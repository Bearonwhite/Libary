// src/server.rs
//
// ฝั่ง Server: เปิด TCP listener ที่ port (จาก config) รอรับ:
//   - Ping            -> ตอบ Pong (ใช้ตอน client กด "ทดสอบการเชื่อมต่อ")
//   - PrintJobHeader   -> ตามด้วย raw bytes ขนาด size_bytes -> enqueue เข้าคิว -> ตอบ PrintJobAck
// พร้อมกันนั้นรัน UDP announce responder (discovery.rs) และ queue worker (queue.rs) แบบ background
//
// เก็บสถานะ "เครื่องที่เชื่อมต่อเข้ามา" (ชื่อเครื่อง/IP/เวลาล่าสุดที่เห็น) ไว้ใน Arc<Mutex<..>> ให้ GUI
// อ่านไปแสดงผลได้ (โชว์ชื่อเครื่อง client ที่ต่อเข้ามา)

use crate::printer;
use crate::protocol::{decode, encode, Message};
use crate::queue;
use std::collections::HashMap;
use std::path::PathBuf;
use std::sync::{Arc, Mutex};
use std::time::Duration;
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::net::{TcpListener, TcpStream};
use tokio::sync::mpsc::unbounded_channel;

#[derive(Debug, Clone)]
pub struct ConnectedClient {
    pub device_name: String,
    pub ip: String,
    pub last_seen: std::time::Instant,
}

pub type ServerState = Arc<Mutex<HashMap<String, ConnectedClient>>>;

pub fn new_state() -> ServerState {
    Arc::new(Mutex::new(HashMap::new()))
}

/// log ผลพิมพ์ล่าสุด ๆ ให้ GUI server อ่านแสดง (เก็บแค่ N รายการล่าสุดพอ)
pub type PrintLog = Arc<Mutex<Vec<String>>>;

pub fn new_log() -> PrintLog {
    Arc::new(Mutex::new(Vec::new()))
}

fn push_log(log: &PrintLog, line: String) {
    let mut l = log.lock().unwrap();
    l.push(line);
    if l.len() > 200 {
        l.remove(0);
    }
}

pub async fn run_server(
    port: u16,
    printer_name: String,
    queue_dir: PathBuf,
    state: ServerState,
    log: PrintLog,
) -> std::io::Result<()> {
    // 1) ตัว announce ทาง UDP สำหรับ discovery (mac/ip ของเครื่องนี้)
    {
        let printer_name = printer_name.clone();
        tokio::spawn(async move {
            if let Err(e) = crate::discovery::run_announce_responder(port, printer_name).await {
                eprintln!("[server] announce responder error: {e}");
            }
        });
    }

    // 2) queue worker: ดึงงานจากคิวไปพิมพ์จริงเรื่อยๆ
    {
        let (tx, mut rx) = unbounded_channel();
        let queue_dir2 = queue_dir.clone();
        let printer_name2 = printer_name.clone();
        tokio::spawn(async move {
            queue::run_queue_worker(queue_dir2, printer_name2, Duration::from_secs(2), tx).await;
        });
        let log2 = log.clone();
        tokio::spawn(async move {
            while let Some(result) = rx.recv().await {
                push_log(
                    &log2,
                    format!(
                        "[{}] {}",
                        if result.success { "สำเร็จ" } else { "ล้มเหลว" },
                        result.message
                    ),
                );
            }
        });
    }

    // 3) TCP listener หลัก รับงานพิมพ์ / ping จาก client
    let listener = TcpListener::bind(("0.0.0.0", port)).await?;
    push_log(&log, format!("Server เริ่มทำงานที่พอร์ต {port}"));

    loop {
        let (socket, addr) = listener.accept().await?;
        let state = state.clone();
        let log = log.clone();
        let queue_dir = queue_dir.clone();
        tokio::spawn(async move {
            if let Err(e) = handle_client(socket, addr.to_string(), state, log, queue_dir).await {
                eprintln!("[server] client {addr} error: {e}");
            }
        });
    }
}

async fn read_message(socket: &mut TcpStream) -> std::io::Result<Option<Message>> {
    let mut len_buf = [0u8; 4];
    if socket.read_exact(&mut len_buf).await.is_err() {
        return Ok(None);
    }
    let len = u32::from_be_bytes(len_buf) as usize;
    let mut data = vec![0u8; len];
    socket.read_exact(&mut data).await?;
    Ok(decode(&data))
}

async fn handle_client(
    mut socket: TcpStream,
    addr: String,
    state: ServerState,
    log: PrintLog,
    queue_dir: PathBuf,
) -> std::io::Result<()> {
    loop {
        let msg = match read_message(&mut socket).await? {
            Some(m) => m,
            None => return Ok(()), // client ปิดการเชื่อมต่อ
        };

        match msg {
            Message::Ping => {
                let pong = Message::Pong {
                    hostname: crate::discovery::local_hostname(),
                    printer_name: "shared-printer".to_string(),
                };
                socket.write_all(&encode(&pong)).await?;
            }
            Message::PrintJobHeader {
                job_id,
                file_name,
                size_bytes,
                is_test,
                from_device,
            } => {
                // อัปเดตรายชื่อเครื่องที่เชื่อมต่อ (โชว์ใน GUI server)
                {
                    let mut st = state.lock().unwrap();
                    st.insert(
                        from_device.clone(),
                        ConnectedClient {
                            device_name: from_device.clone(),
                            ip: addr.clone(),
                            last_seen: std::time::Instant::now(),
                        },
                    );
                }

                // รับ raw bytes ตามขนาดที่ระบุ
                let mut data = vec![0u8; size_bytes as usize];
                socket.read_exact(&mut data).await?;

                let enq = queue::enqueue(
                    &queue_dir,
                    &job_id,
                    &file_name,
                    &data,
                    is_test,
                    &from_device,
                )
                .await;

                let ack = match &enq {
                    Ok(_) => Message::PrintJobAck {
                        job_id: job_id.clone(),
                        accepted: true,
                        message: "รับงานเข้าคิวแล้ว".to_string(),
                    },
                    Err(e) => Message::PrintJobAck {
                        job_id: job_id.clone(),
                        accepted: false,
                        message: format!("เก็บงานเข้าคิวไม่สำเร็จ: {e}"),
                    },
                };
                push_log(
                    &log,
                    format!(
                        "รับงานพิมพ์ '{file_name}' จาก {from_device} ({addr}) [{}]",
                        if is_test { "TEST" } else { "JOB" }
                    ),
                );
                socket.write_all(&encode(&ack)).await?;
            }
            _ => { /* ข้อความอื่นไม่ได้ใช้ฝั่ง server */ }
        }
    }
}

/// ใช้ตอนกดปุ่ม "Print Test" จากฝั่ง server เอง (ไม่ผ่าน network เลย ยิงเข้าคิวตรง)
pub async fn print_test_locally(queue_dir: &PathBuf) -> std::io::Result<()> {
    let job_id = uuid::Uuid::new_v4().to_string();
    let data = printer::build_test_page("Server (local test)");
    queue::enqueue(queue_dir, &job_id, "server_test_page.txt", &data, true, "SERVER").await
}

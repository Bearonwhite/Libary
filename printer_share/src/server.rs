// src/server.rs
//
// TCP listener: รับ Ping → ตอบ Pong, รับ PrintJobHeader + raw bytes → เก็บลง queue
// ยัง spawn run_announce_responder (UDP) และ run_queue_worker ด้วย

use crate::discovery::{local_hostname, run_announce_responder};
use crate::protocol::{decode, encode, Message};
use crate::queue::{enqueue, run_queue_worker, JobMeta};
use std::collections::HashMap;
use std::path::PathBuf;
use std::sync::{Arc, Mutex};
use std::time::Instant;
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::net::{TcpListener, TcpStream};

// ===== Shared state =====

#[derive(Debug, Clone)]
pub struct ClientInfo {
    pub device_name: String,
    pub ip: String,
    pub last_seen: Instant,
}

pub type ServerState = Arc<Mutex<HashMap<String, ClientInfo>>>; // key = device_name
pub type PrintLog = Arc<Mutex<Vec<String>>>;

pub fn new_state() -> ServerState {
    Arc::new(Mutex::new(HashMap::new()))
}

pub fn new_log() -> PrintLog {
    Arc::new(Mutex::new(Vec::new()))
}

// ===== run_server =====

pub async fn run_server(
    port: u16,
    printer_name: String,
    queue_dir: PathBuf,
    state: ServerState,
    log: PrintLog,
) -> std::io::Result<()> {
    // guard: ถ้า printer_name ว่างเปล่า ไม่ start
    if printer_name.is_empty() {
        return Err(std::io::Error::new(
            std::io::ErrorKind::InvalidInput,
            "ยังไม่ได้ตั้งชื่อเครื่องปริ้น",
        ));
    }

    // spawn UDP discovery responder
    {
        let pn = printer_name.clone();
        tokio::spawn(async move {
            if let Err(e) = run_announce_responder(port, pn).await {
                eprintln!("[discovery] error: {e}");
            }
        });
    }

    // spawn queue worker
    {
        let qd = queue_dir.clone();
        let pn = printer_name.clone();
        let lg = log.clone();
        tokio::spawn(async move {
            run_queue_worker(qd, pn, lg).await;
        });
    }

    let listener = TcpListener::bind(("0.0.0.0", port)).await?;
    eprintln!("[server] รอรับงานที่พอร์ต {port} (printer: {printer_name})");

    loop {
        let (socket, addr) = listener.accept().await?;
        let ip = addr.ip().to_string();
        let st = state.clone();
        let lg = log.clone();
        let qd = queue_dir.clone();
        let pn = printer_name.clone();

        tokio::spawn(async move {
            if let Err(e) = handle_connection(socket, ip, pn, qd, st, lg).await {
                eprintln!("[server] connection error: {e}");
            }
        });
    }
}

async fn handle_connection(
    mut socket: TcpStream,
    ip: String,
    printer_name: String,
    queue_dir: PathBuf,
    state: ServerState,
    log: PrintLog,
) -> std::io::Result<()> {
    // อ่าน length-prefixed message
    let mut len_buf = [0u8; 4];
    socket.read_exact(&mut len_buf).await?;
    let len = u32::from_be_bytes(len_buf) as usize;

    let mut buf = vec![0u8; len];
    socket.read_exact(&mut buf).await?;

    let msg = match decode(&buf) {
        Some(m) => m,
        None => return Ok(()),
    };

    match msg {
        Message::Ping => {
            let pong = Message::Pong {
                hostname: local_hostname(),
                printer_name: printer_name.clone(),
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
            // อัปเดต client list
            {
                let mut st = state.lock().unwrap();
                st.insert(
                    from_device.clone(),
                    ClientInfo {
                        device_name: from_device.clone(),
                        ip: ip.clone(),
                        last_seen: Instant::now(),
                    },
                );
            }

            // อ่าน raw bytes ของไฟล์
            let mut data = vec![0u8; size_bytes as usize];
            socket.read_exact(&mut data).await?;

            let meta = JobMeta {
                job_id: job_id.clone(),
                file_name: file_name.clone(),
                from_device: from_device.clone(),
                is_test,
                timestamp: chrono::Utc::now().timestamp_millis(),
            };

            let result = enqueue(&queue_dir, &meta, &data);
            let (accepted, message) = match result {
                Ok(()) => {
                    let msg = format!(
                        "[{}] รับงานจาก {} เข้าคิวแล้ว ({})",
                        if is_test { "TEST" } else { &file_name },
                        from_device,
                        job_id
                    );
                    push_log(&log, msg.clone());
                    (true, msg)
                }
                Err(e) => {
                    let msg = format!("บันทึกงานลง queue ล้มเหลว: {e}");
                    push_log(&log, format!("❌ {msg}"));
                    (false, msg)
                }
            };

            let ack = Message::PrintJobAck {
                job_id,
                accepted,
                message,
            };
            socket.write_all(&encode(&ack)).await?;
        }

        _ => {}
    }

    Ok(())
}

/// สั่ง test print จาก server เอง (ใส่ตรงเข้า queue ไม่ผ่าน network)
pub async fn print_test_locally(queue_dir: &PathBuf) -> std::io::Result<()> {
    let hostname = local_hostname();
    let data = crate::printer::build_test_page(&hostname);
    let meta = JobMeta {
        job_id: uuid::Uuid::new_v4().to_string(),
        file_name: "server_test_page.txt".to_string(),
        from_device: hostname,
        is_test: true,
        timestamp: chrono::Utc::now().timestamp_millis(),
    };
    enqueue(queue_dir, &meta, &data)
}

fn push_log(log: &PrintLog, msg: String) {
    if let Ok(mut l) = log.lock() {
        l.push(msg);
        if l.len() > 200 {
            l.remove(0);
        }
    }
}
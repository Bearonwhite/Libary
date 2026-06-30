// src/client.rs
//
// ฝั่ง Client: เชื่อมต่อ TCP ไปยัง server (resolve IP จาก mac_address ที่บันทึกไว้ ทุกครั้งก่อนส่งงาน
// เผื่อ IP เปลี่ยนไปจากครั้งก่อน) ส่ง Ping เพื่อทดสอบการเชื่อมต่อ หรือส่งไฟล์จริง/ไฟล์ test ไปพิมพ์

use crate::discovery::{resolve_by_mac, DiscoveredServer};
use crate::protocol::{decode, encode, Message};
use std::time::Duration;
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::net::TcpStream;

/// resolve mac_address ปัจจุบันเป็น (ip, port) จริง โดย scan วงใหม่ (กัน IP เปลี่ยนจาก DHCP)
/// ถ้าหาไม่เจอแบบ broadcast ลอง fallback ใช้ last_known_ip ที่เคยจำไว้
pub async fn resolve_target(
    mac_address: &str,
    last_known_ip: &str,
    fallback_port: u16,
) -> Result<(String, u16), String> {
    if let Some(found) = resolve_by_mac(mac_address, Duration::from_secs(2)).await {
        return Ok((found.ip, found.port));
    }
    if !last_known_ip.is_empty() {
        return Ok((last_known_ip.to_string(), fallback_port));
    }
    Err("หาเครื่อง server ที่ผูกด้วย MAC address นี้ไม่เจอในวงเครือข่าย".to_string())
}

async fn connect(ip: &str, port: u16) -> std::io::Result<TcpStream> {
    TcpStream::connect((ip, port)).await
}

async fn send_and_read(socket: &mut TcpStream, msg: &Message) -> std::io::Result<Option<Message>> {
    socket.write_all(&encode(msg)).await?;
    let mut len_buf = [0u8; 4];
    if socket.read_exact(&mut len_buf).await.is_err() {
        return Ok(None);
    }
    let len = u32::from_be_bytes(len_buf) as usize;
    let mut data = vec![0u8; len];
    socket.read_exact(&mut data).await?;
    Ok(decode(&data))
}

/// ทดสอบการเชื่อมต่อ: ต่อ TCP ไปยัง ip:port ส่ง Ping รอ Pong กลับ
pub async fn test_connection(ip: &str, port: u16) -> Result<String, String> {
    let mut socket = connect(ip, port)
        .await
        .map_err(|e| format!("เชื่อมต่อไม่ได้: {e}"))?;
    match send_and_read(&mut socket, &Message::Ping).await {
        Ok(Some(Message::Pong { hostname, .. })) => {
            Ok(format!("เชื่อมต่อสำเร็จ ตอบกลับจากเครื่อง: {hostname}"))
        }
        Ok(_) => Err("ได้รับข้อความที่ไม่คาดคิดจาก server".to_string()),
        Err(e) => Err(format!("ส่ง/รับข้อมูลล้มเหลว: {e}")),
    }
}

/// ส่งไฟล์ไปพิมพ์จริง (หรือ test page) ไปที่ server ที่ ip:port
pub async fn send_print_job(
    ip: &str,
    port: u16,
    file_name: &str,
    data: &[u8],
    is_test: bool,
    this_device_name: &str,
) -> Result<String, String> {
    let mut socket = connect(ip, port)
        .await
        .map_err(|e| format!("เชื่อมต่อไม่ได้: {e}"))?;

    let job_id = uuid::Uuid::new_v4().to_string();
    let header = Message::PrintJobHeader {
        job_id: job_id.clone(),
        file_name: file_name.to_string(),
        size_bytes: data.len() as u64,
        is_test,
        from_device: this_device_name.to_string(),
    };

    socket
        .write_all(&encode(&header))
        .await
        .map_err(|e| format!("ส่ง header ล้มเหลว: {e}"))?;
    socket
        .write_all(data)
        .await
        .map_err(|e| format!("ส่งข้อมูลไฟล์ล้มเหลว: {e}"))?;

    let mut len_buf = [0u8; 4];
    socket
        .read_exact(&mut len_buf)
        .await
        .map_err(|e| format!("ไม่ได้รับการตอบรับจาก server: {e}"))?;
    let len = u32::from_be_bytes(len_buf) as usize;
    let mut buf = vec![0u8; len];
    socket
        .read_exact(&mut buf)
        .await
        .map_err(|e| format!("อ่านการตอบรับล้มเหลว: {e}"))?;

    match decode(&buf) {
        Some(Message::PrintJobAck {
            accepted, message, ..
        }) => {
            if accepted {
                Ok(message)
            } else {
                Err(message)
            }
        }
        _ => Err("ได้รับข้อความที่ไม่คาดคิดจาก server".to_string()),
    }
}

pub async fn scan(wait_secs: u64) -> Vec<DiscoveredServer> {
    crate::discovery::scan_for_servers(Duration::from_secs(wait_secs))
        .await
        .unwrap_or_default()
}

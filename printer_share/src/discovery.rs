// src/discovery.rs
//
// แนวคิด: เราไม่ได้อ้างอิงด้วย IP ตรงๆ (เพราะ DHCP เปลี่ยน IP บ่อย) แต่ผูก "เครื่อง server ที่แชร์
// เครื่องปริ้น" ด้วย MAC address ของมัน แล้วค่อย resolve เป็น IP ปัจจุบันตอนจะเชื่อมต่อจริง
//
// วิธีทำงาน:
// 1) Server เปิด UDP listener พอร์ต ANNOUNCE_PORT รอรับ DiscoverRequest แล้วตอบกลับด้วย Announce
//    (มี mac_address, ip, hostname, printer_name, port TCP สำหรับส่งงานพิมพ์)
// 2) Client "สแกนวง" โดย broadcast DiscoverRequest ไปที่ 255.255.255.255:ANNOUNCE_PORT
//    แล้วรวบรวมคำตอบ Announce ทั้งหมดที่ได้ภายใน timeout เป็นรายการเครื่องปริ้นให้ผู้ใช้ติ๊กเลือก
// 3) เมื่อเลือกแล้ว เก็บ mac_address ไว้ใน config; ครั้งต่อไปก่อนส่งงานพิมพ์ ให้ scan ใหม่อีกครั้ง
//    (หรือเก็บ last_known_ip ไว้ลองก่อน ถ้าใช้ไม่ได้ค่อย broadcast หา mac เดิม)

use crate::protocol::{decode, encode, Message};
use local_ip_address::local_ip;
use mac_address::get_mac_address;
use std::collections::HashMap;
use std::net::{IpAddr, Ipv4Addr, SocketAddr};
use std::time::Duration;
use tokio::net::UdpSocket;
use tokio::time::timeout;

pub const ANNOUNCE_PORT: u16 = 9101; // พอร์ต UDP สำหรับ discovery (แยกจากพอร์ตส่งงานพิมพ์)

#[derive(Debug, Clone)]
pub struct DiscoveredServer {
    pub hostname: String,
    pub mac_address: String,
    pub ip: String,
    pub printer_name: String,
    pub port: u16,
}

/// คืน MAC address ของเครื่องนี้เอง (รูปแบบ "AA:BB:CC:DD:EE:FF")
pub fn local_mac_string() -> String {
    match get_mac_address() {
        Ok(Some(mac)) => mac.to_string(),
        _ => "UNKNOWN-MAC".to_string(),
    }
}

pub fn local_ip_string() -> String {
    local_ip()
        .map(|ip| ip.to_string())
        .unwrap_or_else(|_| "0.0.0.0".to_string())
}

pub fn local_hostname() -> String {
    hostname::get()
        .ok()
        .and_then(|s| s.into_string().ok())
        .unwrap_or_else(|| "UNKNOWN-HOST".to_string())
}

/// ========== ฝั่ง SERVER ==========
/// รอฟัง DiscoverRequest ทาง UDP แล้วตอบกลับ Announce ของตัวเอง วนตลอดอายุโปรแกรม
pub async fn run_announce_responder(
    print_port: u16,
    printer_name: String,
) -> std::io::Result<()> {
    let sock = UdpSocket::bind(("0.0.0.0", ANNOUNCE_PORT)).await?;
    sock.set_broadcast(true)?;
    let mut buf = [0u8; 4096];

    loop {
        let (len, from) = sock.recv_from(&mut buf).await?;
        if let Some(Message::DiscoverRequest) = decode(&buf[..len]) {
            let reply = Message::Announce {
                hostname: local_hostname(),
                mac_address: local_mac_string(),
                ip: local_ip_string(),
                printer_name: printer_name.clone(),
                port: print_port,
            };
            let _ = sock.send_to(&encode(&reply), from).await;
        }
    }
}

/// ========== ฝั่ง CLIENT ==========
/// Broadcast หา server ทั้งวง รอผลภายใน `wait` แล้วคืนรายการที่เจอ (อาจมีหลายเครื่อง)
/// ตัดรายการซ้ำด้วย mac_address (เก็บอันล่าสุด)
pub async fn scan_for_servers(wait: Duration) -> std::io::Result<Vec<DiscoveredServer>> {
    let sock = UdpSocket::bind(("0.0.0.0", 0)).await?;
    sock.set_broadcast(true)?;

    let broadcast_addr: SocketAddr =
        SocketAddr::new(IpAddr::V4(Ipv4Addr::new(255, 255, 255, 255)), ANNOUNCE_PORT);
    sock.send_to(&encode(&Message::DiscoverRequest), broadcast_addr)
        .await?;

    let mut found: HashMap<String, DiscoveredServer> = HashMap::new();
    let mut buf = [0u8; 4096];
    let deadline = tokio::time::Instant::now() + wait;

    loop {
        let remaining = deadline.saturating_duration_since(tokio::time::Instant::now());
        if remaining.is_zero() {
            break;
        }
        match timeout(remaining, sock.recv_from(&mut buf)).await {
            Ok(Ok((len, _from))) => {
                if let Some(Message::Announce {
                    hostname,
                    mac_address,
                    ip,
                    printer_name,
                    port,
                }) = decode(&buf[..len])
                {
                    found.insert(
                        mac_address.clone(),
                        DiscoveredServer {
                            hostname,
                            mac_address,
                            ip,
                            printer_name,
                            port,
                        },
                    );
                }
            }
            _ => break, // timeout ทั้งหมดแล้ว หรือ error -> หยุดรอ
        }
    }

    Ok(found.into_values().collect())
}

/// ทดสอบว่า resolve mac_address ที่จำไว้ ให้เจอ IP ปัจจุบันได้ไหม (สแกนใหม่แล้วกรองด้วย mac)
pub async fn resolve_by_mac(
    mac_address: &str,
    wait: Duration,
) -> Option<DiscoveredServer> {
    let servers = scan_for_servers(wait).await.unwrap_or_default();
    servers
        .into_iter()
        .find(|s| s.mac_address.eq_ignore_ascii_case(mac_address))
}

// src/protocol.rs
//
// โครงสร้างข้อความที่ส่งคุยกันระหว่าง client <-> server
// ใช้ JSON + length-prefix (4 bytes, big-endian = ความยาวของ JSON ที่ตามมา)
// เพื่อรองรับทั้งข้อความควบคุม (discovery/announce/print-job/ack) ผ่าน TCP เดียวกัน

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Message {
    /// Server ประกาศตัวเอง (broadcast ทาง UDP เป็นระยะ หรือตอบ client ที่ scan มา)
    Announce {
        hostname: String,
        mac_address: String,
        ip: String,
        printer_name: String,
        port: u16,
    },
    /// Client ขอ scan หา server ในวง (UDP broadcast)
    DiscoverRequest,
    /// ขอทดสอบการเชื่อมต่อ (TCP ping/pong)
    Ping,
    Pong { hostname: String, printer_name: String },
    /// ส่งงานพิมพ์จริง: ชื่อไฟล์ + ขนาด + เป็น test job หรือไม่ ตามด้วย raw bytes ของไฟล์
    PrintJobHeader {
        job_id: String,
        file_name: String,
        size_bytes: u64,
        is_test: bool,
        from_device: String,
    },
    PrintJobAck {
        job_id: String,
        accepted: bool,
        message: String,
    },
    /// Server แจ้งสถานะ job หลังพิมพ์จริงจาก queue เสร็จ (ถ้า client ยังออนไลน์อยู่)
    PrintJobStatus {
        job_id: String,
        success: bool,
        message: String,
    },
}

pub fn encode(msg: &Message) -> Vec<u8> {
    let json = serde_json::to_vec(msg).expect("encode message");
    let len = json.len() as u32;
    let mut buf = Vec::with_capacity(4 + json.len());
    buf.extend_from_slice(&len.to_be_bytes());
    buf.extend_from_slice(&json);
    buf
}

pub fn decode(json_bytes: &[u8]) -> Option<Message> {
    serde_json::from_slice(json_bytes).ok()
}

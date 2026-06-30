// src/protocol.rs
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum Message {
    DiscoverRequest,
    Announce {
        hostname: String,
        mac_address: String,
        ip: String,
        printer_name: String,
        port: u16,
    },
    Ping,
    Pong {
        hostname: String,
        printer_name: String,
    },
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
}

pub fn encode(msg: &Message) -> Vec<u8> {
    let json = serde_json::to_vec(msg).unwrap_or_default();
    let len = json.len() as u32;
    let mut buf = Vec::with_capacity(4 + json.len());
    buf.extend_from_slice(&len.to_be_bytes());
    buf.extend_from_slice(&json);
    buf
}

pub fn decode(data: &[u8]) -> Option<Message> {
    serde_json::from_slice::<Message>(data).ok()
}
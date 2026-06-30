// src/config.rs
//
// อ่าน/เขียนไฟล์ config ที่เก็บไว้ใน %APPDATA%/PrinterShare/config.json (Windows)
// หรือ ~/.config/printer_share/config.json (Linux/Mac สำหรับตอนพัฒนา/ทดสอบ)

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum Role {
    Server,
    Client,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum Transport {
    Tcp,
    Udp,
}

/// เครื่องปริ้น/เครื่อง server ที่ client เคยเลือกไว้
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct SavedTarget {
    pub mac_address: String,
    pub last_known_ip: String,
    pub printer_name: String,
    pub server_hostname: String,
    pub port: u16,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppConfig {
    pub role: Option<Role>,
    pub transport: Transport,
    pub port: u16,
    /// สำหรับ client: เครื่อง server/printer ที่เลือกไว้แล้ว (ผูกด้วย mac address)
    pub selected_target: Option<SavedTarget>,
    /// สำหรับ server: ชื่อเครื่องปริ้นที่จะแชร์ (ชื่อ queue ในเครื่อง Windows)
    pub shared_printer_name: Option<String>,
    pub queue_dir: PathBuf,
}

impl Default for AppConfig {
    fn default() -> Self {
        Self {
            role: None,
            transport: Transport::Tcp,
            port: 9100, // default raw print port, เปลี่ยนได้
            selected_target: None,
            shared_printer_name: None,
            queue_dir: default_queue_dir(),
        }
    }
}

fn config_dir() -> PathBuf {
    let base = dirs::config_dir().unwrap_or_else(|| PathBuf::from("."));
    base.join("PrinterShare")
}

fn config_path() -> PathBuf {
    config_dir().join("config.json")
}

fn default_queue_dir() -> PathBuf {
    config_dir().join("queue")
}

impl AppConfig {
    /// โหลด config เดิมถ้ามี ไม่มีก็คืนค่า default (ยังไม่ถูกถาม role)
    pub fn load() -> Self {
        let path = config_path();
        if let Ok(data) = fs::read_to_string(&path) {
            if let Ok(cfg) = serde_json::from_str::<AppConfig>(&data) {
                return cfg;
            }
        }
        AppConfig::default()
    }

    pub fn save(&self) -> std::io::Result<()> {
        let dir = config_dir();
        fs::create_dir_all(&dir)?;
        fs::create_dir_all(&self.queue_dir)?;
        let data = serde_json::to_string_pretty(self).unwrap();
        fs::write(config_path(), data)
    }

    /// ล้าง config ทั้งหมด แล้วกลับไปหน้าเลือก role ใหม่ (ปุ่ม "เลือกใหม่")
    pub fn reset(&mut self) {
        *self = AppConfig::default();
        let _ = self.save();
    }

    pub fn has_role_selected(&self) -> bool {
        self.role.is_some()
    }
}

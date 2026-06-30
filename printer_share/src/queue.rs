// src/queue.rs
//
// เก็บงานพิมพ์เป็นไฟล์คู่ใน queue_dir:
//   <id>.job       — raw bytes ของงานพิมพ์
//   <id>.meta.json — metadata (job_id, file_name, from_device, is_test, timestamp)
//
// run_queue_worker วน poll ทุก 2 วินาที ดึงงานเก่าสุดไปพิมพ์ทีละงาน

use crate::printer::print_raw_bytes;
use serde::{Deserialize, Serialize};
use std::path::{Path, PathBuf};
use tokio::time::{sleep, Duration};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct JobMeta {
    pub job_id: String,
    pub file_name: String,
    pub from_device: String,
    pub is_test: bool,
    pub timestamp: i64,
}

/// เขียนงานพิมพ์ใหม่ลง queue_dir
pub fn enqueue(queue_dir: &Path, meta: &JobMeta, data: &[u8]) -> std::io::Result<()> {
    std::fs::create_dir_all(queue_dir)?;
    let base = queue_dir.join(&meta.job_id);
    std::fs::write(base.with_extension("job"), data)?;
    let meta_json = serde_json::to_vec_pretty(meta).unwrap_or_default();
    std::fs::write(base.with_extension("meta.json"), meta_json)?;
    Ok(())
}

/// อ่านงานทั้งหมดใน queue เรียงตาม timestamp (เก่าสุดก่อน)
fn list_jobs(queue_dir: &Path) -> Vec<(PathBuf, JobMeta)> {
    let Ok(entries) = std::fs::read_dir(queue_dir) else {
        return vec![];
    };

    let mut jobs: Vec<(PathBuf, JobMeta)> = entries
        .flatten()
        .filter(|e| {
            e.path()
                .extension()
                .map(|x| x == "meta.json")
                .unwrap_or(false)
        })
        .filter_map(|e| {
            let meta_path = e.path();
            let data = std::fs::read_to_string(&meta_path).ok()?;
            let meta: JobMeta = serde_json::from_str(&data).ok()?;
            Some((meta_path, meta))
        })
        .collect();

    jobs.sort_by_key(|(_, m)| m.timestamp);
    jobs
}

/// ลบไฟล์งานพิมพ์ออกจาก queue
fn remove_job(queue_dir: &Path, job_id: &str) {
    let base = queue_dir.join(job_id);
    let _ = std::fs::remove_file(base.with_extension("job"));
    let _ = std::fs::remove_file(base.with_extension("meta.json"));
}

/// Worker loop: poll ทุก 2 วินาที พิมพ์ทีละงาน
pub async fn run_queue_worker(
    queue_dir: PathBuf,
    printer_name: String,
    log: crate::server::PrintLog,
) {
    loop {
        sleep(Duration::from_secs(2)).await;

        let jobs = list_jobs(&queue_dir);
        if jobs.is_empty() {
            continue;
        }

        let (meta_path, meta) = &jobs[0];
        let job_path = meta_path.with_extension("job");

        let data = match std::fs::read(&job_path) {
            Ok(d) => d,
            Err(e) => {
                let msg = format!("[ล้มเหลว] อ่านไฟล์งาน {} ไม่ได้: {}", meta.job_id, e);
                eprintln!("{msg}");
                push_log(&log, msg);
                remove_job(&queue_dir, &meta.job_id);
                continue;
            }
        };

        let job_label = if meta.is_test {
            format!("[TEST] จาก {}", meta.from_device)
        } else {
            format!("[{}] จาก {}", meta.file_name, meta.from_device)
        };

        match print_raw_bytes(&printer_name, &job_label, &data) {
            Ok(()) => {
                let msg = format!("✅ พิมพ์สำเร็จ: {}", job_label);
                eprintln!("{msg}");
                push_log(&log, msg);
            }
            Err(e) => {
                let msg = format!("❌ พิมพ์ล้มเหลว ({}): {}", job_label, e);
                eprintln!("{msg}");
                push_log(&log, msg);
            }
        }

        remove_job(&queue_dir, &meta.job_id);
    }
}

fn push_log(log: &crate::server::PrintLog, msg: String) {
    if let Ok(mut l) = log.lock() {
        l.push(msg);
        if l.len() > 200 {
            l.remove(0);
        }
    }
}
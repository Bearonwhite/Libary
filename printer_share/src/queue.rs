// src/queue.rs
//
// คิวงานพิมพ์แบบไฟล์: เมื่อ server รับไฟล์จาก client (หรือสร้าง test job เอง) จะเขียนเป็น 2 ไฟล์ใน
// queue_dir: <job_id>.job (ไฟล์ข้อมูลจริงที่จะพิมพ์) และ <job_id>.meta.json (metadata)
// จากนั้น worker (queue::run_queue_worker) จะ poll โฟลเดอร์นี้เป็นระยะ ดึงงานที่เก่าสุดไปพิมพ์ผ่าน
// printer::print_raw_bytes ทีละงาน (กันพิมพ์ซ้อนกัน) แล้วลบไฟล์ทิ้งเมื่อสำเร็จ

use crate::printer;
use serde::{Deserialize, Serialize};
use std::path::{Path, PathBuf};
use std::time::Duration;
use tokio::fs;
use tokio::sync::mpsc::UnboundedSender;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct JobMeta {
    pub job_id: String,
    pub file_name: String,
    pub is_test: bool,
    pub from_device: String,
    pub created_at: String,
}

/// เขียนงานใหม่เข้าคิว คืน path ของไฟล์ข้อมูล
pub async fn enqueue(
    queue_dir: &Path,
    job_id: &str,
    file_name: &str,
    data: &[u8],
    is_test: bool,
    from_device: &str,
) -> std::io::Result<()> {
    fs::create_dir_all(queue_dir).await?;
    let data_path = queue_dir.join(format!("{job_id}.job"));
    let meta_path = queue_dir.join(format!("{job_id}.meta.json"));

    fs::write(&data_path, data).await?;
    let meta = JobMeta {
        job_id: job_id.to_string(),
        file_name: file_name.to_string(),
        is_test,
        from_device: from_device.to_string(),
        created_at: chrono::Local::now().to_rfc3339(),
    };
    fs::write(&meta_path, serde_json::to_vec_pretty(&meta).unwrap()).await?;
    Ok(())
}

/// สถานะที่ worker จะส่งกลับมาให้ GUI/network layer แสดงผล หรือแจ้ง client
#[derive(Debug, Clone)]
pub struct JobResult {
    pub job_id: String,
    pub success: bool,
    pub message: String,
}

/// รัน loop พื้นหลัง: poll queue_dir ทุก `interval` ดึงงานเก่าสุดไปพิมพ์ทีละงาน (กันชนกัน)
/// ผลลัพธ์ส่งผ่าน channel `result_tx` ให้ส่วนอื่นเอาไปแจ้ง client / log บน GUI server
pub async fn run_queue_worker(
    queue_dir: PathBuf,
    printer_name: String,
    interval: Duration,
    result_tx: UnboundedSender<JobResult>,
) {
    loop {
        tokio::time::sleep(interval).await;

        let mut entries = match fs::read_dir(&queue_dir).await {
            Ok(e) => e,
            Err(_) => continue,
        };

        // หา .meta.json ที่เก่าสุด
        let mut metas: Vec<(PathBuf, JobMeta)> = Vec::new();
        while let Ok(Some(entry)) = entries.next_entry().await {
            let path = entry.path();
            if path.extension().and_then(|e| e.to_str()) == Some("json") {
                if let Ok(raw) = fs::read(&path).await {
                    if let Ok(meta) = serde_json::from_slice::<JobMeta>(&raw) {
                        metas.push((path, meta));
                    }
                }
            }
        }
        metas.sort_by(|a, b| a.1.created_at.cmp(&b.1.created_at));

        if let Some((meta_path, meta)) = metas.into_iter().next() {
            let data_path = queue_dir.join(format!("{}.job", meta.job_id));
            let result = match fs::read(&data_path).await {
                Ok(data) => printer::print_raw_bytes(&printer_name, &meta.file_name, &data),
                Err(e) => Err(format!("อ่านไฟล์งานพิมพ์ไม่ได้: {e}")),
            };

            let job_result = match &result {
                Ok(_) => JobResult {
                    job_id: meta.job_id.clone(),
                    success: true,
                    message: format!("พิมพ์ '{}' สำเร็จ", meta.file_name),
                },
                Err(e) => JobResult {
                    job_id: meta.job_id.clone(),
                    success: false,
                    message: format!("พิมพ์ '{}' ล้มเหลว: {e}", meta.file_name),
                },
            };

            let _ = result_tx.send(job_result);

            // ลบไฟล์ของงานนี้ทั้งคู่ ไม่ว่าสำเร็จหรือไม่ (กันคิวค้าง) — งานที่ fail จะถูก log ไว้แทน
            let _ = fs::remove_file(&data_path).await;
            let _ = fs::remove_file(&meta_path).await;
        }
    }
}

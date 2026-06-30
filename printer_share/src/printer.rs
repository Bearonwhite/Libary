// src/printer.rs
//
// เครื่องที่รัน "server" คือเครื่องที่ติดตั้งไดรเวอร์เครื่องปริ้นไว้แล้ว (เครื่องปริ้นต่ออยู่กับเครื่องนี้
// โดยตรง หรือผ่าน LPR/USB เดิม) — ดังนั้นการ "สั่งปริ้นจริง" คือสั่งผ่าน Windows Print Spooler
// (winspool.drv) ของเครื่อง server เอง ซึ่งจะจัดการเรื่อง driver/port ให้อัตโนมัติ (เลิกพึ่ง LPR port
// ที่ IP เปลี่ยนบ่อย เพราะตอนนี้ใช้ "ชื่อเครื่องปริ้นที่ติดตั้งในเครื่อง server" ไม่ใช่ IP ตรงๆ แล้ว)
//
// บน Windows: ใช้ StartDocPrinterW / WritePrinter ส่ง raw bytes เข้า printer queue ตรงๆ
// (เหมาะกับไฟล์ที่ถูกแปลงเป็น printer-ready data อยู่แล้ว เช่น PCL/PostScript/Raw ที่ฝั่ง client
//  สร้างมาจาก driver เดียวกัน — ต้องติดตั้งไดรเวอร์เครื่องปริ้นรุ่นเดียวกันทั้ง 2 ฝั่ง)
//
// บน non-Windows (สำหรับ dev/ทดสอบ logic เครือข่ายบน Linux/Mac): fallback เปิด TCP ไปที่
// localhost:9100 (CUPS หรือ printer จำลอง) เพื่อให้ build/ทดสอบ flow ได้โดยไม่ต้องมี Windows จริง

#[cfg(windows)]
mod win {
    use windows::core::PCWSTR;
    use windows::Win32::Graphics::Printing::{
        ClosePrinter, EndDocPrinter, EndPagePrinter, OpenPrinterW, StartDocPrinterW,
        StartPagePrinter, WritePrinter, DOC_INFO_1W,
    };

    fn to_wide(s: &str) -> Vec<u16> {
        s.encode_utf16().chain(std::iter::once(0)).collect()
    }

    pub fn print_raw(printer_name: &str, doc_name: &str, data: &[u8]) -> Result<(), String> {
        unsafe {
            let printer_name_w = to_wide(printer_name);
            let mut h_printer = Default::default();
            OpenPrinterW(
                PCWSTR(printer_name_w.as_ptr()),
                &mut h_printer,
                None,
            )
            .map_err(|e| format!("OpenPrinterW ล้มเหลว ({printer_name}): {e}"))?;

            let mut doc_name_w = to_wide(doc_name);
            let mut datatype_w = to_wide("RAW");
            let doc_info = DOC_INFO_1W {
                pDocName: windows::core::PWSTR(doc_name_w.as_mut_ptr()),
                pOutputFile: windows::core::PWSTR::null(),
                pDatatype: windows::core::PWSTR(datatype_w.as_mut_ptr()),
            };

            let job_id = StartDocPrinterW(h_printer, 1, &doc_info);
            if job_id == 0 {
                let _ = ClosePrinter(h_printer);
                return Err("StartDocPrinterW ล้มเหลว".into());
            }

            if !StartPagePrinter(h_printer).as_bool() {
                let _ = EndDocPrinter(h_printer);
                let _ = ClosePrinter(h_printer);
                return Err("StartPagePrinter ล้มเหลว".into());
            }

            let mut written: u32 = 0;
            let ok = WritePrinter(
                h_printer,
                data.as_ptr() as *const _,
                data.len() as u32,
                &mut written,
            )
            .as_bool();

            let _ = EndPagePrinter(h_printer);
            let _ = EndDocPrinter(h_printer);
            let _ = ClosePrinter(h_printer);

            if !ok || written as usize != data.len() {
                return Err(format!(
                    "WritePrinter ส่งข้อมูลไม่ครบ ({written}/{} bytes)",
                    data.len()
                ));
            }
            Ok(())
        }
    }
}

#[cfg(not(windows))]
mod fallback {
    use std::io::Write;
    use std::net::TcpStream;
    use std::time::Duration;

    /// ใช้ตอน dev/ทดสอบบน Linux/Mac เท่านั้น: ส่ง raw bytes ไปที่ localhost:9100
    /// (เช่นทดสอบกับ printer จำลอง หรือ socat -tcp-listen:9100)
    pub fn print_raw(_printer_name: &str, _doc_name: &str, data: &[u8]) -> Result<(), String> {
        let addr = "127.0.0.1:9100";
        let mut stream = TcpStream::connect(addr)
            .map_err(|e| format!("เชื่อมต่อ fallback printer ({addr}) ไม่ได้: {e}"))?;
        stream
            .set_write_timeout(Some(Duration::from_secs(10)))
            .ok();
        stream
            .write_all(data)
            .map_err(|e| format!("ส่งข้อมูลไป fallback printer ไม่สำเร็จ: {e}"))
    }
}

/// ส่งข้อมูล raw bytes ไปพิมพ์จริงที่ "printer_name" (ชื่อเครื่องปริ้นที่ติดตั้งในเครื่อง server)
pub fn print_raw_bytes(printer_name: &str, doc_name: &str, data: &[u8]) -> Result<(), String> {
    #[cfg(windows)]
    {
        win::print_raw(printer_name, doc_name, data)
    }
    #[cfg(not(windows))]
    {
        fallback::print_raw(printer_name, doc_name, data)
    }
}

/// สร้างข้อมูล test page อย่างง่าย (raw text) สำหรับปุ่ม "Print Test"
pub fn build_test_page(from: &str) -> Vec<u8> {
    let now = chrono::Local::now().format("%Y-%m-%d %H:%M:%S");
    format!(
        "\x1b@PRINTER SHARE TEST PAGE\nFrom: {from}\nTime: {now}\nหากคุณเห็นข้อความนี้ การเชื่อมต่อและสั่งพิมพ์ทำงานถูกต้อง\n\n\n\n"
    )
    .into_bytes()
}

/// บน Windows: ดึงรายชื่อเครื่องปริ้นที่ติดตั้งในเครื่องนี้ทั้งหมด ให้ผู้ใช้เลือกตอนตั้งค่า server
#[cfg(windows)]
pub fn list_local_printers() -> Vec<String> {
    use windows::Win32::Graphics::Printing::{EnumPrintersW, PRINTER_ENUM_LOCAL};
    use windows::Win32::Graphics::Printing::PRINTER_INFO_2W;

    unsafe {
        let mut needed: u32 = 0;
        let mut returned: u32 = 0;
        // เรียกครั้งแรกเพื่อขอขนาด buffer ที่ต้องใช้
        let _ = EnumPrintersW(
            PRINTER_ENUM_LOCAL,
            None,
            2,
            None,
            &mut needed,
            &mut returned,
        );
        if needed == 0 {
            return Vec::new();
        }
        let mut buffer = vec![0u8; needed as usize];
        let ok = EnumPrintersW(
            PRINTER_ENUM_LOCAL,
            None,
            2,
            Some(buffer.as_mut_slice()),
            &mut needed,
            &mut returned,
        );
        if ok.is_err() {
            return Vec::new();
        }
        let infos = buffer.as_ptr() as *const PRINTER_INFO_2W;
        let mut names = Vec::new();
        for i in 0..returned as usize {
            let info = &*infos.add(i);
            if !info.pPrinterName.is_null() {
                names.push(info.pPrinterName.to_string().unwrap_or_default());
            }
        }
        names
    }
}

#[cfg(not(windows))]
pub fn list_local_printers() -> Vec<String> {
    vec!["(Linux dev mode) Fallback-Printer-9100".to_string()]
}

// src/printer.rs
//
// สั่งพิมพ์จริงผ่าน Windows winspool API
// - print_raw_bytes: ส่ง raw bytes เข้า printer queue โดยตรง
// - list_local_printers: คืนรายชื่อ printer ทั้งหมดในเครื่อง
// - build_test_page: สร้าง test page PCL สีสำหรับทดสอบ
//
// fallback สำหรับ Linux/Mac (dev): ส่ง bytes ไปที่ TCP:9100

/// สร้าง test page เป็น PCL ที่มีสีและข้อความทดสอบ
/// PCL = Printer Command Language รองรับโดย Canon LBP ทุกรุ่น
pub fn build_test_page(from_device: &str) -> Vec<u8> {
    // PCL color test page
    // ESC E = reset printer
    // ESC*r1A = start raster graphics
    // ใช้ PCL text + color commands
    let mut pcl = Vec::new();

    // Reset printer
    pcl.extend_from_slice(b"\x1bE");

    // ตั้ง page orientation = portrait
    pcl.extend_from_slice(b"\x1b&l0O");

    // ตั้ง font = Courier 12pt
    pcl.extend_from_slice(b"\x1b(0N\x1b(s0p12h0s0b3T");

    // เลื่อนลงมา 5 บรรทัด
    pcl.extend_from_slice(b"\x1b&a5R");

    // กึ่งกลางหน้า column 10
    pcl.extend_from_slice(b"\x1b&a10C");

    // ===== หัวข้อ =====
    // สีแดง (foreground color via PCL color)
    pcl.extend_from_slice(b"\x1b*v6W\x00\x01\x01\xFF\x00\x00"); // red
    pcl.extend_from_slice(b"*** PRINTER TEST PAGE ***\r\n");

    // สีน้ำเงิน
    pcl.extend_from_slice(b"\x1b*v6W\x00\x01\x00\x00\xFF\x00"); // blue (RGB mode)
    let line = format!("From device : {}\r\n", from_device);
    pcl.extend_from_slice(line.as_bytes());

    // สีดำ
    pcl.extend_from_slice(b"\x1b*v6W\x00\x01\x00\x00\x00\x00"); // black

    // วันที่เวลา
    let now = chrono::Local::now();
    let ts = format!("Date/Time   : {}\r\n", now.format("%Y-%m-%d %H:%M:%S"));
    pcl.extend_from_slice(ts.as_bytes());

    pcl.extend_from_slice(b"\r\n");
    pcl.extend_from_slice(b"------------------------------------------\r\n");
    pcl.extend_from_slice(b"\r\n");

    // สีเขียว
    pcl.extend_from_slice(b"\x1b*v6W\x00\x01\x00\xFF\x00\x00"); // green
    pcl.extend_from_slice(b"  [OK] Network connection\r\n");
    pcl.extend_from_slice(b"  [OK] Print queue received\r\n");
    pcl.extend_from_slice(b"  [OK] Printer responding\r\n");

    // สีดำ
    pcl.extend_from_slice(b"\x1b*v6W\x00\x01\x00\x00\x00\x00");
    pcl.extend_from_slice(b"\r\n");
    pcl.extend_from_slice(b"------------------------------------------\r\n");
    pcl.extend_from_slice(b"  Printer Share - Test Page\r\n");

    // Form feed = จบหน้า
    pcl.extend_from_slice(b"\x0C");

    // Reset printer
    pcl.extend_from_slice(b"\x1bE");

    pcl
}

// ============================================================
// Windows implementation
// ============================================================
#[cfg(windows)]
pub mod win {
    use windows::core::PCWSTR;
    use windows::Win32::Graphics::Printing::{
        ClosePrinter, EndDocPrinter, EndPagePrinter, EnumPrintersW, OpenPrinterW,
        StartDocPrinterW, StartPagePrinter, WritePrinter, DOC_INFO_1W, PRINTER_ENUM_LOCAL,
        PRINTER_INFO_2W,
    };
    use windows::Win32::Foundation::{GetLastError, HANDLE};

    fn to_wide(s: &str) -> Vec<u16> {
        s.encode_utf16().chain(std::iter::once(0)).collect()
    }

    /// คืนรายชื่อ printer ทั้งหมดที่ติดตั้งในเครื่อง Windows
    pub fn list_local_printers() -> Vec<String> {
        let mut needed: u32 = 0;
        let mut returned: u32 = 0;

        unsafe {
            // เรียกครั้งแรกเพื่อรู้ขนาด buffer ที่ต้องใช้
            let _ = EnumPrintersW(
                PRINTER_ENUM_LOCAL,
                PCWSTR::null(),
                2,
                None,
                &mut needed,
                &mut returned,
            );

            if needed == 0 {
                return vec![];
            }

            let mut buf: Vec<u8> = vec![0u8; needed as usize];
            if EnumPrintersW(
                PRINTER_ENUM_LOCAL,
                PCWSTR::null(),
                2,
                Some(&mut buf),
                &mut needed,
                &mut returned,
            )
            .is_err()
            {
                return vec![];
            }

            let printers =
                std::slice::from_raw_parts(buf.as_ptr() as *const PRINTER_INFO_2W, returned as usize);

            printers
                .iter()
                .map(|p| {
                    if p.pPrinterName.is_null() {
                        return String::new();
                    }
                    let ptr = p.pPrinterName.0;
                    let mut len = 0;
                    while *ptr.add(len) != 0 {
                        len += 1;
                    }
                    String::from_utf16_lossy(std::slice::from_raw_parts(ptr, len))
                })
                .filter(|s| !s.is_empty())
                .collect()
        }
    }

    /// ส่ง raw bytes ไปยัง printer ที่ระบุชื่อ
    pub fn print_raw_bytes(printer_name: &str, job_name: &str, data: &[u8]) -> Result<(), String> {
        let printer_name_w = to_wide(printer_name);
        let job_name_w: Vec<u16> = job_name.encode_utf16().chain(std::iter::once(0)).collect();
        let datatype_w: Vec<u16> = "RAW\0".encode_utf16().collect();

        unsafe {
            // OpenPrinterW คืน Result<()> ใน windows crate 0.56
            let mut handle = HANDLE::default();
            OpenPrinterW(
                PCWSTR(printer_name_w.as_ptr()),
                &mut handle,
                None,
            )
            .map_err(|e| format!("OpenPrinterW ล้มเหลว ({}): {:?}", printer_name, e))?;

            let doc_info = DOC_INFO_1W {
                pDocName: windows::core::PWSTR(job_name_w.as_ptr() as *mut u16),
                pOutputFile: windows::core::PWSTR::null(),
                pDatatype: windows::core::PWSTR(datatype_w.as_ptr() as *mut u16),
            };

            // StartDocPrinterW — คืน job_id (0 = fail)
            let job_id = StartDocPrinterW(handle, 1, &doc_info as *const _ as *const _);
            if job_id == 0 {
                let err = GetLastError();
                ClosePrinter(handle);
                return Err(format!(
                    "StartDocPrinterW ล้มเหลว ({}): error code 0x{:08X}",
                    printer_name, err.0
                ));
            }

            // StartPagePrinter — คืน BOOL
            if !StartPagePrinter(handle).as_bool() {
                let _ = EndDocPrinter(handle);
                let _ = ClosePrinter(handle);
                return Err("StartPagePrinter ล้มเหลว".to_string());
            }

            // WritePrinter — คืน BOOL
            let mut written: u32 = 0;
            if !WritePrinter(
                handle,
                data.as_ptr() as *const _,
                data.len() as u32,
                &mut written,
            )
            .as_bool()
            {
                let _ = EndPagePrinter(handle);
                let _ = EndDocPrinter(handle);
                let _ = ClosePrinter(handle);
                return Err("WritePrinter ล้มเหลว".to_string());
            }

            EndPagePrinter(handle);
            EndDocPrinter(handle);
            ClosePrinter(handle);
        }

        Ok(())
    }
}

// ============================================================
// Public API — เลือก implementation ตาม platform
// ============================================================

/// คืนรายชื่อ printer ในเครื่อง (Windows เท่านั้น; Linux/Mac คืน vec ว่าง)
pub fn list_local_printers() -> Vec<String> {
    #[cfg(windows)]
    {
        win::list_local_printers()
    }
    #[cfg(not(windows))]
    {
        vec!["[Linux/Mac: ใช้ fallback TCP:9100]".to_string()]
    }
}

/// ส่งงานพิมพ์จริง
pub fn print_raw_bytes(printer_name: &str, job_name: &str, data: &[u8]) -> Result<(), String> {
    #[cfg(windows)]
    {
        win::print_raw_bytes(printer_name, job_name, data)
    }
    #[cfg(not(windows))]
    {
        // fallback: ส่งไปที่ localhost:9100 (สำหรับทดสอบบน Linux/Mac)
        use std::io::Write;
        use std::net::TcpStream;
        let mut stream = TcpStream::connect("127.0.0.1:9100")
            .map_err(|e| format!("fallback TCP connect ล้มเหลว: {e}"))?;
        stream
            .write_all(data)
            .map_err(|e| format!("fallback TCP write ล้มเหลว: {e}"))?;
        let _ = printer_name;
        let _ = job_name;
        Ok(())
    }
}
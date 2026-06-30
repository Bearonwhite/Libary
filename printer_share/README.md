# Printer Share (Pure Rust)

## ฟอนต์ภาษาไทย
ฝัง Noto Sans Thai (Regular) ไว้ในโปรแกรมแล้วที่ `assets/fonts/NotoSansThai-Regular.ttf` ผ่าน `include_bytes!` ใน `src/main.rs` (ฟังก์ชัน `setup_thai_fonts`) ทำให้ตัวอักษรไทยใน GUI แสดงผลถูกต้องโดยไม่ต้องติดตั้งฟอนต์เพิ่มที่เครื่องผู้ใช้ และไฟล์ฟอนต์จะถูก compile รวมเข้าไปในไฟล์ .exe เลย (ไม่ใช่ไฟล์แยกที่ต้องแจกไปด้วย)

ที่มาไฟล์ฟอนต์: Noto Sans Thai (Google, OFL license) — ถ้าต้องการอัปเดตเป็นเวอร์ชันล่าสุด/ตัวหนา (Bold) เพิ่ม ดาวน์โหลดได้จาก https://fonts.google.com/noto/specimen/Noto+Sans+Thai แล้วแทนที่ไฟล์ใน `assets/fonts/` พร้อมแก้ path ใน `include_bytes!`

## โครงสร้าง
- `src/config.rs` — เก็บ/โหลด config ที่ `%APPDATA%\PrinterShare\config.json` (role, transport, target ที่เคยเลือก ผูกด้วย MAC)
- `src/discovery.rs` — UDP broadcast หา server (DiscoverRequest/Announce) ผูกด้วย MAC address แทน IP
- `src/protocol.rs` — รูปแบบข้อความ (length-prefixed JSON) ที่ใช้คุยกันทาง TCP
- `src/server.rs` — TCP listener รับ Ping/PrintJobHeader, เก็บรายชื่อ client ที่ต่อเข้ามา
- `src/client.rs` — resolve MAC→IP ใหม่ทุกครั้งก่อนส่งงาน, ส่งไฟล์/test ไปพิมพ์
- `src/queue.rs` — เขียนงานพิมพ์เป็นไฟล์ในคิว แล้ว worker ดึงไปพิมพ์ทีละงาน (กันชนกัน)
- `src/printer.rs` — สั่งพิมพ์จริงผ่าน Windows winspool (`StartDocPrinterW`/`WritePrinter`) บน Windows, มี fallback TCP:9100 สำหรับ dev บน Linux/Mac
- `src/gui.rs` — eframe/egui: หน้า Setup → Server/Client, auto-minimize หลังไม่มีการคลิก 2 นาที

## วิธี build
```
cargo build --release          # บน Linux/Mac จะ build ได้ (ใช้ fallback printer ทดสอบที่ port 9100)
cargo build --release --target x86_64-pc-windows-msvc   # build จริงสำหรับ Windows (ต้องมี rustup + Windows หรือ cross toolchain)
```
แนะนำให้ build บนเครื่อง Windows จริงโดยตรง (ติดตั้ง Rust ผ่าน rustup.rs) เพราะส่วนสั่งพิมพ์จริงใช้ Windows API (`windows` crate, winspool.drv) ซึ่งใช้งานได้เฉพาะ Windows

## ทดสอบในสภาพแวดล้อมที่ผมมี (sandbox)
ผมตรวจสอบโดย `cargo check` บน Linux (rustc 1.75) แล้ว **โค้ดทั้งหมด compile ผ่านสำเร็จ** สำหรับส่วนที่ cross-platform (config, discovery, protocol, server, client, queue, gui, fallback printer). ส่วน Windows-only (`src/printer.rs` mod `win`, ใช้ `windows` crate เรียก `StartDocPrinterW/WritePrinter/EnumPrintersW`) **ไม่สามารถ compile ทดสอบได้ใน sandbox นี้** เพราะไม่มี Windows toolchain — ตรวจสอบด้วยการอ่าน API เองเท่านั้น จึงมีโอกาสสูงสุดที่จะมี error ตรงนี้ (signature ของ `windows` crate เปลี่ยนบ่อยตามเวอร์ชัน) **ถ้า build บน Windows แล้ว error ตรงไหน ส่ง error message มาได้เลย จะแก้ให้ตรงจุด**

## สิ่งที่ยังต้องเพิ่ม/ปรับเอง
1. **ชื่อเครื่องปริ้น**: ฝั่ง server ต้องพิมพ์ชื่อเครื่องปริ้นที่ติดตั้งใน Windows ให้ตรงตัวเป๊ะ (กดปุ่ม "รายชื่อเครื่องปริ้นที่ติดตั้ง" ใน GUI เพื่อเลือกจากลิสต์จะชัวร์กว่าพิมพ์เอง)
2. **Firewall**: ต้องเปิดพอร์ต TCP (default 9100, ใช้พิมพ์งานจริง) และ UDP 9101 (discovery) ใน Windows Firewall ทั้ง 2 ฝั่ง
3. **Tray icon / ย่อเก็บแบบ background เต็มรูปแบบ**: ตอนนี้ idle 2 นาทีจะ "Minimize" หน้าต่าง (ลง taskbar) ซึ่ง process ยังรันอยู่เบื้องหลังจริง (เพราะ network/printing ทำงานใน tokio runtime แยกจาก GUI thread) — ถ้าต้องการซ่อนไปที่ system tray (icon มุมขวาล่าง) แทนการ minimize ต้องเพิ่ม crate `tray-icon` เพิ่ม ซึ่งยังไม่ได้ทำในเวอร์ชันนี้
4. **รูปแบบไฟล์ที่พิมพ์**: ฟังก์ชัน `print_raw_bytes` ส่งข้อมูลแบบ RAW datatype เข้า printer queue ตรงๆ — เหมาะกับไฟล์ที่ถูกแปลงเป็น print-ready data จาก driver/แอปเดียวกันแล้ว (เช่นไฟล์ .prn จาก "Print to file") ถ้าต้องการให้ client ส่งไฟล์ทั่วไป (PDF/Word) แล้วให้ server สั่งพิมพ์ผ่านโปรแกรมที่เกี่ยวข้องเองอัตโนมัติ จะต้องเพิ่ม logic เรียก default app + ShellExecute "print" แทน

## การไหลของการสั่งพิมพ์ (ตามที่ออกแบบ)
1. Client resolve MAC → IP ปัจจุบัน (broadcast UDP ใหม่ทุกครั้ง กัน DHCP เปลี่ยน IP)
2. Client ต่อ TCP ไปที่ IP:port → ส่ง `PrintJobHeader` ตามด้วย raw bytes ของไฟล์
3. Server เก็บไฟล์ลง `queue_dir` (สองไฟล์: `<id>.job` ข้อมูลจริง, `<id>.meta.json` metadata) แล้วตอบ `PrintJobAck`
4. `queue::run_queue_worker` (รันแยกเป็น background task ฝั่ง server ตลอดเวลา) poll ทุก 2 วินาที ดึงงานเก่าสุดไปสั่งพิมพ์จริงด้วย `printer::print_raw_bytes` ทีละงาน (กันพิมพ์ชนกัน) แล้วลบไฟล์ทิ้ง
5. ปุ่ม "Print Test" ทั้งฝั่ง server (เรียก `print_test_locally` ใส่ตรงเข้าคิวเลย) และฝั่ง client (ส่งผ่าน network เหมือนงานจริง แต่ตั้ง `is_test = true`) ใช้ path เดียวกันกับงานพิมพ์จริงทั้งหมด เพื่อทดสอบทั้งระบบ network และเครื่องปริ้นจริง

// src/gui.rs
//
// GUI ด้วย egui/eframe (immediate-mode, pure Rust, รันได้ทั้ง Windows/Linux/Mac)
//
// หน้าจอ:
//  1) Setup   - เลือก Server/Client + Transport (TCP/UDP) ครั้งแรก (หรือถ้ามี config เดิมจะข้ามไปเลย)
//  2) Server  - แสดง MAC+IPv4 ของเครื่องนี้, รายชื่อเครื่องที่ต่อเข้ามา, ปุ่ม Print Test, log การพิมพ์,
//               ปุ่ม "เลือกใหม่" (ล้าง config กลับไปหน้า Setup)
//  3) Client  - ปุ่มสแกนวงหา printer (ติ๊กเลือก), ปุ่มทดสอบการเชื่อมต่อ, เลือกไฟล์ส่งพิมพ์ + ปุ่ม Print
//               Test ไปที่ server, ปุ่ม "เลือกใหม่"
//
// ไม่มีการคลิกในโปรแกรมเกิน 2 นาที -> ย่อหน้าต่างเก็บ (Minimized) แทนการปิด (ทำงานเบื้องหลังต่อ เพราะ
// tokio runtime/ network task ทั้งหมดทำงานแยกจาก GUI thread อยู่แล้ว)

use crate::config::{AppConfig, Role, SavedTarget, Transport};
use crate::discovery::DiscoveredServer;
use crate::printer;
use crate::server::{PrintLog, ServerState};
use eframe::egui;
use std::sync::mpsc::{Receiver, Sender};
use std::time::{Duration, Instant};
use tokio::runtime::Runtime;

const IDLE_TIMEOUT: Duration = Duration::from_secs(120);

enum BgEvent {
    ScanResult(Vec<DiscoveredServer>),
    TestResult(Result<String, String>),
    PrintResult(Result<String, String>),
}

pub struct PrinterShareApp {
    rt: Runtime,
    config: AppConfig,

    // server-only shared state
    server_state: Option<ServerState>,
    server_log: Option<PrintLog>,
    server_started: bool,

    // client-only UI state
    scanning: bool,
    scan_results: Vec<DiscoveredServer>,
    selected_mac: Option<String>,
    last_status: String,

    // idle tracking
    last_interaction: Instant,

    bg_tx: Sender<BgEvent>,
    bg_rx: Receiver<BgEvent>,
}

impl PrinterShareApp {
    pub fn new() -> Self {
        let rt = Runtime::new().expect("สร้าง tokio runtime ไม่สำเร็จ");
        let config = AppConfig::load();
        let (bg_tx, bg_rx) = std::sync::mpsc::channel();

        let mut app = Self {
            rt,
            config,
            server_state: None,
            server_log: None,
            server_started: false,
            scanning: false,
            scan_results: Vec::new(),
            selected_mac: None,
            last_status: String::new(),
            last_interaction: Instant::now(),
            bg_tx,
            bg_rx,
        };

        if app.config.role == Some(Role::Server) {
            app.start_server_backend();
        }
        app
    }

    fn start_server_backend(&mut self) {
        if self.server_started {
            return;
        }
        let state = crate::server::new_state();
        let log = crate::server::new_log();
        self.server_state = Some(state.clone());
        self.server_log = Some(log.clone());

        let port = self.config.port;
        let printer_name = self
            .config
            .shared_printer_name
            .clone()
            .unwrap_or_else(|| "Default-Printer".to_string());
        let queue_dir = self.config.queue_dir.clone();

        self.rt.spawn(async move {
            if let Err(e) = crate::server::run_server(port, printer_name, queue_dir, state, log).await
            {
                eprintln!("[server] หยุดทำงานด้วย error: {e}");
            }
        });
        self.server_started = true;
    }

    fn mark_interaction(&mut self) {
        self.last_interaction = Instant::now();
    }
}

impl eframe::App for PrinterShareApp {
    fn update(&mut self, ctx: &egui::Context, _frame: &mut eframe::Frame) {
        // ดึงผลลัพธ์งานพื้นหลัง (scan/test/print) ที่เสร็จแล้วมาอัปเดต UI
        while let Ok(ev) = self.bg_rx.try_recv() {
            match ev {
                BgEvent::ScanResult(list) => {
                    self.scan_results = list;
                    self.scanning = false;
                }
                BgEvent::TestResult(res) => {
                    self.last_status = match res {
                        Ok(m) => format!("✅ {m}"),
                        Err(e) => format!("❌ {e}"),
                    };
                }
                BgEvent::PrintResult(res) => {
                    self.last_status = match res {
                        Ok(m) => format!("✅ {m}"),
                        Err(e) => format!("❌ {e}"),
                    };
                }
            }
        }

        // ตรวจ interaction เพื่อ reset idle timer
        if ctx.input(|i| i.pointer.any_click() || !i.keys_down.is_empty() || i.pointer.any_pressed())
        {
            self.mark_interaction();
        }

        if self.last_interaction.elapsed() > IDLE_TIMEOUT {
            ctx.send_viewport_cmd(egui::ViewportCommand::Minimized(true));
            // รีเซ็ตเวลาไว้ กันส่งคำสั่ง minimize ซ้ำทุกเฟรม
            self.mark_interaction();
        }

        egui::CentralPanel::default().show(ctx, |ui| match &self.config.role {
            None => self.draw_setup(ui),
            Some(Role::Server) => self.draw_server(ui),
            Some(Role::Client) => self.draw_client(ui),
        });

        // ขอ repaint เป็นระยะ เพื่อให้ log/สถานะที่อัปเดตจาก background thread โชว์ทันที
        ctx.request_repaint_after(Duration::from_millis(500));
    }
}

impl PrinterShareApp {
    fn draw_setup(&mut self, ui: &mut egui::Ui) {
        ui.heading("ตั้งค่าเริ่มต้น Printer Share");
        ui.label("เลือกว่าเครื่องนี้จะทำหน้าที่อะไร:");
        ui.add_space(10.0);

        ui.horizontal(|ui| {
            if ui.button("🖥  เป็น Server (แชร์เครื่องปริ้น)").clicked() {
                self.config.role = Some(Role::Server);
                let _ = self.config.save();
                self.start_server_backend();
                self.mark_interaction();
            }
            if ui.button("💻 เป็น Client (รับเครื่องปริ้น)").clicked() {
                self.config.role = Some(Role::Client);
                let _ = self.config.save();
                self.mark_interaction();
            }
        });

        ui.add_space(10.0);
        ui.label("รูปแบบการส่งข้อมูล:");
        ui.horizontal(|ui| {
            if ui
                .selectable_label(self.config.transport == Transport::Tcp, "TCP")
                .clicked()
            {
                self.config.transport = Transport::Tcp;
                let _ = self.config.save();
            }
            if ui
                .selectable_label(self.config.transport == Transport::Udp, "UDP")
                .clicked()
            {
                self.config.transport = Transport::Udp;
                let _ = self.config.save();
            }
        });
        ui.add_space(6.0);
        ui.small("หมายเหตุ: งานพิมพ์จริงต้องอาศัย TCP (รับประกันข้อมูลครบ/ไม่หาย) — UDP ใช้สำหรับการ\nค้นหาเครื่อง (discovery) เท่านั้นเสมอ ไม่ว่าจะเลือกโหมดไหน");
    }

    fn draw_server(&mut self, ui: &mut egui::Ui) {
        ui.horizontal(|ui| {
            ui.heading("Server - กำลังแชร์เครื่องปริ้น");
            if ui.button("⟲ เลือกใหม่").clicked() {
                self.config.reset();
                self.server_started = false;
                self.server_state = None;
                self.server_log = None;
                self.mark_interaction();
                return;
            }
        });

        ui.add_space(8.0);
        ui.label(format!("Hostname: {}", crate::discovery::local_hostname()));
        ui.label(format!("MAC Address: {}", crate::discovery::local_mac_string()));
        ui.label(format!("IPv4: {}", crate::discovery::local_ip_string()));
        ui.label(format!("พอร์ตรับงานพิมพ์ (TCP): {}", self.config.port));

        ui.add_space(8.0);
        ui.horizontal(|ui| {
            ui.label("ชื่อเครื่องปริ้นที่จะแชร์ (ต้องตรงกับชื่อที่ติดตั้งใน Windows):");
        });
        let mut printer_name = self.config.shared_printer_name.clone().unwrap_or_default();
        if ui.text_edit_singleline(&mut printer_name).changed() {
            self.config.shared_printer_name = Some(printer_name.clone());
            let _ = self.config.save();
            self.mark_interaction();
        }

        #[cfg(windows)]
        {
            if ui.button("รายชื่อเครื่องปริ้นที่ติดตั้งในเครื่องนี้").clicked() {
                self.mark_interaction();
            }
            ui.horizontal_wrapped(|ui| {
                for name in printer::list_local_printers() {
                    if ui.button(&name).clicked() {
                        self.config.shared_printer_name = Some(name.clone());
                        let _ = self.config.save();
                    }
                }
            });
        }

        ui.add_space(10.0);
        if ui.button("🖨  Print Test (พิมพ์ทดสอบจาก server เอง)").clicked() {
            self.mark_interaction();
            let queue_dir = self.config.queue_dir.clone();
            let tx = self.bg_tx.clone();
            self.rt.spawn(async move {
                let res = crate::server::print_test_locally(&queue_dir)
                    .await
                    .map(|_| "ส่งงาน test เข้าคิวแล้ว".to_string())
                    .map_err(|e| format!("{e}"));
                let _ = tx.send(BgEvent::PrintResult(res));
            });
        }

        ui.add_space(10.0);
        ui.separator();
        ui.label("เครื่องที่เชื่อมต่อเข้ามา:");
        if let Some(state) = &self.server_state {
            let st = state.lock().unwrap();
            if st.is_empty() {
                ui.small("(ยังไม่มีเครื่อง client เชื่อมต่อเข้ามา)");
            }
            for c in st.values() {
                ui.label(format!(
                    "• {}  ({})  เห็นล่าสุด {:?} วินาทีที่แล้ว",
                    c.device_name,
                    c.ip,
                    c.last_seen.elapsed().as_secs()
                ));
            }
        }

        ui.add_space(10.0);
        ui.separator();
        ui.label("Log การพิมพ์ล่าสุด:");
        egui::ScrollArea::vertical().max_height(180.0).show(ui, |ui| {
            if let Some(log) = &self.server_log {
                let l = log.lock().unwrap();
                for line in l.iter().rev() {
                    ui.small(line);
                }
            }
        });

        if !self.last_status.is_empty() {
            ui.add_space(6.0);
            ui.label(&self.last_status);
        }
    }

    fn draw_client(&mut self, ui: &mut egui::Ui) {
        ui.horizontal(|ui| {
            ui.heading("Client - เชื่อมต่อเครื่องปริ้นที่แชร์");
            if ui.button("⟲ เลือกใหม่").clicked() {
                self.config.reset();
                self.scan_results.clear();
                self.selected_mac = None;
                self.mark_interaction();
                return;
            }
        });

        ui.add_space(8.0);
        if let Some(target) = self.config.selected_target.clone() {
            ui.group(|ui| {
                ui.label("เครื่องที่เลือกไว้แล้ว:");
                ui.label(format!(
                    "🖨 {}  |  MAC: {}  |  IP ล่าสุด: {}",
                    target.printer_name, target.mac_address, target.last_known_ip
                ));
                ui.horizontal(|ui| {
                    if ui.button("ทดสอบการเชื่อมต่อ").clicked() {
                        self.mark_interaction();
                        let ip = target.last_known_ip.clone();
                        let port = target.port;
                        let mac = target.mac_address.clone();
                        let tx = self.bg_tx.clone();
                        self.rt.spawn(async move {
                            let resolved =
                                crate::client::resolve_target(&mac, &ip, port).await;
                            let res = match resolved {
                                Ok((ip, port)) => crate::client::test_connection(&ip, port).await,
                                Err(e) => Err(e),
                            };
                            let _ = tx.send(BgEvent::TestResult(res));
                        });
                    }
                    if ui.button("🖨 Print Test ไปที่ server").clicked() {
                        self.mark_interaction();
                        let ip = target.last_known_ip.clone();
                        let port = target.port;
                        let mac = target.mac_address.clone();
                        let device_name = crate::discovery::local_hostname();
                        let tx = self.bg_tx.clone();
                        self.rt.spawn(async move {
                            let resolved =
                                crate::client::resolve_target(&mac, &ip, port).await;
                            let res = match resolved {
                                Ok((ip, port)) => {
                                    let data = printer::build_test_page(&device_name);
                                    crate::client::send_print_job(
                                        &ip,
                                        port,
                                        "client_test_page.txt",
                                        &data,
                                        true,
                                        &device_name,
                                    )
                                    .await
                                }
                                Err(e) => Err(e),
                            };
                            let _ = tx.send(BgEvent::PrintResult(res));
                        });
                    }
                });
            });
        } else {
            ui.small("(ยังไม่ได้เลือกเครื่องปริ้น — กดสแกนวงด้านล่างเพื่อค้นหา)");
        }

        ui.add_space(10.0);
        ui.separator();
        ui.horizontal(|ui| {
            let btn_text = if self.scanning { "กำลังสแกน..." } else { "🔍 สแกนวงหาเครื่องปริ้น" };
            if ui.add_enabled(!self.scanning, egui::Button::new(btn_text)).clicked() {
                self.mark_interaction();
                self.scanning = true;
                let tx = self.bg_tx.clone();
                self.rt.spawn(async move {
                    let results = crate::client::scan(2).await;
                    let _ = tx.send(BgEvent::ScanResult(results));
                });
            }
        });

        ui.add_space(6.0);
        for s in self.scan_results.clone() {
            ui.horizontal(|ui| {
                let checked = self.selected_mac.as_deref() == Some(s.mac_address.as_str());
                if ui
                    .selectable_label(
                        checked,
                        format!("☐ {}  ({})  MAC: {} — IP: {}", s.printer_name, s.hostname, s.mac_address, s.ip),
                    )
                    .clicked()
                {
                    self.mark_interaction();
                    self.selected_mac = Some(s.mac_address.clone());
                    self.config.selected_target = Some(SavedTarget {
                        mac_address: s.mac_address.clone(),
                        last_known_ip: s.ip.clone(),
                        printer_name: s.printer_name.clone(),
                        server_hostname: s.hostname.clone(),
                        port: s.port,
                    });
                    let _ = self.config.save();
                }
            });
        }

        if !self.last_status.is_empty() {
            ui.add_space(8.0);
            ui.label(&self.last_status);
        }
    }
}

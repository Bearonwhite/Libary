// src/main.rs
mod client;
mod config;
mod discovery;
mod gui;
mod printer;
mod protocol;
mod queue;
mod server;

use eframe::egui;

fn setup_thai_fonts(ctx: &egui::Context) {
    let mut fonts = egui::FontDefinitions::default();
    fonts.font_data.insert(
        "noto_sans_thai".to_owned(),
        egui::FontData::from_static(include_bytes!("../assets/fonts/NotoSansThai-Regular.ttf")),
    );
    // ใส่ฟอนต์ไทยไว้ลำดับแรกของ Proportional family เพื่อให้ใช้แสดงผลภาษาไทยเป็นหลัก
    // (ตัวอักษร latin/ตัวเลขยังคงอ่านจากฟอนต์ default ของ egui ต่อท้ายได้ตามปกติ)
    fonts
        .families
        .get_mut(&egui::FontFamily::Proportional)
        .unwrap()
        .insert(0, "noto_sans_thai".to_owned());
    fonts
        .families
        .get_mut(&egui::FontFamily::Monospace)
        .unwrap()
        .push("noto_sans_thai".to_owned());

    ctx.set_fonts(fonts);
}

fn main() -> eframe::Result<()> {
    let options = eframe::NativeOptions {
        viewport: egui::ViewportBuilder::default().with_inner_size([640.0, 560.0]),
        ..Default::default()
    };

    eframe::run_native(
        "Printer Share",
        options,
        Box::new(|cc| {
            setup_thai_fonts(&cc.egui_ctx);
            Box::new(gui::PrinterShareApp::new())
        }),
    )
}

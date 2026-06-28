/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Folder, File, Info, ChevronRight, ChevronDown, CheckCircle2 } from 'lucide-react';

interface StructureItem {
  name: string;
  type: 'folder' | 'file';
  description: string;
  role: string;
  children?: StructureItem[];
}

export default function FolderStructureView() {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'src': true,
    'src/types': true,
    'src/data': true,
    'src/components': true,
  });

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => ({ ...prev, [path]: !prev[path] }));
  };

  const structure: StructureItem[] = [
    {
      name: 'src',
      type: 'folder',
      description: 'โฟลเดอร์หลักสำหรับซอร์สโค้ดของแอปพลิเคชัน',
      role: 'บรรจุโค้ด React, ไฟล์ประเภทข้อมูล, และข้อมูลตั้งต้นสำหรับระบบทั้งหมด',
      children: [
        {
          name: 'types',
          type: 'folder',
          description: 'เก็บไฟล์กำหนด Type ในภาษา TypeScript เพื่อความปลอดภัยของข้อมูล (Type Safety)',
          role: 'ควบคุมรูปแบบข้อมูลโครงสร้างบิลด์ (Build Schema), ค่าสเตตัส และข้อมูลสมาชิกร่วมกัน',
          children: [
            {
              name: 'warframe.ts',
              type: 'file',
              description: 'อินเตอร์เฟสหลัก เช่น Build, WarframeMod, Arcane, Helminth, User และ Polarity',
              role: 'ช่วยป้องกันข้อผิดพลาดในการเขียนโปรแกรมแบบ Static Typing ทั่วทั้งระบบ'
            }
          ]
        },
        {
          name: 'data',
          type: 'folder',
          description: 'เก็บข้อมูลดิบ (Raw Data) และค่าสเตตัสเริ่มต้นของเกม Warframe',
          role: 'จำลองฐานข้อมูล Mod, Arcane, Warframes และ Helminth เพื่อใช้ค้นหาและติดตั้งโดยไม่ต้องผ่าน API นอก',
          children: [
            {
              name: 'warframeData.ts',
              type: 'file',
              description: 'คลังข้อมูล Warframes หลัก, Mod ออร่า/เอกซิลัส/ทั่วไป, อาเคนทั้งหมด และสกิล Helminth',
              role: 'ใช้เป็น Database ค้นหาข้อมูลแบบ Instant Search ตอนผู้ใช้งานจัด Build'
            }
          ]
        },
        {
          name: 'components',
          type: 'folder',
          description: 'ส่วนประกอบย่อยของหน้าจออินเตอร์เฟส (Reusable UI Components)',
          role: 'แบ่งส่วนควบคุมหน้าต่าง จัด Mod, บอร์ดแสดง Build, ระบบจำลอง Auth และข้อมูลโครงสร้างเป็นโมดูล',
          children: [
            {
              name: 'Header.tsx',
              type: 'file',
              description: 'แถบนำทางส่วนบน (Navigation Bar) และส่วนสลับสิทธิ์การเข้าถึง',
              role: 'แสดงสถานะ Guest / Member พร้อมจำลองระบบล็อกอิน และสลับผู้ใช้งาน'
            },
            {
              name: 'BuildCard.tsx',
              type: 'file',
              description: 'การ์ดแสดงรายละเอียดของแต่ละบิลด์ (1 Build = 1 Card)',
              role: 'แสดงรูป Frame, พลังงาน Helminth, อาเคนที่ใส่ และปุ่ม Edit สำหรับเข้าไปแก้ไข'
            },
            {
              name: 'BuildGrid.tsx',
              type: 'file',
              description: 'กระดานรวมบิลด์ทั้งหมด (Dashboard Layout)',
              role: 'ระบบค้นหาตามชื่อเฟรม, คัดกรอง Build ของสมาชิก (Member-only) และปุ่มสร้าง Build ใหม่'
            },
            {
              name: 'ModGrid.tsx',
              type: 'file',
              description: 'จำลองสล็อตใส่ Mod แบบตาราง 10 ช่อง (8 ทั่วไป + 1 Aura + 1 Exilus)',
              role: 'ตรวจสอบขั้ว (Polarity MATCH), คำนวณความจุการ์ด (Mod Capacity 60/60) และถอดถอนการ์ด'
            },
            {
              name: 'StatPanel.tsx',
              type: 'file',
              description: 'แผงแสดงสเตตัสผลลัพธ์ของ Warframe แบบ Real-time',
              role: 'คำนวณ Strength, Duration, Range, Efficiency, Health, Armor จาก Mod ที่ผู้ใช้งานจัดไว้'
            },
            {
              name: 'ArcaneSelector.tsx',
              type: 'file',
              description: 'ระบบสวมใส่ Arcane 2 ช่อง',
              role: 'ค้นหา คัดกรองตามความหายาก และติดตั้ง/เปลี่ยน Arcane'
            },
            {
              name: 'HelminthSelector.tsx',
              type: 'file',
              description: 'ระบบเปลี่ยนสกิลของ Warframe ผ่าน Helminth System',
              role: 'เลือกสกิล Helminth และกำหนดว่าต้องการนำมาแทนที่สกิลช่องใด (สกิล 1-4)'
            },
            {
              name: 'AuthModal.tsx',
              type: 'file',
              description: 'หน้าต่างป๊อปอัปสมัคร/ล็อกอินสมาชิก',
              role: 'จำลองสิทธิ์ Member เพื่อสลับการเข้าถึง และการจำกัดสิทธิ์ Guest ไม่ให้เห็นข้อมูลสมาชิก'
            },
            {
              name: 'FolderStructureView.tsx',
              type: 'file',
              description: 'หน้ารายละเอียดคู่มือโครงสร้างโฟลเดอร์',
              role: 'ให้ข้อมูลโครงสร้างและรายละเอียดบทบาทหน้าที่ของแต่ละไฟล์ในระบบอย่างละเอียด'
            }
          ]
        },
        {
          name: 'App.tsx',
          type: 'file',
          description: 'คอมโพเนนต์หลักศูนย์กลางของแอปพลิเคชัน',
          role: 'ควบคุม State หลักของหน้าจอ (Editor vs Dashboard), จัดการข้อมูล LocalStorage บิลด์ และควบคุมผู้ใช้'
        },
        {
          name: 'index.css',
          type: 'file',
          description: 'ไฟล์สไตล์หลักของระบบ',
          role: 'อิมพอร์ต Tailwind CSS และตั้งค่าตัวเลือกสไตล์ ฟอนต์ พารามิเตอร์ธีม'
        },
        {
          name: 'main.tsx',
          type: 'file',
          description: 'ไฟล์จุดเริ่มต้นการรัน React',
          role: 'ติดตั้ง React และ Mount คอมโพเนนต์หลักลงใน HTML Root element'
        }
      ]
    },
    {
      name: 'metadata.json',
      type: 'file',
      description: 'ข้อมูลเมตาของโปรเจกต์ AI Studio',
      role: 'ตั้งชื่อแอปพลิเคชัน (Warframe Build Backup) และสิทธิ์การเข้าถึงความสามารถอื่นๆ'
    },
    {
      name: 'package.json',
      type: 'file',
      description: 'ไฟล์จัดการแพ็กเกจและสคริปต์การรัน',
      role: 'บันทึกรายชื่อ Libraries เช่น Lucide React, Motion (Framer Motion), Tailwind'
    },
    {
      name: 'vite.config.ts',
      type: 'file',
      description: 'ไฟล์กำหนดค่าเครื่องมือ Vite',
      role: 'จัดการการคอมไพล์ React และปลั๊กอิน Tailwind CSS v4'
    }
  ];

  const renderTree = (items: StructureItem[], parentPath: string = '') => {
    return (
      <ul className="pl-4 border-l border-zinc-800 space-y-1.5 mt-1.5">
        {items.map((item) => {
          const currentPath = parentPath ? `${parentPath}/${item.name}` : item.name;
          const isFolder = item.type === 'folder';
          const isExpanded = expandedFolders[currentPath];

          return (
            <li key={currentPath} className="text-sm">
              <div 
                className={`flex items-start md:items-center gap-2 p-1.5 rounded-lg transition-colors group cursor-pointer ${
                  isFolder ? 'hover:bg-zinc-900/60' : 'hover:bg-zinc-950/40'
                }`}
                onClick={() => isFolder && toggleFolder(currentPath)}
              >
                <div className="flex items-center gap-1">
                  {isFolder ? (
                    <>
                      <span className="text-zinc-500">
                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </span>
                      <Folder className="text-amber-500 fill-amber-500/10 shrink-0" size={16} />
                    </>
                  ) : (
                    <>
                      <span className="w-3.5" />
                      <File className="text-blue-400 shrink-0" size={16} />
                    </>
                  )}
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 flex-1">
                  <span className={`font-mono font-medium ${isFolder ? 'text-zinc-200' : 'text-zinc-300'}`}>
                    {item.name}
                  </span>
                  <span className="text-xs text-zinc-500 max-w-md line-clamp-1 md:line-clamp-none">
                    {item.description}
                  </span>
                </div>

                {isFolder && (
                  <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded font-mono uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                    Directory
                  </span>
                )}
              </div>

              {isFolder && isExpanded && item.children && (
                <div>
                  {renderTree(item.children, currentPath)}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div id="folder-structure-view" className="bg-zinc-950/40 border border-zinc-800 rounded-xl p-5 md:p-6 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-zinc-800 pb-5">
        <div>
          <h2 className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
            <Info className="text-amber-500" size={20} />
            คู่มือสถาปัตยกรรมและโครงสร้างโฟลเดอร์ (Folder Structure Directory)
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            รายละเอียดไฟล์และการจัดแบ่งระบบตามที่ออกแบบไว้สำหรับ Warframe Build Backup
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-950/20 text-emerald-400 border border-emerald-800/50 px-3 py-1.5 rounded-lg text-xs font-medium">
          <CheckCircle2 size={14} />
          <span>TypeScript & Tailwind v4 Configured</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tree Directory Column */}
        <div className="lg:col-span-7 bg-zinc-900/30 border border-zinc-800/60 rounded-xl p-4 overflow-x-auto">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 mb-3">
            <span className="text-xs font-semibold text-zinc-400 tracking-wider uppercase font-mono">โครงสร้างไดเรกทอรี</span>
            <button 
              onClick={() => setExpandedFolders({
                'src': true,
                'src/types': true,
                'src/data': true,
                'src/components': true,
              })} 
              className="text-[11px] text-amber-500 hover:underline hover:text-amber-400 font-mono"
            >
              Expand All
            </button>
          </div>
          <div className="min-w-[400px]">
            {renderTree(structure)}
          </div>
        </div>

        {/* Details and Architecture Explain Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-amber-950/10 border border-amber-900/30 rounded-xl p-4">
            <h3 className="text-xs font-semibold text-amber-400 tracking-wider uppercase font-mono mb-2">แนวทางการจัดแบ่งระบบหลัก</h3>
            <ul className="space-y-3.5 text-xs text-zinc-300">
              <li className="flex gap-2">
                <span className="text-amber-500 font-bold shrink-0">1.</span>
                <div>
                  <strong className="text-zinc-100 block mb-0.5">ระบบ Show Mod / Edit</strong>
                  แยกช่องใส่ Mod เป็นประเภทชัดเจน (Aura, Exilus, standard 8 ช่อง) คำนวณ Capacity (60 ขั้วตรงกันลดครึ่ง, ขั้วไม่ตรงเพิ่ม, ขั้วออร่าเพิ่มความจุ) และเชื่อมสเตตัสเข้ากับ Stat Panel ทันที
                </div>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-500 font-bold shrink-0">2.</span>
                <div>
                  <strong className="text-zinc-100 block mb-0.5">ระบบ Arcanes & Helminth</strong>
                  ติดตั้งพลังเสริมได้สูงสุด 2 ช่อง และเปลี่ยนสกิล Warframe เดิม เพื่อปลดขีดจำกัดสเตตัสในแบบที่ต้องการ
                </div>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-500 font-bold shrink-0">3.</span>
                <div>
                  <strong className="text-zinc-100 block mb-0.5">ระบบสมาชิก (Access Controls)</strong>
                  จำกัดสิทธิ์อย่างมีประสิทธิภาพ บิลด์ที่ทำเครื่องหมาย "Member Only" จะไม่แสดงบนหน้ากระดานสำหรับผู้ใช้ทั่วไป (Guest) ทำให้สร้างสังคมจำลองระดับพรีเมียมได้สมบูรณ์แบบ
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4">
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-mono mb-2">การขยายระบบสู่ Cloud</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              ในอนาคต หากคุณเชื่อมฐานข้อมูล API จากภายนอกหรือระบบ Cloud สามารถสับเปลี่ยนไฟล์ <code className="text-amber-500 font-mono bg-zinc-950 px-1 py-0.5 rounded">src/data/warframeData.ts</code> ไปใช้การเรียกข้อมูลผ่าน <code className="text-amber-500 font-mono bg-zinc-950 px-1 py-0.5 rounded">fetch()</code> จาก URL API และจัดการเก็บข้อมูลผู้ใช้นอกจำลองได้ทันที โดยโครงสร้างโฟลเดอร์นี้ออกแบบมาเป็นแบบ Decoupled เรียบร้อยแล้ว
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Database, Shield, Server, FileCode, Users, Plus, Key, RefreshCw, Layers, Sparkles, Check, Copy, Download, ArrowUpRight, TrendingUp } from 'lucide-react';
import { User, Build } from '../types/warframe';

interface AdminCloudPanelProps {
  builds: Build[];
  onAddSimulatedUser: (user: User) => void;
  simulatedUsers: User[];
  onRemoveSimulatedUser: (id: string) => void;
  onCommitGlobalBuildsJson: (jsonString: string) => void;
  globalBuildsJson: string;
}

export default function AdminCloudPanel({
  builds,
  onAddSimulatedUser,
  simulatedUsers,
  onRemoveSimulatedUser,
  onCommitGlobalBuildsJson,
  globalBuildsJson
}: AdminCloudPanelProps) {
  const [newUsername, setNewUsername] = useState('');
  const [newUserRole, setNewUserRole] = useState<'member' | 'admin'>('member');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // SQL schema code
  const sqlSchema = `-- ==========================================
-- SUPABASE / POSTGRESQL DATABASE SCHEMAS
-- WARFRAME BUILD BACKUP SYSTEM (OPTIMIZED)
-- ==========================================

-- 1. Table for member list and role configuration
CREATE TABLE IF NOT EXISTS public.members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(20) CHECK (role IN ('member', 'admin')) DEFAULT 'member',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL
);

-- 2. Table for storing the optimized global build catalog JSON
-- Minimizes continuous select queries to zero per user check-in!
CREATE TABLE IF NOT EXISTS public.cloud_backups (
    id BIGSERIAL PRIMARY KEY,
    backup_file_name VARCHAR(100) DEFAULT 'builds_backup.json' UNIQUE,
    data JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_by VARCHAR(100) NOT NULL
);

-- 3. Row Level Security (RLS) Rules for security compliance
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cloud_backups ENABLE ROW LEVEL SECURITY;

-- Allow read-only access to backups for authenticated members
CREATE POLICY "Allow read access to members" 
ON public.cloud_backups 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Full write/edit access for admins only
CREATE POLICY "Admins full management" 
ON public.cloud_backups 
FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.members 
        WHERE username = auth.jwt()->>'email' AND role = 'admin'
    )
);

-- Seed Initial Super Admin
INSERT INTO public.members (username, role) 
VALUES ('Lotus_Admin', 'admin')
ON CONFLICT (username) DO NOTHING;`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim()) return;

    const user: User = {
      id: newUserRole + '_sim_' + Math.random().toString(36).substr(2, 4),
      username: newUsername.trim(),
      role: newUserRole
    };

    onAddSimulatedUser(user);
    setNewUsername('');
  };

  // Compile full list JSON
  const currentCompiledJson = JSON.stringify(builds, null, 2);

  const handleCommit = () => {
    onCommitGlobalBuildsJson(currentCompiledJson);
    alert('บันทึกและอัพโหลดไฟล์ builds_backup.json สำเร็จ! สมาชิกทุกคนที่ล็อกอินจะดาวน์โหลดไฟล์ชุดนี้ไปใช้งานทันที');
  };

  // Calculated Stats
  const databaseOperationsSaved = builds.length * 15 * 12; // simulated select saves
  const estimatedCloudBillCost = "0.00$ (Supabase Free Tier Safe)";

  return (
    <div id="admin-cloud-panel-root" className="max-w-7xl mx-auto p-4 md:p-6 space-y-8">
      {/* Overview Hero header */}
      <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold font-mono tracking-widest uppercase mb-2">
              <Shield size={14} />
              <span>ADMINISTRATOR CLOUD CONTROL CENTER</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-100 tracking-tight">ระบบจัดการฐานข้อมูล Supabase & JSON Cloud List</h2>
            <p className="text-sm text-zinc-400 mt-2 max-w-2xl">
              จัดการรายชื่อผู้ใช้อัตโนมัติด้วย SQL และรวบรวมไฟล์สำรองบิลด์หลักอัพเดตขึ้น Cloud 
              ช่วยลดการส่งคิวรี่ลงฐานข้อมูลได้ถึง 100% ด้วยเทคนิคสตรีมมิ่งไฟล์ JSON สำหรับผู้ใช้งานทั่วไป
            </p>
          </div>
          <div className="bg-rose-500/10 border border-rose-500/20 px-4 py-3 rounded-xl flex items-center gap-3">
            <Server className="text-rose-400 shrink-0" size={24} />
            <div className="font-mono text-xs">
              <div className="text-zinc-500">CLOUD STATUS</div>
              <div className="text-rose-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span>CONNECTED TO SUPABASE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-2xl">
          <span className="text-xs text-zinc-500 font-mono block">DATABASE REDUCTION</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-zinc-100 font-mono">100%</span>
            <span className="text-xs text-emerald-400 font-medium">Saved Reads</span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">
            ใช้ JSON STATIC BLOCK โหลดครั้งแรกตอนล็อกอิน แทนการดึงทีละฟิลด์
          </p>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-2xl">
          <span className="text-xs text-zinc-500 font-mono block">QUERIES CONSERVED</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-zinc-100 font-mono">~{databaseOperationsSaved}</span>
            <span className="text-xs text-rose-400 font-medium font-mono">SELECTS/day</span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">
            ประหยัดรอบการทำงานของคลาวด์ได้อย่างมีนัยสำคัญ
          </p>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-2xl">
          <span className="text-xs text-zinc-500 font-mono block">CLOUD BUDGET CONSUMPTION</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-emerald-400 font-mono">$0.00</span>
            <span className="text-[10px] text-zinc-400 font-medium font-mono">FREE LEVEL</span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">
            ปลอดภัยจากการเก็บเงินเกินขีดจำกัดของคลาวด์ฟรี Supabase
          </p>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-2xl">
          <span className="text-xs text-zinc-500 font-mono block">COMPILED BUILDS LIST</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-zinc-100 font-mono">{builds.length}</span>
            <span className="text-xs text-zinc-400 font-medium">ชุดข้อมูลพร้อมอัพ</span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">
            พร้อมรวมเป็นไฟล์เดียวแล้วเขียนกลับขึ้นไปที่ `cloud_backups`
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Hand: SQL schema & Build compilation */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Section 1: Build JSON Compiler */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
                  <Layers size={16} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-200">เขียนและคอมไพล์ Build List (.json)</h3>
                  <p className="text-xs text-zinc-500">จัดการรวบรวมข้อมูลบิลด์และเตรียมอัพขึ้นคลาวด์เพื่อจ่ายแจกสมาชิก</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(currentCompiledJson, 'compiledJson')}
                  className="px-2.5 py-1.5 bg-zinc-850 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  {copiedText === 'compiledJson' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  <span>คัดลอก JSON</span>
                </button>
              </div>
            </div>

            {/* Compiled JSON Preview */}
            <div className="relative">
              <pre className="p-4 bg-zinc-950 rounded-xl text-[11px] text-zinc-400 font-mono max-h-[220px] overflow-y-auto border border-zinc-900 scrollbar-thin">
                {currentCompiledJson}
              </pre>
              <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none rounded-b-xl" />
            </div>

            <div className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-3.5 flex items-start gap-3">
              <Sparkles className="text-rose-400 shrink-0 mt-0.5" size={15} />
              <div className="text-xs text-zinc-400 leading-relaxed">
                <span className="font-bold text-zinc-200">ระบบประหยัดคลาวด์:</span> ทุกครั้งที่มีการบันทึก บิลด์จะถูกเขียนลงในตัวแปร JSON ก้อนเดียวก่อน เมื่อแอดมินกด 
                <span className="text-rose-400 font-semibold mx-1">"เขียนบิลด์และอัพโหลดขึ้น Cloud"</span> มันจะเขียนทับไฟล์สำรองก้อนใหญ่บนคลาวด์ เมื่อผู้ใช้อื่นเข้าสู่ระบบจะดึงไฟล์ก้อนเดียวนี้ไปเก็บไว้ใน local ทันที ทำให้ไม่ต้องยิง select บ่อยๆ !
              </div>
            </div>

            <button
              onClick={handleCommit}
              className="w-full py-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-zinc-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-rose-500/10 flex items-center justify-center gap-2"
            >
              <RefreshCw size={14} className="animate-spin-slow" />
              <span>เขียนบิลด์และอัพโหลดขึ้น Cloud (Supabase Storage)</span>
            </button>
          </div>

          {/* Section 2: PostgreSQL Schema */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                  <FileCode size={16} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-200">Supabase SQL Schema DDL</h3>
                  <p className="text-xs text-zinc-500">คัดลอกโครงสร้างไปใช้สร้างตารางในหน้าต่าง SQL Editor ของ Supabase</p>
                </div>
              </div>

              <button
                onClick={() => copyToClipboard(sqlSchema, 'sqlSchema')}
                className="px-2.5 py-1.5 bg-zinc-850 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 rounded-lg flex items-center gap-1.5 transition-colors"
                title="คัดลอกคำสั่ง SQL ทั้งหมด"
              >
                {copiedText === 'sqlSchema' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>{copiedText === 'sqlSchema' ? 'คัดลอกแล้ว!' : 'คัดลอก SQL'}</span>
              </button>
            </div>

            <div className="relative">
              <pre className="p-4 bg-zinc-950 rounded-xl text-[10px] text-zinc-500 font-mono max-h-[300px] overflow-y-auto border border-zinc-900 scrollbar-thin">
                {sqlSchema}
              </pre>
              <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none rounded-b-xl" />
            </div>
          </div>

        </div>

        {/* Right Hand: Simulated Users Database */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
                <Users size={16} />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-200">รายชื่อสมาชิกในคลาวด์ (Simulated Supabase DB)</h3>
                <p className="text-xs text-zinc-500">จัดการเพิ่มสิทธิ์สมาชิกและผู้ดูแลเพื่อเข้าถึงบิลด์จำกัดส่วนตัว</p>
              </div>
            </div>

            {/* Quick user add form */}
            <form onSubmit={handleAddUser} className="space-y-3 bg-zinc-950/40 p-3.5 rounded-xl border border-zinc-800/60">
              <h4 className="text-xs font-bold text-zinc-300 font-mono uppercase">เพิ่มสมาชิกใหม่ขึ้น Cloud</h4>
              <div className="space-y-2">
                <div>
                  <label className="block text-[10px] text-zinc-500 mb-1">ชื่อผู้ใช้งาน</label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น Ordis_Helper"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-850 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-rose-500/50 transition-colors"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewUserRole('member')}
                    className={`py-1.5 rounded-lg text-xs font-semibold border ${
                      newUserRole === 'member'
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-500'
                        : 'bg-zinc-950 border-zinc-900 text-zinc-500'
                    }`}
                  >
                    MEMBER
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewUserRole('admin')}
                    className={`py-1.5 rounded-lg text-xs font-semibold border ${
                      newUserRole === 'admin'
                        ? 'bg-rose-500/10 border-rose-500/40 text-rose-400'
                        : 'bg-zinc-950 border-zinc-900 text-zinc-500'
                    }`}
                  >
                    ADMIN
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-rose-500 hover:bg-rose-400 text-zinc-950 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1 mt-2"
              >
                <Plus size={13} />
                <span>บันทึกรายชื่อลง Supabase</span>
              </button>
            </form>

            {/* Users list */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-zinc-400 font-mono uppercase">ตารางสมาชิกปัจจุบัน ({simulatedUsers.length})</h4>
              <div className="space-y-1.5 max-h-[300px] overflow-y-auto scrollbar-thin pr-1">
                {simulatedUsers.map((user) => (
                  <div 
                    key={user.id} 
                    className="flex items-center justify-between p-2.5 bg-zinc-950 rounded-lg border border-zinc-900 hover:border-zinc-850 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${user.role === 'admin' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                      <span className="text-xs text-zinc-200 font-mono truncate max-w-[120px]">{user.username}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                        user.role === 'admin' 
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                          : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      }`}>
                        {user.role.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-zinc-600 font-mono hidden sm:inline">Active</span>
                      {user.id !== 'admin_initial' && (
                        <button
                          onClick={() => onRemoveSimulatedUser(user.id)}
                          className="text-[10px] text-red-500 hover:text-red-400 font-mono px-1.5 py-0.5 hover:bg-red-500/10 rounded transition-colors"
                        >
                          ลบ
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

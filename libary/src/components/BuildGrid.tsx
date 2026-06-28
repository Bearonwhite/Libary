/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Search, Plus, Filter, LayoutGrid, Sparkles, ShieldAlert, Award, ArrowRight, Download, Upload } from 'lucide-react';
import { Build, User } from '../types/warframe';
import { WARFRAMES } from '../data/warframeData';
import BuildCard from './BuildCard';

interface BuildGridProps {
  builds: Build[];
  currentUser: User;
  onEditBuild: (build: Build) => void;
  onDeleteBuild: (id: string) => void;
  onCreateNewClick: () => void;
  onLoginClick: () => void;
  onExportBuilds: () => void;
  onImportBuilds: (importedList: any[]) => void;
}

export default function BuildGrid({ 
  builds, 
  currentUser, 
  onEditBuild, 
  onDeleteBuild, 
  onCreateNewClick,
  onLoginClick,
  onExportBuilds,
  onImportBuilds
}: BuildGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFrameId, setSelectedFrameId] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showMemberOnlyOnly, setShowMemberOnlyOnly] = useState<boolean>(false);

  // Filter logic based on access permissions and search criteria
  const filteredBuilds = builds.filter(build => {
    // 1. Role-based filtering: Guests absolutely cannot see Member Only builds!
    if (currentUser.role === 'guest' && build.isMemberOnly) {
      return false;
    }

    // 2. Search query (matches title, description, or warframe name)
    const warframe = WARFRAMES.find(wf => wf.id === build.warframeId);
    const matchesSearch = 
      build.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (build.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (warframe?.name || '').toLowerCase().includes(searchQuery.toLowerCase());

    // 3. Category Filter
    const matchesCategory = selectedCategory === 'all' || (build.category || 'warframe') === selectedCategory;

    // 4. Warframe category filter
    const matchesFrame = selectedFrameId === 'all' || build.warframeId === selectedFrameId;

    // 5. Member-only toggle (available only for logged-in members)
    const matchesMemberToggle = !showMemberOnlyOnly || build.isMemberOnly;

    return matchesSearch && matchesCategory && matchesFrame && matchesMemberToggle;
  });

  // Calculate some numbers
  const totalMemberBuildsCount = builds.filter(b => b.isMemberOnly).length;
  const invisibleMemberBuildsCount = currentUser.role === 'guest' ? totalMemberBuildsCount : 0;

  return (
    <div id="build-grid-container" className="space-y-6">
      {/* Welcome Banner / Guest Notification */}
      {currentUser.role === 'guest' ? (
        <div className="bg-gradient-to-r from-cyan-950/20 via-blue-950/10 to-zinc-950 border border-cyan-800/40 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-lg shadow-cyan-500/5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
              <ShieldAlert size={16} />
              <span>โหมดผู้ใช้งานทั่วไป (Guest Mode Activated)</span>
            </div>
            <h2 className="text-lg font-bold text-zinc-100">
              คุณกำลังเข้าใช้งานในฐานะผู้มาเยือนทั่วไป
            </h2>
            <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
              คุณสามารถสร้างและแก้ไขบิลด์ของคุณในคลังแสงจำลองได้ด้วยสิทธิ์ Guest แต่จะไม่สามารถมองเห็นหรือเปิดบิลด์พิเศษของกลุ่มผู้ที่เป็น **สมาชิกคลังแสง (Member)** ได้ ({invisibleMemberBuildsCount} บิลด์ถูกซ่อนไว้)
            </p>
          </div>
          <button
            onClick={onLoginClick}
            className="flex items-center justify-center gap-1.5 px-4.5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 text-xs font-bold rounded-xl transition-all shadow-md shrink-0 self-start md:self-auto"
          >
            <span>ลงชื่อเข้าสมาชิกเพื่อปลดล็อก</span>
            <ArrowRight size={14} />
          </button>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-amber-950/20 via-yellow-950/10 to-zinc-950 border border-amber-800/40 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-lg shadow-amber-500/5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-500 font-semibold text-sm">
              <Award size={16} className="animate-bounce" />
              <span>สมาชิกคลังแสงระดับพิเศษ (Premium Member Status)</span>
            </div>
            <h2 className="text-lg font-bold text-zinc-100">
              ยินดีต้อนรับ Operator ลับเฉพาะคลังแสง
            </h2>
            <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
              สิทธิ์สมาชิกของคุณได้รับการยืนยัน คุณสามารถเข้าถึงบิลด์ขั้นสูงของทุกคน รวมทั้งมีตัวเลือกในการบันทึกบิลด์ใหม่เป็นแบบ **"Member Only"** เพื่อแบ่งปันเฉพาะในแวดวงได้!
            </p>
          </div>
          <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs px-3.5 py-2 rounded-xl font-mono font-medium shrink-0 self-start md:self-auto">
            <span>UNLOCKED: ALL ACCESS</span>
          </div>
        </div>
      )}

      {/* Filters Toolbar */}
      <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          {/* Search Bar */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="ค้นหาบิลด์, เฟรม หรือคำสำคัญ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 transition-colors"
            />
          </div>

          {/* Warframe Category Dropdown */}
          <div className="relative">
            <select
              value={selectedFrameId}
              onChange={(e) => setSelectedFrameId(e.target.value)}
              className="w-full sm:w-44 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-amber-500/50 appearance-none cursor-pointer"
            >
              <option value="all">เฟรมทั้งหมด (All Frames)</option>
              {WARFRAMES.map(wf => (
                <option key={wf.id} value={wf.id}>{wf.name}</option>
              ))}
            </select>
            <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-zinc-500 text-[10px]">
              ▼
            </span>
          </div>

          {/* Member-Only filter for members */}
          {currentUser.role === 'member' && (
            <label className="flex items-center gap-2 cursor-pointer select-none bg-zinc-950/40 border border-zinc-800 px-3 py-2 rounded-xl text-xs text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors">
              <input
                type="checkbox"
                checked={showMemberOnlyOnly}
                onChange={(e) => setShowMemberOnlyOnly(e.target.checked)}
                className="rounded border-zinc-800 bg-zinc-950 text-amber-500 focus:ring-0 focus:ring-offset-0"
              />
              <span>เฉพาะบิลด์สมาชิก เท่านั้น</span>
            </label>
          )}
        </div>

        {/* Action Button: Create New Build & Import/Export JSON */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Export JSON */}
          <button
            type="button"
            onClick={onExportBuilds}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-zinc-100 text-xs font-semibold rounded-xl transition-all shadow-md"
            title="ส่งออกบิลด์ทั้งหมดเป็นไฟล์ JSON เพื่อสำรองหรือแชร์"
          >
            <Download size={13} />
            <span className="hidden sm:inline">Export JSON</span>
          </button>

          {/* Import JSON */}
          <label
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-zinc-100 text-xs font-semibold rounded-xl transition-all shadow-md cursor-pointer"
            title="นำเข้าไฟล์สำรองบิลด์ .json"
          >
            <Upload size={13} />
            <span className="hidden sm:inline">Import JSON</span>
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (event) => {
                  try {
                    const parsed = JSON.parse(event.target?.result as string);
                    onImportBuilds(parsed);
                  } catch (err) {
                    alert('ไม่สามารถอ่านไฟล์ JSON ได้ กรุณาตรวจสอบรูปแบบความถูกต้องของไฟล์');
                  }
                };
                reader.readAsText(file);
                e.target.value = '';
              }}
            />
          </label>

          <button
            type="button"
            onClick={onCreateNewClick}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold rounded-xl transition-all shadow-md"
          >
            <Plus size={14} />
            <span>สร้าง Build ใหม่</span>
          </button>
        </div>
      </div>

      {/* Category Selection Tab Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-zinc-800 border-b border-zinc-800/40">
        {[
          { id: 'all', label: 'ทั้งหมด (All)', count: builds.length },
          { id: 'warframe', label: '🛡️ Warframes', count: builds.filter(b => (b.category || 'warframe') === 'warframe').length },
          { id: 'primary', label: '🔫 Primary', count: builds.filter(b => b.category === 'primary').length },
          { id: 'secondary', label: '🔫 Secondary', count: builds.filter(b => b.category === 'secondary').length },
          { id: 'melee', label: '⚔️ Melee', count: builds.filter(b => b.category === 'melee').length },
          { id: 'companion', label: '🐾 Companion', count: builds.filter(b => b.category === 'companion').length },
          { id: 'companion_weapon', label: '🦾 Companion Weapon', count: builds.filter(b => b.category === 'companion_weapon').length },
          { id: 'hybrid', label: '🔮 Hybrid', count: builds.filter(b => b.category === 'hybrid').length }
        ].map(cat => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                isActive
                  ? 'bg-amber-500 text-zinc-950 shadow-md font-bold'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-750'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                isActive ? 'bg-amber-600/20 text-zinc-900' : 'bg-zinc-950 text-zinc-500'
              }`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid List */}
      {filteredBuilds.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBuilds.map((build) => (
            <BuildCard
              key={build.id}
              build={build}
              onEdit={onEditBuild}
              onDelete={onDeleteBuild}
              currentUserRole={currentUser.role}
              currentUserId={currentUser.id}
            />
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-zinc-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center bg-zinc-950/20">
          <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 text-zinc-500 rounded-xl flex items-center justify-center mb-4">
            <LayoutGrid size={20} />
          </div>
          <h3 className="text-sm font-bold text-zinc-200">ไม่พบบิลด์ที่ตรงกับการค้นหา</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm">
            ลองปรับเปลี่ยนข้อความค้นหา เลือกตัวเลือกประเภทเฟรม หรือสร้างบิลด์ใหม่ได้ทันทีจากปุ่มจัดบิลด์ด้านบน
          </p>
          <button
            onClick={onCreateNewClick}
            className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold rounded-xl transition-colors"
          >
            สร้างบิลด์ใหม่ตอนนี้เลย
          </button>
        </div>
      )}
    </div>
  );
}

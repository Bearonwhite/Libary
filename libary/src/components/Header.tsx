/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Shield, LogIn, LogOut, Code, LayoutGrid, Hammer, HelpCircle, Server } from 'lucide-react';
import { User } from '../types/warframe';

interface HeaderProps {
  currentUser: User;
  onLoginClick: () => void;
  onLogout: () => void;
  activeTab: 'dashboard' | 'editor' | 'structure' | 'admin';
  setActiveTab: (tab: 'dashboard' | 'editor' | 'structure' | 'admin') => void;
  hasActiveBuild: boolean;
}

export default function Header({ 
  currentUser, 
  onLoginClick, 
  onLogout, 
  activeTab, 
  setActiveTab,
  hasActiveBuild
}: HeaderProps) {
  return (
    <header className="bg-zinc-950/80 border-b border-zinc-800 sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center text-zinc-950 font-bold text-lg shadow-md shadow-amber-500/15">
            WF
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold text-zinc-100 font-mono tracking-tight leading-none">WARFRAME BUILD</h1>
            <span className="text-[10px] text-amber-500/80 font-semibold tracking-wider font-mono">BACKUP & DISCOVERY</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 md:gap-3 bg-zinc-900/60 border border-zinc-800/80 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/10'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <LayoutGrid size={13} />
            <span className="hidden md:inline">กระดานรวมบิลด์</span>
            <span className="inline md:hidden">บิลด์</span>
          </button>

          <button
            onClick={() => setActiveTab('editor')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'editor'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/10'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <Hammer size={13} />
            <span>{hasActiveBuild ? 'แก้ไขบิลด์' : 'สร้างบิลด์ใหม่'}</span>
          </button>

          <button
            onClick={() => setActiveTab('structure')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'structure'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/10'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <Code size={13} />
            <span className="hidden md:inline">โครงสร้างโฟลเดอร์</span>
            <span className="inline md:hidden">โครงสร้าง</span>
          </button>

          {currentUser.role === 'admin' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                activeTab === 'admin'
                  ? 'bg-rose-500 border-rose-500 text-zinc-950 shadow-md shadow-rose-500/25'
                  : 'text-rose-400 border-rose-500/30 hover:text-rose-300 hover:bg-rose-500/10'
              }`}
            >
              <Server size={13} />
              <span>Admin & Cloud</span>
            </button>
          )}
        </nav>

        {/* User Status / Actions */}
        <div className="flex items-center gap-3">
          {/* User Role Indicator */}
          <div className="flex flex-col items-end hidden md:flex">
            <span className="text-[11px] text-zinc-500 font-mono">OPERATOR</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-zinc-300">{currentUser.username}</span>
              {currentUser.role === 'admin' ? (
                <span className="text-[10px] bg-rose-500/10 border border-rose-500/30 text-rose-400 px-1.5 py-0.5 rounded font-mono font-medium">
                  ADMIN
                </span>
              ) : currentUser.role === 'member' ? (
                <span className="text-[10px] bg-amber-500/10 border border-amber-500/30 text-amber-500 px-1.5 py-0.5 rounded font-mono font-medium">
                  MEMBER
                </span>
              ) : (
                <span className="text-[10px] bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-1.5 py-0.5 rounded font-mono font-medium">
                  GUEST MODE
                </span>
              )}
            </div>
          </div>

          {/* Quick status mobile */}
          <div className="md:hidden flex items-center justify-center w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800">
            {currentUser.role === 'admin' ? (
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" title="Admin Status" />
            ) : currentUser.role === 'member' ? (
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" title="Member Status" />
            ) : (
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" title="Guest Status" />
            )}
          </div>

          {/* Login/Logout Button */}
          {currentUser.id.startsWith('guest_anonymous') ? (
            <button
              onClick={onLoginClick}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 text-xs font-bold rounded-xl transition-all shadow-md shadow-amber-500/10"
            >
              <LogIn size={13} />
              <span>ล็อกอิน</span>
            </button>
          ) : (
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs text-zinc-400 hover:text-zinc-200 transition-all font-mono"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">ออกจากระบบ</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

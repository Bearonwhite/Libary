/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { Shield, User as UserIcon, Lock, X, Check, ArrowRight } from 'lucide-react';
import { User, UserRole } from '../types/warframe';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

export default function AuthModal({ isOpen, onClose, onLogin }: AuthModalProps) {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<UserRole>('member');
  const [isRegister, setIsRegister] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    // Create or login user
    const loggedUser: User = {
      id: username.toLowerCase().replace(/\s+/g, '_') + '_' + Math.random().toString(36).substr(2, 4),
      username: username.trim(),
      role: role,
    };

    onLogin(loggedUser);
    onClose();
  };

  const handleQuickLogin = (selectedRole: UserRole, defaultName: string) => {
    const loggedUser: User = {
      id: selectedRole + '_demo_' + Math.random().toString(36).substr(2, 4),
      username: defaultName,
      role: selectedRole,
    };
    onLogin(loggedUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div 
        id="auth-modal-container"
        className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Glow effect */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 via-yellow-400 to-cyan-500" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-100 p-1.5 hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <X size={18} />
        </button>

        <div className="p-6 md:p-8">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-center text-amber-500 mb-3">
              <Shield size={24} className="animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-zinc-100">
              {isRegister ? 'สมัครสมาชิกบิลด์ Warframe' : 'เข้าสู่ระบบคลังแสง'}
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              ระบบสลับสิทธิ์ผู้ใช้เพื่อทดสอบการจำกัดเข้าชมบิลด์พิเศษ (Access Controls)
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">ชื่อผู้ใช้งาน</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                  <UserIcon size={16} />
                </span>
                <input
                  type="text"
                  required
                  placeholder="เช่น Lotus_Gamer"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">รหัสผ่าน (จำลองเพื่อเข้าสู่ระบบ)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  defaultValue="123456"
                  disabled
                  className="w-full pl-9 pr-4 py-2.5 bg-zinc-950/50 border border-zinc-800/80 rounded-xl text-sm text-zinc-500 placeholder-zinc-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">สิทธิ์บทบาทที่ต้องการเปิดใช้งาน</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
                    role === 'admin'
                      ? 'bg-rose-500/10 border-rose-500/50 text-rose-400'
                      : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <span className="text-xs font-semibold">Admin</span>
                  <span className="text-[9px] text-zinc-500 mt-0.5">จัดการคลาวด์</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('member')}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
                    role === 'member'
                      ? 'bg-amber-500/10 border-amber-500/50 text-amber-500'
                      : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <span className="text-xs font-semibold">Member</span>
                  <span className="text-[9px] text-zinc-500 mt-0.5">กู้คืน JSON</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('guest')}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
                    role === 'guest'
                      ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400'
                      : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <span className="text-xs font-semibold">Guest</span>
                  <span className="text-[9px] text-zinc-500 mt-0.5">ดูภายนอก</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 mt-2"
            >
              <span>{isRegister ? 'สมัครสมาชิกและเข้าระบบ' : 'ลงชื่อเข้าใช้งานคลังแสง'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Login demos */}
          <div className="mt-6 pt-5 border-t border-zinc-800">
            <span className="block text-xs text-center font-medium text-zinc-500 mb-3">
              หรือเลือกล็อกอินด้วยบัญชีทดสอบด่วน (Quick Demo Login)
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleQuickLogin('admin', 'Lotus_Admin')}
                className="flex flex-col items-center justify-center py-1.5 px-2 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-[10px] text-zinc-300 font-mono transition-colors"
              >
                <Check size={10} className="text-rose-500 mb-0.5" />
                <span>As Admin</span>
              </button>
              <button
                onClick={() => handleQuickLogin('member', 'Teshin_Prime')}
                className="flex flex-col items-center justify-center py-1.5 px-2 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-[10px] text-zinc-300 font-mono transition-colors"
              >
                <Check size={10} className="text-amber-500 mb-0.5" />
                <span>As Member</span>
              </button>
              <button
                onClick={() => handleQuickLogin('guest', 'Guest_Operator')}
                className="flex flex-col items-center justify-center py-1.5 px-2 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-[10px] text-zinc-300 font-mono transition-colors"
              >
                <Check size={10} className="text-cyan-400 mb-0.5" />
                <span>As Guest</span>
              </button>
            </div>
          </div>

          <div className="text-center mt-4">
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-xs text-amber-500 hover:underline transition-all"
            >
              {isRegister ? 'มีบัญชีอยู่แล้ว? เข้าสู่ระบบ' : 'ยังไม่มีบัญชี? สมัครด่วนเพื่อทดสอบ'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

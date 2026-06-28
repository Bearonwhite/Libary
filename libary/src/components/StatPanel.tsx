/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Zap, Heart, Shield, Eye, Flame, ShieldAlert, Award } from 'lucide-react';
import { Warframe, WarframeMod } from '../types/warframe';

interface StatPanelProps {
  warframe: Warframe;
  auraMod: WarframeMod | null;
  exilusMod: WarframeMod | null;
  mods: (WarframeMod | null)[];
}

const SKINS_BUFFS = [
  { id: 'deluxe', name: 'Deluxe Skin (ดีลักซ์)', buffText: '+10% Strength (ความแรงสกิล)', stats: { strength: 10, health: 0, shield: 0, armor: 0, energy: 0, speed: 0 } },
  { id: 'prime', name: 'Prime Skin (ไพรม์ไพร์)', buffText: '+50 Max Energy (พลังงาน)', stats: { strength: 0, health: 0, shield: 0, armor: 0, energy: 50, speed: 0 } },
  { id: 'tennogen', name: 'TennoGen Skin (เทนโนเจน)', buffText: '+10% Speed (ความเร็ววิ่ง)', stats: { strength: 0, health: 0, shield: 0, armor: 0, energy: 0, speed: 10 } },
  { id: 'heirloom', name: 'Heirloom Skin (เฮียร์ลูม)', buffText: '+15% Armor & Shield (เกราะ/โล่)', stats: { strength: 0, health: 0, shield: 15, armor: 15, energy: 0, speed: 0 } },
];

export default function StatPanel({ warframe, auraMod, exilusMod, mods }: StatPanelProps) {
  const [useSkin, setUseSkin] = useState<boolean>(false);
  const [selectedSkin, setSelectedSkin] = useState<string>('deluxe');

  // Collect all active mods
  const activeMods = [auraMod, exilusMod, ...mods].filter((m): m is WarframeMod => m !== null);

  // Summarize stats percentages from mods
  const sums = activeMods.reduce(
    (acc, mod) => {
      if (mod.stats.health) acc.health += mod.stats.health;
      if (mod.stats.shield) acc.shield += mod.stats.shield;
      if (mod.stats.armor) acc.armor += mod.stats.armor;
      if (mod.stats.energy) acc.energy += mod.stats.energy;
      if (mod.stats.speed) acc.speed += mod.stats.speed;
      if (mod.stats.strength) acc.strength += mod.stats.strength;
      if (mod.stats.duration) acc.duration += mod.stats.duration;
      if (acc.efficiency !== undefined && mod.stats.efficiency) acc.efficiency += mod.stats.efficiency;
      if (mod.stats.range) acc.range += mod.stats.range;
      return acc;
    },
    { health: 0, shield: 0, armor: 0, energy: 0, speed: 0, strength: 0, duration: 0, efficiency: 0, range: 0 }
  );

  const activeSkin = useSkin ? SKINS_BUFFS.find(s => s.id === selectedSkin) : null;
  const skinStats = activeSkin ? activeSkin.stats : { strength: 0, health: 0, shield: 0, armor: 0, energy: 0, speed: 0 };

  // WARFRAME CALCULATION FORMULAS
  // 1. Health = Base + (Base * Health% / 100)
  const calculatedHealth = Math.round(warframe.baseStats.health + (warframe.baseStats.health * (sums.health / 100)));
  
  // 2. Shield = Base + (Base * Shield% / 100)
  const calculatedShield = Math.round(warframe.baseStats.shield + (warframe.baseStats.shield * ((sums.shield + skinStats.shield) / 100)));

  // 3. Armor = Base + (Base * Armor% / 100)
  const calculatedArmor = Math.round(warframe.baseStats.armor + (warframe.baseStats.armor * ((sums.armor + skinStats.armor) / 100)));

  // 4. Energy = Base + (Base * Energy% / 100) + skin stats energy
  const calculatedEnergy = Math.round(warframe.baseStats.energy + (warframe.baseStats.energy * (sums.energy / 100)) + skinStats.energy);

  // 5. Sprint Speed = Base * (1 + Speed% / 100)
  const calculatedSpeed = Number((warframe.baseStats.speed * (1 + ((sums.speed + skinStats.speed) / 100))).toFixed(2));

  // 6. Ability stats: starts at 100%
  const calculatedStrength = 100 + sums.strength + skinStats.strength;
  const calculatedDuration = 100 + sums.duration;
  const rawEfficiency = 100 + sums.efficiency;
  // Warframe efficiency hard-caps at 175%
  const calculatedEfficiency = Math.min(175, rawEfficiency);
  const calculatedRange = 100 + sums.range;

  return (
    <div id="stat-panel-container" className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-6">
      {/* Frame Profile Header */}
      <div className="border-b border-zinc-800 pb-4">
        <h3 className="text-xs font-bold text-zinc-500 font-mono uppercase tracking-wider">ตัวละครที่กำลังออกแบบ</h3>
        <div className="flex items-center gap-3 mt-2">
          {warframe.image && (
            <img 
              src={warframe.image} 
              alt={warframe.name} 
              className="w-10 h-10 object-cover rounded-lg border border-zinc-800"
              referrerPolicy="no-referrer"
            />
          )}
          <div>
            <h4 className="text-base font-bold text-zinc-100">{warframe.name}</h4>
            <span className="text-xs text-zinc-400 font-sans italic">{warframe.title}</span>
          </div>
        </div>
      </div>

      {/* Skin Selection Panel */}
      <div className="bg-zinc-950/40 border border-zinc-850 p-4 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-300 font-mono">บิลด์นี้ใช้สกินเสริมพลังไหม? (Skin Buff)</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={useSkin}
              onChange={(e) => setUseSkin(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-8 h-4.5 bg-zinc-800 rounded-full peer peer-checked:bg-amber-500 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-zinc-400 peer-checked:after:bg-zinc-950 after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:after:translate-x-3.5" />
          </label>
        </div>

        {useSkin && (
          <div className="space-y-2">
            <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">เลือกสกินเพื่อเพิ่มสเตตัสตัวละคร:</label>
            <div className="grid grid-cols-2 gap-1.5">
              {SKINS_BUFFS.map(skin => (
                <button
                  key={skin.id}
                  type="button"
                  onClick={() => setSelectedSkin(skin.id)}
                  className={`p-2 rounded-lg border text-left text-[10px] font-mono transition-all flex flex-col justify-between ${
                    selectedSkin === skin.id 
                      ? 'bg-amber-500/10 border-amber-500/50 text-amber-400' 
                      : 'bg-zinc-900/60 border-zinc-850 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <span className="font-bold">{skin.name}</span>
                  <span className="text-[8px] text-zinc-500 mt-1">{skin.buffText}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CORE STATS SECTION (Health, Shield, Armor, Energy, Speed) */}
      <div className="space-y-3.5">
        <h5 className="text-[11px] font-bold text-zinc-400 font-mono tracking-wider">CORE SURVIVABILITY (ค่าพลังชีวิตและพลังงาน)</h5>
        
        <div className="space-y-3 font-mono">
          {/* Health */}
          <div className="flex items-center justify-between p-2.5 bg-zinc-950/40 border border-zinc-850 rounded-xl text-xs">
            <div className="flex items-center gap-2">
              <Heart size={14} className="text-red-500" />
              <span className="text-zinc-400 font-sans font-medium">HEALTH (พลังชีวิต)</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-zinc-200">{calculatedHealth}</span>
              <span className="text-[10px] text-zinc-500 ml-1.5">(Base: {warframe.baseStats.health})</span>
            </div>
          </div>

          {/* Shield */}
          <div className="flex items-center justify-between p-2.5 bg-zinc-950/40 border border-zinc-850 rounded-xl text-xs">
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-cyan-400" />
              <span className="text-zinc-400 font-sans font-medium">SHIELD (โล่ป้องกัน)</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-zinc-200">{calculatedShield}</span>
              <span className="text-[10px] text-zinc-500 ml-1.5">(Base: {warframe.baseStats.shield})</span>
            </div>
          </div>

          {/* Armor */}
          <div className="flex items-center justify-between p-2.5 bg-zinc-950/40 border border-zinc-850 rounded-xl text-xs">
            <div className="flex items-center gap-2">
              <ShieldAlert size={14} className="text-zinc-400" />
              <span className="text-zinc-400 font-sans font-medium">ARMOR (เกราะป้องกัน)</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-zinc-200">{calculatedArmor}</span>
              <span className="text-[10px] text-zinc-500 ml-1.5">(Base: {warframe.baseStats.armor})</span>
            </div>
          </div>

          {/* Energy */}
          <div className="flex items-center justify-between p-2.5 bg-zinc-950/40 border border-zinc-850 rounded-xl text-xs">
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-yellow-400" />
              <span className="text-zinc-400 font-sans font-medium">MAX ENERGY (พลังงานสูงสุด)</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-zinc-200">{calculatedEnergy}</span>
              <span className="text-[10px] text-zinc-500 ml-1.5">(Base: {warframe.baseStats.energy})</span>
            </div>
          </div>

          {/* Speed */}
          <div className="flex items-center justify-between p-2.5 bg-zinc-950/40 border border-zinc-850 rounded-xl text-xs">
            <div className="flex items-center gap-2">
              <Eye size={14} className="text-emerald-400" />
              <span className="text-zinc-400 font-sans font-medium">SPRINT SPEED (ความเร็ววิ่ง)</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-zinc-200">{calculatedSpeed}</span>
              <span className="text-[10px] text-zinc-500 ml-1.5">(Base: {warframe.baseStats.speed})</span>
            </div>
          </div>
        </div>
      </div>

      {/* POWER ABILITY STATS SECTION (Duration, Efficiency, Range, Strength) */}
      <div className="space-y-3 border-t border-zinc-800/60 pt-5">
        <h5 className="text-[11px] font-bold text-zinc-400 font-mono tracking-wider">ABILITY STATS (ประสิทธิภาพสกิล)</h5>

        <div className="grid grid-cols-2 gap-3 text-center font-mono">
          {/* Duration */}
          <div className="p-3 bg-zinc-950/60 border border-zinc-850 rounded-xl">
            <span className="text-[10px] text-zinc-500 block font-sans">DURATION (ระยะเวลา)</span>
            <span className="text-lg font-black text-amber-500 block mt-1">{calculatedDuration}%</span>
            <span className="text-[9px] text-zinc-600 block mt-0.5">Base: 100%</span>
          </div>

          {/* Efficiency */}
          <div className="p-3 bg-zinc-950/60 border border-zinc-850 rounded-xl relative">
            <span className="text-[10px] text-zinc-500 block font-sans">EFFICIENCY (ประหยัดพลัง)</span>
            <span className="text-lg font-black text-amber-500 block mt-1">
              {calculatedEfficiency}%
            </span>
            {rawEfficiency > 175 && (
              <span className="absolute top-1 right-2 text-[8px] bg-red-950 text-red-400 border border-red-900 px-1 rounded">
                CAP 175%
              </span>
            )}
            <span className="text-[9px] text-zinc-600 block mt-0.5">Raw: {rawEfficiency}%</span>
          </div>

          {/* Range */}
          <div className="p-3 bg-zinc-950/60 border border-zinc-850 rounded-xl">
            <span className="text-[10px] text-zinc-500 block font-sans">RANGE (ระยะสกิล)</span>
            <span className="text-lg font-black text-amber-500 block mt-1">{calculatedRange}%</span>
            <span className="text-[9px] text-zinc-600 block mt-0.5">Base: 100%</span>
          </div>

          {/* Strength */}
          <div className="p-3 bg-zinc-950/60 border border-zinc-850 rounded-xl">
            <span className="text-[10px] text-zinc-500 block font-sans">STRENGTH (ความแรงสกิล)</span>
            <span className="text-lg font-black text-amber-500 block mt-1">{calculatedStrength}%</span>
            <span className="text-[9px] text-zinc-600 block mt-0.5">Base: 100%</span>
          </div>
        </div>
      </div>

      {/* Frame Passive and Original abilities review */}
      <div className="border-t border-zinc-800/60 pt-5 space-y-2 text-xs">
        <h5 className="text-[11px] font-bold text-zinc-400 font-mono tracking-wider uppercase">ABILITIES (ความสามารถดั้งเดิม)</h5>
        <div className="space-y-2">
          {warframe.abilities.map((ab, index) => (
            <div key={index} className="bg-zinc-950/20 p-2 rounded-lg border border-zinc-850/50">
              <span className="font-semibold text-zinc-300 font-mono block text-[11px]">
                {index + 1}. {ab.name}
              </span>
              <p className="text-[10px] text-zinc-400 mt-0.5 line-clamp-1 hover:line-clamp-none transition-all duration-300">
                {ab.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

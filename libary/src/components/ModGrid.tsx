/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { X, Search, ShieldAlert, Sparkles, AlertCircle } from 'lucide-react';
import { WarframeMod, Polarity } from '../types/warframe';
import { MODS } from '../data/warframeData';

interface ModGridProps {
  auraMod: WarframeMod | null;
  exilusMod: WarframeMod | null;
  mods: (WarframeMod | null)[];
  auraPolarity: Polarity;
  exilusPolarity: Polarity;
  polarities: Polarity[];
  onAuraChange: (mod: WarframeMod | null) => void;
  onExilusChange: (mod: WarframeMod | null) => void;
  onModChange: (index: number, mod: WarframeMod | null) => void;
}

export default function ModGrid({
  auraMod,
  exilusMod,
  mods,
  auraPolarity,
  exilusPolarity,
  polarities,
  onAuraChange,
  onExilusChange,
  onModChange
}: ModGridProps) {
  const [activeSelectSlot, setActiveSelectSlot] = useState<{ type: 'aura' | 'exilus' | 'standard'; index?: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // POLARITY CALCULATION FUNCTIONS (Warframe Logic)
  // Base capacity is 60 (With Orokin Reactor installed)
  const baseCapacity = 60;

  // Calculate mod cost with polarity matching
  const calculateSlottedModCost = (mod: WarframeMod | null, slotPolarity: Polarity): number => {
    if (!mod) return 0;
    if (slotPolarity === 'None' || mod.polarity === 'None') return mod.cost;
    
    if (mod.polarity === slotPolarity) {
      // Half cost, rounded up
      return Math.ceil(mod.cost / 2);
    } else {
      // Mismatch: cost + 25% (rounded up)
      return Math.ceil(mod.cost * 1.25);
    }
  };

  // Calculate Aura impact on capacity
  const calculateAuraCapacityBoost = (mod: WarframeMod | null, slotPolarity: Polarity): number => {
    if (!mod) return 0;
    const rawValue = Math.abs(mod.cost); // e.g. Steel Charge is -9, so raw is 9
    
    if (slotPolarity === 'None') {
      return rawValue;
    }
    
    if (mod.polarity === slotPolarity) {
      // Double the capacity increase for matching Aura polarity
      return rawValue * 2;
    } else {
      // Mismatch gives a slight penalty, but still increases capacity
      return Math.floor(rawValue * 0.8);
    }
  };

  // Sum capacities
  const auraBoost = calculateAuraCapacityBoost(auraMod, auraPolarity);
  const maxCapacity = baseCapacity + auraBoost;

  const exilusCost = calculateSlottedModCost(exilusMod, exilusPolarity);
  const standardCostsSum = mods.reduce((sum, m, idx) => {
    return sum + calculateSlottedModCost(m, polarities[idx]);
  }, 0);

  const totalCapacityUsed = exilusCost + standardCostsSum;
  const remainingCapacity = maxCapacity - totalCapacityUsed;

  // Filter available mods depending on what slot we are browsing
  const getSelectableMods = () => {
    if (!activeSelectSlot) return [];
    
    let filtered = MODS;
    if (activeSelectSlot.type === 'aura') {
      // Aura slot only accepts aura mods (those with cost < 0 or specific design)
      filtered = MODS.filter(m => m.cost < 0);
    } else if (activeSelectSlot.type === 'exilus') {
      // Exilus slot only accepts Exilus mods
      filtered = MODS.filter(m => m.id === 'power_drift' || m.id === 'rush' || m.id === 'cunning_drift');
    } else {
      // Standard slots accepts standard mods (excluding aura mods)
      filtered = MODS.filter(m => m.cost > 0);
    }

    // Filter out already equipped mods to prevent duplicates (except empty or current being edited slot)
    const equippedModIds = new Set<string>();
    if (auraMod && activeSelectSlot.type !== 'aura') equippedModIds.add(auraMod.id);
    if (exilusMod && activeSelectSlot.type !== 'exilus') equippedModIds.add(exilusMod.id);
    mods.forEach((m, idx) => {
      if (m && !(activeSelectSlot.type === 'standard' && activeSelectSlot.index === idx)) {
        equippedModIds.add(m.id);
      }
    });

    filtered = filtered.filter(m => !equippedModIds.has(m.id));

    return filtered.filter(m => 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const selectMod = (mod: WarframeMod) => {
    if (!activeSelectSlot) return;

    if (activeSelectSlot.type === 'aura') {
      onAuraChange(mod);
    } else if (activeSelectSlot.type === 'exilus') {
      onExilusChange(mod);
    } else if (activeSelectSlot.type === 'standard' && activeSelectSlot.index !== undefined) {
      onModChange(activeSelectSlot.index, mod);
    }

    setActiveSelectSlot(null);
    setSearchQuery('');
  };

  // Helper to get polarity symbol / text styling
  const getPolaritySymbol = (pol: Polarity) => {
    switch (pol) {
      case 'Madurai': return '🗲 (Madurai)';
      case 'Vazarin': return '⛨ (Vazarin)';
      case 'Naramon': return '🕈 (Naramon)';
      case 'Zenurik': return '⧁ (Zenurik)';
      case 'Umbra': return '⚙ (Umbra)';
      default: return '';
    }
  };

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'from-amber-900/40 to-zinc-900 border-amber-800/50 text-amber-100'; // copper
      case 'Uncommon': return 'from-zinc-500/30 to-zinc-900 border-zinc-600/50 text-zinc-100'; // silver
      case 'Rare': return 'from-yellow-600/30 to-zinc-900 border-yellow-500/50 text-yellow-100'; // gold
      case 'Legendary': return 'from-indigo-600/30 to-zinc-900 border-indigo-500/50 text-indigo-100'; // plat
      case 'Primed': return 'from-cyan-600/30 to-zinc-900 border-cyan-500/50 text-cyan-100'; // primed
      case 'Umbral': return 'from-red-950/40 to-zinc-900 border-red-500/50 text-red-100'; // umbral
      default: return 'from-zinc-800/60 to-zinc-900 border-zinc-700/80 text-zinc-200';
    }
  };

  return (
    <div id="mod-grid-editor" className="space-y-6">
      {/* Capacity Indicator Banner */}
      <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-4.5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center font-bold text-amber-500 text-sm">
            60
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-400 font-mono">MOD CAPACITY (ความจุสำหรับการ์ด)</h4>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className={`text-2xl font-black font-mono ${remainingCapacity >= 0 ? 'text-amber-500' : 'text-red-500'}`}>
                {remainingCapacity}
              </span>
              <span className="text-xs text-zinc-600 font-mono">/ {maxCapacity} เหลือใช้งาน</span>
            </div>
          </div>
        </div>

        {/* Capacity Bar */}
        <div className="w-full sm:w-64">
          <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/50">
            <div 
              className={`h-full transition-all duration-300 rounded-full ${
                remainingCapacity < 0 
                  ? 'bg-red-500' 
                  : remainingCapacity < 10 
                  ? 'bg-yellow-500' 
                  : 'bg-gradient-to-r from-amber-500 to-yellow-400'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, (totalCapacityUsed / maxCapacity) * 100))}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono mt-1.5">
            <span>ใช้ไป {totalCapacityUsed} PTS</span>
            <span>ความจุสูงสุด {maxCapacity} PTS</span>
          </div>
        </div>
      </div>

      {/* MODS GRID GRAPHICAL INTERFACE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Aura slot */}
        <div className="bg-zinc-900/40 border border-zinc-800/80 p-4 rounded-2xl flex flex-col justify-between h-36 relative group">
          <div className="flex justify-between items-start">
            <span className="text-[10px] bg-amber-500/10 border border-amber-500/30 text-amber-500 px-2 py-0.5 rounded-full font-mono font-bold tracking-wider">
              AURA SLOT
            </span>
            <span className="text-[11px] text-zinc-500 font-mono">
              {auraPolarity !== 'None' ? `ขั้ว: ${getPolaritySymbol(auraPolarity)}` : 'ไม่มีขั้ว'}
            </span>
          </div>

          {auraMod ? (
            <div className={`p-3 rounded-xl bg-gradient-to-br ${getRarityBg(auraMod.rarity)} border relative flex items-center justify-between`}>
              <div>
                <h5 className="font-bold text-sm font-mono">{auraMod.name}</h5>
                <p className="text-xs text-zinc-400 mt-1">{auraMod.description}</p>
                <span className="text-[9px] uppercase font-semibold text-amber-500 font-mono mt-1 block">
                  +{calculateAuraCapacityBoost(auraMod, auraPolarity)} CAPACITY (MATCHED)
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onAuraChange(null); }}
                className="p-1 hover:bg-black/30 rounded text-zinc-400 hover:text-zinc-100"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setActiveSelectSlot({ type: 'aura' })}
              className="border border-dashed border-zinc-800 hover:border-amber-500/30 hover:bg-zinc-900/30 transition-all rounded-xl p-4 text-center text-zinc-500 hover:text-zinc-300 h-16 flex items-center justify-center gap-1.5 text-xs font-semibold"
            >
              <span>+ คลิกเพื่อใส่ AURA MOD</span>
            </button>
          )}
        </div>

        {/* Exilus slot */}
        <div className="bg-zinc-900/40 border border-zinc-800/80 p-4 rounded-2xl flex flex-col justify-between h-36 relative group">
          <div className="flex justify-between items-start">
            <span className="text-[10px] bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-2 py-0.5 rounded-full font-mono font-bold tracking-wider">
              EXILUS SLOT
            </span>
            <span className="text-[11px] text-zinc-500 font-mono">
              {exilusPolarity !== 'None' ? `ขั้ว: ${getPolaritySymbol(exilusPolarity)}` : 'ไม่มีขั้ว'}
            </span>
          </div>

          {exilusMod ? (
            <div className={`p-3 rounded-xl bg-gradient-to-br ${getRarityBg(exilusMod.rarity)} border relative flex items-center justify-between`}>
              <div>
                <h5 className="font-bold text-sm font-mono">{exilusMod.name}</h5>
                <p className="text-xs text-zinc-400 mt-1">{exilusMod.description}</p>
                <span className="text-[10px] font-mono text-zinc-500 block mt-1">
                  Cost: {calculateSlottedModCost(exilusMod, exilusPolarity)} pts (Base: {exilusMod.cost})
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onExilusChange(null); }}
                className="p-1 hover:bg-black/30 rounded text-zinc-400 hover:text-zinc-100"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setActiveSelectSlot({ type: 'exilus' })}
              className="border border-dashed border-zinc-800 hover:border-cyan-500/30 hover:bg-zinc-900/30 transition-all rounded-xl p-4 text-center text-zinc-500 hover:text-zinc-300 h-16 flex items-center justify-center gap-1.5 text-xs font-semibold"
            >
              <span>+ คลิกเพื่อใส่ EXILUS MOD</span>
            </button>
          )}
        </div>
      </div>

      {/* MAIN 8 MODS GRID */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-zinc-400 font-mono uppercase tracking-wider">
          STANDARD MODS (ช่องติดตั้งโมดทั่วไป 8 ช่อง)
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mods.map((mod, index) => {
            const slotPolarity = polarities[index] || 'None';
            const costCalculated = calculateSlottedModCost(mod, slotPolarity);
            const isMatch = mod && mod.polarity !== 'None' && mod.polarity === slotPolarity;
            const isMismatch = mod && mod.polarity !== 'None' && slotPolarity !== 'None' && mod.polarity !== slotPolarity;

            return (
              <div 
                key={index}
                className="bg-zinc-900/30 border border-zinc-800/80 p-3 rounded-xl flex flex-col justify-between h-40 relative hover:border-zinc-700/80 transition-colors"
              >
                <div className="flex justify-between items-start text-[10px] font-mono text-zinc-500">
                  <span>SLOT #{index + 1}</span>
                  <span>{slotPolarity !== 'None' ? getPolaritySymbol(slotPolarity).split(' ')[0] : 'No Pol'}</span>
                </div>

                {mod ? (
                  <div className={`p-2.5 rounded-lg bg-gradient-to-br ${getRarityBg(mod.rarity)} border text-left mt-2 flex-1 flex flex-col justify-between relative`}>
                    <button
                      type="button"
                      onClick={() => onModChange(index, null)}
                      className="absolute top-1 right-1 p-0.5 hover:bg-black/20 rounded text-zinc-400 hover:text-zinc-100"
                      title="ถอดการ์ด"
                    >
                      <X size={12} />
                    </button>

                    <div className="pr-3">
                      <h6 className="font-bold text-xs truncate font-mono" title={mod.name}>{mod.name}</h6>
                      <p className="text-[10px] text-zinc-300 mt-1 line-clamp-2 leading-relaxed">{mod.description}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-white/5 text-[9px] font-mono">
                      <span className="text-zinc-400 uppercase">{mod.rarity}</span>
                      <span className={`font-bold ${isMatch ? 'text-emerald-400' : isMismatch ? 'text-red-400' : 'text-amber-500'}`}>
                        {costCalculated} PTS
                        {isMatch && ' (Match)'}
                        {isMismatch && ' (Mismatch)'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveSelectSlot({ type: 'standard', index })}
                    className="border border-dashed border-zinc-800/60 hover:border-amber-500/20 hover:bg-zinc-900/20 transition-all rounded-lg p-3 text-center text-zinc-600 hover:text-zinc-400 flex-1 flex flex-col items-center justify-center gap-1 text-[11px] font-medium mt-2"
                  >
                    <span>+ ใส่การ์ด</span>
                    {slotPolarity !== 'None' && (
                      <span className="text-[9px] text-zinc-600 font-mono">ต้องการ {getPolaritySymbol(slotPolarity).split(' ')[0]}</span>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SEARCH / ADD MOD DIALOG MODAL */}
      {activeSelectSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-4 md:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/40">
              <div>
                <h3 className="text-base font-bold text-zinc-200">
                  {activeSelectSlot.type === 'aura' && 'เลือกติดตั้ง AURA MOD'}
                  {activeSelectSlot.type === 'exilus' && 'เลือกติดตั้ง EXILUS MOD'}
                  {activeSelectSlot.type === 'standard' && `เลือกติดตั้ง MOD ในช่อง #${(activeSelectSlot.index || 0) + 1}`}
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  ระบบจำลองรายการ Mod ยอดนิยมที่มีสเตตัสพร้อมคำนวณอัตโนมัติ
                </p>
              </div>
              <button 
                type="button"
                onClick={() => { setActiveSelectSlot(null); setSearchQuery(''); }}
                className="text-zinc-400 hover:text-zinc-100 p-1 hover:bg-zinc-800 rounded"
              >
                <X size={18} />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4 border-b border-zinc-800/60 bg-zinc-950/20">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                  <Search size={15} />
                </span>
                <input
                  type="text"
                  placeholder="พิมพ์ชื่อม็อด หรือ ความสามารถการ์ด..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50"
                  autoFocus
                />
              </div>
            </div>

            {/* Mod List */}
            <div className="p-4 overflow-y-auto space-y-2 flex-1 max-h-[50vh]">
              {getSelectableMods().length > 0 ? (
                getSelectableMods().map((mod) => {
                  // check slot match cost
                  const targetPol = activeSelectSlot.type === 'standard' 
                    ? polarities[activeSelectSlot.index || 0] 
                    : activeSelectSlot.type === 'exilus' 
                    ? exilusPolarity 
                    : auraPolarity;

                  return (
                    <button
                      type="button"
                      key={mod.id}
                      onClick={() => selectMod(mod)}
                      className={`w-full p-3.5 rounded-xl border text-left bg-zinc-950/50 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-950 transition-all flex items-center justify-between group`}
                    >
                      <div className="space-y-1 max-w-[80%]">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs font-mono text-zinc-200 group-hover:text-amber-500 transition-colors">
                            {mod.name}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 font-mono text-zinc-400 uppercase">
                            {mod.rarity}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 font-sans">{mod.description}</p>
                      </div>

                      <div className="text-right font-mono text-xs">
                        <span className="text-zinc-500 block text-[10px]">POLARITY</span>
                        <span className="text-amber-500 font-semibold">{getPolaritySymbol(mod.polarity).split(' ')[0] || 'None'}</span>
                        <span className="text-zinc-400 block text-[10px] mt-1">{mod.cost < 0 ? `+${Math.abs(mod.cost)} Cap` : `${mod.cost} Pts`}</span>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-8 text-zinc-500 text-xs">
                  ไม่พบการ์ดม็อดที่ตรงกับการค้นหาของคุณ
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

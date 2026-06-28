/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { X, Search, Sparkles, AlertCircle } from 'lucide-react';
import { Arcane } from '../types/warframe';
import { ARCANES } from '../data/warframeData';

interface ArcaneSelectorProps {
  arcanes: (Arcane | null)[];
  onArcaneChange: (index: number, arcane: Arcane | null) => void;
}

export default function ArcaneSelector({ arcanes, onArcaneChange }: ArcaneSelectorProps) {
  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectArcane = (arcane: Arcane) => {
    if (activeSlotIndex === null) return;
    
    // Prevent installing the same arcane twice (Warframe standard limit)
    const isDuplicate = arcanes.some((a, idx) => idx !== activeSlotIndex && a?.id === arcane.id);
    if (isDuplicate) {
      alert('คุณใส่ Arcane ชนิดนี้ในอีกช่องหนึ่งแล้ว! กรุณาเลือก Arcane แบบอื่นสำหรับช่องนี้');
      return;
    }

    onArcaneChange(activeSlotIndex, arcane);
    setActiveSlotIndex(null);
    setSearchQuery('');
  };

  const filteredArcanes = ARCANES.filter(arc => 
    arc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    arc.effect.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="arcane-selector-module" className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-4">
      <div>
        <h4 className="text-sm font-bold text-zinc-100 flex items-center gap-1.5">
          <Sparkles className="text-amber-500" size={16} />
          <span>อาเคนเสริมประสิทธิภาพ (Arcanes System)</span>
        </h4>
        <p className="text-xs text-zinc-400 mt-1">
          เลือกสวมใส่อาเคนได้สูงสุด 2 ช่อง เพื่อเพิ่มทักษะบัฟพิเศษตอนต่อสู้
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {arcanes.map((arc, index) => (
          <div 
            key={index} 
            className="bg-zinc-950/40 border border-zinc-850 p-4 rounded-xl flex flex-col justify-between h-36 relative hover:border-zinc-700 transition-colors"
          >
            <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
              <span>ARCANE SLOT #{index + 1}</span>
              {arc && <span className="text-amber-500 uppercase font-semibold">{arc.rarity}</span>}
            </div>

            {arc ? (
              <div className="mt-2 flex-1 flex flex-col justify-between">
                <div>
                  <h5 className="font-bold text-xs font-mono text-zinc-200">{arc.name}</h5>
                  <p className="text-[10px] text-zinc-400 mt-1 line-clamp-3 leading-relaxed">{arc.effect}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onArcaneChange(index, null)}
                  className="absolute top-3 right-3 p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-zinc-100 transition-colors"
                  title="ถอด Arcane"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setActiveSlotIndex(index)}
                className="border border-dashed border-zinc-800/80 hover:border-amber-500/30 hover:bg-zinc-900/20 transition-all rounded-lg p-4 text-center text-zinc-500 hover:text-zinc-300 flex-1 flex flex-col items-center justify-center gap-1 text-xs font-semibold mt-2"
              >
                <span>+ คลิกเพื่อเลือกอาเคน</span>
                <span className="text-[9px] text-zinc-600 font-mono">Empty Slot</span>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* ARCANE SEARCH DIALOG MODAL */}
      {activeSlotIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl max-h-[80vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-4 md:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/40">
              <div>
                <h3 className="text-base font-bold text-zinc-200">
                  เลือกอาเคนติดตั้งในช่อง #{activeSlotIndex + 1}
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  เลือก Arcane ที่มีทักษะสอดคล้องกับแนวทางการเล่นของบิลด์คุณ
                </p>
              </div>
              <button 
                type="button"
                onClick={() => { setActiveSlotIndex(null); setSearchQuery(''); }}
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
                  placeholder="ค้นหาชื่อ Arcane หรือความสามารถพิเศษ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50"
                  autoFocus
                />
              </div>
            </div>

            {/* List */}
            <div className="p-4 overflow-y-auto space-y-2 flex-1 max-h-[45vh]">
              {filteredArcanes.length > 0 ? (
                filteredArcanes.map((arc) => {
                  const isInstalledElsewhere = arcanes.some((a, idx) => idx !== activeSlotIndex && a?.id === arc.id);
                  
                  return (
                    <button
                      type="button"
                      key={arc.id}
                      onClick={() => handleSelectArcane(arc)}
                      disabled={isInstalledElsewhere}
                      className={`w-full p-4 rounded-xl border text-left bg-zinc-950/50 border-zinc-800/85 hover:border-zinc-700 transition-all flex items-center justify-between group ${
                        isInstalledElsewhere ? 'opacity-40 cursor-not-allowed' : 'hover:bg-zinc-950'
                      }`}
                    >
                      <div className="space-y-1 max-w-[85%]">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold text-xs font-mono group-hover:text-amber-500 transition-colors ${isInstalledElsewhere ? 'text-zinc-600' : 'text-zinc-200'}`}>
                            {arc.name}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-900 font-mono text-zinc-500 uppercase">
                            {arc.rarity}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 font-sans">{arc.effect}</p>
                      </div>

                      {isInstalledElsewhere && (
                        <span className="text-[10px] text-zinc-500 font-mono shrink-0 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded">
                          ติดตั้งแล้ว
                        </span>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-8 text-zinc-500 text-xs">
                  ไม่พบ Arcane ที่ตรงกับการค้นหาของคุณ
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

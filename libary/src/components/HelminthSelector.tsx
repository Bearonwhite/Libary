/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { useState } from 'react';
import { X, Search, ToggleLeft, Award } from 'lucide-react';
import { HelminthAbility, Warframe } from '../types/warframe';
import { HELMINTH_ABILITIES } from '../data/warframeData';

interface HelminthSelectorProps {
  warframe: Warframe;
  selectedAbility: HelminthAbility | null;
  replacedIndex: number; // 0 to 3, or -1 if none
  onHelminthChange: (ability: HelminthAbility | null, replacedIndex: number) => void;
}

export default function HelminthSelector({ 
  warframe, 
  selectedAbility, 
  replacedIndex, 
  onHelminthChange 
}: HelminthSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectAbility = (ability: HelminthAbility) => {
    // Default to replacing the 1st ability if none was chosen previously, or keep index if set
    const indexToReplace = replacedIndex !== -1 ? replacedIndex : 0;
    onHelminthChange(ability, indexToReplace);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleRemoveAbility = () => {
    onHelminthChange(null, -1);
  };

  const handleIndexChange = (idx: number) => {
    if (!selectedAbility) return;
    onHelminthChange(selectedAbility, idx);
  };

  const filteredAbilities = HELMINTH_ABILITIES.filter(ab =>
    ab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ab.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="helminth-selector-module" className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-4">
      <div>
        <h4 className="text-sm font-bold text-zinc-100 flex items-center gap-1.5">
          <ToggleLeft className="text-amber-500" size={16} />
          <span>ระบบดูดกลืนสกิลเฮลมินท์ (Helminth Subsume)</span>
        </h4>
        <p className="text-xs text-zinc-400 mt-1">
          แทนที่สกิลประจำตัวเฟรม 1 ช่องด้วยสกิลเฮลมินท์เพื่อเพิ่มบัฟหรือปลดล็อกคอมโบใหม่ๆ
        </p>
      </div>

      {selectedAbility ? (
        <div className="bg-zinc-950/40 border border-zinc-850 p-4 rounded-xl space-y-4 relative">
          {/* Active Helminth Ability Details */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] bg-amber-500/15 border border-amber-500/30 text-amber-500 px-2 py-0.5 rounded-full font-mono font-bold">
                SUBSUMED ABILITY ({selectedAbility.type})
              </span>
              <h5 className="font-bold text-sm text-zinc-200 mt-1">{selectedAbility.name}</h5>
              <p className="text-xs text-zinc-400">{selectedAbility.description}</p>
            </div>
            
            <button
              type="button"
              onClick={handleRemoveAbility}
              className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-zinc-100 transition-colors"
              title="ยกเลิกการสวมสกิลเฮลมินท์"
            >
              <X size={15} />
            </button>
          </div>

          {/* SELECT WHICH SLOT TO REPLACE */}
          <div className="pt-3 border-t border-zinc-800/80">
            <span className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider font-mono mb-2">
              เลือกแทนที่ความสามารถช่องที่ (REPLACE ABILITY):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {warframe.abilities.map((ab, idx) => {
                const isReplaced = replacedIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleIndexChange(idx)}
                    className={`p-2.5 rounded-lg border text-center font-mono text-xs transition-all flex flex-col justify-between h-20 ${
                      isReplaced
                        ? 'bg-amber-500/10 border-amber-500/50 text-amber-500 shadow-md'
                        : 'bg-zinc-950 border-zinc-850 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <span className="text-[9px] uppercase text-zinc-500">ABILITY #{idx + 1}</span>
                    <span className="font-bold truncate w-full mt-1">{ab.name}</span>
                    <span className="text-[9px] text-zinc-600 truncate mt-0.5">
                      {isReplaced ? 'REPLACED' : 'ORIGINAL'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full border border-dashed border-zinc-800 hover:border-amber-500/30 hover:bg-zinc-900/10 transition-all rounded-xl p-5 text-center text-zinc-500 hover:text-zinc-300 flex flex-col items-center justify-center gap-1 text-xs font-semibold"
        >
          <span>+ คลิกเลือกสวมใส่สกิลจากเฮลมินท์ (Helminth System)</span>
          <span className="text-[10px] text-zinc-600">ส้ม/เหลือง บัฟเพิ่มพลังสกิลหลัก</span>
        </button>
      )}

      {/* HELMINTH LIST DIALOG MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl max-h-[80vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-4 md:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/40">
              <div>
                <h3 className="text-base font-bold text-zinc-200">
                  รายชื่อความสามารถเฮลมินท์ยอดฮิต (Helminth Abilities)
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  เลือกสกิลเพื่อนำไปสวมแทนที่ความสามารถดั้งเดิมของ {warframe.name}
                </p>
              </div>
              <button 
                type="button"
                onClick={() => { setIsOpen(false); setSearchQuery(''); }}
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
                  placeholder="พิมพ์ชื่อทักษะ Helminth หรือรายละเอียด..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50"
                  autoFocus
                />
              </div>
            </div>

            {/* List */}
            <div className="p-4 overflow-y-auto space-y-2 flex-1 max-h-[45vh]">
              {filteredAbilities.length > 0 ? (
                filteredAbilities.map((ab) => (
                  <button
                    type="button"
                    key={ab.id}
                    onClick={() => handleSelectAbility(ab)}
                    className="w-full p-4 rounded-xl border text-left bg-zinc-950/50 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-950 transition-all flex items-center justify-between group"
                  >
                    <div className="space-y-1 max-w-[85%]">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs font-mono text-zinc-200 group-hover:text-amber-500 transition-colors">
                          {ab.name}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-900 font-mono text-zinc-500 uppercase">
                          {ab.type}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 font-sans">{ab.description}</p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-8 text-zinc-500 text-xs">
                  ไม่พบทักษะ Helminth ที่ตรงกับการค้นหา
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

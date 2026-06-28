/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Edit, Trash2, ShieldAlert, Award, Sparkles, User, Calendar, ExternalLink, ShieldCheck } from 'lucide-react';
import { Build, Warframe, UserRole } from '../types/warframe';
import { WARFRAMES, WEAPONS, COMPANIONS } from '../data/warframeData';

interface BuildCardProps {
  key?: string;
  build: Build;
  onEdit: (build: Build) => void;
  onDelete: (id: string) => void;
  currentUserRole: UserRole;
  currentUserId: string;
}

export default function BuildCard({ build, onEdit, onDelete, currentUserRole, currentUserId }: BuildCardProps) {
  const warframe = WARFRAMES.find(wf => wf.id === build.warframeId);
  const primaryWeapon = WEAPONS.find(w => w.id === build.primaryWeaponId);
  const secondaryWeapon = WEAPONS.find(w => w.id === build.secondaryWeaponId);
  const companion = COMPANIONS.find(c => c.id === build.companionId);

  const activeModsCount = build.mods.filter(m => m !== null).length + 
    (build.auraMod ? 1 : 0) + 
    (build.exilusMod ? 1 : 0);

  // Calculate other slots
  const activePrimaryModsCount = build.primaryMods?.filter(m => m !== null).length || 0;
  const activeSecondaryModsCount = build.secondaryMods?.filter(m => m !== null).length || 0;
  const activeCompanionModsCount = build.companionMods?.filter(m => m !== null).length || 0;

  // If a guest somehow views a member build, mask it or block interaction
  const isAccessible = !build.isMemberOnly || currentUserRole === 'member' || currentUserRole === 'admin';

  return (
    <div 
      id={`build-card-${build.id}`}
      className={`relative bg-zinc-900 border rounded-2xl overflow-hidden transition-all duration-300 flex flex-col group ${
        build.isMemberOnly 
          ? 'border-amber-500/20 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/5'
          : 'border-zinc-800 hover:border-zinc-700 hover:shadow-lg hover:shadow-zinc-950/50'
      }`}
    >
      {/* Visual Header / Frame Image background */}
      <div className="relative h-28 bg-zinc-950 overflow-hidden">
        {warframe?.image ? (
          <img 
            src={warframe.image} 
            alt={warframe.name}
            className="w-full h-full object-cover object-center opacity-40 group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
        
        {/* Category & Warframe Name */}
        <div className="absolute bottom-3 left-4">
          <span className={`text-[10px] uppercase font-bold tracking-widest font-mono ${
            build.category === 'primary' ? 'text-amber-400' :
            build.category === 'secondary' ? 'text-cyan-400' :
            build.category === 'melee' ? 'text-rose-400' :
            build.category === 'companion' ? 'text-violet-400' :
            build.category === 'companion_weapon' ? 'text-emerald-400' :
            build.category === 'hybrid' ? 'text-fuchsia-400' :
            'text-amber-500'
          }`}>
            {
              build.category === 'primary' ? '🔫 PRIMARY WEAPON BUILD' :
              build.category === 'secondary' ? '🔫 SECONDARY WEAPON BUILD' :
              build.category === 'melee' ? '⚔️ MELEE WEAPON BUILD' :
              build.category === 'companion' ? '🐾 COMPANION BUILD' :
              build.category === 'companion_weapon' ? '🦾 COMPANION WEAPON BUILD' :
              build.category === 'hybrid' ? '🔮 HYBRID BUILD' :
              '🛡️ WARFRAME BUILD'
            }
          </span>
          <h4 className="text-lg font-bold text-zinc-100 leading-tight">{warframe?.name || 'Unknown Frame'}</h4>
        </div>

        {/* Member-Only badge */}
        {build.isMemberOnly && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold shadow-sm backdrop-blur-sm">
            <Award size={10} />
            <span>MEMBER ONLY</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Build Title */}
          <h3 className="text-base font-bold text-zinc-200 line-clamp-1 group-hover:text-zinc-100 transition-colors">
            {build.title}
          </h3>
          <p className="text-xs text-zinc-400 mt-1 line-clamp-2 h-8 leading-relaxed">
            {build.description || 'ไม่มีคำอธิบายเพิ่มเติมสำหรับบิลด์นี้'}
          </p>

          {/* Quick Config Specs */}
          <div className="mt-4 grid grid-cols-2 gap-2.5 text-[11px] bg-zinc-950/50 p-2.5 rounded-xl border border-zinc-800/60 font-mono">
            <div className="flex flex-col">
              <span className="text-zinc-500 uppercase">Warframe Mods</span>
              <span className="text-zinc-300 font-medium">{activeModsCount} / 10 slots</span>
            </div>
            <div className="flex flex-col">
              <span className="text-zinc-500 uppercase">Helminth</span>
              <span className="text-zinc-300 font-medium truncate">
                {build.helminthAbility ? build.helminthAbility.name.split(' ')[0] : 'None'}
              </span>
            </div>

            <div className="col-span-2 border-t border-zinc-900 pt-1.5 grid grid-cols-2 gap-2">
              <div className="flex flex-col">
                <span className="text-zinc-500 uppercase">Primary</span>
                <span className="text-amber-500 font-medium truncate" title={primaryWeapon?.name || 'Not Configured'}>
                  {primaryWeapon ? `${primaryWeapon.name.split(' ')[0]} (${activePrimaryModsCount}/8)` : 'None'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-zinc-500 uppercase">Secondary</span>
                <span className="text-cyan-400 font-medium truncate" title={secondaryWeapon?.name || 'Not Configured'}>
                  {secondaryWeapon ? `${secondaryWeapon.name.split(' ')[0]} (${activeSecondaryModsCount}/8)` : 'None'}
                </span>
              </div>
            </div>

            <div className="col-span-2 border-t border-zinc-900 pt-1.5 flex flex-col">
              <span className="text-zinc-500 uppercase">Companion</span>
              <span className="text-rose-400 font-medium truncate">
                {companion ? `${companion.name} (${activeCompanionModsCount}/8)` : 'None'}
              </span>
            </div>

            <div className="col-span-2 border-t border-zinc-900/60 pt-1.5 flex flex-col">
              <span className="text-zinc-500 uppercase">Active Arcanes</span>
              <span className="text-zinc-300 font-medium truncate">
                {build.arcanes.filter(a => a !== null).map(a => a?.name.split(' ')[1] || a?.name).join(', ') || 'No Arcanes'}
              </span>
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-1.5 truncate max-w-[150px]">
            <User size={12} className="text-zinc-400 shrink-0" />
            <span className="truncate" title={build.creatorName}>{build.creatorName}</span>
          </div>

          <div className="flex items-center gap-1">
            {/* If member only and user is guest, show lock overlay or block actions */}
            {!isAccessible ? (
              <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 text-zinc-500 px-2 py-1 rounded-lg">
                <ShieldAlert size={12} className="text-amber-500/50" />
                <span className="text-[10px] font-mono">LOCK</span>
              </div>
            ) : (
              <>
                <button
                  onClick={() => onEdit(build)}
                  className="p-1.5 hover:bg-amber-500/10 hover:text-amber-500 text-zinc-400 rounded-lg transition-colors"
                  title="แก้ไขบิลด์ (Edit Build)"
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={() => onDelete(build.id)}
                  className="p-1.5 hover:bg-red-500/10 hover:text-red-400 text-zinc-500 rounded-lg transition-colors"
                  title="ลบข้อมูลบิลด์"
                >
                  <Trash2 size={14} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

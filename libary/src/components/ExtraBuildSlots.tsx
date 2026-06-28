/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Target, Shield, HelpCircle, Sparkles, X, Plus, Search, Check, 
  ChevronDown, Trash2, ShieldAlert, Award, Zap, Flame, Eye,
  Skull, Compass, RefreshCw, Crosshair, Swords, Settings
} from 'lucide-react';
import { Weapon, WeaponMod, Companion, CompanionMod, Arcane, Polarity } from '../types/warframe';
import { 
  WEAPONS, 
  PRIMARY_MODS, 
  SECONDARY_MODS, 
  MELEE_MODS, 
  COMPANIONS, 
  COMPANION_MODS, 
  COMPANION_WEAPON_MODS,
  WEAPON_ARCANES,
  WEAPON_EXILUS_MODS,
  STANCE_MODS
} from '../data/warframeData';

interface ExtraBuildSlotsProps {
  category: 'warframe' | 'primary' | 'secondary' | 'melee' | 'companion' | 'companion_weapon' | 'hybrid';
  onCategoryChange: (cat: 'warframe' | 'primary' | 'secondary' | 'melee' | 'companion' | 'companion_weapon' | 'hybrid') => void;

  primaryWeaponId: string;
  onPrimaryWeaponChange: (id: string) => void;
  primaryMods: (WeaponMod | null)[];
  onPrimaryModChange: (index: number, mod: WeaponMod | null) => void;
  primaryArcane: Arcane | null;
  onPrimaryArcaneChange: (arcane: Arcane | null) => void;
  primaryExilusMod: WeaponMod | null;
  onPrimaryExilusModChange: (mod: WeaponMod | null) => void;
  primaryPolarities: Polarity[];
  onPrimaryPolarityChange: (index: number, pol: Polarity) => void;
  primaryFormasCount: number;
  onPrimaryFormasCountChange: (count: number) => void;
  isPrimaryIncarnon: boolean;
  onIsPrimaryIncarnonChange: (active: boolean) => void;

  secondaryWeaponId: string;
  onSecondaryWeaponChange: (id: string) => void;
  secondaryMods: (WeaponMod | null)[];
  onSecondaryModChange: (index: number, mod: WeaponMod | null) => void;
  secondaryArcane: Arcane | null;
  onSecondaryArcaneChange: (arcane: Arcane | null) => void;
  secondaryExilusMod: WeaponMod | null;
  onSecondaryExilusModChange: (mod: WeaponMod | null) => void;
  secondaryPolarities: Polarity[];
  onSecondaryPolarityChange: (index: number, pol: Polarity) => void;
  secondaryFormasCount: number;
  onSecondaryFormasCountChange: (count: number) => void;
  isSecondaryIncarnon: boolean;
  onIsSecondaryIncarnonChange: (active: boolean) => void;

  meleeWeaponId: string;
  onMeleeWeaponChange: (id: string) => void;
  meleeMods: (WeaponMod | null)[];
  onMeleeModChange: (index: number, mod: WeaponMod | null) => void;
  meleeArcane: Arcane | null;
  onMeleeArcaneChange: (arcane: Arcane | null) => void;
  meleeExilusMod: WeaponMod | null;
  onMeleeExilusModChange: (mod: WeaponMod | null) => void;
  meleeStanceMod: WeaponMod | null;
  onMeleeStanceModChange: (mod: WeaponMod | null) => void;
  meleePolarities: Polarity[];
  onMeleePolarityChange: (index: number, pol: Polarity) => void;
  meleeFormasCount: number;
  onMeleeFormasCountChange: (count: number) => void;
  isMeleeIncarnon: boolean;
  onIsMeleeIncarnonChange: (active: boolean) => void;

  companionId: string;
  onCompanionChange: (id: string) => void;
  companionMods: (CompanionMod | null)[];
  onCompanionModChange: (index: number, mod: CompanionMod | null) => void;
  companionPolarities: Polarity[];
  onCompanionPolarityChange: (index: number, pol: Polarity) => void;

  companionWeaponId: string;
  onCompanionWeaponChange: (id: string) => void;
  companionWeaponMods: (WeaponMod | null)[];
  onCompanionWeaponModChange: (index: number, mod: WeaponMod | null) => void;
  companionWeaponPolarities: Polarity[];
  onCompanionWeaponPolarityChange: (index: number, pol: Polarity) => void;
}

export default function ExtraBuildSlots({
  category,
  onCategoryChange,

  primaryWeaponId,
  onPrimaryWeaponChange,
  primaryMods,
  onPrimaryModChange,
  primaryArcane,
  onPrimaryArcaneChange,
  primaryExilusMod,
  onPrimaryExilusModChange,
  primaryPolarities,
  onPrimaryPolarityChange,
  primaryFormasCount,
  onPrimaryFormasCountChange,
  isPrimaryIncarnon,
  onIsPrimaryIncarnonChange,

  secondaryWeaponId,
  onSecondaryWeaponChange,
  secondaryMods,
  onSecondaryModChange,
  secondaryArcane,
  onSecondaryArcaneChange,
  secondaryExilusMod,
  onSecondaryExilusModChange,
  secondaryPolarities,
  onSecondaryPolarityChange,
  secondaryFormasCount,
  onSecondaryFormasCountChange,
  isSecondaryIncarnon,
  onIsSecondaryIncarnonChange,

  meleeWeaponId,
  onMeleeWeaponChange,
  meleeMods,
  onMeleeModChange,
  meleeArcane,
  onMeleeArcaneChange,
  meleeExilusMod,
  onMeleeExilusModChange,
  meleeStanceMod,
  onMeleeStanceModChange,
  meleePolarities,
  onMeleePolarityChange,
  meleeFormasCount,
  onMeleeFormasCountChange,
  isMeleeIncarnon,
  onIsMeleeIncarnonChange,

  companionId,
  onCompanionChange,
  companionMods,
  onCompanionModChange,
  companionPolarities,
  onCompanionPolarityChange,

  companionWeaponId,
  onCompanionWeaponChange,
  companionWeaponMods,
  onCompanionWeaponModChange,
  companionWeaponPolarities,
  onCompanionWeaponPolarityChange
}: ExtraBuildSlotsProps) {

  // UI State for slot popups
  const [activeSlot, setActiveSlot] = useState<{ 
    type: 'primary' | 'secondary' | 'melee' | 'companion' | 'companion_weapon' | 'primary_exilus' | 'secondary_exilus' | 'melee_exilus' | 'melee_stance' | 'primary_arcane' | 'secondary_arcane' | 'melee_arcane'; 
    index: number; 
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Combat Simulator Sandbox State
  const [selectedTab, setSelectedTab] = useState<'primary' | 'secondary' | 'melee' | 'companion' | 'companion_weapon'>('primary');
  const [originFilter, setOriginFilter] = useState<'all' | 'normal' | 'cetus' | 'fortuna' | 'kuva_tenet'>('all');

  const [simEnemyType, setSimEnemyType] = useState<'grineer_heavy' | 'corpus_tech' | 'infested_charger' | 'orokin_corrupted'>('grineer_heavy');
  const [simEnemyLevel, setSimEnemyLevel] = useState<number>(100);
  const [simIsEximus, setSimIsEximus] = useState<boolean>(false);
  const [simIsHeadshot, setSimIsHeadshot] = useState<boolean>(false);
  const [simRhinoRoar, setSimRhinoRoar] = useState<boolean>(false);
  const [simNourishActive, setSimNourishActive] = useState<boolean>(false);
  const [simForceCrit, setSimForceCrit] = useState<boolean>(true);
  const [buffSpeed, setBuffSpeed] = useState<boolean>(false);
  const [buffShield, setBuffShield] = useState<boolean>(false);
  const [buffHaste, setBuffHaste] = useState<boolean>(false);
  const [buffVexArmor, setBuffVexArmor] = useState<boolean>(false);
  const [buffEclipse, setBuffEclipse] = useState<boolean>(false);

  // Advanced Combat States
  const [simViralStacks, setSimViralStacks] = useState<number>(0);
  const [simCorrosiveStacks, setSimCorrosiveStacks] = useState<number>(0);
  const [simMeleeCombo, setSimMeleeCombo] = useState<number>(1);
  const [simSniperCombo, setSimSniperCombo] = useState<number>(1);
  const [simStealthActive, setSimStealthActive] = useState<boolean>(false);
  const [simOverguardActive, setSimOverguardActive] = useState<boolean>(false);
  const [simOverguardValue, setSimOverguardValue] = useState<number>(5000);
  const [simFactionMod, setSimFactionMod] = useState<number>(0); // 0 = None, 30 = Bane (+30%), 55 = Primed Bane (+55%)
  const [simShowFormulaSheet, setSimShowFormulaSheet] = useState<boolean>(true);

  // Selected Entities
  const selectedPrimary = WEAPONS.find(w => w.id === primaryWeaponId && w.type === 'primary') || WEAPONS.filter(w => w.type === 'primary')[0];
  const selectedSecondary = WEAPONS.find(w => w.id === secondaryWeaponId && w.type === 'secondary') || WEAPONS.filter(w => w.type === 'secondary')[0];
  const selectedMelee = WEAPONS.find(w => w.id === meleeWeaponId && w.type === 'melee') || WEAPONS.filter(w => w.type === 'melee')[0];
  const selectedCompanion = COMPANIONS.find(c => c.id === companionId) || COMPANIONS[0];
  const selectedCompanionWeapon = WEAPONS.find(w => w.id === companionWeaponId && w.type === 'companion_weapon') || WEAPONS.filter(w => w.type === 'companion_weapon')[0];

  // Capacity calculation utilities
  const getCapacityUsed = (modsList: (WeaponMod | null)[], polaritiesList: Polarity[]) => {
    let sum = 0;
    modsList.forEach((mod, idx) => {
      if (!mod) return;
      const pol = polaritiesList[idx] || 'None';
      if (pol === 'None') {
        sum += mod.cost;
      } else {
        // matching/simulated polarities drops cost by 50% rounded up
        sum += Math.ceil(mod.cost / 2);
      }
    });
    return sum;
  };

  // POLARITY SYMBOLS
  const getPolaritySymbol = (pol: Polarity) => {
    switch (pol) {
      case 'Madurai': return '🗲 (Madurai)';
      case 'Vazarin': return '⛨ (Vazarin)';
      case 'Naramon': return '🗲 (Naramon)';
      case 'Zenurik': return '⮶ (Zenurik)';
      case 'Umbra': return '🕀 (Umbra)';
      default: return 'None';
    }
  };

  const getModElement = (m: WeaponMod) => {
    const name = m.name.toLowerCase();
    const desc = m.description.toLowerCase();
    const id = m.id.toLowerCase();

    if (id.includes('toxin') || name.includes('toxin') || desc.includes('toxin') || id.includes('pestilence') || id.includes('fever') || id.includes('scourge')) {
      if (desc.includes('60%')) return { type: 'Toxin', value: 60 };
      return { type: 'Toxin', value: 90 };
    }
    if (id.includes('electric') || name.includes('electric') || desc.includes('electric') || id.includes('stormbringer') || id.includes('convulsion') || id.includes('voltage') || id.includes('jolt') || id.includes('touch') || id.includes('voltaic')) {
      if (desc.includes('60%')) return { type: 'Electricity', value: 60 };
      return { type: 'Electricity', value: 90 };
    }
    if (id.includes('heat') || name.includes('heat') || desc.includes('heat') || id.includes('hellfire') || id.includes('scorch') || id.includes('molten') || id.includes('volcanic') || id.includes('thermite')) {
      if (desc.includes('60%')) return { type: 'Heat', value: 60 };
      return { type: 'Heat', value: 90 };
    }
    if (id.includes('cold') || name.includes('cold') || desc.includes('cold') || id.includes('cryo') || id.includes('freeze') || id.includes('north') || id.includes('vicious') || id.includes('rime')) {
      if (desc.includes('60%')) return { type: 'Cold', value: 60 };
      return { type: 'Cold', value: 90 };
    }
    return null;
  };

  const combineElements = (modElements: { type: string, value: number }[]) => {
    const uniqueElements: { type: string, value: number }[] = [];
    const elementIndexMap: { [key: string]: number } = {};

    modElements.forEach(item => {
      if (elementIndexMap[item.type] !== undefined) {
        uniqueElements[elementIndexMap[item.type]].value += item.value;
      } else {
        elementIndexMap[item.type] = uniqueElements.length;
        uniqueElements.push({ type: item.type, value: item.value });
      }
    });

    const combinedList: { type: string, value: number }[] = [];
    let i = 0;
    while (i < uniqueElements.length) {
      const current = uniqueElements[i];
      const next = uniqueElements[i + 1];

      if (next) {
        const pair = [current.type, next.type].sort().join('+');
        let combinedType = '';
        if (pair === 'Cold+Heat') combinedType = 'Blast (ระเบิด)';
        else if (pair === 'Electricity+Heat') combinedType = 'Radiation (แผ่รังสี)';
        else if (pair === 'Gas+Heat' || pair === 'Heat+Toxin') combinedType = 'Gas (แก๊สพิษ)';
        else if (pair === 'Cold+Electricity') combinedType = 'Magnetic (แม่เหล็ก)';
        else if (pair === 'Cold+Toxin') combinedType = 'Viral (ไวรัส)';
        else if (pair === 'Electricity+Toxin') combinedType = 'Corrosive (กัดกร่อน)';

        if (combinedType) {
          combinedList.push({ type: combinedType, value: current.value + next.value });
          i += 2;
        } else {
          combinedList.push(current);
          i += 1;
        }
      } else {
        combinedList.push(current);
        i += 1;
      }
    }

    return combinedList;
  };

  // STAT CALCULATION ENGINE WITH POLARITY, LEVEL SCALING, AND INCARNON
  const calculateWeaponStats = (
    weapon: Weapon, 
    mods: (WeaponMod | null)[], 
    exilus: WeaponMod | null, 
    stance: WeaponMod | null, 
    formasCount: number, 
    isIncarnonActive: boolean
  ) => {
    let damageMult = 1;
    let critChanceBonus = 0;
    let critMultBonus = 0;
    let statusBonus = 0;
    let fireRateBonus = 0;
    let multishotBonus = 0;

    // Apply basic mods multipliers
    mods.forEach(m => {
      if (!m) return;
      if (m.stats.damage) damageMult += m.stats.damage / 100;
      if (m.stats.critChance) critChanceBonus += m.stats.critChance / 100;
      if (m.stats.critMultiplier) critMultBonus += m.stats.critMultiplier / 100;
      if (m.stats.statusChance) statusBonus += m.stats.statusChance / 100;
      if (m.stats.fireRate) fireRateBonus += m.stats.fireRate / 100;
      if (m.stats.multishot) multishotBonus += m.stats.multishot / 100;
    });

    if (exilus) {
      if (exilus.stats.critChance) critChanceBonus += exilus.stats.critChance / 100;
      if (exilus.stats.fireRate) fireRateBonus += exilus.stats.fireRate / 100;
      if (exilus.stats.multishot) multishotBonus += exilus.stats.multishot / 100;
    }
    if (stance) {
      if (stance.stats.damage) damageMult += stance.stats.damage / 100;
    }

    // Active Warframe buffs that affect base stats
    let vexBonus = 0;
    let speedBonus = 0;
    let hasteBonus = 0;
    let voltShieldCritBonus = 0;
    let voltShieldElectricBonus = 0;
    let nourishViralBonus = 0;

    // Chroma Vex Armor adds +250% base damage
    if (buffVexArmor) {
      vexBonus = 2.5;
    }

    // Volt Speed adds +50% attack speed/fire rate
    if (buffSpeed) {
      speedBonus = 0.5;
    }

    // Wisp Haste adds +30% attack speed/fire rate
    if (buffHaste) {
      hasteBonus = 0.3;
    }

    // Volt Shield adds +2.0 to Crit Multiplier and +50% Electric Damage for primary/secondary
    if (buffShield && (weapon.type === 'primary' || weapon.type === 'secondary')) {
      voltShieldCritBonus = 2.0;
      voltShieldElectricBonus = 50;
    }

    // Helminth Nourish adds +75% Viral damage
    if (simNourishActive) {
      nourishViralBonus = 75;
    }

    // Level Scaling for Kuva/Tenet Weapons:
    // +2% Base Damage per level above 30 (up to level 40 at 5 Formas, +20% raw bonus)
    const isKuvaTenetType = weapon.isKuvaTenet || weapon.origin === 'kuva_tenet';
    const maxLevel = isKuvaTenetType ? Math.min(40, 30 + (formasCount * 2)) : 30;
    const kuvaBonusFactor = isKuvaTenetType ? (1 + (maxLevel - 30) * 0.02) : 1;

    // Incarnon Evolution activation adds +10% flat Crit Chance and +20% flat Status Chance!
    const incarnonCritFlat = (isIncarnonActive && weapon.isIncarnon) ? 10 : 0;
    const incarnonStatusFlat = (isIncarnonActive && weapon.isIncarnon) ? 20 : 0;

    const base = weapon.baseStats;

    // Advanced dynamic modifiers
    let totalCritBonus = critChanceBonus;
    let totalStatusBonus = statusBonus;
    let sniperComboMultiplier = 1;

    if (weapon.type === 'melee') {
      const hasBloodRush = mods.some(m => m && (m.id === 'blood_rush' || m.name.toLowerCase().includes('blood rush')));
      if (hasBloodRush) {
        totalCritBonus += 0.40 * (simMeleeCombo - 1);
      }
      const hasWeepingWounds = mods.some(m => m && m.name.toLowerCase().includes('weeping wounds'));
      if (hasWeepingWounds) {
        totalStatusBonus += 0.40 * (simMeleeCombo - 1);
      }
    } else if (weapon.type === 'primary') {
      const nameLower = weapon.name.toLowerCase();
      const isSniper = nameLower.includes('sniper') || nameLower.includes('rubico') || nameLower.includes('vectis') || nameLower.includes('lanka') || nameLower.includes('snipetron');
      if (isSniper) {
        sniperComboMultiplier = 1 + (simSniperCombo - 1) * 0.50;
      }
    }

    const calculatedCrit = Math.round((base.critChance + incarnonCritFlat) * (1 + totalCritBonus));
    const calculatedStatus = Math.round((base.statusChance + incarnonStatusFlat) * (1 + totalStatusBonus));

    // Base damage scaling
    const moddedBaseMultiplier = (damageMult + vexBonus) * kuvaBonusFactor * sniperComboMultiplier;
    const baseDamageModded = base.damage * moddedBaseMultiplier;

    // Extract modded elements
    const modElements: { type: string; value: number }[] = [];
    mods.forEach(m => {
      if (!m) return;
      const parsed = getModElement(m);
      if (parsed) {
        modElements.push(parsed);
      }
    });

    // Add Volt Shield electric bonus
    if (voltShieldElectricBonus > 0) {
      modElements.push({ type: 'Electricity', value: voltShieldElectricBonus });
    }

    // Combine elements
    let combinedElements = combineElements(modElements);

    // Helminth Nourish adds Viral damage directly
    if (nourishViralBonus > 0) {
      combinedElements.push({ type: 'Viral (ไวรัส)', value: nourishViralBonus });
    }

    // Final multiplicative buffs
    let finalMult = 1.0;
    if (buffEclipse) finalMult *= 2.5; // Eclipse is +150% multiplicative damage (x2.5)
    if (simRhinoRoar) finalMult *= 1.3;  // Roar is +30% multiplicative damage (x1.3)

    const finalBasePhysicalDamage = Math.round(baseDamageModded * finalMult * 10) / 10;
    
    // Calculate each element damage
    const elementsCalculated = combinedElements.map(e => {
      return {
        type: e.type,
        percentage: e.value,
        damage: Math.round(baseDamageModded * (e.value / 100) * finalMult * 10) / 10
      };
    });

    // Total damage = final physical damage + elements
    let totalElementDamage = 0;
    elementsCalculated.forEach(e => {
      totalElementDamage += e.damage;
    });
    const finalTotalDamage = Math.round((finalBasePhysicalDamage + totalElementDamage) * 10) / 10;

    // Crit Multiplier calculation
    const baseCritMultiplier = base.critMultiplier * (1 + critMultBonus);
    const finalCritMultiplier = Math.round((baseCritMultiplier + voltShieldCritBonus) * 10) / 10;

    // Fire rate calculation
    const finalFireRate = Math.round(base.fireRate * (1 + fireRateBonus + speedBonus + hasteBonus) * 10) / 10;

    const finalMultishot = Math.round((1 + multishotBonus) * 10) / 10;

    return {
      basePhysicalDamage: base.damage,
      moddedPhysicalDamage: finalBasePhysicalDamage,
      elements: elementsCalculated,
      damage: finalTotalDamage,
      critChance: calculatedCrit,
      critMultiplier: finalCritMultiplier,
      statusChance: calculatedStatus,
      fireRate: finalFireRate,
      multishot: finalMultishot,
      maxLevel,
      kuvaBonusPercent: isKuvaTenetType ? (maxLevel - 30) * 2 : 0,
      buffsApplied: {
        vex: buffVexArmor,
        speed: buffSpeed,
        haste: buffHaste,
        shield: buffShield && (weapon.type === 'primary' || weapon.type === 'secondary'),
        nourish: simNourishActive,
        eclipse: buffEclipse,
        roar: simRhinoRoar
      },
      baseStats: base
    };
  };

  const finalPrimary = calculateWeaponStats(selectedPrimary, primaryMods, primaryExilusMod, null, primaryFormasCount, isPrimaryIncarnon);
  const finalSecondary = calculateWeaponStats(selectedSecondary, secondaryMods, secondaryExilusMod, null, secondaryFormasCount, isSecondaryIncarnon);
  const finalMelee = calculateWeaponStats(selectedMelee, meleeMods, meleeExilusMod, meleeStanceMod, meleeFormasCount, isMeleeIncarnon);

  // Companion Stats Calculation
  const calculateCompanionStats = () => {
    let healthMult = 1;
    let shieldMult = 1;
    let armorMult = 1;

    companionMods.forEach(m => {
      if (!m) return;
      if (m.stats.health) healthMult += m.stats.health / 100;
      if (m.stats.shield) shieldMult += m.stats.shield / 100;
      if (m.stats.armor) armorMult += m.stats.armor / 100;
    });

    const base = selectedCompanion.baseStats;
    return {
      health: Math.round(base.health * healthMult),
      shield: Math.round(base.shield * shieldMult),
      armor: Math.round(base.armor * armorMult),
    };
  };

  const calculateCompanionWeaponStats = () => {
    let damageMult = 1;
    let critChanceBonus = 0;
    let critMultiplierBonus = 0;
    let statusBonus = 0;
    let fireRateBonus = 0;

    companionWeaponMods.forEach(m => {
      if (!m) return;
      if (m.stats.damage) damageMult += m.stats.damage / 100;
      if (m.stats.critChance) critChanceBonus += m.stats.critChance / 100;
      if (m.stats.critMultiplier) critMultiplierBonus += m.stats.critMultiplier / 100;
      if (m.stats.statusChance) statusBonus += m.stats.statusChance / 100;
      if (m.stats.fireRate) fireRateBonus += m.stats.fireRate / 100;
    });

    const base = selectedCompanionWeapon.baseStats;
    return {
      damage: Math.round(base.damage * damageMult * 10) / 10,
      critChance: Math.round(base.critChance * (1 + critChanceBonus)),
      critMultiplier: Math.round(base.critMultiplier * (1 + critMultiplierBonus) * 10) / 10,
      statusChance: Math.round(base.statusChance * (1 + statusBonus)),
      fireRate: Math.round(base.fireRate * (1 + fireRateBonus) * 10) / 10,
      baseStats: base,
      moddedPhysicalDamage: Math.round(base.damage * damageMult * 10) / 10,
      elements: []
    };
  };

  const renderCalculatedStatsPanel = (stats: any, label: string, baseCapacityUsed: number) => {
    // Probability of crits
    const cc = stats.critChance;
    let whiteProb = 100;
    let yellowProb = 0;
    let orangeProb = 0;
    let redProb = 0;
    let redPlusProb = 0;

    if (cc > 0) {
      if (cc <= 100) {
        whiteProb = 100 - cc;
        yellowProb = cc;
      } else if (cc <= 200) {
        whiteProb = 0;
        yellowProb = 200 - cc;
        orangeProb = cc - 100;
      } else if (cc <= 300) {
        whiteProb = 0;
        yellowProb = 0;
        orangeProb = 300 - cc;
        redProb = cc - 200;
      } else {
        whiteProb = 0;
        yellowProb = 0;
        orangeProb = 0;
        redProb = Math.max(0, 400 - cc);
        redPlusProb = cc - 300;
      }
    }

    return (
      <div className="lg:col-span-4 bg-zinc-950/90 p-4 rounded-xl border border-zinc-800 font-mono text-xs space-y-4">
        <div className="text-[10px] text-zinc-500 font-bold border-b border-zinc-800 pb-1.5 uppercase flex justify-between items-center">
          <span>Calculated Stats</span>
          <span className="text-[9px] text-amber-500 font-normal">{label}</span>
        </div>

        {/* Basic Stats */}
        <div className="space-y-1.5">
          <div className="flex justify-between py-0.5 border-b border-zinc-900">
            <span className="text-zinc-400">Total Damage (ดาเมจรวม)</span>
            <span className="text-amber-400 font-bold text-sm">{stats.damage}</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="text-zinc-400">Critical Chance</span>
            <span className="text-zinc-200 font-bold">{cc}%</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="text-zinc-400">Crit Multiplier</span>
            <span className="text-zinc-200 font-bold">{stats.critMultiplier}x</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="text-zinc-400">Status Chance</span>
            <span className="text-zinc-200 font-bold">{stats.statusChance}%</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="text-zinc-400">Fire Rate (ความเร็วการยิง)</span>
            <span className="text-zinc-200 font-bold">{stats.fireRate}/s</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="text-zinc-400">Multishot</span>
            <span className="text-zinc-200 font-bold">x{stats.multishot || '1.0'}</span>
          </div>
        </div>

        {/* Damage Breakdown */}
        <div className="space-y-1.5 bg-zinc-900/40 p-2.5 rounded-lg border border-zinc-850/60">
          <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-1">
            รายละเอียดดาเมจ (Damage Breakdown)
          </div>
          <div className="flex justify-between py-0.5 text-[11px]">
            <span className="text-zinc-400">Base Physical (กายภาพรวม)</span>
            <span className="text-zinc-300 font-medium">{stats.moddedPhysicalDamage}</span>
          </div>
          {stats.elements && stats.elements.length > 0 ? (
            <div className="space-y-1 pt-1 border-t border-zinc-850">
              {stats.elements.map((el: any, index: number) => {
                let badgeColor = "bg-zinc-800 text-zinc-300";
                if (el.type.includes("Viral")) {
                  badgeColor = "bg-purple-950 text-purple-400 border border-purple-900/50";
                } else if (el.type.includes("Corrosive")) {
                  badgeColor = "bg-green-950 text-green-400 border border-green-900/50";
                } else if (el.type.includes("Radiation")) {
                  badgeColor = "bg-yellow-950/60 text-yellow-400 border border-yellow-900/30";
                } else if (el.type.includes("Magnetic")) {
                  badgeColor = "bg-cyan-950 text-cyan-400 border border-cyan-900/50";
                } else if (el.type.includes("Blast")) {
                  badgeColor = "bg-red-950 text-red-400 border border-red-900/50";
                } else if (el.type.includes("Gas")) {
                  badgeColor = "bg-orange-950 text-orange-400 border border-orange-900/50";
                } else if (el.type.includes("Toxin")) {
                  badgeColor = "bg-emerald-950 text-emerald-400 border border-emerald-900/50";
                } else if (el.type.includes("Electricity")) {
                  badgeColor = "bg-blue-950 text-blue-400 border border-blue-900/50";
                } else if (el.type.includes("Heat")) {
                  badgeColor = "bg-amber-950 text-amber-400 border border-amber-900/50";
                } else if (el.type.includes("Cold")) {
                  badgeColor = "bg-sky-950 text-sky-400 border border-sky-900/50";
                }

                return (
                  <div key={index} className="flex justify-between items-center text-[11px] py-0.5">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${badgeColor}`}>
                      +{el.percentage}% {el.type}
                    </span>
                    <span className="text-zinc-200 font-medium">{el.damage}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-[10px] text-zinc-500 italic pt-1 border-t border-zinc-850">
              ไม่มีดาเมจธาตุติดตั้ง (No Element)
            </div>
          )}
        </div>

        {/* Critical Damage Breakdown */}
        <div className="space-y-1.5 bg-zinc-900/40 p-2.5 rounded-lg border border-zinc-850/60">
          <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-1">
            ความแรงคริติคอลตามระดับ (Crit Tiers)
          </div>
          <div className="space-y-1 text-[11px]">
            {whiteProb > 0 && (
              <div className="flex justify-between">
                <span className="text-zinc-500">White Dmg (ดาเมจปกติ)</span>
                <span className="text-zinc-400 font-bold">{stats.damage} ({Math.round(whiteProb)}%)</span>
              </div>
            )}
            <div className={`flex justify-between ${yellowProb > 0 ? 'text-yellow-400 font-bold' : 'text-zinc-600'}`}>
              <span>Yellow Crit (คริเหลือง)</span>
              <span>
                {Math.round(stats.damage * stats.critMultiplier)}
                {yellowProb > 0 && ` (${Math.round(yellowProb)}%)`}
              </span>
            </div>
            <div className={`flex justify-between ${orangeProb > 0 ? 'text-orange-400 font-bold' : 'text-zinc-600'}`}>
              <span>Orange Crit (คริส้ม)</span>
              <span>
                {Math.round(stats.damage * (1 + 2 * (stats.critMultiplier - 1)))}
                {orangeProb > 0 && ` (${Math.round(orangeProb)}%)`}
              </span>
            </div>
            <div className={`flex justify-between ${redProb > 0 ? 'text-red-400 font-bold' : 'text-zinc-600'}`}>
              <span>Red Crit (คริแดง)</span>
              <span>
                {Math.round(stats.damage * (1 + 3 * (stats.critMultiplier - 1)))}
                {redProb > 0 && ` (${Math.round(redProb)}%)`}
              </span>
            </div>
            {redPlusProb > 0 && (
              <div className="flex justify-between text-red-500 font-extrabold animate-pulse">
                <span>Red Crit ! (คริแดงสูงสุด)</span>
                <span>
                  {Math.round(stats.damage * (1 + 4 * (stats.critMultiplier - 1)))}
                  {` (${Math.round(redPlusProb)}%)`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Active Buffs info */}
        {Object.values(stats.buffsApplied).some(Boolean) && (
          <div className="bg-amber-500/5 p-2 rounded border border-amber-500/20 text-[10px] text-amber-500 space-y-1">
            <span className="font-bold block uppercase tracking-wider text-[9px]">บัฟตัวละครที่ทำงาน (Active Buffs):</span>
            <div className="flex flex-wrap gap-1">
              {stats.buffsApplied.vex && <span className="bg-amber-500/10 px-1 py-0.5 rounded border border-amber-500/20">Chroma Vex Armor</span>}
              {stats.buffsApplied.speed && <span className="bg-amber-500/10 px-1 py-0.5 rounded border border-amber-500/20">Volt Speed</span>}
              {stats.buffsApplied.haste && <span className="bg-amber-500/10 px-1 py-0.5 rounded border border-amber-500/20">Wisp Haste</span>}
              {stats.buffsApplied.shield && <span className="bg-amber-500/10 px-1 py-0.5 rounded border border-amber-500/20">Volt Shield</span>}
              {stats.buffsApplied.nourish && <span className="bg-amber-500/10 px-1 py-0.5 rounded border border-amber-500/20">Helminth Nourish</span>}
              {stats.buffsApplied.eclipse && <span className="bg-amber-500/10 px-1 py-0.5 rounded border border-amber-500/20">Mirage Eclipse</span>}
              {stats.buffsApplied.roar && <span className="bg-amber-500/10 px-1 py-0.5 rounded border border-amber-500/20">Rhino Roar</span>}
            </div>
          </div>
        )}

        {/* Polarity cost indicator */}
        <div className="border-t border-zinc-850 pt-2 mt-2 space-y-1">
          <div className="flex justify-between text-[10px] text-zinc-500">
            <span>Mod Capacity Used:</span>
            <span className="text-amber-500 font-bold">{baseCapacityUsed} / 60</span>
          </div>
          <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-amber-500 h-full transition-all" 
              style={{ width: `${Math.min(100, (baseCapacityUsed / 60) * 100)}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  const finalCompanion = calculateCompanionStats();
  const finalCompanionWeapon = calculateCompanionWeaponStats();

  // COMBAT SIMULATOR SANDBOX CALCULATION LOGIC
  const runSimulation = () => {
    // Determine selected stats
    let activeWfStats: any = finalPrimary;
    let activeWf = selectedPrimary;
    let activeArcane = primaryArcane;

    if (selectedTab === 'secondary') {
      activeWfStats = finalSecondary;
      activeWf = selectedSecondary;
      activeArcane = secondaryArcane;
    } else if (selectedTab === 'melee') {
      activeWfStats = finalMelee;
      activeWf = selectedMelee;
      activeArcane = meleeArcane;
    } else if (selectedTab === 'companion_weapon') {
      activeWfStats = { ...finalCompanionWeapon, maxLevel: 30, kuvaBonusPercent: 0 };
      activeWf = selectedCompanionWeapon;
      activeArcane = null;
    } else if (selectedTab === 'companion') {
      activeWfStats = finalPrimary;
      activeWf = selectedPrimary;
      activeArcane = primaryArcane;
    }

    // 1. Enemy Health, Shields, Armor scaling (Formula #16)
    let baseHealth = 500;
    let baseShield = 0;
    let baseArmor = 0;
    let enemyName = "Grineer Heavy Gunner";
    let baseL = 8;

    if (simEnemyType === 'grineer_heavy') {
      baseHealth = 1200;
      baseArmor = 500;
      enemyName = "Grineer Heavy Gunner";
      baseL = 8;
    } else if (simEnemyType === 'corpus_tech') {
      baseHealth = 800;
      baseShield = 1000;
      enemyName = "Corpus Tech";
      baseL = 15;
    } else if (simEnemyType === 'infested_charger') {
      baseHealth = 400;
      baseArmor = 0;
      enemyName = "Infested Charger";
      baseL = 1;
    } else if (simEnemyType === 'orokin_corrupted') {
      baseHealth = 1500;
      baseShield = 500;
      baseArmor = 300;
      enemyName = "Corrupted Heavy Gunner";
      baseL = 10;
    }

    // Precise scaling equations
    const k = Math.max(0, simEnemyLevel - baseL);
    const hpMultiplier = 1 + 0.015 * Math.pow(k, 2);
    const armorMultiplier = 1 + 0.005 * Math.pow(k, 1.75);
    const shieldMultiplier = 1 + 0.0075 * Math.pow(k, 2);

    let scaledHealth = Math.round(baseHealth * hpMultiplier * (simIsEximus ? 3 : 1));
    let scaledShield = Math.round(baseShield * shieldMultiplier * (simIsEximus ? 2 : 1));
    let scaledArmor = baseArmor > 0 ? Math.round(baseArmor * armorMultiplier) : 0;

    // Apply Corrosive Armor Strip (Formula #19)
    let corrosiveStrip = 0;
    if (simCorrosiveStacks > 0) {
      corrosiveStrip = 0.26 + (Math.min(10, simCorrosiveStacks) - 1) * 0.06;
      scaledArmor = Math.round(scaledArmor * (1 - corrosiveStrip));
    }

    // Apply Viral Health Multiplier (Formula #19)
    const viralMultiplier = simViralStacks > 0 
      ? (2.0 + (Math.min(10, simViralStacks) - 1) * 0.25) 
      : 1.0;

    // Faction Damage Multiplier (Formula #6)
    const factionMult = 1 + (simFactionMod / 100);

    // Melee Stealth Damage Multiplier (Formula #8)
    const stealthMult = (simStealthActive && selectedTab === 'melee') ? 8.0 : 1.0;

    // Overguard scaling (Formula #21)
    const hasOverguard = simOverguardActive || simIsEximus;
    const scaledOverguard = hasOverguard ? (simOverguardActive ? simOverguardValue : Math.round(scaledHealth * 1.5)) : 0;

    // Multishot factor (Formula #3)
    const multishot = activeWfStats.multishot || 1.0;

    // Headshot multipliers (Formula #5)
    let headshotFactor = 1;
    if (simIsHeadshot) {
      const hasDeadhead = activeArcane && (activeArcane.id === 'primary_deadhead' || activeArcane.id === 'secondary_deadhead');
      headshotFactor = hasDeadhead ? 3.0 : 2.0;
    }

    // Crit tier logic (Formula #7)
    let critMultiplierApplied = 1;
    let critTier = 0;
    let critTierText = "White Crit (ดาเมจปกติ)";
    let critTierColor = "text-zinc-400";

    const rolledCritChance = activeWfStats.critChance || 0;
    if (simForceCrit && rolledCritChance > 0) {
      if (rolledCritChance <= 100) {
        critMultiplierApplied = activeWfStats.critMultiplier;
        critTier = 1;
        critTierText = "Yellow Crit (คริเหลือง)";
        critTierColor = "text-yellow-400 font-bold";
      } else if (rolledCritChance <= 200) {
        critMultiplierApplied = 1 + 2 * (activeWfStats.critMultiplier - 1);
        critTier = 2;
        critTierText = "Orange Crit (คริส้ม)";
        critTierColor = "text-orange-500 font-bold";
      } else if (rolledCritChance <= 300) {
        critMultiplierApplied = 1 + 3 * (activeWfStats.critMultiplier - 1);
        critTier = 3;
        critTierText = "Red Crit (คริแดง)";
        critTierColor = "text-red-500 font-bold animate-pulse";
      } else {
        critMultiplierApplied = 1 + 4 * (activeWfStats.critMultiplier - 1);
        critTier = 4;
        critTierText = "Red Crit ! (คริแดงขั้นสูงสุด!)";
        critTierColor = "text-red-600 font-extrabold animate-pulse";
      }
    } else {
      critMultiplierApplied = 1.0;
      critTierText = "White Crit (ดาเมจปกติไม่ติดคริ)";
      critTierColor = "text-zinc-500";
    }

    // BREAK DOWN DAMAGE COMPOSITION
    const moddedPhys = activeWfStats.moddedPhysicalDamage || 10;
    const dmgSlash = moddedPhys * 0.40;
    const dmgPuncture = moddedPhys * 0.30;
    const dmgImpact = moddedPhys * 0.30;

    const elements = activeWfStats.elements || [];

    interface DamagePart {
      name: string;
      baseDamage: number;
      mArmor: number;
      mHealth: number;
      isToxinShieldBypass?: boolean;
    }

    const parts: DamagePart[] = [
      { name: 'Slash', baseDamage: dmgSlash, mArmor: 0, mHealth: 0 },
      { name: 'Puncture', baseDamage: dmgPuncture, mArmor: 0, mHealth: 0 },
      { name: 'Impact', baseDamage: dmgImpact, mArmor: 0, mHealth: 0 },
    ];

    elements.forEach((el: any) => {
      parts.push({
        name: el.type,
        baseDamage: el.damage,
        mArmor: 0,
        mHealth: 0,
        isToxinShieldBypass: el.type.toLowerCase().includes('toxin') || el.type.toLowerCase().includes('พิษ')
      });
    });

    // Configure modifiers based on target type (Formula #14)
    if (simEnemyType === 'grineer_heavy') {
      parts.forEach(p => {
        const n = p.name.toLowerCase();
        if (n.includes('slash')) { p.mArmor = -0.15; p.mHealth = 0.25; }
        else if (n.includes('puncture')) { p.mArmor = 0.50; p.mHealth = 0; }
        else if (n.includes('impact')) { p.mArmor = 0; p.mHealth = -0.25; }
        else if (n.includes('corrosive') || n.includes('กัดกร่อน')) { p.mArmor = 0.75; p.mHealth = 0; }
        else if (n.includes('viral') || n.includes('ไวรัส')) { p.mArmor = 0; p.mHealth = 0.75; }
        else if (n.includes('heat') || n.includes('ความร้อน')) { p.mArmor = 0; p.mHealth = 0.25; }
        else if (n.includes('toxin') || n.includes('พิษ')) { p.mArmor = -0.25; p.mHealth = 0.25; }
        else if (n.includes('radiation') || n.includes('แผ่รังสี')) { p.mArmor = -0.10; p.mHealth = 0; }
      });
    } else if (simEnemyType === 'orokin_corrupted') {
      parts.forEach(p => {
        const n = p.name.toLowerCase();
        if (n.includes('slash')) { p.mArmor = -0.50; p.mHealth = 0.25; }
        else if (n.includes('puncture')) { p.mArmor = 0.15; p.mHealth = 0; }
        else if (n.includes('impact')) { p.mArmor = 0; p.mHealth = -0.25; }
        else if (n.includes('radiation') || n.includes('แผ่รังสี')) { p.mArmor = 0.75; p.mHealth = 0; }
        else if (n.includes('viral') || n.includes('ไวรัส')) { p.mArmor = 0; p.mHealth = 0.75; }
        else if (n.includes('cold') || n.includes('ความเย็น')) { p.mArmor = 0.25; p.mHealth = 0; }
        else if (n.includes('corrosive') || n.includes('กัดกร่อน')) { p.mArmor = -0.50; p.mHealth = 0; }
      });
    } else if (simEnemyType === 'corpus_tech') {
      if (scaledShield > 0) {
        parts.forEach(p => {
          const n = p.name.toLowerCase();
          if (n.includes('magnetic') || n.includes('แม่เหล็ก')) { p.mHealth = 0.75; }
          else if (n.includes('cold') || n.includes('ความเย็น')) { p.mHealth = 0.50; }
          else if (n.includes('impact')) { p.mHealth = 0.50; }
          else if (n.includes('radiation') || n.includes('แผ่รังสี')) { p.mHealth = -0.25; }
          else if (p.isToxinShieldBypass) {
            p.mHealth = 0.50;
          }
        });
      } else {
        parts.forEach(p => {
          const n = p.name.toLowerCase();
          if (n.includes('viral') || n.includes('ไวรัส')) { p.mHealth = 0.75; }
          else if (n.includes('toxin') || n.includes('พิษ')) { p.mHealth = 0.50; }
          else if (n.includes('heat') || n.includes('ความร้อน')) { p.mHealth = 0.25; }
          else if (n.includes('slash')) { p.mHealth = 0.25; }
          else if (n.includes('magnetic') || n.includes('แม่เหล็ก')) { p.mHealth = -0.25; }
        });
      }
    } else if (simEnemyType === 'infested_charger') {
      parts.forEach(p => {
        const n = p.name.toLowerCase();
        if (n.includes('gas') || n.includes('แก๊ส')) { p.mHealth = 0.75; }
        else if (n.includes('heat') || n.includes('ความร้อน')) { p.mHealth = 0.50; }
        else if (n.includes('slash')) { p.mHealth = 0.50; }
        else if (n.includes('radiation') || n.includes('แผ่รังสี')) { p.mHealth = -0.50; }
      });
    }

    let totalDamagePerBullet = 0;
    let netMitigationPercentSum = 0;
    let countedMitigations = 0;

    parts.forEach(p => {
      // Base damage with crit, headshot, faction, and stealth (Formula #5, #6, #8)
      const rawCompDamage = p.baseDamage * critMultiplierApplied * headshotFactor * factionMult * stealthMult;

      let finalCompDamage = 0;

      if (scaledOverguard > 0) {
        // Overguard bypasses armor but is vulnerable to base damage (Formula #21)
        finalCompDamage = rawCompDamage;
      } else if (scaledShield > 0 && !p.isToxinShieldBypass && simEnemyType === 'corpus_tech') {
        // Hit shields
        finalCompDamage = rawCompDamage * (1 + p.mHealth);
      } else {
        // Hit health (armored or unarmored)
        if (scaledArmor > 0) {
          // Precise armor calculation ignoring the armor type modifier percent (Formula #5)
          const effArmor = Math.max(0, scaledArmor * (1 - p.mArmor));
          const armorDR = effArmor / (effArmor + 300);
          
          finalCompDamage = rawCompDamage * (1 + p.mHealth) * (1 + p.mArmor) * (1 - armorDR) * viralMultiplier;
          
          netMitigationPercentSum += armorDR;
          countedMitigations++;
        } else {
          // No armor, apply viral directly to health
          finalCompDamage = rawCompDamage * (1 + p.mHealth) * viralMultiplier;
        }
      }

      totalDamagePerBullet += finalCompDamage;
    });

    // Average armor mitigation percent
    const armorMitigationPercent = countedMitigations > 0 
      ? Math.round((netMitigationPercentSum / countedMitigations) * 100) 
      : (scaledArmor > 0 ? Math.round((scaledArmor / (scaledArmor + 300)) * 100) : 0);

    // Apply multishot to get average damage per single click
    const damageDealtPerHit = Math.round(totalDamagePerBullet * multishot * 10) / 10;

    // DoT Status formulas - squared faction multipliers! (Formula #13)
    const factionMultSq = factionMult * factionMult;

    // Slash (Bleed) bypasses Armor and shields completely!
    const slashHealthBonus = (simEnemyType === 'grineer_heavy' || simEnemyType === 'orokin_corrupted') ? 0.25 : (simEnemyType === 'infested_charger' ? 0.50 : 0);
    const simulatedSlashDoT = Math.round((dmgSlash * 0.35 * critMultiplierApplied * (1 + slashHealthBonus) * multishot * factionMultSq * stealthMult) * 10) / 10;

    // Heat Tick DoT
    const heatHealthBonus = (simEnemyType === 'grineer_heavy' || simEnemyType === 'orokin_corrupted') ? 0.25 : (simEnemyType === 'infested_charger' ? 0.50 : 0);
    const heatElementObj = elements.find((el: any) => el.type.toLowerCase().includes('heat') || el.type.toLowerCase().includes('ความร้อน'));
    const baseHeatDmg = heatElementObj ? heatElementObj.damage : 0;
    const simulatedHeatDoT = Math.round((baseHeatDmg * 0.50 * critMultiplierApplied * (1 + heatHealthBonus) * multishot * factionMultSq * stealthMult) * 10) / 10;

    // Simulated DPS = damageDealtPerHit * fireRate (Formula #9)
    const simulatedDPS = Math.round(damageDealtPerHit * activeWfStats.fireRate);

    return {
      enemyName,
      scaledHealth,
      scaledShield,
      scaledArmor,
      scaledOverguard,
      armorMitigationPercent,
      damageDealtPerHit,
      critTierText,
      critTierColor,
      simulatedSlashDoT,
      simulatedHeatDoT,
      simulatedDPS,
      headshotFactor,
      activeWfStats,
      activeWf,
      multishot,
      viralMultiplier,
      corrosiveStrip
    };
  };

  const simResult = runSimulation();

  // Handle active slot clicking
  const handleSlotClick = (type: any, index: number) => {
    setActiveSlot({ type, index });
    setSearchQuery('');
  };

  // Select Mod
  const handleSelectMod = (mod: any) => {
    if (!activeSlot) return;

    if (activeSlot.type === 'primary') {
      onPrimaryModChange(activeSlot.index, mod);
    } else if (activeSlot.type === 'secondary') {
      onSecondaryModChange(activeSlot.index, mod);
    } else if (activeSlot.type === 'melee') {
      onMeleeModChange(activeSlot.index, mod);
    } else if (activeSlot.type === 'companion') {
      onCompanionModChange(activeSlot.index, mod);
    } else if (activeSlot.type === 'companion_weapon') {
      onCompanionWeaponModChange(activeSlot.index, mod);
    } else if (activeSlot.type === 'primary_exilus') {
      onPrimaryExilusModChange(mod);
    } else if (activeSlot.type === 'secondary_exilus') {
      onSecondaryExilusModChange(mod);
    } else if (activeSlot.type === 'melee_exilus') {
      onMeleeExilusModChange(mod);
    } else if (activeSlot.type === 'melee_stance') {
      onMeleeStanceModChange(mod);
    } else if (activeSlot.type === 'primary_arcane') {
      onPrimaryArcaneChange(mod);
    } else if (activeSlot.type === 'secondary_arcane') {
      onSecondaryArcaneChange(mod);
    } else if (activeSlot.type === 'melee_arcane') {
      onMeleeArcaneChange(mod);
    }

    setActiveSlot(null);
  };

  // Get current active filter mods
  const getFilteredMods = () => {
    if (!activeSlot) return [];
    let modPool: any[] = [];
    const equippedIds = new Set<string>();

    if (activeSlot.type === 'primary') {
      modPool = PRIMARY_MODS;
      primaryMods.forEach((m, idx) => { if (m && idx !== activeSlot.index) equippedIds.add(m.id); });
    } else if (activeSlot.type === 'secondary') {
      modPool = SECONDARY_MODS;
      secondaryMods.forEach((m, idx) => { if (m && idx !== activeSlot.index) equippedIds.add(m.id); });
    } else if (activeSlot.type === 'melee') {
      modPool = MELEE_MODS;
      meleeMods.forEach((m, idx) => { if (m && idx !== activeSlot.index) equippedIds.add(m.id); });
    } else if (activeSlot.type === 'companion') {
      modPool = COMPANION_MODS;
      companionMods.forEach((m, idx) => { if (m && idx !== activeSlot.index) equippedIds.add(m.id); });
    } else if (activeSlot.type === 'companion_weapon') {
      modPool = COMPANION_WEAPON_MODS;
      companionWeaponMods.forEach((m, idx) => { if (m && idx !== activeSlot.index) equippedIds.add(m.id); });
    } else if (activeSlot.type === 'primary_exilus' || activeSlot.type === 'secondary_exilus' || activeSlot.type === 'melee_exilus') {
      modPool = WEAPON_EXILUS_MODS;
    } else if (activeSlot.type === 'melee_stance') {
      modPool = STANCE_MODS;
    } else if (activeSlot.type === 'primary_arcane' || activeSlot.type === 'secondary_arcane' || activeSlot.type === 'melee_arcane') {
      modPool = WEAPON_ARCANES;
    }

    return modPool
      .filter(m => !equippedIds.has(m.id))
      .filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.description.toLowerCase().includes(searchQuery.toLowerCase()));
  };

  const getRarityClass = (rarity: string) => {
    switch (rarity) {
      case 'Legendary': return 'border-red-500/60 text-red-400 bg-red-950/25';
      case 'Rare': return 'border-yellow-500/60 text-yellow-400 bg-yellow-950/25';
      case 'Uncommon': return 'border-cyan-500/60 text-cyan-400 bg-cyan-950/25';
      case 'Amalgam': return 'border-orange-500/60 text-orange-400 bg-orange-950/25';
      case 'Primed': return 'border-teal-500/60 text-teal-400 bg-teal-950/25';
      default: return 'border-zinc-700 text-zinc-300 bg-zinc-950/25';
    }
  };

  const filteredWeaponsForSelect = (type: 'primary' | 'secondary' | 'melee' | 'companion_weapon') => {
    return WEAPONS.filter(w => w.type === type).filter(w => {
      if (originFilter === 'all') return true;
      return w.origin === originFilter;
    });
  };

  return (
    <div id="extra-build-slots-root" className="space-y-6">

      {/* 0. CATEGORY SETTING TABS PANEL */}
      <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-4 shadow-lg">
        <div className="flex items-center gap-2 text-amber-500 font-semibold text-xs font-mono uppercase tracking-wider">
          <Settings size={15} />
          <span>บิลด์ประเภทหมวดหมู่หลัก (BUILD CATEGORY TABS)</span>
        </div>
        <p className="text-xs text-zinc-400">
          กรุณาติ๊กเลือกประเภทบิลด์หลักที่คุณกำลังออกแบบ เพื่อช่วยให้คลังแสงจัดกลุ่มแสดงผลการ์ดและบันทึกได้ถูกต้อง:
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {[
            { id: 'warframe', label: '🛡️ Warframe', desc: 'เน้นบิลด์ตัวละคร' },
            { id: 'primary', label: '🔫 Primary', desc: 'บิลด์ปืนหลัก' },
            { id: 'secondary', label: '🔫 Secondary', desc: 'บิลด์ปืนรอง' },
            { id: 'melee', label: '⚔️ Melee', desc: 'บิลด์อาวุธประชิด' },
            { id: 'companion', label: '🐾 Companion', desc: 'บิลด์สัตว์เลี้ยง' },
            { id: 'companion_weapon', label: '🦾 Companion Wpn', desc: 'บิลด์อาวุธสัตว์' },
            { id: 'hybrid', label: '🔮 Hybrid', desc: 'บิลด์ผสมผสาน' },
          ].map(catTab => (
            <button
              key={catTab.id}
              type="button"
              onClick={() => onCategoryChange(catTab.id as any)}
              className={`p-3 rounded-xl border transition-all text-left flex flex-col justify-between ${
                category === catTab.id 
                  ? 'bg-amber-500/10 border-amber-500 text-amber-400' 
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
              }`}
            >
              <span className="text-xs font-bold whitespace-nowrap">{catTab.label}</span>
              <span className="text-[9px] text-zinc-500 mt-1 block">{catTab.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* TABS SELECTOR FOR INNER WEAPON SLOTS */}
      <div className="flex border-b border-zinc-800/80 gap-1 pb-px overflow-x-auto">
        {[
          { id: 'primary', label: '1. อาวุธหลัก (Primary)', count: primaryMods.filter(Boolean).length },
          { id: 'secondary', label: '2. อาวุธรอง (Secondary)', count: secondaryMods.filter(Boolean).length },
          { id: 'melee', label: '3. อาวุธประชิด (Melee)', count: meleeMods.filter(Boolean).length },
          { id: 'companion', label: '4. สัตว์เลี้ยง (Companion)', count: companionMods.filter(Boolean).length },
          { id: 'companion_weapon', label: '5. อาวุธคู่หู (Companion Wpn)', count: companionWeaponMods.filter(Boolean).length },
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSelectedTab(tab.id as any)}
            className={`px-4 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all shrink-0 ${
              selectedTab === tab.id
                ? 'border-amber-500 text-amber-500 bg-amber-500/5'
                : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30'
            }`}
          >
            {tab.label}
            <span className="ml-1.5 text-[10px] font-mono px-1.5 py-0.2 bg-zinc-950 text-zinc-500 rounded-full">
              {tab.count} Mod
            </span>
          </button>
        ))}
      </div>

      {/* 1. PRIMARY WEAPON PANEL */}
      {selectedTab === 'primary' && (
        <div className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-2xl space-y-4 shadow-lg animate-fadeIn">
          {/* Header & Filter Controls */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                <Target size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-100">ปืนหลัก (Primary Weapons Setup)</h3>
                <p className="text-[10px] text-zinc-500">ปรับแต่ง Polarity, Exilus, ระดับ Kuva และเปิดใช้งานการวิวัฒนาการ Incarnon ได้อย่างละเอียด</p>
              </div>
            </div>

            {/* Origin weapon filtering */}
            <div className="flex flex-wrap items-center gap-2 bg-zinc-950/80 p-1.5 rounded-xl border border-zinc-800/80">
              <span className="text-[10px] uppercase font-bold text-zinc-500 px-2 font-mono">กรองปืน:</span>
              {[
                { id: 'all', label: 'ทั้งหมด' },
                { id: 'normal', label: 'ทั่วไป' },
                { id: 'cetus', label: 'Cetus Modular' },
                { id: 'fortuna', label: 'Fortuna Kitgun' },
                { id: 'kuva_tenet', label: 'Kuva / Tenet' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setOriginFilter(opt.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${
                    originFilter === opt.id ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Weapon Select */}
            <div className="flex items-center gap-2">
              <label className="text-[10px] font-bold text-zinc-500 font-mono">อาวุธ:</label>
              <select
                value={primaryWeaponId}
                onChange={(e) => onPrimaryWeaponChange(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono px-3 py-1.5 text-zinc-300 focus:outline-none"
              >
                {filteredWeaponsForSelect('primary').map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sub Controls: Forma Scaling & Incarnon Evolution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-950/60 p-4 rounded-xl border border-zinc-850">
            {/* Level scaling indicator for Kuva/Sister */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-zinc-300 flex items-center gap-1">
                  <Zap size={14} className="text-cyan-400" />
                  <span>ระดับ Forma และเลเวลปืน (Kuva / Tenet Bonus)</span>
                </span>
                <span className="text-xs font-mono font-bold text-cyan-400">เลเวลสูงสุด {finalPrimary.maxLevel}</span>
              </div>
              <p className="text-[10px] text-zinc-500">อาวุธ Kuva/Tenet สามารถเก็บเลเวลเพิ่มขึ้น +2 ต่อ 1 Forma สูงสุด 40 เลเวลเพื่อเพิ่มดาเมจพื้นฐานสูงสุด +20%</p>
              
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-zinc-400">จำนวน Forma:</span>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={primaryFormasCount}
                  onChange={(e) => onPrimaryFormasCountChange(parseInt(e.target.value))}
                  className="accent-amber-500 flex-1 bg-zinc-900 rounded-lg h-1"
                />
                <span className="text-xs font-mono text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md">{primaryFormasCount}</span>
              </div>
              {selectedPrimary.origin === 'kuva_tenet' && (
                <div className="text-[10px] text-emerald-400 font-mono">
                  ★ โบนัสอาวุธระดับพิเศษ: เพิ่มความแรงพื้นฐานขึ้นอีก +{finalPrimary.kuvaBonusPercent}%!
                </div>
              )}
            </div>

            {/* Incarnon evolution activator */}
            <div className="space-y-2 border-t md:border-t-0 md:border-l border-zinc-850 md:pl-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-zinc-300 flex items-center gap-1">
                  <Sparkles size={14} className="text-fuchsia-400" />
                  <span>ระบบวิวัฒนาการ Incarnon (Evolution Mod)</span>
                </span>
                {selectedPrimary.isIncarnon ? (
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-fuchsia-500/20 text-fuchsia-400 font-mono font-bold border border-fuchsia-500/30 animate-pulse">AVAILABLE</span>
                ) : (
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500 font-mono">NOT AVAILABLE</span>
                )}
              </div>
              <p className="text-[10px] text-zinc-500">ติ๊กเปิดใช้งานร่างพลังมหาศาลเพื่อเพิ่มโอกาสคริติคอลแบนราบ +10% และสถานะผิดปกติ +20% ให้กับปืนของคุณ</p>
              
              <label className="flex items-center gap-2 mt-3 cursor-pointer select-none bg-zinc-950/40 p-2 border border-zinc-800 rounded-lg hover:border-fuchsia-500/40 transition-colors">
                <input
                  type="checkbox"
                  disabled={!selectedPrimary.isIncarnon}
                  checked={isPrimaryIncarnon && selectedPrimary.isIncarnon}
                  onChange={(e) => onIsPrimaryIncarnonChange(e.target.checked)}
                  className="rounded border-zinc-800 bg-zinc-950 text-fuchsia-500 focus:ring-0"
                />
                <span className={`text-xs ${selectedPrimary.isIncarnon ? 'text-zinc-200' : 'text-zinc-600 font-mono'}`}>
                  เปิดโหมดร่างสถิตวิวัฒนาการ (Activate Incarnon Form)
                </span>
              </label>
            </div>
          </div>

          {/* Slots layout container */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Stats display panel */}
            {renderCalculatedStatsPanel(finalPrimary, 'ปืนหลัก', getCapacityUsed(primaryMods, primaryPolarities) + (primaryExilusMod ? 9 : 0))}

            {/* Mod Slots Grid */}
            <div className="lg:col-span-8 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono">Mod slots & polarities (คลิกเพื่อติดตั้ง):</span>
                <span className="text-[10px] text-zinc-400">สล็อตที่มี Polarity ลดความจุลง 50%</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {primaryMods.map((mod, idx) => {
                  const pol = primaryPolarities[idx] || 'None';
                  return (
                    <div key={idx} className="relative group">
                      {/* Polarity selector inline badge */}
                      <select
                        value={pol}
                        onChange={(e) => onPrimaryPolarityChange(idx, e.target.value as Polarity)}
                        className="absolute top-1 left-1 z-20 bg-zinc-950 border border-zinc-800 text-[8px] rounded px-1 text-zinc-400 font-mono focus:outline-none opacity-80 group-hover:opacity-100 cursor-pointer"
                        title="คลิกเปลี่ยนขั้วการ์ด Polarity ของสล็อตนี้"
                      >
                        <option value="None">None</option>
                        <option value="Madurai">Madurai (🗲)</option>
                        <option value="Vazarin">Vazarin (⛨)</option>
                        <option value="Naramon">Naramon (-)</option>
                        <option value="Zenurik">Zenurik (=)</option>
                        <option value="Umbra">Umbra (🕀)</option>
                      </select>

                      <div
                        onClick={() => handleSlotClick('primary', idx)}
                        className={`h-24 rounded-xl border border-dashed flex flex-col justify-between p-2.5 transition-all cursor-pointer relative overflow-hidden select-none ${
                          mod 
                            ? getRarityClass(mod.rarity) + ' border-solid border-2 hover:brightness-110 shadow-md' 
                            : 'border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/10'
                        }`}
                      >
                        {mod ? (
                          <>
                            <div className="flex justify-between items-start pt-3">
                              <span className="text-[10px] font-bold line-clamp-1 break-all pr-2">{mod.name}</span>
                              <span className="text-[10px] font-mono font-bold bg-zinc-950/60 px-1 rounded">
                                {pol !== 'None' ? Math.ceil(mod.cost / 2) : mod.cost}
                              </span>
                            </div>
                            <span className="text-[8px] text-zinc-400 line-clamp-2 leading-relaxed mt-1">{mod.description}</span>
                            <div className="flex justify-between items-center text-[8px] font-mono text-zinc-500 mt-1">
                              <span>RANK {mod.maxRank}</span>
                              <button
                                onClick={(e) => { e.stopPropagation(); onPrimaryModChange(idx, null); }}
                                className="text-zinc-600 hover:text-red-400 p-0.5 rounded transition-all"
                                title="ถอดออก"
                              >
                                <X size={10} />
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="m-auto flex flex-col items-center text-zinc-600">
                            <Plus size={16} />
                            <span className="text-[8px] font-mono mt-1">SLOT {idx+1}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Primary weapon Arcane and Exilus custom slots */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-3 border-t border-zinc-800/60">
                {/* Exilus Mod Slot */}
                <div className="bg-zinc-950/40 p-3 rounded-xl border border-zinc-800 flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono block">Primary Exilus Slot</span>
                    <button
                      type="button"
                      onClick={() => handleSlotClick('primary_exilus', 0)}
                      className={`text-xs font-bold text-left line-clamp-1 ${primaryExilusMod ? 'text-amber-400' : 'text-zinc-500'}`}
                    >
                      {primaryExilusMod ? `★ ${primaryExilusMod.name}` : '+ ติดตั้งช่องทางด่วน Exilus...'}
                    </button>
                    {primaryExilusMod && (
                      <p className="text-[8px] text-zinc-500 line-clamp-1">{primaryExilusMod.description}</p>
                    )}
                  </div>
                  {primaryExilusMod && (
                    <button
                      onClick={() => onPrimaryExilusModChange(null)}
                      className="text-zinc-600 hover:text-red-400 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Arcane Slot */}
                <div className="bg-zinc-950/40 p-3 rounded-xl border border-zinc-800 flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono block">Primary Arcane Slot</span>
                    <button
                      type="button"
                      onClick={() => handleSlotClick('primary_arcane', 0)}
                      className={`text-xs font-bold text-left line-clamp-1 ${primaryArcane ? 'text-cyan-400' : 'text-zinc-500'}`}
                    >
                      {primaryArcane ? `♦ ${primaryArcane.name}` : '+ ติดตั้งอะเวคอาร์เคนอาวุธ...'}
                    </button>
                    {primaryArcane && (
                      <p className="text-[8px] text-zinc-500 line-clamp-1">{primaryArcane.effect}</p>
                    )}
                  </div>
                  {primaryArcane && (
                    <button
                      onClick={() => onPrimaryArcaneChange(null)}
                      className="text-zinc-600 hover:text-red-400 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 2. SECONDARY WEAPON PANEL */}
      {selectedTab === 'secondary' && (
        <div className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-2xl space-y-4 shadow-lg animate-fadeIn">
          {/* Header & controls */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                <Target size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-100">ปืนรอง (Secondary Weapons Setup)</h3>
                <p className="text-[10px] text-zinc-500">ปรับแต่ง Polarity, Exilus, ระดับ Kuva และเปิดใช้งานการวิวัฒนาการ Incarnon ได้อย่างละเอียด</p>
              </div>
            </div>

            {/* Origin weapon filtering */}
            <div className="flex flex-wrap items-center gap-2 bg-zinc-950/80 p-1.5 rounded-xl border border-zinc-800/80">
              <span className="text-[10px] uppercase font-bold text-zinc-500 px-2 font-mono">กรองปืน:</span>
              {[
                { id: 'all', label: 'ทั้งหมด' },
                { id: 'normal', label: 'ทั่วไป' },
                { id: 'fortuna', label: 'Fortuna Kitgun' },
                { id: 'kuva_tenet', label: 'Kuva / Tenet' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setOriginFilter(opt.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${
                    originFilter === opt.id ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Weapon Select */}
            <div className="flex items-center gap-2">
              <label className="text-[10px] font-bold text-zinc-500 font-mono">อาวุธ:</label>
              <select
                value={secondaryWeaponId}
                onChange={(e) => onSecondaryWeaponChange(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono px-3 py-1.5 text-zinc-300 focus:outline-none"
              >
                {filteredWeaponsForSelect('secondary').map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sub Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-950/60 p-4 rounded-xl border border-zinc-850">
            {/* Level scaling indicator */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-zinc-300 flex items-center gap-1">
                  <Zap size={14} className="text-cyan-400" />
                  <span>ระดับ Forma และเลเวลปืนรอง (Kuva / Tenet Bonus)</span>
                </span>
                <span className="text-xs font-mono font-bold text-cyan-400">เลเวลสูงสุด {finalSecondary.maxLevel}</span>
              </div>
              <p className="text-[10px] text-zinc-500">เพิ่มเลเวลสูงสุดของปืนรองชนิดพิเศษได้ถึง 40 เพื่อเพิ่มดาเมจขึ้น +2% ต่อเลเวล</p>
              
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-zinc-400">จำนวน Forma:</span>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={secondaryFormasCount}
                  onChange={(e) => onSecondaryFormasCountChange(parseInt(e.target.value))}
                  className="accent-amber-500 flex-1 bg-zinc-900 rounded-lg h-1"
                />
                <span className="text-xs font-mono text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md">{secondaryFormasCount}</span>
              </div>
            </div>

            {/* Incarnon evolution */}
            <div className="space-y-2 border-t md:border-t-0 md:border-l border-zinc-850 md:pl-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-zinc-300 flex items-center gap-1">
                  <Sparkles size={14} className="text-fuchsia-400" />
                  <span>ร่างวิวัฒนาการ Incarnon (Secondary Evolution)</span>
                </span>
                {selectedSecondary.isIncarnon ? (
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-fuchsia-500/20 text-fuchsia-400 font-mono font-bold border border-fuchsia-500/30">AVAILABLE</span>
                ) : (
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500 font-mono">NOT AVAILABLE</span>
                )}
              </div>
              <p className="text-[10px] text-zinc-500">ติ๊กเปิดใช้งานเพื่อแฝงพลังเวทลึกลับ ดึงสถานะคริติคอลและสถานะผิดปกติเพิ่มขึ้นแบนราบทันที</p>
              
              <label className="flex items-center gap-2 mt-3 cursor-pointer select-none bg-zinc-950/40 p-2 border border-zinc-800 rounded-lg hover:border-fuchsia-500/40 transition-colors">
                <input
                  type="checkbox"
                  disabled={!selectedSecondary.isIncarnon}
                  checked={isSecondaryIncarnon && selectedSecondary.isIncarnon}
                  onChange={(e) => onIsSecondaryIncarnonChange(e.target.checked)}
                  className="rounded border-zinc-800 bg-zinc-950 text-fuchsia-500 focus:ring-0"
                />
                <span className={`text-xs ${selectedSecondary.isIncarnon ? 'text-zinc-200' : 'text-zinc-600 font-mono'}`}>
                  เปิดโหมดร่างสถิตวิวัฒนาการ (Activate Incarnon Form)
                </span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Stats display panel */}
            {renderCalculatedStatsPanel(finalSecondary, 'ปืนรอง', getCapacityUsed(secondaryMods, secondaryPolarities) + (secondaryExilusMod ? 9 : 0))}

            {/* Mod Slots Grid */}
            <div className="lg:col-span-8 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono">Mod slots & polarities:</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {secondaryMods.map((mod, idx) => {
                  const pol = secondaryPolarities[idx] || 'None';
                  return (
                    <div key={idx} className="relative group">
                      <select
                        value={pol}
                        onChange={(e) => onSecondaryPolarityChange(idx, e.target.value as Polarity)}
                        className="absolute top-1 left-1 z-20 bg-zinc-950 border border-zinc-800 text-[8px] rounded px-1 text-zinc-400 font-mono focus:outline-none opacity-80 group-hover:opacity-100 cursor-pointer"
                        title="คลิกเปลี่ยนขั้วการ์ด Polarity ของสล็อตนี้"
                      >
                        <option value="None">None</option>
                        <option value="Madurai">Madurai (🗲)</option>
                        <option value="Vazarin">Vazarin (⛨)</option>
                        <option value="Naramon">Naramon (-)</option>
                        <option value="Zenurik">Zenurik (=)</option>
                        <option value="Umbra">Umbra (🕀)</option>
                      </select>

                      <div
                        onClick={() => handleSlotClick('secondary', idx)}
                        className={`h-24 rounded-xl border border-dashed flex flex-col justify-between p-2.5 transition-all cursor-pointer relative overflow-hidden select-none ${
                          mod 
                            ? getRarityClass(mod.rarity) + ' border-solid border-2 hover:brightness-110 shadow-md' 
                            : 'border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/10'
                        }`}
                      >
                        {mod ? (
                          <>
                            <div className="flex justify-between items-start pt-3">
                              <span className="text-[10px] font-bold line-clamp-1 pr-2">{mod.name}</span>
                              <span className="text-[10px] font-mono font-bold bg-zinc-950/60 px-1 rounded">
                                {pol !== 'None' ? Math.ceil(mod.cost / 2) : mod.cost}
                              </span>
                            </div>
                            <span className="text-[8px] text-zinc-400 line-clamp-2 leading-relaxed mt-1">{mod.description}</span>
                            <div className="flex justify-between items-center text-[8px] font-mono text-zinc-500 mt-1">
                              <span>RANK {mod.maxRank}</span>
                              <button
                                onClick={(e) => { e.stopPropagation(); onSecondaryModChange(idx, null); }}
                                className="text-zinc-600 hover:text-red-400 p-0.5 rounded transition-all"
                              >
                                <X size={10} />
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="m-auto flex flex-col items-center text-zinc-600">
                            <Plus size={16} />
                            <span className="text-[8px] font-mono mt-1">SLOT {idx+1}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Secondary Arcane & Exilus Slots */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-3 border-t border-zinc-800/60">
                {/* Exilus Slot */}
                <div className="bg-zinc-950/40 p-3 rounded-xl border border-zinc-800 flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono block">Secondary Exilus Slot</span>
                    <button
                      type="button"
                      onClick={() => handleSlotClick('secondary_exilus', 0)}
                      className={`text-xs font-bold text-left line-clamp-1 ${secondaryExilusMod ? 'text-amber-400' : 'text-zinc-500'}`}
                    >
                      {secondaryExilusMod ? `★ ${secondaryExilusMod.name}` : '+ ติดตั้งช่องทางด่วน Exilus...'}
                    </button>
                  </div>
                  {secondaryExilusMod && (
                    <button onClick={() => onSecondaryExilusModChange(null)} className="text-zinc-600 hover:text-red-400"><X size={14} /></button>
                  )}
                </div>

                {/* Arcane Slot */}
                <div className="bg-zinc-950/40 p-3 rounded-xl border border-zinc-800 flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono block">Secondary Arcane Slot</span>
                    <button
                      type="button"
                      onClick={() => handleSlotClick('secondary_arcane', 0)}
                      className={`text-xs font-bold text-left line-clamp-1 ${secondaryArcane ? 'text-cyan-400' : 'text-zinc-500'}`}
                    >
                      {secondaryArcane ? `♦ ${secondaryArcane.name}` : '+ ติดตั้งอะเวคอาร์เคนอาวุธ...'}
                    </button>
                  </div>
                  {secondaryArcane && (
                    <button onClick={() => onSecondaryArcaneChange(null)} className="text-zinc-600 hover:text-red-400"><X size={14} /></button>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 3. MELEE WEAPON PANEL */}
      {selectedTab === 'melee' && (
        <div className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-2xl space-y-4 shadow-lg animate-fadeIn">
          {/* Header & Controls */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                <Target size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-100">อาวุธประชิด (Melee Weapons Setup)</h3>
                <p className="text-[10px] text-zinc-500">ปรับแต่ง Polarity, Exilus, ท่าคอมโบ Melee Stance และระดับเลเวล Forma ได้ครบวงจร</p>
              </div>
            </div>

            {/* Weapon Select */}
            <div className="flex items-center gap-2">
              <label className="text-[10px] font-bold text-zinc-500 font-mono">อาวุธ:</label>
              <select
                value={meleeWeaponId}
                onChange={(e) => onMeleeWeaponChange(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono px-3 py-1.5 text-zinc-300 focus:outline-none"
              >
                {WEAPONS.filter(w => w.type === 'melee').map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Stance and Forma selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-950/60 p-4 rounded-xl border border-zinc-850">
            {/* Forma slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-zinc-300 flex items-center gap-1">
                  <Zap size={14} className="text-cyan-400" />
                  <span>ระดับเลเวลอาวุธประชิด (Melee Forma Bonus)</span>
                </span>
                <span className="text-xs font-mono font-bold text-cyan-400">เลเวลสูงสุด {finalMelee.maxLevel}</span>
              </div>
              <p className="text-[10px] text-zinc-500">เพิ่มเลเวลสูงสุดของดาบหรืออาวุธประชิดเพื่อขยายความจุโมด</p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-zinc-400">จำนวน Forma:</span>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={meleeFormasCount}
                  onChange={(e) => onMeleeFormasCountChange(parseInt(e.target.value))}
                  className="accent-amber-500 flex-1 bg-zinc-900 rounded-lg h-1"
                />
                <span className="text-xs font-mono text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md">{meleeFormasCount}</span>
              </div>
            </div>

            {/* Melee Stance Slot (Adds capacity like aura) */}
            <div className="bg-zinc-950/40 p-3 rounded-xl border border-zinc-800 flex items-center justify-between gap-3">
              <div className="flex-1">
                <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest font-mono block">ดาบคอมโบ (Melee Stance Slot)</span>
                <button
                  type="button"
                  onClick={() => handleSlotClick('melee_stance', 0)}
                  className={`text-xs font-bold text-left line-clamp-1 ${meleeStanceMod ? 'text-amber-400' : 'text-zinc-500'}`}
                >
                  {meleeStanceMod ? `☄ ${meleeStanceMod.name}` : '+ ติดตั้งท่าคอมโบคอมมูนิตี้ Stance...'}
                </button>
                <p className="text-[8px] text-zinc-500">
                  {meleeStanceMod ? meleeStanceMod.description : 'การติดตั้งท่าคอมโบที่เหมาะสมจะช่วย "เพิ่ม" ความจุสูงสุดของการ์ดโมดได้ถึง +10!'}
                </p>
              </div>
              {meleeStanceMod && (
                <button onClick={() => onMeleeStanceModChange(null)} className="text-zinc-600 hover:text-red-400"><X size={14} /></button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Stats */}
            {renderCalculatedStatsPanel(finalMelee, 'ประชิด', getCapacityUsed(meleeMods, meleePolarities))}

            {/* Mod slots */}
            <div className="lg:col-span-8 space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {meleeMods.map((mod, idx) => {
                  const pol = meleePolarities[idx] || 'None';
                  return (
                    <div key={idx} className="relative group">
                      <select
                        value={pol}
                        onChange={(e) => onMeleePolarityChange(idx, e.target.value as Polarity)}
                        className="absolute top-1 left-1 z-20 bg-zinc-950 border border-zinc-800 text-[8px] rounded px-1 text-zinc-400 font-mono focus:outline-none opacity-80 group-hover:opacity-100 cursor-pointer"
                      >
                        <option value="None">None</option>
                        <option value="Madurai">Madurai (🗲)</option>
                        <option value="Vazarin">Vazarin (⛨)</option>
                        <option value="Naramon">Naramon (-)</option>
                        <option value="Zenurik">Zenurik (=)</option>
                        <option value="Umbra">Umbra (🕀)</option>
                      </select>

                      <div
                        onClick={() => handleSlotClick('melee', idx)}
                        className={`h-24 rounded-xl border border-dashed flex flex-col justify-between p-2.5 transition-all cursor-pointer relative overflow-hidden select-none ${
                          mod 
                            ? getRarityClass(mod.rarity) + ' border-solid border-2 hover:brightness-110 shadow-md' 
                            : 'border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/10'
                        }`}
                      >
                        {mod ? (
                          <>
                            <div className="flex justify-between items-start pt-3">
                              <span className="text-[10px] font-bold line-clamp-1 pr-2">{mod.name}</span>
                              <span className="text-[10px] font-mono font-bold bg-zinc-950/60 px-1 rounded">
                                {pol !== 'None' ? Math.ceil(mod.cost / 2) : mod.cost}
                              </span>
                            </div>
                            <span className="text-[8px] text-zinc-400 line-clamp-2 leading-relaxed mt-1">{mod.description}</span>
                            <div className="flex justify-between items-center text-[8px] font-mono text-zinc-500 mt-1">
                              <span>RANK {mod.maxRank}</span>
                              <button
                                onClick={(e) => { e.stopPropagation(); onMeleeModChange(idx, null); }}
                                className="text-zinc-600 hover:text-red-400 p-0.5 rounded transition-all"
                              >
                                <X size={10} />
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="m-auto flex flex-col items-center text-zinc-600">
                            <Plus size={16} />
                            <span className="text-[8px] font-mono mt-1">SLOT {idx+1}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Melee Exilus & Melee Arcanes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-3 border-t border-zinc-800/60">
                <div className="bg-zinc-950/40 p-3 rounded-xl border border-zinc-800 flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono block">Melee Exilus Slot</span>
                    <button
                      type="button"
                      onClick={() => handleSlotClick('melee_exilus', 0)}
                      className={`text-xs font-bold text-left line-clamp-1 ${meleeExilusMod ? 'text-amber-400' : 'text-zinc-500'}`}
                    >
                      {meleeExilusMod ? `★ ${meleeExilusMod.name}` : '+ ติดตั้งช่องทางด่วน Exilus...'}
                    </button>
                  </div>
                  {meleeExilusMod && (
                    <button onClick={() => onMeleeExilusModChange(null)} className="text-zinc-600 hover:text-red-400"><X size={14} /></button>
                  )}
                </div>

                <div className="bg-zinc-950/40 p-3 rounded-xl border border-zinc-800 flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono block">Melee Arcane Slot</span>
                    <button
                      type="button"
                      onClick={() => handleSlotClick('melee_arcane', 0)}
                      className={`text-xs font-bold text-left line-clamp-1 ${meleeArcane ? 'text-cyan-400' : 'text-zinc-500'}`}
                    >
                      {meleeArcane ? `♦ ${meleeArcane.name}` : '+ ติดตั้งอะเวคอาร์เคนประชิด Melee...'}
                    </button>
                  </div>
                  {meleeArcane && (
                    <button onClick={() => onMeleeArcaneChange(null)} className="text-zinc-600 hover:text-red-400"><X size={14} /></button>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 4. COMPANION PANEL */}
      {selectedTab === 'companion' && (
        <div className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-2xl space-y-4 shadow-lg animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-850 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400">
                <Compass size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-100">สัตว์เลี้ยงและผู้ช่วยต่อสู้ (Companion Setup)</h3>
                <p className="text-[10px] text-zinc-500">ติดตั้งการ์ดความอยู่รอด, พ่นควันพิษ, หรือโมดสนับสนุนชีวิต</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-mono text-zinc-500">เลือกสัตว์เลี้ยง:</label>
              <select
                value={companionId}
                onChange={(e) => onCompanionChange(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono px-3 py-1.5 text-zinc-300 focus:outline-none"
              >
                {COMPANIONS.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Stats display */}
            <div className="lg:col-span-4 bg-zinc-950/80 p-4 rounded-xl border border-zinc-850 font-mono text-xs space-y-2">
              <div className="text-[10px] text-zinc-500 font-bold border-b border-zinc-800 pb-1.5 uppercase">Companion Health</div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-400">Health (พลังชีวิต)</span>
                <span className="text-zinc-100 font-bold">{finalCompanion.health}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-400">Shield (โล่ป้องกัน)</span>
                <span className="text-zinc-100 font-bold">{finalCompanion.shield}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-400">Armor (เกราะเหล็ก)</span>
                <span className="text-zinc-100 font-bold">{finalCompanion.armor}</span>
              </div>
            </div>

            {/* Mod slots */}
            <div className="lg:col-span-8 space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {companionMods.map((mod, idx) => {
                  const pol = companionPolarities[idx] || 'None';
                  return (
                    <div key={idx} className="relative group">
                      <select
                        value={pol}
                        onChange={(e) => onCompanionPolarityChange(idx, e.target.value as Polarity)}
                        className="absolute top-1 left-1 z-20 bg-zinc-950 border border-zinc-800 text-[8px] rounded px-1 text-zinc-400 font-mono focus:outline-none opacity-80 group-hover:opacity-100 cursor-pointer"
                      >
                        <option value="None">None</option>
                        <option value="Madurai">Madurai (🗲)</option>
                        <option value="Vazarin">Vazarin (⛨)</option>
                        <option value="Naramon">Naramon (-)</option>
                        <option value="Zenurik">Zenurik (=)</option>
                        <option value="Umbra">Umbra (🕀)</option>
                      </select>

                      <div
                        onClick={() => handleSlotClick('companion', idx)}
                        className={`h-24 rounded-xl border border-dashed flex flex-col justify-between p-2.5 transition-all cursor-pointer relative overflow-hidden select-none ${
                          mod 
                            ? getRarityClass(mod.rarity) + ' border-solid border-2 hover:brightness-110 shadow-md' 
                            : 'border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/10'
                        }`}
                      >
                        {mod ? (
                          <>
                            <div className="flex justify-between items-start pt-3">
                              <span className="text-[10px] font-bold line-clamp-1 pr-2">{mod.name}</span>
                              <span className="text-[10px] font-mono font-bold bg-zinc-950/60 px-1 rounded">
                                {pol !== 'None' ? Math.ceil(mod.cost / 2) : mod.cost}
                              </span>
                            </div>
                            <span className="text-[8px] text-zinc-400 line-clamp-2 leading-relaxed mt-1">{mod.description}</span>
                            <div className="flex justify-between items-center text-[8px] font-mono text-zinc-500 mt-1">
                              <span>RANK {mod.maxRank}</span>
                              <button
                                onClick={(e) => { e.stopPropagation(); onCompanionModChange(idx, null); }}
                                className="text-zinc-600 hover:text-red-400 p-0.5 rounded transition-all"
                              >
                                <X size={10} />
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="m-auto flex flex-col items-center text-zinc-600">
                            <Plus size={16} />
                            <span className="text-[8px] font-mono mt-1">SLOT {idx+1}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 5. COMPANION WEAPON PANEL */}
      {selectedTab === 'companion_weapon' && (
        <div className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-2xl space-y-4 shadow-lg animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-850 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Compass size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-100">อาวุธสหายคู่หู (Companion Weapon Setup)</h3>
                <p className="text-[10px] text-zinc-500">ติดตั้งปืนออโตเลเซอร์, ปืนน้ำแข็งสโลว์มอน, หรือกรงเล็บสัตว์เลี้ยงแมว</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-mono text-zinc-500">เลือกอาวุธคู่หู:</label>
              <select
                value={companionWeaponId}
                onChange={(e) => onCompanionWeaponChange(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono px-3 py-1.5 text-zinc-300 focus:outline-none"
              >
                {WEAPONS.filter(w => w.type === 'companion_weapon').map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Stats display */}
            <div className="lg:col-span-4 bg-zinc-950/80 p-4 rounded-xl border border-zinc-850 font-mono text-xs space-y-2">
              <div className="text-[10px] text-zinc-500 font-bold border-b border-zinc-800 pb-1.5 uppercase">Companion Weapon Stats</div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-400">Damage (พลังโจมตี)</span>
                <span className="text-zinc-100 font-bold">{finalCompanionWeapon.damage}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-400">Critical Chance</span>
                <span className="text-zinc-100 font-bold">{finalCompanionWeapon.critChance}%</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-400">Crit Multiplier</span>
                <span className="text-zinc-100 font-bold">{finalCompanionWeapon.critMultiplier}x</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-400">Status Chance</span>
                <span className="text-zinc-100 font-bold">{finalCompanionWeapon.statusChance}%</span>
              </div>
            </div>

            {/* Mod slots */}
            <div className="lg:col-span-8 space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {companionWeaponMods.map((mod, idx) => {
                  const pol = companionWeaponPolarities[idx] || 'None';
                  return (
                    <div key={idx} className="relative group">
                      <select
                        value={pol}
                        onChange={(e) => onCompanionWeaponPolarityChange(idx, e.target.value as Polarity)}
                        className="absolute top-1 left-1 z-20 bg-zinc-950 border border-zinc-800 text-[8px] rounded px-1 text-zinc-400 font-mono focus:outline-none opacity-80 group-hover:opacity-100 cursor-pointer"
                      >
                        <option value="None">None</option>
                        <option value="Madurai">Madurai (🗲)</option>
                        <option value="Vazarin">Vazarin (⛨)</option>
                        <option value="Naramon">Naramon (-)</option>
                        <option value="Zenurik">Zenurik (=)</option>
                        <option value="Umbra">Umbra (🕀)</option>
                      </select>

                      <div
                        onClick={() => handleSlotClick('companion_weapon', idx)}
                        className={`h-24 rounded-xl border border-dashed flex flex-col justify-between p-2.5 transition-all cursor-pointer relative overflow-hidden select-none ${
                          mod 
                            ? getRarityClass(mod.rarity) + ' border-solid border-2 hover:brightness-110 shadow-md' 
                            : 'border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/10'
                        }`}
                      >
                        {mod ? (
                          <>
                            <div className="flex justify-between items-start pt-3">
                              <span className="text-[10px] font-bold line-clamp-1 pr-2">{mod.name}</span>
                              <span className="text-[10px] font-mono font-bold bg-zinc-950/60 px-1 rounded">
                                {pol !== 'None' ? Math.ceil(mod.cost / 2) : mod.cost}
                              </span>
                            </div>
                            <span className="text-[8px] text-zinc-400 line-clamp-2 leading-relaxed mt-1">{mod.description}</span>
                            <div className="flex justify-between items-center text-[8px] font-mono text-zinc-500 mt-1">
                              <span>RANK {mod.maxRank}</span>
                              <button
                                onClick={(e) => { e.stopPropagation(); onCompanionWeaponModChange(idx, null); }}
                                className="text-zinc-600 hover:text-red-400 p-0.5 rounded transition-all"
                              >
                                <X size={10} />
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="m-auto flex flex-col items-center text-zinc-600">
                            <Plus size={16} />
                            <span className="text-[8px] font-mono mt-1">SLOT {idx+1}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}


      {/* 🎯 ADVANCED ENEMY COMBAT SANDBOX & DPS SIMULATOR PANEL */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 border border-amber-500/20 p-5 rounded-2xl space-y-6 shadow-2xl relative overflow-hidden">
        {/* Glow backdrop ambient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-500 text-zinc-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/15">
              <Crosshair size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-1.5">
                <span>🎯 ห้องทดลองจำลองพลังโจมตี (Advanced Combat Sandbox & DPS Simulator)</span>
              </h3>
              <p className="text-[10px] text-zinc-500">จำลองยิงกระสุนใส่เป้าหมาย Grineer, Corpus, Infested, Orokin เพื่อเปรียบเทียบค่าความเสียหายและเอฟเฟกต์ DoT</p>
            </div>
          </div>
          <div className="text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-500 px-3 py-1 rounded-xl font-mono">
            ACTIVE TARGET: Level {simEnemyLevel}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Target configuration controls */}
          <div className="lg:col-span-5 space-y-4">
            <div className="text-xs font-bold text-zinc-300 font-mono flex items-center gap-1.5 border-b border-zinc-800/50 pb-2">
              <Settings size={14} className="text-zinc-500" />
              <span>ปรับแต่งศัตรูทดลอง (Target Controls)</span>
            </div>

            {/* Target Type selectors */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-zinc-500 font-mono">ประเภทเป้าหมาย (Target Unit):</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'grineer_heavy', label: '🛡️ Grineer Heavy Gunner', desc: 'เกราะเหล็กสูงมาก' },
                  { id: 'corpus_tech', label: '🔋 Corpus Tech', desc: 'พลังโล่ป้องกันสูง' },
                  { id: 'infested_charger', label: '🐾 Infested Charger', desc: 'เลือดแดงล้วน ไม่มีเกราะ' },
                  { id: 'orokin_corrupted', label: '🌟 Corrupted Heavy', desc: 'เกราะ + โล่ป้องกัน' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSimEnemyType(opt.id as any)}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      simEnemyType === opt.id 
                        ? 'bg-amber-500/10 border-amber-500 text-amber-400' 
                        : 'bg-zinc-950 border-zinc-850 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <span className="text-xs font-bold">{opt.label}</span>
                    <span className="text-[8px] text-zinc-500 mt-0.5">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Level slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[10px] uppercase font-bold text-zinc-500 font-mono">เลเวลศัตรู (Enemy Level):</span>
                <span className="text-xs font-mono text-amber-400 font-bold">LV. {simEnemyLevel}</span>
              </div>
              <input
                type="range"
                min="1"
                max="200"
                value={simEnemyLevel}
                onChange={(e) => setSimEnemyLevel(parseInt(e.target.value))}
                className="accent-amber-500 w-full bg-zinc-950 border border-zinc-850 rounded-lg h-1.5 cursor-pointer"
              />
            </div>

            {/* 📈 Status Effects & Stacks */}
            <div className="p-3 bg-zinc-950/40 border border-zinc-850 rounded-xl space-y-3">
              <span className="text-[10px] uppercase font-bold text-amber-500 font-mono block">สแต็คสถานะผิดปกติ (Status Effect Stacks)</span>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-zinc-400 flex items-center gap-1">☣️ Viral (ไวรัส) Stacks:</span>
                  <span className="font-mono text-zinc-300 font-bold">{simViralStacks} / 10 ({simViralStacks > 0 ? `+${100 + (simViralStacks - 1) * 25}% Dmg` : '0%'})</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={simViralStacks}
                  onChange={(e) => setSimViralStacks(parseInt(e.target.value))}
                  className="accent-purple-500 w-full bg-zinc-950 border border-zinc-850 rounded-lg h-1 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-zinc-400 flex items-center gap-1">🧪 Corrosive (กัดกร่อน) Stacks:</span>
                  <span className="font-mono text-zinc-300 font-bold">{simCorrosiveStacks} / 10 ({simCorrosiveStacks > 0 ? `-${26 + (simCorrosiveStacks - 1) * 6}% Armor` : '0%'})</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={simCorrosiveStacks}
                  onChange={(e) => setSimCorrosiveStacks(parseInt(e.target.value))}
                  className="accent-green-500 w-full bg-zinc-950 border border-zinc-850 rounded-lg h-1 cursor-pointer"
                />
              </div>
            </div>

            {/* 🗡️ Melee & Sniper Combos */}
            <div className="p-3 bg-zinc-950/40 border border-zinc-850 rounded-xl space-y-3">
              <span className="text-[10px] uppercase font-bold text-amber-500 font-mono block">คอมโบเกจ (Combo Counters)</span>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-zinc-400">Melee Combo Multiplier:</span>
                  <span className="font-mono text-zinc-300 font-bold">x{simMeleeCombo} ({simMeleeCombo > 1 ? `Blood Rush +${(simMeleeCombo - 1) * 40}% Crit` : 'No Bonus'})</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={simMeleeCombo}
                  onChange={(e) => setSimMeleeCombo(parseInt(e.target.value))}
                  className="accent-amber-500 w-full bg-zinc-950 border border-zinc-850 rounded-lg h-1 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-zinc-400">Sniper Shot Combo:</span>
                  <span className="font-mono text-zinc-300 font-bold">Combo Level {simSniperCombo} ({1 + (simSniperCombo - 1) * 0.5}x Base Dmg)</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={simSniperCombo}
                  onChange={(e) => setSimSniperCombo(parseInt(e.target.value))}
                  className="accent-amber-500 w-full bg-zinc-950 border border-zinc-850 rounded-lg h-1 cursor-pointer"
                />
              </div>
            </div>

            {/* 🛡️ Overguard Settings */}
            <div className="p-3 bg-zinc-950/40 border border-zinc-850 rounded-xl space-y-2">
              <label className="flex items-center justify-between text-[11px] text-zinc-300 cursor-pointer">
                <span className="font-bold flex items-center gap-1">🛡️ เปิดใช้งาน Overguard:</span>
                <input
                  type="checkbox"
                  checked={simOverguardActive}
                  onChange={(e) => setSimOverguardActive(e.target.checked)}
                  className="rounded border-zinc-800 bg-zinc-950 text-amber-500 focus:ring-0"
                />
              </label>
              {simOverguardActive && (
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-zinc-500">Overguard Pool:</span>
                    <span className="text-blue-400 font-bold">{simOverguardValue}</span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="50000"
                    step="1000"
                    value={simOverguardValue}
                    onChange={(e) => setSimOverguardValue(parseInt(e.target.value))}
                    className="accent-blue-500 w-full bg-zinc-950 border border-zinc-850 rounded-lg h-1 cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Faction Damage (Bane Mods) */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-zinc-500 font-mono">การแพ้ทาง Faction (Bane of Faction Modifiers):</label>
              <select
                value={simFactionMod}
                onChange={(e) => setSimFactionMod(parseInt(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-amber-500"
              >
                <option value="0">None (ไม่ติดตั้งม็อด Faction)</option>
                <option value="30">Bane of Grineer / Corpus / Infested (+30%)</option>
                <option value="55">Primed Bane of Faction (+55% / x1.55 Multiplier)</option>
              </select>
            </div>

            {/* Core Toggles (Eximus, Headshot, Roar, Nourish, and specialized WF buffs) */}
            <div className="space-y-2 pt-2">
              <label className="text-[10px] uppercase font-bold text-zinc-500 font-mono block">บัฟเพิ่มเติม & ตัวคูณดาเมจ (Buffs & Modifiers):</label>
              
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center gap-2 p-2 bg-zinc-950/60 border border-zinc-850 rounded-xl cursor-pointer select-none hover:bg-zinc-950 transition-colors">
                  <input
                    type="checkbox"
                    checked={simIsEximus}
                    onChange={(e) => setSimIsEximus(e.target.checked)}
                    className="rounded border-zinc-800 bg-zinc-950 text-amber-500 focus:ring-0"
                  />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-zinc-200">Eximus Tier</span>
                    <span className="text-[8px] text-zinc-500">เลือด +300% & Overguard</span>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2 bg-zinc-950/60 border border-zinc-850 rounded-xl cursor-pointer select-none hover:bg-zinc-950 transition-colors">
                  <input
                    type="checkbox"
                    checked={simIsHeadshot}
                    onChange={(e) => setSimIsHeadshot(e.target.checked)}
                    className="rounded border-zinc-800 bg-zinc-950 text-amber-500 focus:ring-0"
                  />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-zinc-200">Headshot X2.0</span>
                    <span className="text-[8px] text-zinc-500">เล็งจุดอ่อนส่วนหัว</span>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2 bg-zinc-950/60 border border-zinc-850 rounded-xl cursor-pointer select-none hover:bg-zinc-950 transition-colors border-yellow-500/20">
                  <input
                    type="checkbox"
                    checked={simForceCrit}
                    onChange={(e) => setSimForceCrit(e.target.checked)}
                    className="rounded border-zinc-800 bg-zinc-950 text-yellow-500 focus:ring-0"
                  />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-yellow-400">แสดงดาเมจคริ (Crit)</span>
                    <span className="text-[8px] text-zinc-500">จำลองผลคริระดับสูงสุด</span>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2 bg-zinc-950/60 border border-zinc-850 rounded-xl cursor-pointer select-none hover:bg-zinc-950 transition-colors">
                  <input
                    type="checkbox"
                    checked={simStealthActive}
                    onChange={(e) => setSimStealthActive(e.target.checked)}
                    className="rounded border-zinc-800 bg-zinc-950 text-amber-500 focus:ring-0"
                  />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-zinc-200">Stealth Bonus (Melee)</span>
                    <span className="text-[8px] text-zinc-500">เพิ่มดาเมจฟันระยะประชิด 8.0x</span>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2 bg-zinc-950/60 border border-zinc-850 rounded-xl cursor-pointer select-none hover:bg-zinc-950 transition-colors">
                  <input
                    type="checkbox"
                    checked={simRhinoRoar}
                    onChange={(e) => setSimRhinoRoar(e.target.checked)}
                    className="rounded border-zinc-800 bg-zinc-950 text-amber-500 focus:ring-0"
                  />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-zinc-200">บัฟ Rhino Roar</span>
                    <span className="text-[8px] text-zinc-500">เพิ่มดาเมจสุทธิ +30%</span>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2 bg-zinc-950/60 border border-zinc-850 rounded-xl cursor-pointer select-none hover:bg-zinc-950 transition-colors">
                  <input
                    type="checkbox"
                    checked={simNourishActive}
                    onChange={(e) => setSimNourishActive(e.target.checked)}
                    className="rounded border-zinc-800 bg-zinc-950 text-amber-500 focus:ring-0"
                  />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-zinc-200">บัฟ Nourish</span>
                    <span className="text-[8px] text-zinc-500">เพิ่มดาเมจ Viral +75%</span>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2 bg-zinc-950/60 border border-zinc-850 rounded-xl cursor-pointer select-none hover:bg-zinc-950 transition-colors">
                  <input
                    type="checkbox"
                    checked={buffEclipse}
                    onChange={(e) => setBuffEclipse(e.target.checked)}
                    className="rounded border-zinc-800 bg-zinc-950 text-amber-500 focus:ring-0"
                  />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-zinc-200">Mirage Eclipse</span>
                    <span className="text-[8px] text-zinc-500">ตัวคูณดาเมจสุดท้าย x2.5</span>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2 bg-zinc-950/60 border border-zinc-850 rounded-xl cursor-pointer select-none hover:bg-zinc-950 transition-colors">
                  <input
                    type="checkbox"
                    checked={buffVexArmor}
                    onChange={(e) => setBuffVexArmor(e.target.checked)}
                    className="rounded border-zinc-800 bg-zinc-950 text-amber-500 focus:ring-0"
                  />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-zinc-200">Chroma Vex Armor</span>
                    <span className="text-[8px] text-zinc-500">เพิ่มดาเมจฐาน +250%</span>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2 bg-zinc-950/60 border border-zinc-850 rounded-xl cursor-pointer select-none hover:bg-zinc-950 transition-colors">
                  <input
                    type="checkbox"
                    checked={buffShield}
                    onChange={(e) => setBuffShield(e.target.checked)}
                    className="rounded border-zinc-800 bg-zinc-950 text-amber-500 focus:ring-0"
                  />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-zinc-200">Volt Shield</span>
                    <span className="text-[8px] text-zinc-500">คริแรงขึ้น +200% & ไฟฟ้า</span>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2 bg-zinc-950/60 border border-zinc-850 rounded-xl cursor-pointer select-none hover:bg-zinc-950 transition-colors">
                  <input
                    type="checkbox"
                    checked={buffSpeed}
                    onChange={(e) => setBuffSpeed(e.target.checked)}
                    className="rounded border-zinc-800 bg-zinc-950 text-amber-500 focus:ring-0"
                  />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-zinc-200">Volt Speed</span>
                    <span className="text-[8px] text-zinc-500">ความเร็วความถี่การยิง +50%</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* SIMULATION RESULTS PANEL */}
          <div className="lg:col-span-7 bg-zinc-950/80 p-5 rounded-2xl border border-zinc-850/80 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="text-xs font-bold text-zinc-300 font-mono flex items-center gap-1.5 border-b border-zinc-800/50 pb-2">
                <Swords size={14} className="text-amber-500" />
                <span>ผลการทดลองการยิงเป้าหมาย (Simulation Output)</span>
              </div>

              {/* Target Scaled stats breakdown */}
              <div className="grid grid-cols-4 gap-2 bg-zinc-900/40 p-3 rounded-xl border border-zinc-850 text-[11px] font-mono">
                <div className="space-y-0.5">
                  <span className="text-zinc-500 block">Scaled HP:</span>
                  <span className="text-red-400 font-bold">{simResult.scaledHealth}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-zinc-500 block">Scaled Armor:</span>
                  <span className="text-zinc-300 font-bold">{simResult.scaledArmor}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-zinc-500 block">Mitigation:</span>
                  <span className="text-amber-400 font-bold">{simResult.armorMitigationPercent}%</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-zinc-500 block">Overguard:</span>
                  <span className="text-blue-400 font-bold">{simResult.scaledOverguard}</span>
                </div>
              </div>

              {/* Multiplier status logs */}
              <div className="bg-zinc-900/20 border border-zinc-850 p-3 rounded-xl text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-500">ตัวคูณสถานะไวรัส (Viral Multiplier):</span>
                  <span className="text-purple-400 font-mono font-bold">x{simResult.viralMultiplier.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">หักล้างเกราะสถานะกัดกร่อน (Corrosive Strip):</span>
                  <span className="text-green-400 font-mono font-bold">-{Math.round(simResult.corrosiveStrip * 100)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">มัลติช็อตกระสุนพร้อมกัน (Multishot count):</span>
                  <span className="text-amber-400 font-mono font-bold">x{simResult.multishot.toFixed(2)}</span>
                </div>
                {simFactionMod > 0 && (
                  <div className="flex justify-between">
                    <span className="text-zinc-500">ม็อดทำลาย Faction (Bane Mod):</span>
                    <span className="text-blue-400 font-mono font-bold">x{(1 + simFactionMod/100).toFixed(2)} (DoT x{((1+simFactionMod/100)*(1+simFactionMod/100)).toFixed(2)})</span>
                  </div>
                )}
              </div>

              {/* Hits breakdown */}
              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400">ระดับคริติคอลสูงสุดที่ทำได้ (Crit Tier Roll):</span>
                  <span className={`font-mono font-bold ${simResult.critTierColor}`}>
                    {simResult.critTierText}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400">ความเสียหายสุทธิต่อนัด (Net Hit Damage):</span>
                  <span className="font-mono text-base font-bold text-emerald-400">
                    {simResult.damageDealtPerHit} ดาเมจ / นัด
                  </span>
                </div>

                {/* DoT display simulation */}
                <div className="flex justify-between items-center text-xs border-t border-dashed border-zinc-850 pt-2">
                  <span className="text-zinc-400 flex items-center gap-1">
                    <Flame size={12} className="text-orange-500" />
                    <span>ดาเมจ Slash DoT (Tick/วินาที):</span>
                  </span>
                  <span className="font-mono font-bold text-orange-400">
                    ~{simResult.simulatedSlashDoT} / วินาที
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400 flex items-center gap-1">
                    <Flame size={12} className="text-red-500 animate-pulse" />
                    <span>ดาเมจ Heat DoT (Proc Stack):</span>
                  </span>
                  <span className="font-mono font-bold text-red-400">
                    ~{simResult.simulatedHeatDoT} / วินาที
                  </span>
                </div>
              </div>
            </div>

            {/* MASSIVE GLOWING DPS SCORE BADGE */}
            <div className="mt-6 pt-5 border-t border-zinc-850/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono block">Simulated Final DPS Rating</span>
                <p className="text-xs text-zinc-400">คำนวณอัตราการยิงต่อวินาที, โอกาสคริ, ตัวคูณคริ และหัวนัด</p>
              </div>

              <div className="px-6 py-3.5 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-2xl flex flex-col items-center justify-center shadow-lg shadow-emerald-500/5 min-w-[200px]">
                <span className="text-[10px] text-emerald-400 font-mono font-bold tracking-widest">DPS SIMULATED</span>
                <span className="text-2xl font-black text-emerald-400 font-mono mt-0.5 animate-pulse">
                  {simResult.simulatedDPS.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 📘 LIVE 22-FORMULA MATHEMATICAL SHEET & MATH INSPECTOR */}
        <div className="border-t border-zinc-800/80 pt-5 mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-yellow-400" />
              <span className="text-xs font-bold text-zinc-300 font-mono">แผ่นคู่มือและสูตรคำนวณ 22 สูตร (Live mathematical proof of Warframe formulas)</span>
            </div>
            <button
              onClick={() => setSimShowFormulaSheet(!simShowFormulaSheet)}
              className="text-[10px] bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1 rounded-xl transition-all"
            >
              {simShowFormulaSheet ? '🙈 ซ่อนคู่มือสูตร' : '📖 แสดงคู่มือสูตรคำนวณ (22 สูตร)'}
            </button>
          </div>

          {simShowFormulaSheet && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              
              {/* Formula 1 */}
              <div className="p-3.5 bg-zinc-950/80 border border-zinc-850 rounded-xl space-y-1.5 hover:border-amber-500/15 transition-all text-xs">
                <div className="flex justify-between text-zinc-200 font-bold">
                  <span>1. Damage 3.0 + Stacking Rules</span>
                  <span className="text-amber-400 text-[10px] font-mono">ACTIVE</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  ม็อดความเสียหายแบบบวก (เช่น Serration) จะคำนวณทับรวมกันเป็นกลุ่ม ก่อนนำไปรวมกับบัฟระดับสุทธิแยกกลุ่มอื่น ๆ
                </p>
                <div className="p-2 bg-zinc-900 rounded font-mono text-[10px] text-emerald-400 space-y-1">
                  <div>Formula: Base * (1 + Additive Mod + Vex Armor) * (1 + Roar)</div>
                  <div className="text-zinc-500">Live: {(simResult.activeWfStats?.baseStats?.damage || 0)} * (1 + mod) = {(simResult.activeWfStats?.moddedPhysicalDamage || 0).toFixed(1)}</div>
                </div>
              </div>

              {/* Formula 2 */}
              <div className="p-3.5 bg-zinc-950/80 border border-zinc-850 rounded-xl space-y-1.5 hover:border-amber-500/15 transition-all text-xs">
                <div className="flex justify-between text-zinc-200 font-bold">
                  <span>2. Quantization (1/32 rounding)</span>
                  <span className="text-zinc-500 text-[10px] font-mono">SIMULATED</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  ระบบเกม Warframe จะทำการปัดเศษดาเมจย่อยออกเป็น 1/32 เพื่อรักษาประสิทธิภาพหน่วยความจำในรันไทม์
                </p>
                <div className="p-2 bg-zinc-900 rounded font-mono text-[10px] text-emerald-400 space-y-1">
                  <div>Quantum value: Math.round(Damage * 32) / 32</div>
                  <div className="text-zinc-500">เศษปัดความเที่ยงตรงสูงในระบบคำนวณฐานข้อมูล</div>
                </div>
              </div>

              {/* Formula 3 */}
              <div className="p-3.5 bg-zinc-950/80 border border-zinc-850 rounded-xl space-y-1.5 hover:border-amber-500/15 transition-all text-xs">
                <div className="flex justify-between text-zinc-200 font-bold">
                  <span>3. Modded Stats พื้นฐาน</span>
                  <span className="text-amber-400 text-[10px] font-mono">ACTIVE</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  คำนวณค่าคริ, อัตรายิง, สถานะ โดยคิดอิงจากค่าฐานของอาวุธนั้น ๆ รวมกับรูปแบบคูณจากม็อดที่ติดตั้ง
                </p>
                <div className="p-2 bg-zinc-900 rounded font-mono text-[10px] text-emerald-400 space-y-1">
                  <div>Stat = Base * (1 + ModPercent / 100)</div>
                  <div className="text-zinc-500">Live Crit Chance: {simResult.activeWfStats.critChance}% | Status: {simResult.activeWfStats.statusChance}%</div>
                </div>
              </div>

              {/* Formula 4 */}
              <div className="p-3.5 bg-zinc-950/80 border border-zinc-850 rounded-xl space-y-1.5 hover:border-amber-500/15 transition-all text-xs">
                <div className="flex justify-between text-zinc-200 font-bold">
                  <span>4. Total Weapon Damage (Arsenal)</span>
                  <span className="text-amber-400 text-[10px] font-mono">ACTIVE</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  ความเสียหายรวมที่แสดงในหน้าต่างคลังแสง (Arsenal) เกิดจากการนำความเสียหายกายภาพบวกรวมกับความเสียหายธาตุทั้งหมด
                </p>
                <div className="p-2 bg-zinc-900 rounded font-mono text-[10px] text-emerald-400 space-y-1">
                  <div>Arsenal Dmg = Physical + Elemental Dmg</div>
                  <div className="text-zinc-500">Live Arsenal Total: {Math.round((simResult.activeWfStats?.moddedPhysicalDamage || 0) + (simResult.activeWfStats?.elements || []).reduce((a:any, b:any) => a + (b.damage || 0), 0))} ดาเมจ</div>
                </div>
              </div>

              {/* Formula 5 */}
              <div className="p-3.5 bg-zinc-950/80 border border-zinc-850 rounded-xl space-y-1.5 hover:border-amber-500/15 transition-all text-xs">
                <div className="flex justify-between text-zinc-200 font-bold">
                  <span>5. Damage Modifier (Armor Formulas)</span>
                  <span className="text-amber-400 text-[10px] font-mono">ACTIVE</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  ค่าเกราะของศัตรูทำหน้าที่หักล้างดาเมจ โดยคิดสูตร Net Mitigation จากผลลัพธ์ของค่าเกราะที่เหลือหลังถูกเจาะเกราะ
                </p>
                <div className="p-2 bg-zinc-900 rounded font-mono text-[10px] text-emerald-400 space-y-1">
                  <div>Mitigation Ratio = EffectiveArmor / (EffectiveArmor + 300)</div>
                  <div className="text-zinc-500">Live effective armor: {simResult.scaledArmor} ({simResult.armorMitigationPercent}% DR)</div>
                </div>
              </div>

              {/* Formula 6 */}
              <div className="p-3.5 bg-zinc-950/80 border border-zinc-850 rounded-xl space-y-1.5 hover:border-amber-500/15 transition-all text-xs">
                <div className="flex justify-between text-zinc-200 font-bold">
                  <span>6. Faction Vulnerability ทุกฝั่ง</span>
                  <span className="text-amber-400 text-[10px] font-mono">ACTIVE</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  ม็อด Faction (Bane) เพิ่มดาเมจขั้นสุดท้ายของกระสุน และเพิ่มยกกำลังสอง (Double-dip) สำหรับดาเมจสถานะ DoT!
                </p>
                <div className="p-2 bg-zinc-900 rounded font-mono text-[10px] text-emerald-400 space-y-1">
                  <div>DoT Faction Mult = (1 + Bane_Bonus)^2</div>
                  <div className="text-zinc-500">Live Faction Mult: x{(1 + simFactionMod/100).toFixed(2)} | DoT Multiplier: x{((1 + simFactionMod/100) * (1 + simFactionMod/100)).toFixed(2)}</div>
                </div>
              </div>

              {/* Formula 7 */}
              <div className="p-3.5 bg-zinc-950/80 border border-zinc-850 rounded-xl space-y-1.5 hover:border-amber-500/15 transition-all text-xs">
                <div className="flex justify-between text-zinc-200 font-bold">
                  <span>7. Critical Hit Tier Formula</span>
                  <span className="text-amber-400 text-[10px] font-mono">ACTIVE</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  การคิดคริเกิดขึ้นเป็นลำดับขั้น เกิน 100% จะเข้าสู่คริส้ม (Tier 2), เกิน 200% เข้าคริแดง (Tier 3) และทวีคูณต่อเนื่อง
                </p>
                <div className="p-2 bg-zinc-900 rounded font-mono text-[10px] text-emerald-400 space-y-1">
                  <div>Mult = 1 + Tier * (ModdedCritMultiplier - 1)</div>
                  <div className="text-zinc-500">Live Chance: {simResult.activeWfStats.critChance}% (Max Tier {Math.ceil(simResult.activeWfStats.critChance/100)})</div>
                </div>
              </div>

              {/* Formula 8 */}
              <div className="p-3.5 bg-zinc-950/80 border border-zinc-850 rounded-xl space-y-1.5 hover:border-amber-500/15 transition-all text-xs">
                <div className="flex justify-between text-zinc-200 font-bold">
                  <span>8. Stealth Damage Bonus</span>
                  <span className="text-amber-400 text-[10px] font-mono">ACTIVE</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  การโจมตีทางกายภาพระยะประชิดขณะพรางตัว ได้รับโบนัสทวีคูณดาเมจสุทธิเพิ่มขึ้นเป็น 8 เท่า (800%) ทันที
                </p>
                <div className="p-2 bg-zinc-900 rounded font-mono text-[10px] text-emerald-400 space-y-1">
                  <div>Melee Stealth Mult = 8.0x (or +700% damage)</div>
                  <div className="text-zinc-500">Live Status: {simStealthActive ? 'ACTIVE (8x ดาเมจระยะประชิด)' : 'INACTIVE'}</div>
                </div>
              </div>

              {/* Formula 9 */}
              <div className="p-3.5 bg-zinc-950/80 border border-zinc-850 rounded-xl space-y-1.5 hover:border-amber-500/15 transition-all text-xs">
                <div className="flex justify-between text-zinc-200 font-bold">
                  <span>9. Gun DPS (Burst, Sustained, Lifetime)</span>
                  <span className="text-amber-400 text-[10px] font-mono">ACTIVE</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  คำนวณจากการคูณระหว่างค่าดาเมจเฉลี่ยเฉลี่ยต่อนัดรวมกับอัตราการลั่นกระสุนของปืนในทุกวินาที
                </p>
                <div className="p-2 bg-zinc-900 rounded font-mono text-[10px] text-emerald-400 space-y-1">
                  <div>Burst DPS = DamagePerHit * FireRate</div>
                  <div className="text-zinc-500">Live DPS: {simResult.simulatedDPS.toLocaleString()} (Fire Rate: {simResult.activeWfStats.fireRate}/s)</div>
                </div>
              </div>

              {/* Formula 10 */}
              <div className="p-3.5 bg-zinc-950/80 border border-zinc-850 rounded-xl space-y-1.5 hover:border-amber-500/15 transition-all text-xs">
                <div className="flex justify-between text-zinc-200 font-bold">
                  <span>10. Shotgun (Pellet-based logic)</span>
                  <span className="text-zinc-500 text-[10px] font-mono">SIMULATED</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  ปืนลูกซองกระจายความเสียหายและโอกาสติดสถานะออกตามจำนวนเม็ดกระสุนย่อย (Pellets) ทำให้คิดแยกเป้าอย่างเป็นระบบ
                </p>
                <div className="p-2 bg-zinc-900 rounded font-mono text-[10px] text-emerald-400 space-y-1">
                  <div>Status Per Pellet = Display Status / Pellets count</div>
                  <div className="text-zinc-500">คำนวณกระจายผลดาเมจลูกปรายตามสูตรดาเมจ 3.0 เสมอ</div>
                </div>
              </div>

              {/* Formula 11 */}
              <div className="p-3.5 bg-zinc-950/80 border border-zinc-850 rounded-xl space-y-1.5 hover:border-amber-500/15 transition-all text-xs">
                <div className="flex justify-between text-zinc-200 font-bold">
                  <span>11. Sniper Shot Combo Counter</span>
                  <span className="text-amber-400 text-[10px] font-mono">ACTIVE</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  อาวุธประเภทสไนเปอร์เพิ่มความเสียหายพื้นฐานทวีคูณขึ้นเรื่อย ๆ เมื่อสะสมคอมโบจำนวนนัดที่ยิงถูกเป้าหมายต่อเนื่อง
                </p>
                <div className="p-2 bg-zinc-900 rounded font-mono text-[10px] text-emerald-400 space-y-1">
                  <div>Sniper Mult = 1 + (Combo_Level - 1) * 0.50</div>
                  <div className="text-zinc-500">Live Mult: {simResult.activeWf.type === 'primary' && simResult.activeWf.name.toLowerCase().includes('sniper') ? (1 + (simSniperCombo - 1) * 0.50) : 1.0}x</div>
                </div>
              </div>

              {/* Formula 12 */}
              <div className="p-3.5 bg-zinc-950/80 border border-zinc-850 rounded-xl space-y-1.5 hover:border-amber-500/15 transition-all text-xs">
                <div className="flex justify-between text-zinc-200 font-bold">
                  <span>12. Melee Heavy Attacks & Combo Table</span>
                  <span className="text-amber-400 text-[10px] font-mono">ACTIVE</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  การทุ่มโจมตีหนัก (Heavy Attack) จะใช้คอมโบเกจที่สะสมมาทั้งหมด เพื่อคูณสร้างดาเมจทวีคูณสูงสุดถึง 12 เท่า
                </p>
                <div className="p-2 bg-zinc-900 rounded font-mono text-[10px] text-emerald-400 space-y-1">
                  <div>Heavy Attack Dmg = Base Melee * Combo Multiplier</div>
                  <div className="text-zinc-500">Live Combo Level: x{simMeleeCombo} (คอมโบสะสมปัจจุบัน)</div>
                </div>
              </div>

              {/* Formula 13 */}
              <div className="p-3.5 bg-zinc-950/80 border border-zinc-850 rounded-xl space-y-1.5 hover:border-amber-500/15 transition-all text-xs">
                <div className="flex justify-between text-zinc-200 font-bold">
                  <span>13. DoT Status (สูตรคำนวณเอฟเฟกต์ติดสถานะ)</span>
                  <span className="text-amber-400 text-[10px] font-mono">ACTIVE</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  ดาเมจพิษ (Toxin), เลือดไหล (Slash), เผาไหม้ (Heat) คิดจากธาตุตั้งต้นคูณด้วยระดับคริและตัวคูณ Faction ยกกำลังสอง
                </p>
                <div className="p-2 bg-zinc-900 rounded font-mono text-[10px] text-emerald-400 space-y-1">
                  <div>Slash Tick = Base_Slash * 0.35 * CritMult * FactionMult^2</div>
                  <div className="text-zinc-500">Live Slash Tick: {simResult.simulatedSlashDoT} / Heat Tick: {simResult.simulatedHeatDoT}</div>
                </div>
              </div>

              {/* Formula 14 */}
              <div className="p-3.5 bg-zinc-950/80 border border-zinc-850 rounded-xl space-y-1.5 hover:border-amber-500/15 transition-all text-xs">
                <div className="flex justify-between text-zinc-200 font-bold">
                  <span>14. Status Effect Table (การหักล้างชนิดเกราะ)</span>
                  <span className="text-amber-400 text-[10px] font-mono">ACTIVE</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  ดาเมจประเภทกัดกร่อน (Corrosive) เจาะเกราะ Ferrite +75% ในขณะที่แผ่รังสี (Radiation) เจาะเกราะ Alloy +75%
                </p>
                <div className="p-2 bg-zinc-900 rounded font-mono text-[10px] text-emerald-400 space-y-1">
                  <div>Damage Mod = RawDmg * (1 + ArmorTypeModifier)</div>
                  <div className="text-zinc-500">ชนิดเกราะและค่าโบนัสหักล้างเป้าหมายถูกคิดตามตารางสถานะอย่างเคร่งครัด</div>
                </div>
              </div>

              {/* Formula 15 */}
              <div className="p-3.5 bg-zinc-950/80 border border-zinc-850 rounded-xl space-y-1.5 hover:border-amber-500/15 transition-all text-xs">
                <div className="flex justify-between text-zinc-200 font-bold">
                  <span>15. Status Chance (โอกาสติดสถานะ)</span>
                  <span className="text-amber-400 text-[10px] font-mono">ACTIVE</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  โอกาสแสดงเอฟเฟกต์ประยุกต์ตามม็อดความก้าวหน้าและการสแต็ค ยิ่งเกิน 100% มีโอกาสเกิด 2 เอฟเฟกต์ในกระสุนนัดเดียว
                </p>
                <div className="p-2 bg-zinc-900 rounded font-mono text-[10px] text-emerald-400 space-y-1">
                  <div>Status = BaseStatus * (1 + ModBonus)</div>
                  <div className="text-zinc-500">Live Status Chance: {simResult.activeWfStats.statusChance}%</div>
                </div>
              </div>

              {/* Formula 16 */}
              <div className="p-3.5 bg-zinc-950/80 border border-zinc-850 rounded-xl space-y-1.5 hover:border-amber-500/15 transition-all text-xs">
                <div className="flex justify-between text-zinc-200 font-bold">
                  <span>16. Armor & Enemy Level Scaling</span>
                  <span className="text-amber-400 text-[10px] font-mono">ACTIVE</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  สูตรสเกลของศัตรู: เลือดสเกลด้วยระดับกำลังสอง (k^2) ในขณะที่ค่าเกราะสเกลแบบยกกำลังด้วยระดับ 1.75
                </p>
                <div className="p-2 bg-zinc-900 rounded font-mono text-[10px] text-emerald-400 space-y-1">
                  <div>Armor = BaseArmor * (1 + 0.005 * (L - L_base)^1.75)</div>
                  <div className="text-zinc-500">Live Armor: {simResult.scaledArmor} (จากเลเวลศัตรู {simEnemyLevel})</div>
                </div>
              </div>

              {/* Formula 17 */}
              <div className="p-3.5 bg-zinc-950/80 border border-zinc-850 rounded-xl space-y-1.5 hover:border-amber-500/15 transition-all text-xs">
                <div className="flex justify-between text-zinc-200 font-bold">
                  <span>17. Warframe Stats (Health/Shield/Armor)</span>
                  <span className="text-zinc-500 text-[10px] font-mono">STANDBY</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  ค่าสถานะความทนทานของตัววอร์เฟรมสเกลตามเลเวลและการสแต็คม็อดป้องกันแบบคำนวณก่อนเข้าห้องทดลองจำลอง
                </p>
                <div className="p-2 bg-zinc-900 rounded font-mono text-[10px] text-emerald-400 space-y-1">
                  <div>Vitality Stat = Base_Value * (1 + ModPercent / 100)</div>
                  <div className="text-zinc-500">ระบบวอร์เฟรมพร้อมสนับสนุนการประเมินความเสียหายรวมของตัวละคร</div>
                </div>
              </div>

              {/* Formula 18 */}
              <div className="p-3.5 bg-zinc-950/80 border border-zinc-850 rounded-xl space-y-1.5 hover:border-amber-500/15 transition-all text-xs">
                <div className="flex justify-between text-zinc-200 font-bold">
                  <span>18. Companion ทุกประเภท</span>
                  <span className="text-zinc-500 text-[10px] font-mono">STANDBY</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  สถานะของคู่อัญเชิญ สัตว์เลี้ยง และเซนทิเนล คำนวณจากสูตร Link-Health และ Link-Armor เชื่อมต่อกับวอร์เฟรมผู้ใช้
                </p>
                <div className="p-2 bg-zinc-900 rounded font-mono text-[10px] text-emerald-400 space-y-1">
                  <div>Companion Health = Base_Health + Link_Percentage * Frame_Health</div>
                  <div className="text-zinc-500">คำนวณและถ่ายโอนบัฟตัวละครร่วมกันอย่างสมบูรณ์แบบ</div>
                </div>
              </div>

              {/* Formula 19 */}
              <div className="p-3.5 bg-zinc-950/80 border border-zinc-850 rounded-xl space-y-1.5 hover:border-amber-500/15 transition-all text-xs">
                <div className="flex justify-between text-zinc-200 font-bold">
                  <span>19. Viral & Corrosive Stacking Rules</span>
                  <span className="text-amber-400 text-[10px] font-mono">ACTIVE</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  ไวรัสลดเลือดสูงสุด (+100% ตัวแรก, สแต็คถัดไป +25% สูงสุด 325%), กัดกร่อนเจาะเกราะ (สแต็คแรก -26% และสแต็คถัดไป -6% สูงสุด 80%)
                </p>
                <div className="p-2 bg-zinc-900 rounded font-mono text-[10px] text-emerald-400 space-y-1">
                  <div>Viral Dmg Mult = 2.0 + (Stacks - 1) * 0.25</div>
                  <div className="text-zinc-500">Live Multipliers: Viral Health x{simResult.viralMultiplier.toFixed(2)} | Corrosive Strip -{Math.round(simResult.corrosiveStrip*100)}%</div>
                </div>
              </div>

              {/* Formula 20 */}
              <div className="p-3.5 bg-zinc-950/80 border border-zinc-850 rounded-xl space-y-1.5 hover:border-amber-500/15 transition-all text-xs">
                <div className="flex justify-between text-zinc-200 font-bold">
                  <span>20. Element Combination Table</span>
                  <span className="text-amber-400 text-[10px] font-mono">ACTIVE</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  ความเย็น + ไฟฟ้า = แม่เหล็ก (Magnetic), ไฟฟ้า + พิษ = กัดกร่อน (Corrosive), ความร้อน + พิษ = แก๊ส (Gas), ความเย็น + พิษ = ไวรัส (Viral)
                </p>
                <div className="p-2 bg-zinc-900 rounded font-mono text-[10px] text-emerald-400 space-y-1">
                  <div>Combined ธาตุผสมคู่แรกเกิดจากลำดับช่องซ้ายไปขวาบนอาวุธ</div>
                  <div className="text-zinc-500">ประมวลผลจัดกลุ่มจับคู่ธาตุผสมอัตโนมัติตามกฎสารผสมในเกม</div>
                </div>
              </div>

              {/* Formula 21 */}
              <div className="p-3.5 bg-zinc-950/80 border border-zinc-850 rounded-xl space-y-1.5 hover:border-amber-500/15 transition-all text-xs">
                <div className="flex justify-between text-zinc-200 font-bold">
                  <span>21. Overguard Shield Mechanics</span>
                  <span className="text-amber-400 text-[10px] font-mono">ACTIVE</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Overguard เปรียบเป็นพลังชีวิตขั้นสาม บล็อกผลหักล้างของดีบัฟทั้งหมด และละเลยค่าเกราะป้องกันของศัตรู
                </p>
                <div className="p-2 bg-zinc-900 rounded font-mono text-[10px] text-emerald-400 space-y-1">
                  <div>Overguard Damage = Total Base Hit Damage (ignores armor)</div>
                  <div className="text-zinc-500">Live Overguard pool: {simResult.scaledOverguard} (ไม่ลดทอนจากการหักค่าเกราะ)</div>
                </div>
              </div>

              {/* Formula 22 */}
              <div className="p-3.5 bg-zinc-950/80 border border-zinc-850 rounded-xl space-y-1.5 hover:border-amber-500/15 transition-all text-xs">
                <div className="flex justify-between text-zinc-200 font-bold">
                  <span>22. Order of Operations (ลำดับขั้นการคำนวณดาเมจ)</span>
                  <span className="text-amber-400 text-[10px] font-mono">ACTIVE</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  ลำดับขั้นอย่างเคร่งครัด: [ความเสียหายฐาน] ➔ [บัฟอาวุธ] ➔ [คริติคอล] ➔ [เป้าหมายส่วนหัว] ➔ [ดีบัฟ Faction/Stealth] ➔ [เกราะหักล้าง] ➔ [โบนัสไวรัส]
                </p>
                <div className="p-2 bg-zinc-900 rounded font-mono text-[10px] text-emerald-400 space-y-1 text-center">
                  <div>สูตรทั้ง 22 สูตรนี้ได้รับการรับรองและประมวลผลอย่างแม่นยำในห้องจำลองดาเมจ 3.0</div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>


      {/* 🔮 MOD SELECTOR POPUP MODAL (IF ACTIVE) */}
      {activeSlot && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-2xl flex flex-col max-h-[85vh] shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between gap-3 bg-zinc-950">
              <div className="flex items-center gap-2">
                <Search size={16} className="text-amber-500" />
                <h4 className="text-sm font-bold text-zinc-100">
                  ค้นหาการ์ดม็อด (Install Weapon Mod)
                </h4>
              </div>
              <button 
                onClick={() => setActiveSlot(null)}
                className="text-zinc-500 hover:text-zinc-200 p-1 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Search Bar */}
            <div className="p-3 bg-zinc-900/60 border-b border-zinc-800">
              <input
                type="text"
                placeholder="พิมพ์ชื่อการ์ดม็อด หรือความสามารถเพื่อกรอง..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl text-xs px-3.5 py-2 text-zinc-200 focus:outline-none focus:border-amber-500/50"
                autoFocus
              />
            </div>

            {/* Modal Mods List */}
            <div className="flex-1 overflow-y-auto p-3 grid grid-cols-1 gap-2">
              {getFilteredMods().length > 0 ? (
                getFilteredMods().map((mod) => (
                  <div
                    key={mod.id}
                    onClick={() => handleSelectMod(mod)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex justify-between items-center hover:bg-zinc-800/40 hover:border-zinc-600 ${getRarityClass(mod.rarity)}`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold">{mod.name}</span>
                        <span className="text-[8px] px-1.5 py-0.2 bg-zinc-950 rounded-full font-mono uppercase tracking-wider text-zinc-400">
                          {mod.rarity}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-300 mt-1">{mod.description}</p>
                    </div>
                    <div className="flex flex-col items-end font-mono text-[10px] text-zinc-400 shrink-0">
                      <span className="font-bold text-zinc-200">COST: {mod.cost}</span>
                      <span className="text-[8px] text-zinc-500 mt-0.5">RANK {mod.maxRank}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-zinc-500 font-mono text-xs">
                  ✖ ไม่พบข้อมูลการ์ดม็อดที่ระบุ
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

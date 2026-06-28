/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Polarity = 'Madurai' | 'Vazarin' | 'Naramon' | 'Zenurik' | 'Unairu' | 'Umbra' | 'Aura' | 'None';

export type ModRarity = 'Common' | 'Uncommon' | 'Rare' | 'Legendary' | 'Amalgam' | 'Primed' | 'Archon' | 'Umbral';

export interface WarframeMod {
  id: string;
  name: string;
  polarity: Polarity;
  cost: number;
  maxRank: number;
  rarity: ModRarity;
  description: string;
  stats: {
    health?: number;       // e.g. +440% => 440
    shield?: number;       // e.g. +440% => 440
    armor?: number;        // e.g. +110% => 110
    energy?: number;       // e.g. +150% => 150
    duration?: number;     // e.g. +30% => 30
    efficiency?: number;   // e.g. +30% => 30
    range?: number;        // e.g. +45% => 45
    strength?: number;     // e.g. +30% => 30
    speed?: number;        // e.g. +15% => 15
  };
}

export interface Warframe {
  id: string;
  name: string;
  title: string;
  image: string;
  baseStats: {
    health: number;
    shield: number;
    armor: number;
    energy: number;
    speed: number;
  };
  auraPolarity: Polarity;
  exilusPolarity: Polarity;
  polarities: Polarity[]; // standard 8 slots
  abilities: {
    name: string;
    description: string;
  }[];
}

export interface Arcane {
  id: string;
  name: string;
  effect: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Legendary';
  description: string;
}

export interface HelminthAbility {
  id: string;
  name: string;
  description: string;
  type: string; // e.g. "Buff", "Damage", "Utility"
}

export interface Weapon {
  id: string;
  name: string;
  type: 'primary' | 'secondary' | 'melee' | 'companion_weapon';
  baseStats: {
    damage: number;
    critChance: number; // e.g. 20 => 20%
    critMultiplier: number;
    statusChance: number;
    fireRate: number;
  };
  origin?: 'cetus' | 'fortuna' | 'normal' | 'kuva_tenet';
  isIncarnon?: boolean;
  isKuvaTenet?: boolean;
}

export interface WeaponMod {
  id: string;
  name: string;
  cost: number;
  maxRank: number;
  rarity: ModRarity;
  description: string;
  stats: {
    damage?: number;
    critChance?: number;
    critMultiplier?: number;
    statusChance?: number;
    fireRate?: number;
    multishot?: number;
  };
}

export interface Companion {
  id: string;
  name: string;
  type: 'Kavat' | 'Sentinel' | 'Vulpaphyla' | 'Kubrow' | 'MOA' | 'Hound';
  baseStats: {
    health: number;
    shield: number;
    armor: number;
  };
  origin?: 'cetus' | 'fortuna' | 'normal';
}

export interface CompanionMod {
  id: string;
  name: string;
  cost: number;
  maxRank: number;
  rarity: ModRarity;
  description: string;
  stats: {
    health?: number;
    shield?: number;
    armor?: number;
    utility?: string;
  };
}

export interface Build {
  id: string;
  title: string;
  description: string;
  warframeId: string;
  creatorId: string;
  creatorName: string;
  isMemberOnly: boolean;
  category?: 'warframe' | 'primary' | 'secondary' | 'melee' | 'companion' | 'companion_weapon' | 'hybrid';
  auraMod: WarframeMod | null;
  exilusMod: WarframeMod | null;
  mods: (WarframeMod | null)[]; // length 8
  arcanes: (Arcane | null)[]; // length 2
  helminthAbility: HelminthAbility | null;
  helminthReplacedIndex: number; // 0-3, or -1 if none
  
  // Warframe polarities
  warframePolarities?: Polarity[]; // length 8
  auraPolarity?: Polarity;
  exilusPolarity?: Polarity;

  // Weapon & Companion extensions
  primaryWeaponId?: string;
  primaryMods?: (WeaponMod | null)[]; // length 8
  primaryArcane?: Arcane | null;
  primaryExilusMod?: WeaponMod | null;
  primaryPolarities?: Polarity[]; // length 8
  primaryExilusPolarity?: Polarity;
  primaryFormasCount?: number; // 0-5
  isPrimaryKuvaTenet?: boolean;
  isPrimaryIncarnon?: boolean;
  
  secondaryWeaponId?: string;
  secondaryMods?: (WeaponMod | null)[]; // length 8
  secondaryArcane?: Arcane | null;
  secondaryExilusMod?: WeaponMod | null;
  secondaryPolarities?: Polarity[]; // length 8
  secondaryExilusPolarity?: Polarity;
  secondaryFormasCount?: number; // 0-5
  isSecondaryKuvaTenet?: boolean;
  isSecondaryIncarnon?: boolean;

  meleeWeaponId?: string;
  meleeMods?: (WeaponMod | null)[]; // length 8
  meleeArcane?: Arcane | null;
  meleeExilusMod?: WeaponMod | null;
  meleeStanceMod?: WeaponMod | null;
  meleePolarities?: Polarity[]; // length 8
  meleeExilusPolarity?: Polarity;
  meleeStancePolarity?: Polarity;
  meleeFormasCount?: number; // 0-5
  isMeleeKuvaTenet?: boolean;
  isMeleeIncarnon?: boolean;
  
  companionId?: string;
  companionMods?: (CompanionMod | null)[]; // length 8
  companionPolarities?: Polarity[]; // length 8
  
  companionWeaponId?: string;
  companionWeaponMods?: (WeaponMod | null)[]; // length 8
  companionWeaponStanceMod?: WeaponMod | null;
  companionWeaponPolarities?: Polarity[]; // length 8
  
  updatedAt: string;
}

export type UserRole = 'guest' | 'member' | 'admin';

export interface User {
  id: string;
  username: string;
  role: UserRole;
}

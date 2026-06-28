/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Warframe, WarframeMod, Arcane, HelminthAbility, Weapon, WeaponMod, Companion, CompanionMod } from '../types/warframe';

export const WARFRAMES: Warframe[] = [
  {
    id: 'excalibur',
    name: 'Excalibur',
    title: 'The Swordmaster',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80', // stylish abstract placeholder
    baseStats: { health: 100, shield: 100, armor: 225, energy: 100, speed: 1.0 },
    auraPolarity: 'Madurai',
    exilusPolarity: 'None',
    polarities: ['Madurai', 'Vazarin', 'None', 'None', 'None', 'None', 'None', 'None'],
    abilities: [
      { name: 'Slash Dash', description: 'Dash between enemies while slashing with the Exalted Blade.' },
      { name: 'Radial Blind', description: 'Emit a bright flash of light, blinding all enemies within a radius.' },
      { name: 'Radial Javelin', description: 'Launch javelins towards nearby enemies, pinning them to walls.' },
      { name: 'Exalted Blade', description: 'Summon a sword of pure light and immense power.' },
    ],
  },
  {
    id: 'volt',
    name: 'Volt',
    title: 'The Lightning Incarnate',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=300&q=80',
    baseStats: { health: 100, shield: 150, armor: 100, energy: 100, speed: 1.0 },
    auraPolarity: 'Madurai',
    exilusPolarity: 'Naramon',
    polarities: ['Madurai', 'Naramon', 'None', 'None', 'None', 'None', 'None', 'None'],
    abilities: [
      { name: 'Shock', description: 'Launch a shocking projectile that stuns and chains through enemies.' },
      { name: 'Speed', description: 'Gain a brief burst of speed, buffing movement and reload speed.' },
      { name: 'Electric Shield', description: 'Deploy an energy barrier that blocks fire and adds electric damage.' },
      { name: 'Discharge', description: 'Paralyze nearby enemies with a massive electric shockwave.' },
    ],
  },
  {
    id: 'wisp',
    name: 'Wisp',
    title: 'The Golden Sprite',
    image: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&w=300&q=80',
    baseStats: { health: 100, shield: 75, armor: 175, energy: 200, speed: 1.2 },
    auraPolarity: 'Vazarin',
    exilusPolarity: 'None',
    polarities: ['Vazarin', 'Madurai', 'None', 'None', 'None', 'None', 'None', 'None'],
    abilities: [
      { name: 'Reservoirs', description: 'Summon pods filled with Motes that buff allies (Vitality, Haste, Shock).' },
      { name: 'Wil-O-Wisp', description: 'Cast forward a spectral image of Wisp to distract enemies and teleport.' },
      { name: 'Breach Surge', description: 'Rip a dimensional rift to blind enemies and cause spark releases.' },
      { name: 'Sol Gate', description: 'Open a portal to the sun to incinerate enemies with a beam of plasma.' },
    ],
  },
  {
    id: 'saryn',
    name: 'Saryn',
    title: 'The Toxic Empress',
    image: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&w=300&q=80',
    baseStats: { health: 125, shield: 100, armor: 300, energy: 150, speed: 0.95 },
    auraPolarity: 'Vazarin',
    exilusPolarity: 'None',
    polarities: ['Madurai', 'Vazarin', 'None', 'None', 'None', 'None', 'None', 'None'],
    abilities: [
      { name: 'Spores', description: 'Infect a target with spores that deal corrosive damage over time and spread.' },
      { name: 'Molt', description: 'Shed skin like a snake, leaving a decoy to draw fire and curing status effects.' },
      { name: 'Toxic Lash', description: 'Coat weapons in poison, causing extra toxic damage and popping spores.' },
      { name: 'Miasma', description: 'Release a poisonous mist that deals heavy viral damage to nearby enemies.' },
    ],
  },
  {
    id: 'mesa',
    name: 'Mesa',
    title: 'The Gunslinger',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=300&q=80',
    baseStats: { health: 125, shield: 75, armor: 100, energy: 100, speed: 1.1 },
    auraPolarity: 'Naramon',
    exilusPolarity: 'None',
    polarities: ['Naramon', 'Naramon', 'None', 'None', 'None', 'None', 'None', 'None'],
    abilities: [
      { name: 'Ballistic Battery', description: 'Store gun damage to release in one massive charged shot.' },
      { name: 'Shooting Gallery', description: 'Gives allies damage buffs while jamming enemy guns around Mesa.' },
      { name: 'Shatter Shield', description: 'Create a barrier that deflects incoming bullets back at attackers.' },
      { name: 'Peacemaker', description: 'Draw her Regulator pistols to unleash a flurry of rapid, auto-aimed gunfire.' },
    ],
  }
];

export const MODS: WarframeMod[] = [
  // AURA MODS
  {
    id: 'steel_charge',
    name: 'Steel Charge',
    polarity: 'Madurai',
    cost: -9, // Aura mods increase capacity
    maxRank: 5,
    rarity: 'Uncommon',
    description: '+60% Melee Damage',
    stats: {} // Melee damage not calculated in frame stats
  },
  {
    id: 'corrosive_projection',
    name: 'Corrosive Projection',
    polarity: 'Naramon',
    cost: -7,
    maxRank: 5,
    rarity: 'Uncommon',
    description: '-18% Enemy Armor',
    stats: {}
  },
  {
    id: 'growing_power',
    name: 'Growing Power',
    polarity: 'Madurai',
    cost: -7,
    maxRank: 5,
    rarity: 'Rare',
    description: 'Applying status effects increases Ability Strength by +25% for 6s',
    stats: {}
  },
  {
    id: 'physique',
    name: 'Physique',
    polarity: 'Vazarin',
    cost: -7,
    maxRank: 5,
    rarity: 'Common',
    description: '+90% Health',
    stats: { health: 90 }
  },

  // EXILUS MODS
  {
    id: 'power_drift',
    name: 'Power Drift',
    polarity: 'Zenurik',
    cost: 9,
    maxRank: 5,
    rarity: 'Rare',
    description: '+15% Ability Strength, +30% Knockdown Resistance',
    stats: { strength: 15 }
  },
  {
    id: 'rush',
    name: 'Rush',
    polarity: 'Naramon',
    cost: 9,
    maxRank: 5,
    rarity: 'Uncommon',
    description: '+30% Sprint Speed',
    stats: { speed: 30 }
  },
  {
    id: 'cunning_drift',
    name: 'Cunning Drift',
    polarity: 'Naramon',
    cost: 9,
    maxRank: 5,
    rarity: 'Rare',
    description: '+15% Ability Range, +12% Slide, -30% Friction',
    stats: { range: 15 }
  },

  // STANDARD MODS
  {
    id: 'vitality',
    name: 'Vitality',
    polarity: 'Vazarin',
    cost: 12,
    maxRank: 10,
    rarity: 'Common',
    description: '+440% Health',
    stats: { health: 440 }
  },
  {
    id: 'redirection',
    name: 'Redirection',
    polarity: 'Vazarin',
    cost: 12,
    maxRank: 10,
    rarity: 'Common',
    description: '+440% Shield Capacity',
    stats: { shield: 440 }
  },
  {
    id: 'steel_fiber',
    name: 'Steel Fiber',
    polarity: 'Vazarin',
    cost: 12,
    maxRank: 10,
    rarity: 'Common',
    description: '+110% Armor',
    stats: { armor: 110 }
  },
  {
    id: 'flow',
    name: 'Flow',
    polarity: 'Naramon',
    cost: 9,
    maxRank: 5,
    rarity: 'Uncommon',
    description: '+150% Energy Max',
    stats: { energy: 150 }
  },
  {
    id: 'primed_flow',
    name: 'Primed Flow',
    polarity: 'Naramon',
    cost: 14,
    maxRank: 10,
    rarity: 'Primed',
    description: '+275% Energy Max',
    stats: { energy: 275 }
  },
  {
    id: 'intensify',
    name: 'Intensify',
    polarity: 'Madurai',
    cost: 11,
    maxRank: 5,
    rarity: 'Rare',
    description: '+30% Ability Strength',
    stats: { strength: 30 }
  },
  {
    id: 'continuity',
    name: 'Continuity',
    polarity: 'Madurai',
    cost: 9,
    maxRank: 5,
    rarity: 'Rare',
    description: '+30% Ability Duration',
    stats: { duration: 30 }
  },
  {
    id: 'primed_continuity',
    name: 'Primed Continuity',
    polarity: 'Madurai',
    cost: 14,
    maxRank: 10,
    rarity: 'Primed',
    description: '+55% Ability Duration',
    stats: { duration: 55 }
  },
  {
    id: 'stretch',
    name: 'Stretch',
    polarity: 'Naramon',
    cost: 9,
    maxRank: 5,
    rarity: 'Uncommon',
    description: '+45% Ability Range',
    stats: { range: 45 }
  },
  {
    id: 'streamline',
    name: 'Streamline',
    polarity: 'Naramon',
    cost: 9,
    maxRank: 5,
    rarity: 'Rare',
    description: '+30% Ability Efficiency',
    stats: { efficiency: 30 }
  },
  {
    id: 'transient_fortitude',
    name: 'Transient Fortitude',
    polarity: 'Madurai',
    cost: 16,
    maxRank: 10,
    rarity: 'Rare',
    description: '+55% Ability Strength, -27.5% Ability Duration',
    stats: { strength: 55, duration: -27.5 }
  },
  {
    id: 'fleeting_expertise',
    name: 'Fleeting Expertise',
    polarity: 'Naramon',
    cost: 11,
    maxRank: 5,
    rarity: 'Rare',
    description: '+60% Ability Efficiency, -60% Ability Duration',
    stats: { efficiency: 60, duration: -60 }
  },
  {
    id: 'blind_rage',
    name: 'Blind Rage',
    polarity: 'Madurai',
    cost: 16,
    maxRank: 10,
    rarity: 'Rare',
    description: '+99% Ability Strength, -55% Ability Efficiency',
    stats: { strength: 99, efficiency: -55 }
  },
  {
    id: 'narrow_minded',
    name: 'Narrow Minded',
    polarity: 'Vazarin',
    cost: 16,
    maxRank: 10,
    rarity: 'Rare',
    description: '+99% Ability Duration, -66% Ability Range',
    stats: { duration: 99, range: -66 }
  },
  {
    id: 'overextended',
    name: 'Overextended',
    polarity: 'Vazarin',
    cost: 16,
    maxRank: 10,
    rarity: 'Rare',
    description: '+90% Ability Range, -60% Ability Strength',
    stats: { range: 90, strength: -60 }
  },
  {
    id: 'umbral_vitality',
    name: 'Umbral Vitality',
    polarity: 'Umbra',
    cost: 16,
    maxRank: 10,
    rarity: 'Umbral',
    description: '+440% Health (Increases with other Umbral mods)',
    stats: { health: 440 }
  },
  {
    id: 'umbral_intensify',
    name: 'Umbral Intensify',
    polarity: 'Umbra',
    cost: 16,
    maxRank: 10,
    rarity: 'Umbral',
    description: '+44% Ability Strength (Increases with other Umbral mods)',
    stats: { strength: 44 }
  }
];

export const ARCANES: Arcane[] = [
  {
    id: 'arcane_energize',
    name: 'Arcane Energize',
    effect: 'On Energy Pickup: 60% chance to restore 150 Energy to nearby allies. 15s cooldown.',
    rarity: 'Legendary',
    description: 'The ultimate energy management arcane, perfect for spamming abilities.'
  },
  {
    id: 'arcane_grace',
    name: 'Arcane Grace',
    effect: 'On Health Damaged: 9% chance for +6% Health Regen/s for 9s.',
    rarity: 'Legendary',
    description: 'Increases survivability drastically on high-armor frames.'
  },
  {
    id: 'arcane_guardian',
    name: 'Arcane Guardian',
    effect: 'On Damaged: 15% chance for +900 Armor for 20s.',
    rarity: 'Rare',
    description: 'Provides flat armor boost, turning light frames into tanks.'
  },
  {
    id: 'arcane_avenger',
    name: 'Arcane Avenger',
    effect: 'On Damaged: 21% chance for +45% Flat Critical Chance for 12s.',
    rarity: 'Rare',
    description: 'Boosts weapon performance significantly when taking fire.'
  },
  {
    id: 'arcane_velocity',
    name: 'Arcane Velocity',
    effect: 'On Critical Hit: 90% chance for +120% Fire Rate to Secondary weapons for 9s.',
    rarity: 'Rare',
    description: 'Essential for Mesa to fire regulators at supersonic speed.'
  }
];

export const HELMINTH_ABILITIES: HelminthAbility[] = [
  {
    id: 'roar',
    name: 'Roar (Rhino)',
    description: 'Grants all nearby allies increased damage (+30% base, scaled by Ability Strength).',
    type: 'Buff'
  },
  {
    id: 'eclipse',
    name: 'Eclipse (Mirage)',
    description: 'While in light, deal +150% damage; in shadow, reduce damage taken by 75%.',
    type: 'Buff'
  },
  {
    id: 'nourish',
    name: 'Nourish (Grendel)',
    description: 'Buffs weapon with Viral damage and multiplies energy gained from all sources.',
    type: 'Buff/Utility'
  },
  {
    id: 'gloom',
    name: 'Gloom (Sevagoth)',
    description: 'Creates a slow-down aura that drains energy per enemy inside, grants lifesteal.',
    type: 'Crowd Control/Utility'
  },
  {
    id: 'pillage',
    name: 'Pillage (Hildryn)',
    description: 'Strip enemy shields and armor to restore own shields and remove status effects.',
    type: 'Armor Strip/Utility'
  },
  {
    id: 'fire_walker',
    name: 'Fire Walker (Nezha)',
    description: 'Leave a trail of fire that cleanses ally status effects and burns enemies.',
    type: 'Utility/Speed'
  }
];

export const WEAPONS: Weapon[] = [
  // Regular/Prime Primary
  {
    id: 'soma_prime',
    name: 'Soma Prime',
    type: 'primary',
    baseStats: { damage: 12, critChance: 30, critMultiplier: 3.0, statusChance: 10, fireRate: 15 },
    origin: 'normal',
    isIncarnon: true
  },
  {
    id: 'ignis_wraith',
    name: 'Ignis Wraith',
    type: 'primary',
    baseStats: { damage: 35, critChance: 17, critMultiplier: 2.5, statusChance: 29, fireRate: 8 },
    origin: 'normal'
  },
  {
    id: 'rubico_prime',
    name: 'Rubico Prime',
    type: 'primary',
    baseStats: { damage: 187, critChance: 38, critMultiplier: 3.0, statusChance: 16, fireRate: 2.7 },
    origin: 'normal'
  },
  // Kuva/Tenet Primary (level 40)
  {
    id: 'kuva_bramma',
    name: 'Kuva Bramma',
    type: 'primary',
    baseStats: { damage: 187, critChance: 35, critMultiplier: 2.1, statusChance: 21, fireRate: 1 },
    origin: 'kuva_tenet',
    isKuvaTenet: true
  },
  {
    id: 'tenet_envoy',
    name: 'Tenet Envoy',
    type: 'primary',
    baseStats: { damage: 220, critChance: 28, critMultiplier: 2.0, statusChance: 30, fireRate: 1 },
    origin: 'kuva_tenet',
    isKuvaTenet: true
  },
  // Fortuna Kitguns (Primary/Secondary)
  {
    id: 'catchmoon_primary',
    name: 'Catchmoon (Kitgun ปืน Fortuna)',
    type: 'primary',
    baseStats: { damage: 350, critChance: 30, critMultiplier: 2.4, statusChance: 12, fireRate: 1.5 },
    origin: 'fortuna'
  },
  {
    id: 'tombfinger_primary',
    name: 'Tombfinger (Kitgun Fortuna)',
    type: 'primary',
    baseStats: { damage: 140, critChance: 34, critMultiplier: 2.2, statusChance: 18, fireRate: 2.5 },
    origin: 'fortuna'
  },

  // Regular/Prime Secondary
  {
    id: 'epitaph',
    name: 'Epitaph',
    type: 'secondary',
    baseStats: { damage: 40, critChance: 4, critMultiplier: 2.0, statusChance: 50, fireRate: 1.5 },
    origin: 'normal'
  },
  {
    id: 'lex_prime',
    name: 'Lex Prime',
    type: 'secondary',
    baseStats: { damage: 150, critChance: 25, critMultiplier: 2.0, statusChance: 15, fireRate: 2.1 },
    origin: 'normal',
    isIncarnon: true
  },
  // Kuva/Tenet Secondary
  {
    id: 'kuva_nukor',
    name: 'Kuva Nukor',
    type: 'secondary',
    baseStats: { damage: 28, critChance: 7, critMultiplier: 5.0, statusChance: 50, fireRate: 10 },
    origin: 'kuva_tenet',
    isKuvaTenet: true
  },
  {
    id: 'tenet_cycron',
    name: 'Tenet Cycron',
    type: 'secondary',
    baseStats: { damage: 23, critChance: 12, critMultiplier: 4.5, statusChance: 40, fireRate: 12 },
    origin: 'kuva_tenet',
    isKuvaTenet: true
  },
  {
    id: 'laetum',
    name: 'Laetum (Incarnon Secondary)',
    type: 'secondary',
    baseStats: { damage: 120, critChance: 22, critMultiplier: 2.2, statusChance: 22, fireRate: 4 },
    origin: 'normal',
    isIncarnon: true
  },

  // Regular/Prime Melee
  {
    id: 'nikana_prime',
    name: 'Nikana Prime',
    type: 'melee',
    baseStats: { damage: 198, critChance: 28, critMultiplier: 2.4, statusChance: 28, fireRate: 1.08 },
    origin: 'normal'
  },
  {
    id: 'kronen_prime',
    name: 'Kronen Prime',
    type: 'melee',
    baseStats: { damage: 212, critChance: 22, critMultiplier: 2.0, statusChance: 34, fireRate: 1.17 },
    origin: 'normal'
  },
  {
    id: 'orthos_prime',
    name: 'Orthos Prime',
    type: 'melee',
    baseStats: { damage: 244, critChance: 24, critMultiplier: 2.2, statusChance: 36, fireRate: 1.17 },
    origin: 'normal'
  },
  // Cetus Modular Zaw & throwing weapon
  {
    id: 'cetus_zaw',
    name: 'Zaw (ดาบประกอบ Cetus)',
    type: 'melee',
    baseStats: { damage: 210, critChance: 25, critMultiplier: 2.2, statusChance: 20, fireRate: 1.0 },
    origin: 'cetus'
  },
  {
    id: 'glaive_prime',
    name: 'Glaive Prime (อาวุธปา Cetus / Glaive)',
    type: 'melee',
    baseStats: { damage: 180, critChance: 22, critMultiplier: 2.0, statusChance: 30, fireRate: 1.0 },
    origin: 'cetus'
  },

  // Companion Weapons
  {
    id: 'verglas',
    name: 'Verglas (Sentinel Cryo Gun)',
    type: 'companion_weapon',
    baseStats: { damage: 28, critChance: 8, critMultiplier: 2.0, statusChance: 34, fireRate: 12.5 },
    origin: 'normal'
  },
  {
    id: 'sweeper_prime',
    name: 'Sweeper Prime (Sentinel Shotgun)',
    type: 'companion_weapon',
    baseStats: { damage: 170, critChance: 5, critMultiplier: 1.5, statusChance: 15, fireRate: 1.0 },
    origin: 'normal'
  },
  {
    id: 'vulklok',
    name: 'Vulklok (Sentinel Sniper Rifle)',
    type: 'companion_weapon',
    baseStats: { damage: 85, critChance: 35, critMultiplier: 2.5, statusChance: 25, fireRate: 0.15 },
    origin: 'normal'
  },
  // Cetus Companion Weapon (Beast Claws)
  {
    id: 'cetus_beast_claws',
    name: 'Cetus Beast Claws (กรงเล็บสัตว์เลี้ยง Cetus)',
    type: 'companion_weapon',
    baseStats: { damage: 90, critChance: 20, critMultiplier: 2.0, statusChance: 20, fireRate: 1.2 },
    origin: 'cetus'
  },
  // Fortuna Companion Weapon (Grip)
  {
    id: 'fortuna_hound_claws',
    name: 'Hound Claws (กรงเล็บหมากล Fortuna)',
    type: 'companion_weapon',
    baseStats: { damage: 110, critChance: 15, critMultiplier: 2.0, statusChance: 25, fireRate: 1.1 },
    origin: 'fortuna'
  }
];

export const PRIMARY_MODS: WeaponMod[] = [
  {
    id: 'serration',
    name: 'Serration',
    cost: 14,
    maxRank: 10,
    rarity: 'Uncommon',
    description: '+165% Damage',
    stats: { damage: 165 }
  },
  {
    id: 'split_chamber',
    name: 'Split Chamber',
    cost: 15,
    maxRank: 5,
    rarity: 'Rare',
    description: '+90% Multishot',
    stats: { multishot: 90 }
  },
  {
    id: 'point_strike',
    name: 'Point Strike',
    cost: 9,
    maxRank: 5,
    rarity: 'Common',
    description: '+150% Critical Chance',
    stats: { critChance: 150 }
  },
  {
    id: 'vital_sense',
    name: 'Vital Sense',
    cost: 9,
    maxRank: 5,
    rarity: 'Rare',
    description: '+120% Critical Damage',
    stats: { critMultiplier: 120 }
  },
  {
    id: 'infected_clip',
    name: 'Infected Clip',
    cost: 11,
    maxRank: 5,
    rarity: 'Uncommon',
    description: '+90% Toxin',
    stats: { statusChance: 15 }
  },
  {
    id: 'stormbringer',
    name: 'Stormbringer',
    cost: 11,
    maxRank: 5,
    rarity: 'Uncommon',
    description: '+90% Electricity',
    stats: { statusChance: 15 }
  },
  {
    id: 'hellfire',
    name: 'Hellfire',
    cost: 11,
    maxRank: 5,
    rarity: 'Uncommon',
    description: '+90% Heat',
    stats: { statusChance: 15 }
  },
  {
    id: 'cryo_rounds',
    name: 'Cryo Rounds',
    cost: 11,
    maxRank: 5,
    rarity: 'Uncommon',
    description: '+90% Cold',
    stats: { statusChance: 15 }
  },
  {
    id: 'malignant_force',
    name: 'Malignant Force',
    cost: 7,
    maxRank: 5,
    rarity: 'Rare',
    description: '+60% Toxin, +60% Status Chance',
    stats: { statusChance: 60 }
  },
  {
    id: 'high_voltage',
    name: 'High Voltage',
    cost: 7,
    maxRank: 5,
    rarity: 'Rare',
    description: '+60% Electricity, +60% Status Chance',
    stats: { statusChance: 60 }
  },
  {
    id: 'thermite_rounds',
    name: 'Thermite Rounds',
    cost: 7,
    maxRank: 5,
    rarity: 'Rare',
    description: '+60% Heat, +60% Status Chance',
    stats: { statusChance: 60 }
  },
  {
    id: 'rime_rounds',
    name: 'Rime Rounds',
    cost: 7,
    maxRank: 5,
    rarity: 'Rare',
    description: '+60% Cold, +60% Status Chance',
    stats: { statusChance: 60 }
  },
  {
    id: 'speed_trigger',
    name: 'Speed Trigger',
    cost: 9,
    maxRank: 5,
    rarity: 'Uncommon',
    description: '+60% Fire Rate',
    stats: { fireRate: 60 }
  },
  {
    id: 'amalgam_serration',
    name: 'Amalgam Serration',
    cost: 14,
    maxRank: 10,
    rarity: 'Amalgam',
    description: '+155% Damage, +25% Sprint Speed',
    stats: { damage: 155 }
  }
];

export const SECONDARY_MODS: WeaponMod[] = [
  {
    id: 'hornet_strike',
    name: 'Hornet Strike',
    cost: 14,
    maxRank: 10,
    rarity: 'Uncommon',
    description: '+220% Damage',
    stats: { damage: 220 }
  },
  {
    id: 'barrel_diffusion',
    name: 'Barrel Diffusion',
    cost: 11,
    maxRank: 5,
    rarity: 'Rare',
    description: '+120% Multishot',
    stats: { multishot: 120 }
  },
  {
    id: 'lethal_torrent',
    name: 'Lethal Torrent',
    cost: 11,
    maxRank: 5,
    rarity: 'Rare',
    description: '+60% Fire Rate, +60% Multishot',
    stats: { fireRate: 60, multishot: 60 }
  },
  {
    id: 'target_cracker',
    name: 'Target Cracker',
    cost: 9,
    maxRank: 5,
    rarity: 'Rare',
    description: '+60% Critical Damage',
    stats: { critMultiplier: 60 }
  },
  {
    id: 'pistol_gambit',
    name: 'Pistol Gambit',
    cost: 9,
    maxRank: 5,
    rarity: 'Common',
    description: '+120% Critical Chance',
    stats: { critChance: 120 }
  },
  {
    id: 'convulsion',
    name: 'Convulsion',
    cost: 11,
    maxRank: 5,
    rarity: 'Uncommon',
    description: '+90% Electricity',
    stats: { statusChance: 15 }
  },
  {
    id: 'heated_charge',
    name: 'Heated Charge',
    cost: 11,
    maxRank: 5,
    rarity: 'Uncommon',
    description: '+90% Heat',
    stats: { statusChance: 15 }
  },
  {
    id: 'deep_freeze',
    name: 'Deep Freeze',
    cost: 11,
    maxRank: 5,
    rarity: 'Uncommon',
    description: '+90% Cold',
    stats: { statusChance: 15 }
  },
  {
    id: 'pistol_pestilence',
    name: 'Pistol Pestilence',
    cost: 7,
    maxRank: 5,
    rarity: 'Rare',
    description: '+60% Toxin, +60% Status Chance',
    stats: { statusChance: 60 }
  },
  {
    id: 'jolt',
    name: 'Jolt',
    cost: 7,
    maxRank: 5,
    rarity: 'Rare',
    description: '+60% Electricity, +60% Status Chance',
    stats: { statusChance: 60 }
  },
  {
    id: 'scorch',
    name: 'Scorch',
    cost: 7,
    maxRank: 5,
    rarity: 'Rare',
    description: '+60% Heat, +60% Status Chance',
    stats: { statusChance: 60 }
  },
  {
    id: 'frostbite',
    name: 'Frostbite',
    cost: 7,
    maxRank: 5,
    rarity: 'Rare',
    description: '+60% Cold, +60% Status Chance',
    stats: { statusChance: 60 }
  }
];

export const COMPANIONS: Companion[] = [
  {
    id: 'smeeta_kavat',
    name: 'Smeeta Kavat (แมวส้ม Smeeta)',
    type: 'Kavat',
    baseStats: { health: 100, shield: 75, armor: 50 },
    origin: 'normal'
  },
  {
    id: 'carrier_prime',
    name: 'Carrier Prime (Sentinel กระสุน)',
    type: 'Sentinel',
    baseStats: { health: 400, shield: 100, armor: 150 },
    origin: 'normal'
  },
  {
    id: 'panzer_vulpaphyla',
    name: 'Panzer Vulpaphyla (แมวติดเชื้ออมตะ)',
    type: 'Vulpaphyla',
    baseStats: { health: 150, shield: 100, armor: 50 },
    origin: 'normal'
  },
  {
    id: 'helios_prime',
    name: 'Helios Prime (Sentinel สแกน)',
    type: 'Sentinel',
    baseStats: { health: 250, shield: 100, armor: 100 },
    origin: 'normal'
  },
  {
    id: 'vasca_kavat',
    name: 'Vasca Kavat (แมว Vasca Cetus)',
    type: 'Kavat',
    baseStats: { health: 120, shield: 60, armor: 80 },
    origin: 'cetus'
  },
  {
    id: 'fortuna_moa',
    name: 'Nychus MOA (หุ่นยนต์เดินได้ Fortuna)',
    type: 'MOA',
    baseStats: { health: 150, shield: 150, armor: 100 },
    origin: 'fortuna'
  },
  {
    id: 'fortuna_hound',
    name: 'Adrastea Hound (สุนัขกลต่อสู้ Fortuna)',
    type: 'Hound',
    baseStats: { health: 200, shield: 150, armor: 150 },
    origin: 'fortuna'
  }
];

export const WEAPON_ARCANES: Arcane[] = [
  {
    id: 'primary_merciless',
    name: 'Primary Merciless',
    effect: 'On Kill: +30% Damage for 4s. Stacks up to 12x. +30% Reload Speed. +100% Max Ammo.',
    rarity: 'Legendary',
    description: 'Increases weapon raw damage on any kill. Best on fast killing weapons.'
  },
  {
    id: 'primary_deadhead',
    name: 'Primary Deadhead',
    effect: 'On Headshot Kill: +120% Damage for 24s. Stacks up to 3x. +30% Headshot Multiplier.',
    rarity: 'Legendary',
    description: 'Increases reward for accurate precision shooters.'
  },
  {
    id: 'secondary_merciless',
    name: 'Secondary Merciless',
    effect: 'On Kill: +30% Damage for 4s. Stacks up to 12x. +30% Reload Speed.',
    rarity: 'Legendary',
    description: 'Powerful secondary general weapon arcane.'
  },
  {
    id: 'secondary_deadhead',
    name: 'Secondary Deadhead',
    effect: 'On Headshot Kill: +120% Damage for 24s. Stacks up to 3x. +30% Headshot Multiplier.',
    rarity: 'Legendary',
    description: 'Perfect for pistols to snipe headshots.'
  },
  {
    id: 'melee_crescendo',
    name: 'Melee Crescendo',
    effect: 'On Finisher Kill: Gain 6 Initial Combo for the rest of the mission.',
    rarity: 'Legendary',
    description: 'Provides permanent combo counter upgrades.'
  },
  {
    id: 'melee_exposure',
    name: 'Melee Exposure',
    effect: 'On Ability Cast: Add +45% Corrosive Damage to melee attacks for 25s. Stacks up to 240%.',
    rarity: 'Rare',
    description: 'Gives massive chemical damage bonus on spellcast.'
  }
];

export const WEAPON_EXILUS_MODS: WeaponMod[] = [
  {
    id: 'terminal_velocity',
    name: 'Terminal Velocity',
    cost: 9,
    maxRank: 5,
    rarity: 'Uncommon',
    description: '+60% Projectile Speed',
    stats: { fireRate: 10 }
  },
  {
    id: 'vigilante_supplies',
    name: 'Vigilante Supplies',
    cost: 9,
    maxRank: 5,
    rarity: 'Rare',
    description: 'Converts unused ammo types. +5% chance to enhance critical hits.',
    stats: { critChance: 5 }
  },
  {
    id: 'ruinous_extension',
    name: 'Ruinous Extension',
    cost: 9,
    maxRank: 5,
    rarity: 'Uncommon',
    description: '+8m Beam Range',
    stats: {}
  }
];

export const STANCE_MODS: WeaponMod[] = [
  {
    id: 'blind_justice',
    name: 'Blind Justice (Nikana)',
    cost: -4, // adds capacity like aura
    maxRank: 3,
    rarity: 'Uncommon',
    description: 'Stance: Fast strikes and multi-hit combos. +100% Melee Damage multiplier.',
    stats: { damage: 100 }
  },
  {
    id: 'sovereign_outcast',
    name: 'Sovereign Outcast (Tonfas)',
    cost: -4,
    maxRank: 3,
    rarity: 'Rare',
    description: 'Stance: Sweeping dual spin strikes. +120% Melee Damage multiplier.',
    stats: { damage: 120 }
  },
  {
    id: 'tempo_royale',
    name: 'Tempo Royale (Heavy Blade)',
    cost: -4,
    maxRank: 3,
    rarity: 'Rare',
    description: 'Stance: Imposing heavyweight momentum swings. +110% Melee Damage.',
    stats: { damage: 110 }
  }
];

export const COMPANION_MODS: CompanionMod[] = [
  {
    id: 'enhanced_vitality',
    name: 'Enhanced Vitality',
    cost: 9,
    maxRank: 10,
    rarity: 'Common',
    description: '+220% Health Link',
    stats: { health: 220 }
  },
  {
    id: 'calculated_redirection',
    name: 'Calculated Redirection',
    cost: 9,
    maxRank: 10,
    rarity: 'Common',
    description: '+275% Shield Link',
    stats: { shield: 275 }
  },
  {
    id: 'metal_fiber',
    name: 'Metal Fiber',
    cost: 9,
    maxRank: 10,
    rarity: 'Common',
    description: '+110% Armor Link',
    stats: { armor: 110 }
  },
  {
    id: 'vacuum',
    name: 'Vacuum',
    cost: 5,
    maxRank: 5,
    rarity: 'Common',
    description: 'Detects and pulls items within 11.5m',
    stats: { utility: 'Vacuum' }
  },
  {
    id: 'animal_instinct',
    name: 'Animal Instinct',
    cost: 11,
    maxRank: 5,
    rarity: 'Rare',
    description: '+30 Loot Radar, +20 Enemy Radar',
    stats: { utility: 'Radar' }
  },
  {
    id: 'medi_pet_kit',
    name: 'Medi-Pet Kit',
    cost: 9,
    maxRank: 5,
    rarity: 'Rare',
    description: '+6s Bleedout Delay, +6 Health/s Regeneration',
    stats: { health: 50 }
  },
  {
    id: 'fetch',
    name: 'Fetch',
    cost: 5,
    maxRank: 5,
    rarity: 'Common',
    description: 'Companion pulls items within 13.5m',
    stats: { utility: 'Fetch' }
  },
  {
    id: 'synth_fiber',
    name: 'Synth Fiber',
    cost: 9,
    maxRank: 5,
    rarity: 'Rare',
    description: 'Health Orbs increase companion armor by 100% for 12s',
    stats: { armor: 100 }
  }
];

export const MELEE_MODS: WeaponMod[] = [
  {
    id: 'pressure_point',
    name: 'Pressure Point',
    cost: 9,
    maxRank: 5,
    rarity: 'Common',
    description: '+120% Melee Damage',
    stats: { damage: 120 }
  },
  {
    id: 'primed_pressure_point',
    name: 'Primed Pressure Point',
    cost: 14,
    maxRank: 10,
    rarity: 'Primed',
    description: '+165% Melee Damage',
    stats: { damage: 165 }
  },
  {
    id: 'fury',
    name: 'Fury',
    cost: 9,
    maxRank: 5,
    rarity: 'Uncommon',
    description: '+30% Attack Speed',
    stats: { fireRate: 30 }
  },
  {
    id: 'true_steel',
    name: 'True Steel',
    cost: 9,
    maxRank: 5,
    rarity: 'Common',
    description: '+60% Critical Chance',
    stats: { critChance: 60 }
  },
  {
    id: 'organ_shatter',
    name: 'Organ Shatter',
    cost: 9,
    maxRank: 5,
    rarity: 'Common',
    description: '+90% Critical Damage',
    stats: { critMultiplier: 90 }
  },
  {
    id: 'fever_strike',
    name: 'Fever Strike',
    cost: 11,
    maxRank: 5,
    rarity: 'Uncommon',
    description: '+90% Toxin',
    stats: { statusChance: 15 }
  },
  {
    id: 'shocking_touch',
    name: 'Shocking Touch',
    cost: 11,
    maxRank: 5,
    rarity: 'Uncommon',
    description: '+90% Electricity',
    stats: { statusChance: 15 }
  },
  {
    id: 'molten_impact',
    name: 'Molten Impact',
    cost: 11,
    maxRank: 5,
    rarity: 'Uncommon',
    description: '+90% Heat',
    stats: { statusChance: 15 }
  },
  {
    id: 'north_wind',
    name: 'North Wind',
    cost: 11,
    maxRank: 5,
    rarity: 'Uncommon',
    description: '+90% Cold',
    stats: { statusChance: 15 }
  },
  {
    id: 'virulent_scourge',
    name: 'Virulent Scourge',
    cost: 7,
    maxRank: 5,
    rarity: 'Rare',
    description: '+60% Toxin, +60% Status Chance',
    stats: { statusChance: 60 }
  },
  {
    id: 'voltaic_strike',
    name: 'Voltaic Strike',
    cost: 7,
    maxRank: 5,
    rarity: 'Rare',
    description: '+60% Electricity, +60% Status Chance',
    stats: { statusChance: 60 }
  },
  {
    id: 'volcanic_edge',
    name: 'Volcanic Edge',
    cost: 7,
    maxRank: 5,
    rarity: 'Rare',
    description: '+60% Heat, +60% Status Chance',
    stats: { statusChance: 60 }
  },
  {
    id: 'vicious_frost',
    name: 'Vicious Frost',
    cost: 7,
    maxRank: 5,
    rarity: 'Rare',
    description: '+60% Cold, +60% Status Chance',
    stats: { statusChance: 60 }
  },
  {
    id: 'blood_rush',
    name: 'Blood Rush',
    cost: 14,
    maxRank: 10,
    rarity: 'Rare',
    description: '+40% Critical Chance stacks with Combo Multiplier',
    stats: { critChance: 40 }
  }
];

export const COMPANION_WEAPON_MODS: WeaponMod[] = [
  {
    id: 'companion_serration',
    name: 'Serrated Claws',
    cost: 9,
    maxRank: 10,
    rarity: 'Common',
    description: '+150% Base Damage',
    stats: { damage: 150 }
  },
  {
    id: 'companion_split_chamber',
    name: 'Dual Striking',
    cost: 9,
    maxRank: 5,
    rarity: 'Uncommon',
    description: '+90% Multishot',
    stats: { multishot: 90 }
  },
  {
    id: 'companion_point_strike',
    name: 'Targeting Array',
    cost: 7,
    maxRank: 5,
    rarity: 'Common',
    description: '+100% Critical Chance',
    stats: { critChance: 100 }
  },
  {
    id: 'companion_vital_sense',
    name: 'Predatory Instinct',
    cost: 7,
    maxRank: 5,
    rarity: 'Rare',
    description: '+110% Critical Damage',
    stats: { critMultiplier: 110 }
  }
];

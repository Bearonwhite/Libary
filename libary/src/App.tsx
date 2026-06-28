/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { Build, User, Warframe, WarframeMod, Arcane, HelminthAbility, WeaponMod, CompanionMod, UserRole, Polarity } from './types/warframe';
import { WARFRAMES, MODS, ARCANES, HELMINTH_ABILITIES, WEAPONS, COMPANIONS } from './data/warframeData';
import Header from './components/Header';
import BuildGrid from './components/BuildGrid';
import ModGrid from './components/ModGrid';
import StatPanel from './components/StatPanel';
import ArcaneSelector from './components/ArcaneSelector';
import HelminthSelector from './components/HelminthSelector';
import AuthModal from './components/AuthModal';
import FolderStructureView from './components/FolderStructureView';
import ExtraBuildSlots from './components/ExtraBuildSlots';
import AdminCloudPanel from './components/AdminCloudPanel';
import { Shield, Sparkles, HelpCircle, Save, X, Hammer, ClipboardCheck, CloudDownload } from 'lucide-react';

// INITIAL PRE-LOADED BUILDS (to showcase guest vs member and complex setups immediately)
const DEFAULT_BUILDS: Build[] = [
  {
    id: 'saryn_endgame_nuke',
    title: 'Saryn Prime - Roaring Plague (Endgame Nuke)',
    description: 'บิลด์ความแรงสูงสำหรับฟาร์มทรัพยากรระดับสูงและ Steel Path ซับซูมสกิล Roar แทนที่ Molt เพื่อเร่งความแรงพิษและการระเบิดสปอร์ให้รุนแรงขึ้นเป็นทวีคูณ',
    warframeId: 'saryn',
    creatorId: 'member_teshin',
    creatorName: 'Teshin_Prime',
    isMemberOnly: true, // MEMBER ONLY BUILD - Hidden from guests!
    auraMod: MODS.find(m => m.id === 'growing_power') || null,
    exilusMod: MODS.find(m => m.id === 'power_drift') || null,
    mods: [
      MODS.find(m => m.id === 'vitality') || null,
      MODS.find(m => m.id === 'primed_continuity') || null,
      MODS.find(m => m.id === 'stretch') || null,
      MODS.find(m => m.id === 'streamline') || null,
      MODS.find(m => m.id === 'transient_fortitude') || null,
      MODS.find(m => m.id === 'blind_rage') || null,
      MODS.find(m => m.id === 'overextended') || null,
      MODS.find(m => m.id === 'primed_flow') || null,
    ],
    arcanes: [
      ARCANES.find(a => a.id === 'arcane_energize') || null,
      ARCANES.find(a => a.id === 'arcane_guardian') || null,
    ],
    helminthAbility: HELMINTH_ABILITIES.find(h => h.id === 'roar') || null,
    helminthReplacedIndex: 1, // replaced Molt (2nd skill, 0-indexed is 1)
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'volt_speed_runner',
    title: 'Volt - Speedrun God (Infinite Speed Build)',
    description: 'บิลด์เน้นความเร็วสูงสุดระดับเทพ เหมาะกับการเล่นวิ่งทำเควสด่วน, Capture, และวิ่งชนศัตรูให้ช็อค ใส่ Rush และ ม็อดเพิ่มระยะเวลาสกิลเพื่อให้วิ่งเร็วนานขึ้น',
    warframeId: 'volt',
    creatorId: 'member_teshin',
    creatorName: 'Teshin_Prime',
    isMemberOnly: false, // PUBLIC BUILD - Everyone can see
    auraMod: MODS.find(m => m.id === 'steel_charge') || null,
    exilusMod: MODS.find(m => m.id === 'rush') || null,
    mods: [
      MODS.find(m => m.id === 'redirection') || null,
      MODS.find(m => m.id === 'flow') || null,
      MODS.find(m => m.id === 'continuity') || null,
      MODS.find(m => m.id === 'stretch') || null,
      MODS.find(m => m.id === 'streamline') || null,
      null, null, null
    ],
    arcanes: [
      ARCANES.find(a => a.id === 'arcane_velocity') || null,
      null
    ],
    helminthAbility: null,
    helminthReplacedIndex: -1,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'excalibur_swordmaster_classic',
    title: 'Excalibur - Blade Mastery Classic',
    description: 'บิลด์มาตรฐานสำหรับผู้เล่นใหม่และผู้เริ่มต้น เพิ่มความเสียหายดาบกายภาพด้วย Steel Charge และเพิ่มสเตตัสความอึดและระยะเวลาสกิลสำหรับสับ Exalted Blade สะใจ',
    warframeId: 'excalibur',
    creatorId: 'guest_operator',
    creatorName: 'Guest_Operator',
    isMemberOnly: false, // PUBLIC BUILD - Everyone can see
    auraMod: MODS.find(m => m.id === 'steel_charge') || null,
    exilusMod: null,
    mods: [
      MODS.find(m => m.id === 'vitality') || null,
      MODS.find(m => m.id === 'steel_fiber') || null,
      MODS.find(m => m.id === 'intensify') || null,
      MODS.find(m => m.id === 'continuity') || null,
      MODS.find(m => m.id === 'streamline') || null,
      null, null, null
    ],
    arcanes: [
      ARCANES.find(a => a.id === 'arcane_avenger') || null,
      null
    ],
    helminthAbility: null,
    helminthReplacedIndex: -1,
    updatedAt: new Date().toISOString(),
  }
];

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'admin_initial',
    username: 'Lotus_Admin',
    role: 'admin'
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'editor' | 'structure' | 'admin'>('dashboard');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [builds, setBuilds] = useState<Build[]>([]);

  // Simulated Database Users List (Supabase Sync)
  const [simulatedUsers, setSimulatedUsers] = useState<User[]>([
    { id: 'admin_initial', username: 'Lotus_Admin', role: 'admin' },
    { id: 'member_teshin', username: 'Teshin_Prime', role: 'member' },
    { id: 'member_darvo', username: 'Darvo_Deals', role: 'member' },
    { id: 'guest_anonymous_8811', username: 'Guest_Operator', role: 'guest' }
  ]);

  // Simulated static cloud file download overlay
  const [isDownloadingCloudJson, setIsDownloadingCloudJson] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [globalBuildsJson, setGlobalBuildsJson] = useState('');

  // EDITOR STATE
  const [editingBuildId, setEditingBuildId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editIsMemberOnly, setEditIsMemberOnly] = useState(false);
  const [selectedFrame, setSelectedFrame] = useState<Warframe>(WARFRAMES[0]);
  const [auraMod, setAuraMod] = useState<WarframeMod | null>(null);
  const [exilusMod, setExilusMod] = useState<WarframeMod | null>(null);
  const [slottedMods, setSlottedMods] = useState<(WarframeMod | null)[]>(Array(8).fill(null));
  const [slottedArcanes, setSlottedArcanes] = useState<(Arcane | null)[]>(Array(2).fill(null));
  const [helminthAbility, setHelminthAbility] = useState<HelminthAbility | null>(null);
  const [helminthReplacedIndex, setHelminthReplacedIndex] = useState<number>(-1);

  // EXTRA BUILD SLOTS STATES
  const [editCategory, setEditCategory] = useState<'warframe' | 'primary' | 'secondary' | 'melee' | 'companion' | 'companion_weapon' | 'hybrid'>('warframe');

  const [primaryWeaponId, setPrimaryWeaponId] = useState<string>('');
  const [primaryMods, setPrimaryMods] = useState<(WeaponMod | null)[]>(Array(8).fill(null));
  const [primaryArcane, setPrimaryArcane] = useState<Arcane | null>(null);
  const [primaryExilusMod, setPrimaryExilusMod] = useState<WeaponMod | null>(null);
  const [primaryPolarities, setPrimaryPolarities] = useState<Polarity[]>(Array(8).fill('None'));
  const [primaryFormasCount, setPrimaryFormasCount] = useState<number>(0);
  const [isPrimaryIncarnon, setIsPrimaryIncarnon] = useState<boolean>(false);

  const [secondaryWeaponId, setSecondaryWeaponId] = useState<string>('');
  const [secondaryMods, setSecondaryMods] = useState<(WeaponMod | null)[]>(Array(8).fill(null));
  const [secondaryArcane, setSecondaryArcane] = useState<Arcane | null>(null);
  const [secondaryExilusMod, setSecondaryExilusMod] = useState<WeaponMod | null>(null);
  const [secondaryPolarities, setSecondaryPolarities] = useState<Polarity[]>(Array(8).fill('None'));
  const [secondaryFormasCount, setSecondaryFormasCount] = useState<number>(0);
  const [isSecondaryIncarnon, setIsSecondaryIncarnon] = useState<boolean>(false);

  const [meleeWeaponId, setMeleeWeaponId] = useState<string>('');
  const [meleeMods, setMeleeMods] = useState<(WeaponMod | null)[]>(Array(8).fill(null));
  const [meleeArcane, setMeleeArcane] = useState<Arcane | null>(null);
  const [meleeExilusMod, setMeleeExilusMod] = useState<WeaponMod | null>(null);
  const [meleeStanceMod, setMeleeStanceMod] = useState<WeaponMod | null>(null);
  const [meleePolarities, setMeleePolarities] = useState<Polarity[]>(Array(8).fill('None'));
  const [meleeFormasCount, setMeleeFormasCount] = useState<number>(0);
  const [isMeleeIncarnon, setIsMeleeIncarnon] = useState<boolean>(false);

  const [companionId, setCompanionId] = useState<string>('');
  const [companionMods, setCompanionMods] = useState<(CompanionMod | null)[]>(Array(8).fill(null));
  const [companionPolarities, setCompanionPolarities] = useState<Polarity[]>(Array(8).fill('None'));

  const [companionWeaponId, setCompanionWeaponId] = useState<string>('');
  const [companionWeaponMods, setCompanionWeaponMods] = useState<(WeaponMod | null)[]>(Array(8).fill(null));
  const [companionWeaponPolarities, setCompanionWeaponPolarities] = useState<Polarity[]>(Array(8).fill('None'));

  // LOAD INITIAL DATA
  useEffect(() => {
    // 1. Load builds backup
    const stored = localStorage.getItem('warframe_builds_backup');
    if (stored) {
      try {
        setBuilds(JSON.parse(stored));
      } catch (e) {
        setBuilds(DEFAULT_BUILDS);
      }
    } else {
      localStorage.setItem('warframe_builds_backup', JSON.stringify(DEFAULT_BUILDS));
      setBuilds(DEFAULT_BUILDS);
    }

    // 2. Load or seed simulated cloud users table
    const storedUsers = localStorage.getItem('warframe_simulated_users');
    if (storedUsers) {
      try {
        setSimulatedUsers(JSON.parse(storedUsers));
      } catch (e) {
        // use default
      }
    } else {
      localStorage.setItem('warframe_simulated_users', JSON.stringify(simulatedUsers));
    }

    // 3. Load or seed global builds json payload
    const storedGlobalJson = localStorage.getItem('warframe_global_builds_json');
    if (storedGlobalJson) {
      setGlobalBuildsJson(storedGlobalJson);
    } else {
      const initialJson = JSON.stringify(DEFAULT_BUILDS, null, 2);
      setGlobalBuildsJson(initialJson);
      localStorage.setItem('warframe_global_builds_json', initialJson);
    }
  }, []);

  // SAVE TO LOCALSTORAGE UTILITY
  const saveBuildsToStorage = (updatedBuilds: Build[]) => {
    setBuilds(updatedBuilds);
    localStorage.setItem('warframe_builds_backup', JSON.stringify(updatedBuilds));
  };

  // HANDLE USER LOGIN
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    
    // Simulating downloading builds_backup.json from Supabase Storage on login
    if (user.role === 'member' || user.role === 'admin') {
      setIsDownloadingCloudJson(true);
      setDownloadProgress(0);
      
      const interval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setIsDownloadingCloudJson(false);
              // Retrieve simulated cloud static file
              const cloudBackup = localStorage.getItem('warframe_global_builds_json');
              if (cloudBackup) {
                try {
                  const parsed = JSON.parse(cloudBackup);
                  if (Array.isArray(parsed) && parsed.length > 0) {
                    saveBuildsToStorage(parsed);
                  }
                } catch (e) {
                  // Fallback
                }
              }
            }, 600);
            return 100;
          }
          return prev + 25;
        });
      }, 200);
    }
  };

  // HANDLE USER LOGOUT
  const handleLogout = () => {
    setCurrentUser({
      id: 'guest_anonymous_8811',
      username: 'Guest_Operator',
      role: 'guest'
    });
    setActiveTab('dashboard');
  };

  // LOAD BUILD INTO EDITOR FOR EDITING
  const handleLoadEdit = (build: Build) => {
    const frame = WARFRAMES.find(wf => wf.id === build.warframeId) || WARFRAMES[0];
    
    setEditingBuildId(build.id);
    setEditTitle(build.title);
    setEditDescription(build.description);
    setEditIsMemberOnly(build.isMemberOnly);
    setSelectedFrame(frame);
    setAuraMod(build.auraMod);
    setExilusMod(build.exilusMod);
    
    // Ensure accurate array sizes
    const loadedMods = [...build.mods];
    while (loadedMods.length < 8) loadedMods.push(null);
    setSlottedMods(loadedMods);

    const loadedArcanes = [...build.arcanes];
    while (loadedArcanes.length < 2) loadedArcanes.push(null);
    setSlottedArcanes(loadedArcanes);

    setHelminthAbility(build.helminthAbility);
    setHelminthReplacedIndex(build.helminthReplacedIndex);

    // Load Weapons and Companions
    setPrimaryWeaponId(build.primaryWeaponId || WEAPONS.filter(w => w.type === 'primary')[0].id);
    const loadedPrimaryMods = build.primaryMods ? [...build.primaryMods] : Array(8).fill(null);
    while (loadedPrimaryMods.length < 8) loadedPrimaryMods.push(null);
    setPrimaryMods(loadedPrimaryMods);
    setPrimaryArcane(build.primaryArcane || null);

    setSecondaryWeaponId(build.secondaryWeaponId || WEAPONS.filter(w => w.type === 'secondary')[0].id);
    const loadedSecondaryMods = build.secondaryMods ? [...build.secondaryMods] : Array(8).fill(null);
    while (loadedSecondaryMods.length < 8) loadedSecondaryMods.push(null);
    setSecondaryMods(loadedSecondaryMods);
    setSecondaryArcane(build.secondaryArcane || null);

    setMeleeWeaponId(build.meleeWeaponId || WEAPONS.filter(w => w.type === 'melee')[0].id);
    const loadedMeleeMods = build.meleeMods ? [...build.meleeMods] : Array(8).fill(null);
    while (loadedMeleeMods.length < 8) loadedMeleeMods.push(null);
    setMeleeMods(loadedMeleeMods);
    setMeleeArcane(build.meleeArcane || null);

    setCompanionId(build.companionId || COMPANIONS[0].id);
    const loadedCompanionMods = build.companionMods ? [...build.companionMods] : Array(8).fill(null);
    while (loadedCompanionMods.length < 8) loadedCompanionMods.push(null);
    setCompanionMods(loadedCompanionMods);

    setCompanionWeaponId(build.companionWeaponId || WEAPONS.filter(w => w.type === 'companion_weapon')[0].id);
    const loadedCompanionWeaponMods = build.companionWeaponMods ? [...build.companionWeaponMods] : Array(8).fill(null);
    while (loadedCompanionWeaponMods.length < 8) loadedCompanionWeaponMods.push(null);
    setCompanionWeaponMods(loadedCompanionWeaponMods);

    // Load extra weapon configs
    setEditCategory(build.category || 'warframe');
    setPrimaryExilusMod(build.primaryExilusMod || null);
    setPrimaryPolarities(build.primaryPolarities || Array(8).fill('None'));
    setPrimaryFormasCount(build.primaryFormasCount || 0);
    setIsPrimaryIncarnon(build.isPrimaryIncarnon || false);

    setSecondaryExilusMod(build.secondaryExilusMod || null);
    setSecondaryPolarities(build.secondaryPolarities || Array(8).fill('None'));
    setSecondaryFormasCount(build.secondaryFormasCount || 0);
    setIsSecondaryIncarnon(build.isSecondaryIncarnon || false);

    setMeleeExilusMod(build.meleeExilusMod || null);
    setMeleeStanceMod(build.meleeStanceMod || null);
    setMeleePolarities(build.meleePolarities || Array(8).fill('None'));
    setMeleeFormasCount(build.meleeFormasCount || 0);
    setIsMeleeIncarnon(build.isMeleeIncarnon || false);

    setCompanionPolarities(build.companionPolarities || Array(8).fill('None'));
    setCompanionWeaponPolarities(build.companionWeaponPolarities || Array(8).fill('None'));

    setActiveTab('editor');
  };

  // INITIALIZE A NEW BLANK BUILD IN EDITOR
  const handleCreateNewClick = () => {
    setEditingBuildId(null);
    setEditTitle('บิลด์ใหม่ของฉัน');
    setEditDescription('คำอธิบายประกอบการเล่นบิลด์นี้...');
    setEditIsMemberOnly(false);
    setSelectedFrame(WARFRAMES[0]);
    setAuraMod(null);
    setExilusMod(null);
    setSlottedMods(Array(8).fill(null));
    setSlottedArcanes(Array(2).fill(null));
    setHelminthAbility(null);
    setHelminthReplacedIndex(-1);

    // Setup default weapons and companion slots
    setPrimaryWeaponId(WEAPONS.filter(w => w.type === 'primary')[0].id);
    setPrimaryMods(Array(8).fill(null));
    setPrimaryArcane(null);
    setPrimaryExilusMod(null);
    setPrimaryPolarities(Array(8).fill('None'));
    setPrimaryFormasCount(0);
    setIsPrimaryIncarnon(false);

    setSecondaryWeaponId(WEAPONS.filter(w => w.type === 'secondary')[0].id);
    setSecondaryMods(Array(8).fill(null));
    setSecondaryArcane(null);
    setSecondaryExilusMod(null);
    setSecondaryPolarities(Array(8).fill('None'));
    setSecondaryFormasCount(0);
    setIsSecondaryIncarnon(false);

    setMeleeWeaponId(WEAPONS.filter(w => w.type === 'melee')[0].id);
    setMeleeMods(Array(8).fill(null));
    setMeleeArcane(null);
    setMeleeExilusMod(null);
    setMeleeStanceMod(null);
    setMeleePolarities(Array(8).fill('None'));
    setMeleeFormasCount(0);
    setIsMeleeIncarnon(false);

    setCompanionId(COMPANIONS[0].id);
    setCompanionMods(Array(8).fill(null));
    setCompanionPolarities(Array(8).fill('None'));

    setCompanionWeaponId(WEAPONS.filter(w => w.type === 'companion_weapon')[0].id);
    setCompanionWeaponMods(Array(8).fill(null));
    setCompanionWeaponPolarities(Array(8).fill('None'));

    setEditCategory('warframe');
    setActiveTab('editor');
  };

  // FRAME SELECTOR CHANGE (resets slots and configuration polarities)
  const handleFrameChange = (frameId: string) => {
    const frame = WARFRAMES.find(wf => wf.id === frameId);
    if (frame) {
      setSelectedFrame(frame);
      // Clear slotted mods because polarities and slots change
      setAuraMod(null);
      setExilusMod(null);
      setSlottedMods(Array(8).fill(null));
      setHelminthAbility(null);
      setHelminthReplacedIndex(-1);
    }
  };

  // SAVE MOD STATE CHANGERS
  const handleModSlotChange = (index: number, mod: WarframeMod | null) => {
    const updated = [...slottedMods];
    updated[index] = mod;
    setSlottedMods(updated);
  };

  const handleArcaneSlotChange = (index: number, arcane: Arcane | null) => {
    const updated = [...slottedArcanes];
    updated[index] = arcane;
    setSlottedArcanes(updated);
  };

  // DELETE BUILD
  const handleDeleteBuild = (id: string) => {
    if (confirm('คุณต้องการลบบิลด์นี้ออกจากระบบสำรองใช่หรือไม่?')) {
      const updated = builds.filter(b => b.id !== id);
      saveBuildsToStorage(updated);
    }
  };

  // EXPORT ALL BUILDS TO JSON FILE
  const handleExportBuilds = () => {
    try {
      const dataStr = JSON.stringify(builds, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `warframe_builds_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('เกิดข้อผิดพลาดในการส่งออกไฟล์ JSON');
    }
  };

  // IMPORT BUILDS FROM JSON FILE
  const handleImportBuilds = (importedList: any[]) => {
    if (!Array.isArray(importedList)) {
      alert('ข้อมูลที่นำเข้าต้องเป็น Array ของข้อมูล Build เท่านั้น');
      return;
    }

    // Basic validation
    const valid = importedList.every(b => b && typeof b === 'object' && b.id && b.title && b.warframeId);
    if (!valid) {
      alert('ข้อมูลบิลด์บางรายการมีฟอร์แมตไม่ถูกต้อง ขาดฟิลด์จำเป็น เช่น id, title, warframeId');
      return;
    }

    if (confirm(`พบข้อมูลบิลด์จำนวน ${importedList.length} รายการ คุณต้องการนำเข้ามาเขียนเพิ่มในระบบสำรองใช่หรือไม่? (บิลด์ที่ ID ซ้ำกันจะอัปเดต ID ใหม่ให้ไม่ทับกัน)`)) {
      const existingIds = new Set(builds.map(b => b.id));
      const merged = [...builds];
      let importedCount = 0;

      importedList.forEach(b => {
        if (existingIds.has(b.id)) {
          // generate a new id to prevent duplication issues
          const newId = 'build_' + Math.random().toString(36).substr(2, 9);
          merged.push({ ...b, id: newId });
        } else {
          merged.push(b);
        }
        importedCount++;
      });

      saveBuildsToStorage(merged);
      alert(`นำเข้าสำเร็จเรียบร้อยจำนวน ${importedCount} บิลด์!`);
    }
  };

  // SIMULATED DATABASE SYNC HELPERS
  const handleAddSimulatedUser = (user: User) => {
    setSimulatedUsers(prev => {
      const next = [...prev, user];
      localStorage.setItem('warframe_simulated_users', JSON.stringify(next));
      return next;
    });
  };

  const handleRemoveSimulatedUser = (id: string) => {
    setSimulatedUsers(prev => {
      const next = prev.filter(u => u.id !== id);
      localStorage.setItem('warframe_simulated_users', JSON.stringify(next));
      return next;
    });
  };

  const handleCommitGlobalBuildsJson = (jsonString: string) => {
    setGlobalBuildsJson(jsonString);
    localStorage.setItem('warframe_global_builds_json', jsonString);
  };

  // SUBMIT SAVE BUILD TO DATABASE/STORAGE
  const handleSaveBuildSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim()) {
      alert('กรุณากรอกชื่อบิลด์ด้วยครับ');
      return;
    }

    const compiledBuild: Build = {
      id: editingBuildId || 'build_' + Math.random().toString(36).substr(2, 9),
      title: editTitle.trim(),
      description: editDescription.trim(),
      warframeId: selectedFrame.id,
      creatorId: currentUser.id,
      creatorName: currentUser.username,
      isMemberOnly: editIsMemberOnly,
      category: editCategory,
      auraMod: auraMod,
      exilusMod: exilusMod,
      mods: slottedMods,
      arcanes: slottedArcanes,
      helminthAbility: helminthAbility,
      helminthReplacedIndex: helminthReplacedIndex,

      primaryWeaponId: primaryWeaponId,
      primaryMods: primaryMods,
      primaryArcane: primaryArcane,
      primaryExilusMod: primaryExilusMod,
      primaryPolarities: primaryPolarities,
      primaryFormasCount: primaryFormasCount,
      isPrimaryIncarnon: isPrimaryIncarnon,

      secondaryWeaponId: secondaryWeaponId,
      secondaryMods: secondaryMods,
      secondaryArcane: secondaryArcane,
      secondaryExilusMod: secondaryExilusMod,
      secondaryPolarities: secondaryPolarities,
      secondaryFormasCount: secondaryFormasCount,
      isSecondaryIncarnon: isSecondaryIncarnon,

      meleeWeaponId: meleeWeaponId,
      meleeMods: meleeMods,
      meleeArcane: meleeArcane,
      meleeExilusMod: meleeExilusMod,
      meleeStanceMod: meleeStanceMod,
      meleePolarities: meleePolarities,
      meleeFormasCount: meleeFormasCount,
      isMeleeIncarnon: isMeleeIncarnon,

      companionId: companionId,
      companionMods: companionMods,
      companionPolarities: companionPolarities,

      companionWeaponId: companionWeaponId,
      companionWeaponMods: companionWeaponMods,
      companionWeaponPolarities: companionWeaponPolarities,

      updatedAt: new Date().toISOString()
    };

    let updatedList: Build[];
    if (editingBuildId) {
      // Update existing
      updatedList = builds.map(b => b.id === editingBuildId ? compiledBuild : b);
    } else {
      // Create new
      updatedList = [compiledBuild, ...builds];
    }

    saveBuildsToStorage(updatedList);
    alert('บันทึกและสำรองบิลด์สำเร็จแล้ว!');
    setActiveTab('dashboard');
  };

  // UTILITY FOR GUEST AUTO WARNING REGARDING MEMBER STATUS
  const blockSaveForGuestsIfMemberOnly = editIsMemberOnly && currentUser.role === 'guest';

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-300 font-sans antialiased selection:bg-amber-500 selection:text-zinc-950 flex flex-col justify-between">
      {/* Background Ambience Dots */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/40 via-transparent to-transparent pointer-events-none z-0" />
      
      <div className="flex-1 relative z-10 flex flex-col">
        {/* Navigation Header */}
        <Header 
          currentUser={currentUser}
          onLoginClick={() => setIsAuthModalOpen(true)}
          onLogout={handleLogout}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          hasActiveBuild={editingBuildId !== null}
        />

        {/* Main Content Stage */}
        <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 flex-1 w-full">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-zinc-100 tracking-tight font-mono">
                    WARFRAME BUILD LISTS
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    ระบบสำรองและเรียนรู้สูตรบิลด์ยอดนิยม พร้อมตัวกรองระบบเข้าถึงสมาชิกลับเฉพาะ
                  </p>
                </div>
              </div>

              {/* Build Lists Grid */}
              <BuildGrid 
                builds={builds}
                currentUser={currentUser}
                onEditBuild={handleLoadEdit}
                onDeleteBuild={handleDeleteBuild}
                onCreateNewClick={handleCreateNewClick}
                onLoginClick={() => setIsAuthModalOpen(true)}
                onExportBuilds={handleExportBuilds}
                onImportBuilds={handleImportBuilds}
              />
            </div>
          )}

          {activeTab === 'editor' && (
            <form onSubmit={handleSaveBuildSubmit} className="space-y-6">
              {/* Editor Header Banner */}
              <div className="bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="space-y-1">
                  <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest font-mono flex items-center gap-1">
                    <Hammer size={12} />
                    <span>BUILD SMITH EDITOR</span>
                  </span>
                  <h2 className="text-xl font-bold text-zinc-100 leading-none">
                    {editingBuildId ? 'เครื่องมือปรับแต่งสำรองบิลด์เดิม' : 'สร้างสำรองสูตรบิลด์คลังแสงใหม่'}
                  </h2>
                  <p className="text-xs text-zinc-500">
                    ใส่รายละเอียด ค้นหาม็อดจัดสล็อต และเปลี่ยนสกิลเฟรมเพื่อสรุปผลลัพธ์
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('dashboard')}
                    className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-xs text-zinc-400 hover:text-zinc-200 font-semibold rounded-xl transition-all"
                  >
                    ยกเลิก (Cancel)
                  </button>

                  <button
                    type="submit"
                    disabled={blockSaveForGuestsIfMemberOnly}
                    className={`flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 text-xs font-bold rounded-xl transition-all shadow-lg shadow-amber-500/10 ${
                      blockSaveForGuestsIfMemberOnly ? 'opacity-40 cursor-not-allowed' : ''
                    }`}
                  >
                    <Save size={14} />
                    <span>บันทึกบิลด์ (Save Config)</span>
                  </button>
                </div>
              </div>

              {/* TWO COLUMNS EDITOR */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* LEFT MAIN EDITING CONTROLS COLUMN (8 slots) */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* BASIC META CARD */}
                  <div className="bg-zinc-900/30 border border-zinc-800 p-5 rounded-2xl space-y-4">
                    <h3 className="text-xs font-bold text-zinc-400 font-mono uppercase tracking-wider">
                      BASIC SPECIFICATIONS (รายละเอียดบิลด์)
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Frame selection */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-zinc-400">ตัวละครที่ต้องการจัดบิลด์ (Select Frame)</label>
                        <select
                          value={selectedFrame.id}
                          onChange={(e) => handleFrameChange(e.target.value)}
                          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-amber-500/50 cursor-pointer appearance-none"
                        >
                          {WARFRAMES.map(wf => (
                            <option key={wf.id} value={wf.id}>{wf.name} ({wf.title})</option>
                          ))}
                        </select>
                      </div>

                      {/* Title input */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-zinc-400">ชื่อชื่อบิลด์จัดทัพ (Build Title)</label>
                        <input
                          type="text"
                          required
                          placeholder="เช่น Saryn Plague Steel Path, Volt Speed God..."
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50"
                        />
                      </div>

                      {/* Description input */}
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="block text-xs font-semibold text-zinc-400">อธิบายแนวทางและสไตล์การเล่น (Build Explanation)</label>
                        <textarea
                          placeholder="อธิบายจุดประสงค์ของบิลด์นี้ว่าใช้กับเควสหรือด่านใด คอมโบอย่างไร..."
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 resize-y"
                        />
                      </div>

                      {/* Member-only Access controls */}
                      <div className="md:col-span-2 pt-2 border-t border-zinc-850 flex items-center justify-between">
                        <div className="space-y-0.5">
                          <label className="text-xs font-semibold text-zinc-300 block">เปิดใช้งานการเข้าถึงเฉพาะสมาชิก (Member Only Build)</label>
                          <span className="text-[10px] text-zinc-500 block">
                            เปิดเพื่อให้สตรีมเมอร์หรือนักจัดบิลด์สำรองข้อมูลพิเศษเฉพาะผู้มีสมาชิกเท่านั้น บัญชี Guest จะไม่สามารถเข้าถึงได้
                          </span>
                        </div>
                        
                        <div>
                          {currentUser.role === 'guest' ? (
                            <div className="flex flex-col items-end">
                              <span className="text-[9px] bg-cyan-950 text-cyan-400 border border-cyan-800/40 px-2 py-1 rounded font-mono">
                                GUEST CANNOT TOGGLE
                              </span>
                              <span className="text-[8px] text-zinc-500 mt-1">ล็อกอินเป็น Member เพื่อใช้ความสามารถนี้</span>
                            </div>
                          ) : (
                            <label className="relative inline-flex items-center cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={editIsMemberOnly}
                                onChange={(e) => setEditIsMemberOnly(e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-zinc-950 rounded-full peer peer-focus:ring-0 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-zinc-700 after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500 peer-checked:after:bg-zinc-950 peer-checked:after:border-zinc-950" />
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SHOW MODS GRID INTERACTIVE COMPONENT */}
                  <div className="bg-zinc-900/30 border border-zinc-800 p-5 rounded-2xl space-y-4">
                    <h3 className="text-xs font-bold text-zinc-400 font-mono uppercase tracking-wider">
                      SHOW MODS SYSTEM (ระบบติดตั้งการ์ดโมด)
                    </h3>
                    
                    <ModGrid 
                      auraMod={auraMod}
                      exilusMod={exilusMod}
                      mods={slottedMods}
                      auraPolarity={selectedFrame.auraPolarity}
                      exilusPolarity={selectedFrame.exilusPolarity}
                      polarities={selectedFrame.polarities}
                      onAuraChange={setAuraMod}
                      onExilusChange={setExilusMod}
                      onModChange={handleModSlotChange}
                    />
                  </div>

                  {/* ARCANES SYSTEM */}
                  <ArcaneSelector 
                    arcanes={slottedArcanes}
                    onArcaneChange={handleArcaneSlotChange}
                  />

                  {/* HELMINTH SYSTEM */}
                  <HelminthSelector 
                    warframe={selectedFrame}
                    selectedAbility={helminthAbility}
                    replacedIndex={helminthReplacedIndex}
                    onHelminthChange={(ab, idx) => {
                      setHelminthAbility(ab);
                      setHelminthReplacedIndex(idx);
                    }}
                  />

                  {/* WEAPONS & COMPANION SYSTEM (SLOTS 1, 2, 3, 4, 5) */}
                  <ExtraBuildSlots 
                    category={editCategory}
                    onCategoryChange={setEditCategory}

                    primaryWeaponId={primaryWeaponId}
                    onPrimaryWeaponChange={setPrimaryWeaponId}
                    primaryMods={primaryMods}
                    onPrimaryModChange={(idx, mod) => {
                      const updated = [...primaryMods];
                      updated[idx] = mod;
                      setPrimaryMods(updated);
                    }}
                    primaryArcane={primaryArcane}
                    onPrimaryArcaneChange={setPrimaryArcane}
                    primaryExilusMod={primaryExilusMod}
                    onPrimaryExilusModChange={setPrimaryExilusMod}
                    primaryPolarities={primaryPolarities}
                    onPrimaryPolarityChange={(idx, pol) => {
                      const updated = [...primaryPolarities];
                      updated[idx] = pol;
                      setPrimaryPolarities(updated);
                    }}
                    primaryFormasCount={primaryFormasCount}
                    onPrimaryFormasCountChange={setPrimaryFormasCount}
                    isPrimaryIncarnon={isPrimaryIncarnon}
                    onIsPrimaryIncarnonChange={setIsPrimaryIncarnon}

                    secondaryWeaponId={secondaryWeaponId}
                    onSecondaryWeaponChange={setSecondaryWeaponId}
                    secondaryMods={secondaryMods}
                    onSecondaryModChange={(idx, mod) => {
                      const updated = [...secondaryMods];
                      updated[idx] = mod;
                      setSecondaryMods(updated);
                    }}
                    secondaryArcane={secondaryArcane}
                    onSecondaryArcaneChange={setSecondaryArcane}
                    secondaryExilusMod={secondaryExilusMod}
                    onSecondaryExilusModChange={setSecondaryExilusMod}
                    secondaryPolarities={secondaryPolarities}
                    onSecondaryPolarityChange={(idx, pol) => {
                      const updated = [...secondaryPolarities];
                      updated[idx] = pol;
                      setSecondaryPolarities(updated);
                    }}
                    secondaryFormasCount={secondaryFormasCount}
                    onSecondaryFormasCountChange={setSecondaryFormasCount}
                    isSecondaryIncarnon={isSecondaryIncarnon}
                    onIsSecondaryIncarnonChange={setIsSecondaryIncarnon}

                    meleeWeaponId={meleeWeaponId}
                    onMeleeWeaponChange={setMeleeWeaponId}
                    meleeMods={meleeMods}
                    onMeleeModChange={(idx, mod) => {
                      const updated = [...meleeMods];
                      updated[idx] = mod;
                      setMeleeMods(updated);
                    }}
                    meleeArcane={meleeArcane}
                    onMeleeArcaneChange={setMeleeArcane}
                    meleeExilusMod={meleeExilusMod}
                    onMeleeExilusModChange={setMeleeExilusMod}
                    meleeStanceMod={meleeStanceMod}
                    onMeleeStanceModChange={setMeleeStanceMod}
                    meleePolarities={meleePolarities}
                    onMeleePolarityChange={(idx, pol) => {
                      const updated = [...meleePolarities];
                      updated[idx] = pol;
                      setMeleePolarities(updated);
                    }}
                    meleeFormasCount={meleeFormasCount}
                    onMeleeFormasCountChange={setMeleeFormasCount}
                    isMeleeIncarnon={isMeleeIncarnon}
                    onIsMeleeIncarnonChange={setIsMeleeIncarnon}

                    companionId={companionId}
                    onCompanionChange={setCompanionId}
                    companionMods={companionMods}
                    onCompanionModChange={(idx, mod) => {
                      const updated = [...companionMods];
                      updated[idx] = mod;
                      setCompanionMods(updated);
                    }}
                    companionPolarities={companionPolarities}
                    onCompanionPolarityChange={(idx, pol) => {
                      const updated = [...companionPolarities];
                      updated[idx] = pol;
                      setCompanionPolarities(updated);
                    }}

                    companionWeaponId={companionWeaponId}
                    onCompanionWeaponChange={setCompanionWeaponId}
                    companionWeaponMods={companionWeaponMods}
                    onCompanionWeaponModChange={(idx, mod) => {
                      const updated = [...companionWeaponMods];
                      updated[idx] = mod;
                      setCompanionWeaponMods(updated);
                    }}
                    companionWeaponPolarities={companionWeaponPolarities}
                    onCompanionWeaponPolarityChange={(idx, pol) => {
                      const updated = [...companionWeaponPolarities];
                      updated[idx] = pol;
                      setCompanionWeaponPolarities(updated);
                    }}
                  />

                </div>

                {/* RIGHT DETAILED CALCULATOR / STAT PANEL COLUMN (4 slots) */}
                <div className="lg:col-span-4 sticky top-20">
                  <StatPanel 
                    warframe={selectedFrame}
                    auraMod={auraMod}
                    exilusMod={exilusMod}
                    mods={slottedMods}
                  />

                  <div className="bg-zinc-950/40 border border-zinc-850 p-4.5 rounded-2xl mt-4 space-y-3">
                    <h5 className="text-[10px] font-bold text-zinc-400 font-mono tracking-wider uppercase">คำแนะนำก่อนสำรอง</h5>
                    <p className="text-[11px] text-zinc-500 leading-relaxed font-sans">
                      ม็อดขั้วเดียวกัน (Matched Polarity) จะลดค่าความต้องการใช้พลังการ์ดลงครึ่งหนึ่ง ม็อดขั้วไม่ตรงกับสล็อตจะเพิ่มค่าพลังการ์ด 25% หากความจุเกินลิมิต แนะนำให้ใช้ขั้วให้ถูกช่องหรือใส่ Aura ที่ถูกช่องเพื่อเร่งความจุสูงสุดได้
                    </p>
                  </div>
                </div>

              </div>
            </form>
          )}

          {activeTab === 'structure' && (
            <FolderStructureView />
          )}

          {activeTab === 'admin' && (
            <AdminCloudPanel 
              builds={builds}
              onAddSimulatedUser={handleAddSimulatedUser}
              simulatedUsers={simulatedUsers}
              onRemoveSimulatedUser={handleRemoveSimulatedUser}
              onCommitGlobalBuildsJson={handleCommitGlobalBuildsJson}
              globalBuildsJson={globalBuildsJson}
            />
          )}
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-zinc-950 border-t border-zinc-900 py-6 text-xs text-zinc-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>Warframe Build Backup & Storage v1.2</span>
          </div>
          <div className="text-center sm:text-right">
            Designed for Operators | Powered by React, Vite & Tailwind v4
          </div>
        </div>
      </footer>

      {/* LOGIN/ROLE AUTH MODAL PANEL */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />

      {/* CLOUD DOWNLOAD SIMULATION OVERLAY */}
      {isDownloadingCloudJson && (
        <div className="fixed inset-0 bg-[#070709]/95 z-[9999] flex flex-col items-center justify-center p-6 backdrop-blur-lg">
          <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-zinc-850">
              <div 
                className="h-full bg-gradient-to-r from-rose-500 to-rose-400 transition-all duration-200" 
                style={{ width: `${downloadProgress}%` }}
              />
            </div>

            <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto animate-pulse">
              <CloudDownload size={32} />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-zinc-100 font-mono tracking-tight">กำลังซิงค์และดึงข้อมูลจาก Cloud...</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                กำลังดาวน์โหลดไฟล์ <code className="text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded font-mono font-semibold">builds_backup.json</code> ({builds.length} บิลด์) 
                จากถังเก็บข้อมูลความจุสูงของ Supabase Storage 
                เพื่อประหยัดรอบการดึงฐานข้อมูลแบบเรียลไทม์
              </p>
            </div>

            {/* Progress bar container */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono text-zinc-500">
                <span>SUPABASE STORAGE CDN</span>
                <span>{downloadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-900">
                <div 
                  className="h-full bg-rose-500 transition-all duration-200" 
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
            </div>

            <div className="text-[10px] text-zinc-500 font-mono flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              <span>SECURE ACCESS VIA OAUTH TOKEN</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

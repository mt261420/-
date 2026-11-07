import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { EcoMap } from './components/EcoMap';
import { BioScanner } from './components/BioScanner';
import { Encyclopedia } from './components/EncyclopediaModal';
import { ResearchHQ } from './components/ResearchHQModal';
import { QuestModal } from './components/QuestModal';
import { CertificateModal } from './components/CertificateModal';
import { PurificationBattle } from './components/PurificationBattle';
import { RescueMission } from './components/RescueMission';
import { Species, PlayerStats, EcoMarker, Quest } from './types/game';
import { SPECIES_DATABASE } from './data/speciesData';
import { soundFX } from './utils/audio';

export default function App() {
  // Player Stats with LocalStorage hydration
  const [player, setPlayer] = useState<PlayerStats>(() => {
    const saved = localStorage.getItem('eco_guardian_player');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      name: '이정빈 연구소 수호원',
      title: '수습 생태 가디언',
      level: 1,
      exp: 0,
      maxExp: 300,
      hp: 150,
      maxHp: 150,
      energy: 80,
      maxEnergy: 80,
      gold: 500,
      bioCores: 2,
      scannerLevel: 1,
      toolLevel: 1,
      radarLevel: 1,
      purifiedCount: 0,
      rescuedCount: 0,
      scannedCount: 0,
    };
  });

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<'map' | 'scanner' | 'encyclopedia' | 'quests' | 'research'>('map');

  // Active Encounters
  const [activeBattleSpecies, setActiveBattleSpecies] = useState<Species | null>(null);
  const [activeRescueSpecies, setActiveRescueSpecies] = useState<Species | null>(null);

  // Modals
  const [showCertificate, setShowCertificate] = useState(false);

  // Discovered species collection
  const [discoveredSpeciesIds, setDiscoveredSpeciesIds] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('eco_guardian_discovered');
    if (saved) {
      try {
        return new Set(JSON.parse(saved));
      } catch (e) {}
    }
    // Initial starter discoveries
    return new Set(['endangered_otter', 'invasive_sicyos_angulatus']);
  });

  // Daily Quests
  const [quests, setQuests] = useState<Quest[]>([
    {
      id: 'quest_1',
      title: '우리 동네 외래 교란종 2회 정화',
      description: '하천변과 둘레길을 위협하는 가시박이나 뉴트리아 등 교란종을 퇴치하세요.',
      targetCount: 2,
      currentCount: 0,
      isCompleted: false,
      isClaimed: false,
      rewardExp: 200,
      rewardGold: 300,
      rewardCores: 2,
      type: 'purify',
    },
    {
      id: 'quest_2',
      title: '멸종위기 야생생물 1종 응급 보호',
      description: '수달, 맹꽁이 등 멸종위기 동물을 발견하고 비콘을 부착해 보호소에 등록하세요.',
      targetCount: 1,
      currentCount: 0,
      isCompleted: false,
      isClaimed: false,
      rewardExp: 250,
      rewardGold: 400,
      rewardCores: 3,
      type: 'rescue',
    },
    {
      id: 'quest_3',
      title: 'AI 생체 스캐너로 생물 감정 1회',
      description: '사진 촬영 또는 샘플을 업로드하여 Gemini AI 생물 판별을 실행하세요.',
      targetCount: 1,
      currentCount: 0,
      isCompleted: false,
      isClaimed: false,
      rewardExp: 150,
      rewardGold: 200,
      rewardCores: 1,
      type: 'scan',
    },
    {
      id: 'quest_4',
      title: '생태 레이더로 주변 순찰 3회',
      description: '지도 화면에서 주변 생태 레이더 스캔을 3회 실시하여 잠재 위협을 포착하세요.',
      targetCount: 3,
      currentCount: 0,
      isCompleted: false,
      isClaimed: false,
      rewardExp: 180,
      rewardGold: 250,
      rewardCores: 1,
      type: 'explore',
    },
  ]);

  // Initial Markers on the Eco-Radar Map
  const [markers, setMarkers] = useState<EcoMarker[]>([
    {
      id: 'm1',
      speciesId: 'invasive_sicyos_angulatus',
      name: '가시박 덩굴 군락',
      category: 'invasive',
      designation: '생태계교란 생물',
      lat: 37.5665,
      lng: 126.9780,
      sectorName: '우리 동네 수변 하천',
      discoveredAt: '방금 전',
      hp: 450,
      maxHp: 450,
    },
    {
      id: 'm2',
      speciesId: 'endangered_otter',
      name: '야생 수달 가족',
      category: 'endangered',
      designation: '멸종위기 야생생물 I급',
      lat: 37.5670,
      lng: 126.9800,
      sectorName: '우리 동네 수변 하천',
      discoveredAt: '10분 전',
      hp: 420,
      maxHp: 420,
    },
    {
      id: 'm3',
      speciesId: 'invasive_nutria',
      name: '괴물쥐 뉴트리아',
      category: 'invasive',
      designation: '생태계교란 생물',
      lat: 37.5650,
      lng: 126.9750,
      sectorName: '자연 늪지 & 저수지',
      discoveredAt: '25분 전',
      hp: 520,
      maxHp: 520,
    },
    {
      id: 'm4',
      speciesId: 'endangered_boreal_digging_frog',
      name: '산란지 맹꽁이',
      category: 'endangered',
      designation: '멸종위기 야생생물 II급',
      lat: 37.5685,
      lng: 126.9820,
      sectorName: '도심 근린공원 & 숲길',
      discoveredAt: '1시간 전',
      hp: 310,
      maxHp: 310,
    },
    {
      id: 'm5',
      speciesId: 'invasive_largemouth_bass',
      name: '포식자 큰입배스 떼',
      category: 'invasive',
      designation: '생태계교란 생물',
      lat: 37.5640,
      lng: 126.9790,
      sectorName: '우리 동네 수변 하천',
      discoveredAt: '40분 전',
      hp: 430,
      maxHp: 430,
    },
    {
      id: 'm6',
      speciesId: 'endangered_flying_squirrel',
      name: '고목 속 하늘다람쥐',
      category: 'endangered',
      designation: '멸종위기 야생생물 II급',
      lat: 37.5695,
      lng: 126.9740,
      sectorName: '동네 뒷산 생태통로',
      discoveredAt: '2시간 전',
      hp: 340,
      maxHp: 340,
    },
    {
      id: 'm7',
      speciesId: 'invasive_spotted_lanternfly',
      name: '꽃매미 집단 산란지',
      category: 'invasive',
      designation: '생태계교란 생물',
      lat: 37.5660,
      lng: 126.9840,
      sectorName: '도심 근린공원 & 숲길',
      discoveredAt: '15분 전',
      hp: 320,
      maxHp: 320,
    },
    {
      id: 'm8',
      speciesId: 'endangered_black_faced_spoonbill',
      name: '월동 저어새',
      category: 'endangered',
      designation: '멸종위기 야생생물 I급',
      lat: 37.5630,
      lng: 126.9810,
      sectorName: '자연 늪지 & 저수지',
      discoveredAt: '3시간 전',
      hp: 400,
      maxHp: 400,
    },
  ]);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('eco_guardian_player', JSON.stringify(player));
  }, [player]);

  useEffect(() => {
    localStorage.setItem('eco_guardian_discovered', JSON.stringify(Array.from(discoveredSpeciesIds)));
  }, [discoveredSpeciesIds]);

  // Cleansing Rate Calculation (0% to 100%)
  const cleansingRate = Math.min(
    100,
    Math.round(45 + player.purifiedCount * 4 + player.rescuedCount * 5)
  );

  // Quest Progression Helper
  const progressQuest = (type: 'purify' | 'rescue' | 'scan' | 'explore') => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.type === type && !q.isCompleted) {
          const nextCount = q.currentCount + 1;
          return {
            ...q,
            currentCount: nextCount,
            isCompleted: nextCount >= q.targetCount,
          };
        }
        return q;
      })
    );
  };

  // Add EXP and handle level-up
  const addPlayerRewards = (gainedExp: number, gainedGold: number, gainedCores: number) => {
    setPlayer((prev) => {
      let newExp = prev.exp + gainedExp;
      let newLevel = prev.level;
      let newMaxExp = prev.maxExp;
      let newMaxHp = prev.maxHp;
      let newMaxEnergy = prev.maxEnergy;
      let newTitle = prev.title;

      while (newExp >= newMaxExp) {
        newExp -= newMaxExp;
        newLevel += 1;
        newMaxExp = Math.round(newMaxExp * 1.3);
        newMaxHp += 25;
        newMaxEnergy += 10;
        soundFX.playLevelUp();
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.4 },
        });

        if (newLevel >= 15) newTitle = '생태계 수석 수호 총괄관';
        else if (newLevel >= 10) newTitle = '전설의 에코 마스터';
        else if (newLevel >= 7) newTitle = '베테랑 생태 정화관';
        else if (newLevel >= 4) newTitle = '공인 야생동물 수호단원';
        else if (newLevel >= 2) newTitle = '실전 탐사 가디언';
      }

      return {
        ...prev,
        level: newLevel,
        exp: newExp,
        maxExp: newMaxExp,
        hp: newMaxHp,
        maxHp: newMaxHp,
        energy: newMaxEnergy,
        maxEnergy: newMaxEnergy,
        gold: prev.gold + gainedGold,
        bioCores: prev.bioCores + gainedCores,
        title: newTitle,
      };
    });
  };

  // Handlers for Map Marker Click
  const handleSelectMapMarker = (marker: EcoMarker, species: Species) => {
    if (species.category === 'endangered') {
      setActiveRescueSpecies(species);
    } else {
      setActiveBattleSpecies(species);
    }
  };

  // Quick Spot encounter from Radar Scan
  const handleQuickSpot = () => {
    progressQuest('explore');
    // Pick random species from DB
    const randomSpecies = SPECIES_DATABASE[Math.floor(Math.random() * SPECIES_DATABASE.length)];
    const newMarker: EcoMarker = {
      id: `m_${Date.now()}`,
      speciesId: randomSpecies.id,
      name: `${randomSpecies.name} ${randomSpecies.category === 'endangered' ? '발견' : '침식'}`,
      category: randomSpecies.category,
      designation: randomSpecies.designation,
      lat: 37.5665 + (Math.random() - 0.5) * 0.02,
      lng: 126.9780 + (Math.random() - 0.5) * 0.02,
      sectorName: randomSpecies.taxon === 'fish' ? '우리 동네 수변 하천' : '도심 근린공원 & 숲길',
      discoveredAt: '방금 전 탐지',
      hp: randomSpecies.hp,
      maxHp: randomSpecies.hp,
    };

    setMarkers((prev) => [newMarker, ...prev.slice(0, 11)]);
  };

  // Battle Victory Callback
  const handleBattleVictory = (exp: number, gold: number, cores: number) => {
    if (activeBattleSpecies) {
      setDiscoveredSpeciesIds((prev) => new Set([...prev, activeBattleSpecies.id]));
      setPlayer((p) => ({ ...p, purifiedCount: p.purifiedCount + 1 }));
      progressQuest('purify');
    }
    addPlayerRewards(exp, gold, cores);
    setActiveBattleSpecies(null);
  };

  // Rescue Success Callback
  const handleRescueSuccess = (exp: number, gold: number, cores: number) => {
    if (activeRescueSpecies) {
      setDiscoveredSpeciesIds((prev) => new Set([...prev, activeRescueSpecies.id]));
      setPlayer((p) => ({ ...p, rescuedCount: p.rescuedCount + 1 }));
      progressQuest('rescue');
    }
    addPlayerRewards(exp, gold, cores);
    setActiveRescueSpecies(null);
  };

  // Register Marker from AI Scanner
  const handleRegisterScannerMarker = (species: Species) => {
    setDiscoveredSpeciesIds((prev) => new Set([...prev, species.id]));
    setPlayer((p) => ({ ...p, scannedCount: p.scannedCount + 1 }));
    progressQuest('scan');

    const newMarker: EcoMarker = {
      id: `scan_${Date.now()}`,
      speciesId: species.id,
      name: `AI 스캔: ${species.name}`,
      category: species.category,
      designation: species.designation,
      lat: 37.5665 + (Math.random() - 0.5) * 0.015,
      lng: 126.9780 + (Math.random() - 0.5) * 0.015,
      sectorName: '우리 동네 수변 하천',
      discoveredAt: 'AI 현장 등록',
      hp: species.hp,
      maxHp: species.hp,
    };

    setMarkers((prev) => [newMarker, ...prev]);
    setActiveTab('map');
  };

  // Claim Quest Reward
  const handleClaimQuest = (questId: string) => {
    const q = quests.find((quest) => quest.id === questId);
    if (!q || !q.isCompleted || q.isClaimed) return;

    setQuests((prev) =>
      prev.map((item) => (item.id === questId ? { ...item, isClaimed: true } : item))
    );

    addPlayerRewards(q.rewardExp, q.rewardGold, q.rewardCores);
  };

  // Gear Upgrades in Research HQ
  const handleUpgradeScanner = () => {
    const cost = player.scannerLevel * 300;
    if (player.gold < cost || player.scannerLevel >= 4) return;
    setPlayer((p) => ({
      ...p,
      gold: p.gold - cost,
      scannerLevel: p.scannerLevel + 1,
    }));
  };

  const handleUpgradeTool = () => {
    const cost = player.toolLevel * 250;
    if (player.gold < cost || player.toolLevel >= 4) return;
    setPlayer((p) => ({
      ...p,
      gold: p.gold - cost,
      toolLevel: p.toolLevel + 1,
    }));
  };

  const handleUpgradeRadar = () => {
    const cost = player.radarLevel * 350;
    if (player.gold < cost || player.radarLevel >= 4) return;
    setPlayer((p) => ({
      ...p,
      gold: p.gold - cost,
      radarLevel: p.radarLevel + 1,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Header & Navigation */}
      <Header
        player={player}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCertificate={() => {
          soundFX.playClick();
          setShowCertificate(true);
        }}
        cleansingRate={cleansingRate}
      />

      {/* Main Game Screen */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5">
        {/* If Active Encounter is ongoing, show Combat or Rescue screen */}
        {activeBattleSpecies ? (
          <PurificationBattle
            species={activeBattleSpecies}
            player={player}
            onVictory={handleBattleVictory}
            onEscape={() => setActiveBattleSpecies(null)}
          />
        ) : activeRescueSpecies ? (
          <RescueMission
            species={activeRescueSpecies}
            player={player}
            onRescueSuccess={handleRescueSuccess}
            onCancel={() => setActiveRescueSpecies(null)}
          />
        ) : (
          /* Normal Tab Content */
          <>
            {activeTab === 'map' && (
              <EcoMap
                markers={markers}
                onSelectMarker={handleSelectMapMarker}
                onQuickSpotEncounter={handleQuickSpot}
                playerLevel={player.level}
              />
            )}

            {activeTab === 'scanner' && (
              <BioScanner
                onStartBattle={(species) => setActiveBattleSpecies(species)}
                onStartRescue={(species) => setActiveRescueSpecies(species)}
                onRegisterMarker={handleRegisterScannerMarker}
              />
            )}

            {activeTab === 'encyclopedia' && (
              <Encyclopedia discoveredSpeciesIds={discoveredSpeciesIds} />
            )}

            {activeTab === 'quests' && (
              <QuestModal quests={quests} onClaimQuest={handleClaimQuest} />
            )}

            {activeTab === 'research' && (
              <ResearchHQ
                player={player}
                onUpgradeScanner={handleUpgradeScanner}
                onUpgradeTool={handleUpgradeTool}
                onUpgradeRadar={handleUpgradeRadar}
                onOpenCertificate={() => {
                  soundFX.playClick();
                  setShowCertificate(true);
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Official Certificate Modal */}
      {showCertificate && (
        <CertificateModal
          player={player}
          cleansingRate={cleansingRate}
          onClose={() => setShowCertificate(false)}
        />
      )}

      {/* Footer Info */}
      <footer className="bg-slate-950 border-t border-slate-900 py-3 px-4 text-center text-xs text-slate-500">
        <p>
          <strong className="text-emerald-400">에코 가디언즈: 우리 동네 생태 수호 RPG</strong> | 총괄 기획 & 제작: <strong className="text-slate-300">이정빈 (Lee Jeongbin)</strong>
        </p>
        <p className="text-[11px] text-slate-600 mt-0.5">
          대한민국 환경부 및 국립생태원 생물 데이터베이스 기반 | 실시간 AI 생체 분류 & GPS 생태 지도
        </p>
      </footer>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { 
  Swords, 
  ShieldAlert, 
  Sparkles, 
  Flame, 
  Zap, 
  Heart, 
  Crosshair, 
  RotateCcw, 
  Award,
  ChevronRight,
  Shield,
  Layers,
  Skull
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Species, PlayerStats, BattleActionLog } from '../types/game';
import { soundFX } from '../utils/audio';

interface PurificationBattleProps {
  species: Species;
  player: PlayerStats;
  onVictory: (exp: number, gold: number, cores: number) => void;
  onEscape: () => void;
}

export const PurificationBattle: React.FC<PurificationBattleProps> = ({
  species,
  player,
  onVictory,
  onEscape,
}) => {
  const [enemyHp, setEnemyHp] = useState(species.hp);
  const maxEnemyHp = species.hp;
  const [playerHp, setPlayerHp] = useState(player.hp);
  const maxPlayerHp = player.maxHp;
  const [playerEnergy, setPlayerEnergy] = useState(player.energy);
  const maxPlayerEnergy = player.maxEnergy;

  const [hasScannedWeakness, setHasScannedWeakness] = useState(false);
  const [turn, setTurn] = useState<number>(1);
  const [isEnemyTurn, setIsEnemyTurn] = useState(false);
  const [isBattleOver, setIsBattleOver] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [logs, setLogs] = useState<BattleActionLog[]>([
    {
      sender: 'system',
      message: `생태계교란 생물 [${species.name}]과의 정화 배틀이 시작되었습니다!`,
    },
    {
      sender: 'enemy',
      message: `${species.name}이(가) 주변 식생을 위협하며 침식을 개시합니다.`,
    },
  ]);

  const addLog = (log: BattleActionLog) => {
    setLogs((prev) => [log, ...prev.slice(0, 15)]);
  };

  // Enemy Turn AI
  useEffect(() => {
    if (!isEnemyTurn || isBattleOver) return;

    const timer = setTimeout(() => {
      // Enemy attack calculation
      const enemyDmg = Math.max(12, Math.round(species.atk * (0.8 + Math.random() * 0.4)));
      soundFX.playAttack();

      setPlayerHp((prev) => {
        const next = Math.max(0, prev - enemyDmg);
        if (next === 0) {
          setIsBattleOver(true);
          setIsVictory(false);
          addLog({
            sender: 'enemy',
            message: `${species.name}의 치명적 반격! 수호단의 방어막이 파괴되어 후퇴해야 합니다.`,
            type: 'damage',
          });
        }
        return next;
      });

      addLog({
        sender: 'enemy',
        message: `${species.name}의 교란 번식 공격! 수호대원에게 ${enemyDmg}의 생태 피해!`,
        type: 'damage',
      });

      setIsEnemyTurn(false);
      setTurn((t) => t + 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isEnemyTurn, isBattleOver, species]);

  // Check Enemy Defeat
  const checkEnemyDefeat = (newEnemyHp: number) => {
    if (newEnemyHp <= 0) {
      setIsBattleOver(true);
      setIsVictory(true);
      soundFX.playVictory();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      addLog({
        sender: 'system',
        message: `생태 정화 성공! [${species.name}]의 군락을 무사히 퇴치하고 생태계 균형을 되찾았습니다!`,
        type: 'special',
      });
    } else {
      setIsEnemyTurn(true);
    }
  };

  // Action 1: Weakness Scan
  const handleScanWeakness = () => {
    if (isEnemyTurn || isBattleOver) return;
    soundFX.playScan();
    setHasScannedWeakness(true);
    addLog({
      sender: 'player',
      message: `이정빈 AI 스캐너로 [${species.weakness}] 약점을 포착했습니다! 다음 물리 공격 치명타율 100%!`,
      type: 'buff',
    });
    setIsEnemyTurn(true);
  };

  // Action 2: Physical Eradication
  const handlePhysicalAttack = () => {
    if (isEnemyTurn || isBattleOver) return;
    const isCrit = hasScannedWeakness;
    const baseDmg = 45 + player.toolLevel * 15;
    const finalDmg = isCrit ? Math.round(baseDmg * 2.2) : Math.round(baseDmg * (0.9 + Math.random() * 0.3));

    if (isCrit) {
      soundFX.playCrit();
      setHasScannedWeakness(false);
    } else {
      soundFX.playAttack();
    }

    setPlayerEnergy((e) => Math.min(maxPlayerEnergy, e + 15));
    const nextHp = Math.max(0, enemyHp - finalDmg);
    setEnemyHp(nextHp);

    addLog({
      sender: 'player',
      message: `친환경 제거 도구 낫질 공격! ${isCrit ? '💥 약점 정밀 타격!!' : ''} ${species.name}에게 ${finalDmg} 대미지! (+15 에너지)`,
      type: isCrit ? 'crit' : 'damage',
    });

    checkEnemyDefeat(nextHp);
  };

  // Action 3: Eco-Bio Purify (Consumes 25 Energy)
  const handleBioPurify = () => {
    if (isEnemyTurn || isBattleOver || playerEnergy < 25) return;
    soundFX.playAttack();
    setPlayerEnergy((e) => e - 25);

    const bioDmg = 90 + player.scannerLevel * 20;
    const nextHp = Math.max(0, enemyHp - bioDmg);
    setEnemyHp(nextHp);

    addLog({
      sender: 'player',
      message: `생물학적 천적 방제 정화파 발사! ${bioDmg}의 강력한 정화 피해를 입혔습니다! (-25 에너지)`,
      type: 'damage',
    });

    checkEnemyDefeat(nextHp);
  };

  // Action 4: Bio-Heal (Consumes 20 Energy)
  const handleBioHeal = () => {
    if (isEnemyTurn || isBattleOver || playerEnergy < 20) return;
    soundFX.playHeal();
    setPlayerEnergy((e) => e - 20);

    const healAmount = 70;
    setPlayerHp((h) => Math.min(maxPlayerHp, h + healAmount));

    addLog({
      sender: 'player',
      message: `휴대용 바이오 회복 스프레이 사용! 수호단 체력 +${healAmount} 회복! (-20 에너지)`,
      type: 'heal',
    });

    setIsEnemyTurn(true);
  };

  // Action 5: Ultimate Eco Burst (Consumes 50 Energy)
  const handleUltimateBurst = () => {
    if (isEnemyTurn || isBattleOver || playerEnergy < 50) return;
    soundFX.playCrit();
    setPlayerEnergy((e) => e - 50);

    const ultimateDmg = 240 + player.level * 10;
    const nextHp = Math.max(0, enemyHp - ultimateDmg);
    setEnemyHp(nextHp);

    addLog({
      sender: 'player',
      message: `⚡ [궁극기: 이정빈 연구소의 에코 버스트] 전 방위 정화포 발사! ${species.name}에게 ${ultimateDmg}의 압도적 정화 타격!!`,
      type: 'special',
    });

    checkEnemyDefeat(nextHp);
  };

  const enemyHpPercent = Math.max(0, Math.round((enemyHp / maxEnemyHp) * 100));
  const playerHpPercent = Math.max(0, Math.round((playerHp / maxPlayerHp) * 100));
  const energyPercent = Math.max(0, Math.round((playerEnergy / maxPlayerEnergy) * 100));

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Battle Top Banner */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 border border-rose-800/40 rounded-xl p-3 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-rose-900/60 border border-rose-500/50 flex items-center justify-center text-rose-300">
            <Swords className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              생태 정화 배틀 (Turn {turn})
              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-bold border border-rose-800">
                위협도 ★{species.threatLevel}
              </span>
            </h3>
            <p className="text-xs text-rose-300/80">
              외래 침입 생물을 물리쳐 우리 동네 고유 생태계를 정화하세요.
            </p>
          </div>
        </div>

        <button
          onClick={onEscape}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 cursor-pointer"
        >
          전선 이탈 (후퇴)
        </button>
      </div>

      {/* Duel Arena Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Enemy Status Card */}
        <div className="bg-slate-950 rounded-2xl border border-rose-900/40 p-4 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                {species.designation}
              </span>
              <h4 className="text-lg font-black text-white mt-1 flex items-center gap-2">
                <span>{species.emoji}</span>
                <span>{species.name}</span>
              </h4>
              <p className="text-[11px] font-mono text-slate-400 italic">{species.scientificName}</p>
            </div>

            <div className="w-16 h-16 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center text-3xl shrink-0">
              {species.sampleImageUrl ? (
                <img src={species.sampleImageUrl} alt={species.name} className="w-full h-full object-cover" />
              ) : (
                <span>{species.emoji}</span>
              )}
            </div>
          </div>

          {/* Enemy HP Bar */}
          <div className="mt-4 space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-rose-400 font-bold">침식도 / 생명력</span>
              <span className="text-slate-300 font-bold">{enemyHp} / {maxEnemyHp} HP</span>
            </div>
            <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-rose-950">
              <div
                className="h-full bg-gradient-to-r from-rose-600 to-red-500 transition-all duration-300"
                style={{ width: `${enemyHpPercent}%` }}
              />
            </div>
          </div>

          <div className="mt-3 text-[11px] text-slate-400 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
            <strong className="text-amber-400">약점 키워드: </strong>
            <span>{species.weakness}</span>
          </div>
        </div>

        {/* Player Guardian Status Card */}
        <div className="bg-slate-950 rounded-2xl border border-emerald-900/40 p-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                이정빈 생태 수호대원
              </span>
              <h4 className="text-lg font-black text-white mt-1 flex items-center gap-2">
                <span>🛡️</span>
                <span>{player.name} (LV.{player.level})</span>
              </h4>
              <p className="text-[11px] text-emerald-400 font-medium">{player.title}</p>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">장비 상태</span>
              <span className="text-xs font-bold text-cyan-400">제거도구 LV.{player.toolLevel}</span>
            </div>
          </div>

          {/* Player HP & Energy Bars */}
          <div className="mt-4 space-y-2">
            <div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-emerald-400 font-bold">수호단 방어막 (HP)</span>
                <span className="text-slate-300 font-bold">{playerHp} / {maxPlayerHp}</span>
              </div>
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-emerald-950">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                  style={{ width: `${playerHpPercent}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-cyan-400 font-bold">정화 에너지 (AP)</span>
                <span className="text-slate-300 font-bold">{playerEnergy} / {maxPlayerEnergy}</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-cyan-950">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                  style={{ width: `${energyPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>약점 분석 상태:</span>
            <span className={`font-bold ${hasScannedWeakness ? 'text-amber-400' : 'text-slate-500'}`}>
              {hasScannedWeakness ? '★ 약점 포착 완료 (치명타 준비됨)' : '스캔 미가동'}
            </span>
          </div>
        </div>
      </div>

      {/* Battle Controls (Player Actions) */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 shadow-xl">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          수호단 정화 액션 명령 (Action Command)
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {/* Action 1: Weakness Scan */}
          <button
            onClick={handleScanWeakness}
            disabled={isEnemyTurn || isBattleOver || hasScannedWeakness}
            className={`p-3 rounded-xl flex flex-col items-center justify-center text-center gap-1.5 border transition-all cursor-pointer ${
              hasScannedWeakness
                ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
                : 'bg-slate-950 hover:bg-slate-800 text-amber-300 border-amber-600/40 hover:scale-[1.02]'
            }`}
          >
            <Crosshair className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold">1. 약점 AI 스캔</span>
            <span className="text-[9px] text-slate-400">치명타 버프</span>
          </button>

          {/* Action 2: Physical Eradication */}
          <button
            onClick={handlePhysicalAttack}
            disabled={isEnemyTurn || isBattleOver}
            className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-white border border-rose-600/40 hover:scale-[1.02] flex flex-col items-center justify-center text-center gap-1.5 transition-all cursor-pointer"
          >
            <Swords className="w-5 h-5 text-rose-400" />
            <span className="text-xs font-bold">2. 물리적 제거 낫질</span>
            <span className="text-[9px] text-emerald-400">+15 에너지 회복</span>
          </button>

          {/* Action 3: Eco-Bio Purify */}
          <button
            onClick={handleBioPurify}
            disabled={isEnemyTurn || isBattleOver || playerEnergy < 25}
            className={`p-3 rounded-xl flex flex-col items-center justify-center text-center gap-1.5 border transition-all cursor-pointer ${
              playerEnergy < 25
                ? 'bg-slate-950 text-slate-600 border-slate-800 cursor-not-allowed'
                : 'bg-slate-950 hover:bg-slate-800 text-cyan-300 border-cyan-500/40 hover:scale-[1.02]'
            }`}
          >
            <Zap className="w-5 h-5 text-cyan-400" />
            <span className="text-xs font-bold">3. 천적 생물 정화</span>
            <span className="text-[9px] text-cyan-400">-25 에너지 소비</span>
          </button>

          {/* Action 4: Bio-Heal */}
          <button
            onClick={handleBioHeal}
            disabled={isEnemyTurn || isBattleOver || playerEnergy < 20}
            className={`p-3 rounded-xl flex flex-col items-center justify-center text-center gap-1.5 border transition-all cursor-pointer ${
              playerEnergy < 20
                ? 'bg-slate-950 text-slate-600 border-slate-800 cursor-not-allowed'
                : 'bg-slate-950 hover:bg-slate-800 text-emerald-300 border-emerald-500/40 hover:scale-[1.02]'
            }`}
          >
            <Heart className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold">4. 바이오 힐링</span>
            <span className="text-[9px] text-emerald-400">-20 에너지 소비</span>
          </button>

          {/* Action 5: Ultimate Eco Burst */}
          <button
            onClick={handleUltimateBurst}
            disabled={isEnemyTurn || isBattleOver || playerEnergy < 50}
            className={`col-span-2 sm:col-span-1 p-3 rounded-xl flex flex-col items-center justify-center text-center gap-1.5 border transition-all cursor-pointer ${
              playerEnergy < 50
                ? 'bg-slate-950 text-slate-600 border-slate-800 cursor-not-allowed'
                : 'bg-gradient-to-br from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white border-amber-400 shadow-lg shadow-amber-950/60 hover:scale-[1.03]'
            }`}
          >
            <Flame className="w-5 h-5 text-amber-200 animate-bounce" />
            <span className="text-xs font-black">5. 에코 버스트 포!</span>
            <span className="text-[9px] text-amber-200">-50 에너지 (필살)</span>
          </button>
        </div>
      </div>

      {/* Combat Action Log Feed */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-3 shadow-inner">
        <h4 className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5" />
          <span>전투 실황 로그</span>
        </h4>
        <div className="max-h-32 overflow-y-auto space-y-1 text-xs font-mono">
          {logs.map((log, idx) => (
            <div
              key={idx}
              className={`p-1.5 rounded text-[11px] ${
                log.sender === 'player'
                  ? 'bg-emerald-950/40 text-emerald-300 border-l-2 border-emerald-500'
                  : log.sender === 'enemy'
                  ? 'bg-rose-950/40 text-rose-300 border-l-2 border-rose-500'
                  : 'bg-slate-900 text-slate-300 border-l-2 border-slate-600'
              }`}
            >
              {log.message}
            </div>
          ))}
        </div>
      </div>

      {/* Victory / Defeat Modal Overlay */}
      {isBattleOver && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-center shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            {isVictory ? (
              <>
                <div className="w-16 h-16 rounded-2xl bg-emerald-950 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400">
                  <Award className="w-9 h-9" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">생태 정화 작전 대성공!</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    교란생물 <strong className="text-rose-400">{species.name}</strong>을(를) 퇴치하여 동네 생태계 건강도를 복구했습니다!
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">수호단 EXP</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">+{species.dropExp}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">생태 코인</span>
                    <span className="font-mono font-bold text-amber-400 text-sm">+{species.dropGold}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">생체 코어</span>
                    <span className="font-mono font-bold text-cyan-400 text-sm">+2</span>
                  </div>
                </div>

                <button
                  onClick={() => onVictory(species.dropExp, species.dropGold, 2)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/60 cursor-pointer"
                >
                  보상 수령 및 생태 지도로 복귀
                </button>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-2xl bg-rose-950 border border-rose-500/50 flex items-center justify-center mx-auto text-rose-400">
                  <Skull className="w-9 h-9" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">정화 작전 일시 후퇴</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    교란종의 침식이 거셉니다. 연구소에서 장비를 업그레이드하고 다시 도전하세요!
                  </p>
                </div>

                <button
                  onClick={onEscape}
                  className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm cursor-pointer"
                >
                  안전 거점으로 복귀
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

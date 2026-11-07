import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Sparkles, 
  Activity, 
  Radio, 
  CheckCircle2, 
  Award, 
  ShieldCheck, 
  Thermometer, 
  Droplet,
  Compass,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Species, PlayerStats } from '../types/game';
import { soundFX } from '../utils/audio';

interface RescueMissionProps {
  species: Species;
  player: PlayerStats;
  onRescueSuccess: (exp: number, gold: number, cores: number) => void;
  onCancel: () => void;
}

export const RescueMission: React.FC<RescueMissionProps> = ({
  species,
  player,
  onRescueSuccess,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [vitalsDiagnosed, setVitalsDiagnosed] = useState(false);
  const [treated, setTreated] = useState(false);
  const [tagged, setTagged] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Step 1: Health Diagnostic
  const handleDiagnose = () => {
    soundFX.playScan();
    setVitalsDiagnosed(true);
    setTimeout(() => {
      setCurrentStep(2);
    }, 600);
  };

  // Step 2: Emergency Care
  const handleTreat = () => {
    soundFX.playHeal();
    setTreated(true);
    setTimeout(() => {
      setCurrentStep(3);
    }, 600);
  };

  // Step 3: Satellite Smart Tagging
  const handleTag = () => {
    soundFX.playCrit();
    setTagged(true);
    setTimeout(() => {
      setCurrentStep(4);
      setIsCompleted(true);
      soundFX.playVictory();
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.5 },
      });
    }, 600);
  };

  const expReward = Math.round(species.dropExp * 1.5);
  const goldReward = species.dropGold;
  const coresReward = 3;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border border-emerald-800/40 rounded-xl p-3 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-emerald-900/60 border border-emerald-500/50 flex items-center justify-center text-emerald-300">
            <HeartHandshake className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              멸종위기 야생생물 긴급 보호 프로토콜
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-800">
                보호 우선순위 ★{species.conservationPriority}
              </span>
            </h3>
            <p className="text-xs text-emerald-300/80">
              안전하고 스트레스 없는 비침습적 수호 활동으로 개체를 보호하세요.
            </p>
          </div>
        </div>

        <button
          onClick={onCancel}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 cursor-pointer"
        >
          탐사로 복귀
        </button>
      </div>

      {/* Creature Showcase Card */}
      <div className="bg-slate-950 rounded-2xl border border-emerald-900/40 p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row items-center gap-4">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-900 border border-emerald-600/40 overflow-hidden flex items-center justify-center text-4xl shadow-inner shrink-0">
          {species.sampleImageUrl ? (
            <img src={species.sampleImageUrl} alt={species.name} className="w-full h-full object-cover" />
          ) : (
            <span>{species.emoji}</span>
          )}
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h3 className="text-xl font-black text-white">{species.name}</h3>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">
              {species.designation}
            </span>
            <span className="text-xs font-mono font-bold text-amber-400">
              [{species.rarity}]
            </span>
          </div>

          <p className="text-xs text-slate-400 font-mono italic mt-0.5">{species.scientificName}</p>
          <p className="text-xs text-slate-300 mt-2 line-clamp-2">{species.description}</p>

          <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[11px] text-slate-400">
            <span className="bg-slate-900 px-2 py-1 rounded border border-slate-800">
              주요 서식지: <strong className="text-slate-200">{species.habitat}</strong>
            </span>
            <span className="bg-slate-900 px-2 py-1 rounded border border-slate-800">
              위협 요인: <strong className="text-rose-300">{species.weakness}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Rescue Protocol Step Indicators */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div
          className={`p-3 rounded-xl border transition-all ${
            currentStep >= 1
              ? 'bg-slate-900 border-emerald-500/60 text-emerald-300 shadow-xs'
              : 'bg-slate-950 border-slate-800 text-slate-500'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5 font-bold mb-1">
            <Thermometer className="w-3.5 h-3.5" />
            <span>1단계: 건강 진단</span>
          </div>
          <span className="text-[10px] text-slate-400">
            {vitalsDiagnosed ? '✓ 완료' : '대기 중'}
          </span>
        </div>

        <div
          className={`p-3 rounded-xl border transition-all ${
            currentStep >= 2
              ? 'bg-slate-900 border-emerald-500/60 text-emerald-300 shadow-xs'
              : 'bg-slate-950 border-slate-800 text-slate-500'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5 font-bold mb-1">
            <Droplet className="w-3.5 h-3.5" />
            <span>2단계: 수분·응급치료</span>
          </div>
          <span className="text-[10px] text-slate-400">
            {treated ? '✓ 완료' : '대기 중'}
          </span>
        </div>

        <div
          className={`p-3 rounded-xl border transition-all ${
            currentStep >= 3
              ? 'bg-slate-900 border-emerald-500/60 text-emerald-300 shadow-xs'
              : 'bg-slate-950 border-slate-800 text-slate-500'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5 font-bold mb-1">
            <Radio className="w-3.5 h-3.5" />
            <span>3단계: 스마트 태깅</span>
          </div>
          <span className="text-[10px] text-slate-400">
            {tagged ? '✓ 완료' : '대기 중'}
          </span>
        </div>
      </div>

      {/* Interactive Step Action Box */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl">
        {!isCompleted ? (
          <div>
            {currentStep === 1 && (
              <div className="space-y-3 text-center">
                <Activity className="w-8 h-8 mx-auto text-emerald-400 animate-pulse" />
                <h4 className="text-base font-bold text-white">생체 바이탈 및 외상 진단</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  이정빈 연구소의 광학 센서로 체온, 스트레스 지수, 이동성 및 탈수도를 원격 스캔합니다.
                </p>
                <button
                  onClick={handleDiagnose}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/60 cursor-pointer"
                >
                  비침습 생체 진단 스캔 실행
                </button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-3 text-center">
                <Droplet className="w-8 h-8 mx-auto text-cyan-400 animate-bounce" />
                <h4 className="text-base font-bold text-white">스트레스 완화 및 영양 전해질 공급</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  천연 미네랄 전해질 수액과 보호 스프레이를 안전하게 도포하여 기력을 회복시킵니다.
                </p>
                <button
                  onClick={handleTreat}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-950/60 cursor-pointer"
                >
                  바이오 케어 및 수분 공급 완료
                </button>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-3 text-center">
                <Radio className="w-8 h-8 mx-auto text-amber-400 animate-pulse" />
                <h4 className="text-base font-bold text-white">국립생태원 연동 GPS 스마트 비콘 태깅</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  초경량 위성 위치 태그를 부착하여 향후 이동 경로와 번식지를 실시간 모니터링합니다.
                </p>
                <button
                  onClick={handleTag}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-emerald-600 hover:from-amber-500 hover:to-emerald-500 text-white font-bold text-xs shadow-lg shadow-amber-950/60 cursor-pointer"
                >
                  위성 비콘 등록 & 자연 안식처 복귀
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center space-y-4 py-2">
            <div className="w-16 h-16 rounded-2xl bg-emerald-950 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400">
              <ShieldCheck className="w-9 h-9" />
            </div>

            <div>
              <h3 className="text-xl font-black text-white">
                {species.name} 보호 및 구조 프로토콜 완료!
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
                귀중한 생명이 안전하게 보존되었습니다. 이정빈 연구소 수호 도감에 최고 등급으로 영구 등록되었습니다!
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">수호단 EXP</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">+{expReward}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">생태 코인</span>
                <span className="font-mono font-bold text-amber-400 text-sm">+{goldReward}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">생체 코어</span>
                <span className="font-mono font-bold text-cyan-400 text-sm">+{coresReward}</span>
              </div>
            </div>

            <button
              onClick={() => onRescueSuccess(expReward, goldReward, coresReward)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/60 cursor-pointer"
            >
              생태 수호 보상 획득 및 도감 갱신
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

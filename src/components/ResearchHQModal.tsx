import React, { useState } from 'react';
import { 
  Building2, 
  Award, 
  Wrench, 
  Sparkles, 
  CheckCircle, 
  ShieldCheck, 
  Coins, 
  Dna, 
  Printer, 
  X,
  Zap,
  Radio,
  Cpu,
  UserCheck
} from 'lucide-react';
import { PlayerStats } from '../types/game';
import { soundFX } from '../utils/audio';

interface ResearchHQProps {
  player: PlayerStats;
  onUpgradeScanner: () => void;
  onUpgradeTool: () => void;
  onUpgradeRadar: () => void;
  onOpenCertificate: () => void;
}

export const ResearchHQ: React.FC<ResearchHQProps> = ({
  player,
  onUpgradeScanner,
  onUpgradeTool,
  onUpgradeRadar,
  onOpenCertificate,
}) => {
  const scannerCost = player.scannerLevel * 300;
  const toolCost = player.toolLevel * 250;
  const radarCost = player.radarLevel * 350;

  return (
    <div className="space-y-5">
      {/* Director Greeting Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-600/40 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-emerald-600 p-0.5 shadow-xl shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex flex-col items-center justify-center text-center">
                <span className="text-2xl">🌿</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">
                  생태 총괄 사령부
                </span>
                <span className="text-xs text-slate-400 font-mono">EST. 2026</span>
              </div>
              <h2 className="text-xl font-black text-white mt-1">
                이정빈 생태 연구 총괄 본부 (Director Lee Jeongbin's HQ)
              </h2>
              <p className="text-xs text-emerald-300/90 mt-1.5 max-w-2xl leading-relaxed">
                "에코 가디언즈 대원 여러분, 환영합니다. 저는 총괄 제작자이자 생태 연구소장 <strong>이정빈</strong>입니다.
                외래종 교란으로 신음하는 하천과 멸종위기에 놓인 소중한 야생동물을 지켜내는 여러분의 활동은 
                우리 동네의 생물 다양성을 보존하는 가장 숭고한 임무입니다. 연구소의 최신 장비로 지원하겠습니다!"
              </p>
            </div>
          </div>

          <button
            onClick={onOpenCertificate}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-amber-950/60 cursor-pointer shrink-0 transition-all hover:scale-[1.02]"
          >
            <Award className="w-4 h-4 text-slate-950" />
            <span>이정빈 공인 수호 인증서 열람</span>
          </button>
        </div>
      </div>

      {/* Equipment Upgrade Lab */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Wrench className="w-5 h-5 text-cyan-400" />
              <span>수호단 필드 장비 강화 연구실 (Field Gear Lab)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              생태 코인과 바이오 코어로 탐사 장비를 개조하여 공격력과 스캔 성능을 극대화하세요.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="flex items-center gap-1 font-mono font-bold text-amber-300">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              {player.gold.toLocaleString()}
            </span>
            <span className="flex items-center gap-1 font-mono font-bold text-cyan-300">
              <Dna className="w-3.5 h-3.5 text-cyan-400" />
              {player.bioCores}개
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Upgrade 1: AI Scanner Lens */}
          <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-9 h-9 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Cpu className="w-5 h-5" />
                </span>
                <span className="text-xs font-mono font-bold text-cyan-300">
                  LV.{player.scannerLevel} / 4
                </span>
              </div>
              <h4 className="font-bold text-white text-sm">AI 생체 분광 렌즈</h4>
              <p className="text-xs text-slate-400 mt-1">
                AI 스캔 정확도 증가 및 전투 시 천적 생물 정화 대미지 +20 추가
              </p>
            </div>

            <button
              onClick={() => {
                soundFX.playClick();
                onUpgradeScanner();
              }}
              disabled={player.scannerLevel >= 4 || player.gold < scannerCost}
              className={`w-full py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                player.scannerLevel >= 4
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : player.gold < scannerCost
                  ? 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-950/50'
              }`}
            >
              {player.scannerLevel >= 4 ? '최고 레벨 달성' : `강화하기 (${scannerCost.toLocaleString()} 골드)`}
            </button>
          </div>

          {/* Upgrade 2: Eradication Tool */}
          <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-9 h-9 rounded-lg bg-rose-950 border border-rose-500/40 flex items-center justify-center text-rose-400">
                  <Zap className="w-5 h-5" />
                </span>
                <span className="text-xs font-mono font-bold text-rose-300">
                  LV.{player.toolLevel} / 4
                </span>
              </div>
              <h4 className="font-bold text-white text-sm">친환경 티타늄 정화 낫</h4>
              <p className="text-xs text-slate-400 mt-1">
                교란종 물리 배틀 기본 낫질 공격력 +15 증가 및 치명타 위력 증폭
              </p>
            </div>

            <button
              onClick={() => {
                soundFX.playClick();
                onUpgradeTool();
              }}
              disabled={player.toolLevel >= 4 || player.gold < toolCost}
              className={`w-full py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                player.toolLevel >= 4
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : player.gold < toolCost
                  ? 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed'
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-950/50'
              }`}
            >
              {player.toolLevel >= 4 ? '최고 레벨 달성' : `강화하기 (${toolCost.toLocaleString()} 골드)`}
            </button>
          </div>

          {/* Upgrade 3: GPS Radar Antenna */}
          <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-9 h-9 rounded-lg bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Radio className="w-5 h-5" />
                </span>
                <span className="text-xs font-mono font-bold text-emerald-300">
                  LV.{player.radarLevel} / 4
                </span>
              </div>
              <h4 className="font-bold text-white text-sm">초광대역 생태 레이더</h4>
              <p className="text-xs text-slate-400 mt-1">
                레이더 탐사 반경 2배 확장 및 희귀 SSR 멸종위기종 조우 확률 증가
              </p>
            </div>

            <button
              onClick={() => {
                soundFX.playClick();
                onUpgradeRadar();
              }}
              disabled={player.radarLevel >= 4 || player.gold < radarCost}
              className={`w-full py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                player.radarLevel >= 4
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : player.gold < radarCost
                  ? 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/50'
              }`}
            >
              {player.radarLevel >= 4 ? '최고 레벨 달성' : `강화하기 (${radarCost.toLocaleString()} 골드)`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

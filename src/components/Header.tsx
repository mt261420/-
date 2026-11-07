import React, { useState } from 'react';
import { 
  Shield, 
  Sparkles, 
  Compass, 
  Camera, 
  BookOpen, 
  Award, 
  Volume2, 
  VolumeX, 
  Coins, 
  Dna, 
  Building2, 
  CheckSquare,
  BadgeAlert
} from 'lucide-react';
import { PlayerStats } from '../types/game';
import { soundFX } from '../utils/audio';

interface HeaderProps {
  player: PlayerStats;
  activeTab: 'map' | 'scanner' | 'encyclopedia' | 'quests' | 'research';
  setActiveTab: (tab: 'map' | 'scanner' | 'encyclopedia' | 'quests' | 'research') => void;
  onOpenCertificate: () => void;
  cleansingRate: number;
}

export const Header: React.FC<HeaderProps> = ({
  player,
  activeTab,
  setActiveTab,
  onOpenCertificate,
  cleansingRate,
}) => {
  const [isMuted, setIsMuted] = useState(soundFX.getMuted());

  const handleToggleSound = () => {
    const muted = soundFX.toggleMute();
    setIsMuted(muted);
    if (!muted) soundFX.playClick();
  };

  const expPercentage = Math.min(100, Math.round((player.exp / player.maxExp) * 100));

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-emerald-900/40 text-slate-100 shadow-xl">
      {/* Top Banner: Creator Lee Jeongbin & Ecological Status */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-b border-emerald-800/30 px-3 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-600/40 shadow-xs">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>총괄 제작자: <strong className="text-emerald-200 font-extrabold underline decoration-emerald-500/60 underline-offset-2">이정빈</strong></span>
          </span>
          <span className="text-emerald-400/80 hidden sm:inline">|</span>
          <span className="text-slate-300 hidden sm:inline flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            우리 동네 생태 수호 프로젝트 v2.5
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700/60">
            <span className="text-slate-400">동네 생태 정화율:</span>
            <div className="w-16 sm:w-24 h-2 bg-slate-800 rounded-full overflow-hidden border border-emerald-800/50">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                style={{ width: `${cleansingRate}%` }}
              />
            </div>
            <span className="font-mono font-bold text-emerald-300 text-[11px]">{cleansingRate}%</span>
          </div>

          <button
            onClick={onOpenCertificate}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-semibold transition-all cursor-pointer"
            title="이정빈 연구소 공인 수호단 인증서"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>수호 인증서</span>
          </button>

          <button
            onClick={handleToggleSound}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
            title={isMuted ? '음소거 해제' : '음소거'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Main Header Row: Guardian Profile & Nav Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Left: Player Badge & Stats */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 p-0.5 shadow-lg shadow-emerald-950/50 flex items-center justify-center border border-emerald-400/30">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-bold text-emerald-400 leading-none">LV</span>
                <span className="text-base font-black text-white font-mono leading-none">{player.level}</span>
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-slate-950">
              ★
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                <span className="text-emerald-400">에코 가디언즈</span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-medium border border-emerald-700/40">
                  {player.title}
                </span>
              </h1>
            </div>

            {/* EXP Bar & Currencies */}
            <div className="flex flex-wrap items-center gap-3 mt-1 text-xs">
              <div className="flex items-center gap-1.5 w-32 sm:w-40">
                <span className="text-[11px] font-mono text-slate-400">EXP</span>
                <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 transition-all duration-300"
                    style={{ width: `${expPercentage}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-slate-300">{expPercentage}%</span>
              </div>

              <div className="flex items-center gap-3 text-slate-300 text-xs">
                <span className="inline-flex items-center gap-1 font-mono font-semibold text-amber-300">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  {player.gold.toLocaleString()}
                </span>
                <span className="inline-flex items-center gap-1 font-mono font-semibold text-cyan-300">
                  <Dna className="w-3.5 h-3.5 text-cyan-400" />
                  {player.bioCores}개
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Tab Navigation Buttons */}
        <nav className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => {
              soundFX.playClick();
              setActiveTab('map');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'map'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/50'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>생태 지도 & 탐사</span>
          </button>

          <button
            onClick={() => {
              soundFX.playClick();
              setActiveTab('scanner');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'scanner'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/50'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <Camera className="w-4 h-4 text-cyan-300" />
            <span>AI 생물 스캐너</span>
          </button>

          <button
            onClick={() => {
              soundFX.playClick();
              setActiveTab('encyclopedia');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'encyclopedia'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/50'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-300" />
            <span>생태 도감 (36종)</span>
          </button>

          <button
            onClick={() => {
              soundFX.playClick();
              setActiveTab('quests');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'quests'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/50'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <CheckSquare className="w-4 h-4 text-amber-300" />
            <span>일일 미션</span>
          </button>

          <button
            onClick={() => {
              soundFX.playClick();
              setActiveTab('research');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'research'
                ? 'bg-gradient-to-r from-amber-600 to-emerald-600 text-white shadow-md shadow-amber-900/50'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>이정빈 연구소</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

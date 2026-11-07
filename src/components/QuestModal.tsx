import React from 'react';
import { CheckSquare, Award, Sparkles, Coins, Dna, Check, ArrowRight } from 'lucide-react';
import { Quest } from '../types/game';
import { soundFX } from '../utils/audio';

interface QuestModalProps {
  quests: Quest[];
  onClaimQuest: (questId: string) => void;
}

export const QuestModal: React.FC<QuestModalProps> = ({ quests, onClaimQuest }) => {
  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-950 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <CheckSquare className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-black text-white">수호단 일일 생태 임무 (Daily Patrol Quests)</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            이정빈 생태 연구소가 발령한 일일 미션을 완료하고 골드와 수호단 경험치, 바이오 코어를 수령하세요.
          </p>
        </div>
      </div>

      {/* Quests List */}
      <div className="space-y-3">
        {quests.map((quest) => {
          const isDone = quest.currentCount >= quest.targetCount;
          const progressPercent = Math.min(100, Math.round((quest.currentCount / quest.targetCount) * 100));

          return (
            <div
              key={quest.id}
              className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                quest.isClaimed
                  ? 'bg-slate-950/60 border-slate-900 opacity-60'
                  : isDone
                  ? 'bg-slate-900/90 border-emerald-500/50 shadow-md shadow-emerald-950/30'
                  : 'bg-slate-950 border-slate-800'
              }`}
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-white text-sm">{quest.title}</h4>
                  {quest.isClaimed && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      수령 완료
                    </span>
                  )}
                  {isDone && !quest.isClaimed && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-600 animate-pulse">
                      임무 달성!
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">{quest.description}</p>

                {/* Progress bar */}
                <div className="flex items-center gap-2 pt-1 text-xs">
                  <div className="flex-1 max-w-xs h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <span className="font-mono text-slate-300 text-[11px]">
                    {quest.currentCount} / {quest.targetCount}
                  </span>
                </div>
              </div>

              {/* Rewards & Claim Button */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center gap-2 text-xs">
                  <span className="flex items-center gap-1 font-mono font-bold text-amber-300">
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    +{quest.rewardGold}
                  </span>
                  <span className="flex items-center gap-1 font-mono font-bold text-emerald-300">
                    +{quest.rewardExp} EXP
                  </span>
                  <span className="flex items-center gap-1 font-mono font-bold text-cyan-300">
                    <Dna className="w-3.5 h-3.5 text-cyan-400" />
                    +{quest.rewardCores}
                  </span>
                </div>

                <button
                  onClick={() => {
                    soundFX.playVictory();
                    onClaimQuest(quest.id);
                  }}
                  disabled={!isDone || quest.isClaimed}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    quest.isClaimed
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : isDone
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/60 animate-bounce'
                      : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  }`}
                >
                  {quest.isClaimed ? '수령됨' : isDone ? '보상 수령' : '진행 중'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

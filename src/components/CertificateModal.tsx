import React from 'react';
import { Award, ShieldCheck, Printer, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { PlayerStats } from '../types/game';
import { soundFX } from '../utils/audio';

interface CertificateModalProps {
  player: PlayerStats;
  cleansingRate: number;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  player,
  cleansingRate,
  onClose,
}) => {
  const handlePrint = () => {
    soundFX.playClick();
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-2xl w-full p-6 sm:p-8 text-center shadow-2xl space-y-6 animate-in fade-in zoom-in-95 relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Outer Border with Eco Gold Pattern */}
        <div className="border-4 border-double border-amber-500/60 rounded-xl p-6 sm:p-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 shadow-inner relative">
          {/* Watermark / Logo Icon */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <ShieldCheck className="w-96 h-96 text-emerald-400" />
          </div>

          <div className="relative z-10 space-y-5">
            {/* Certificate Header */}
            <div>
              <span className="text-[11px] font-bold tracking-widest uppercase text-amber-400 border-b border-amber-500/40 pb-1 inline-block">
                REPUBLIC OF KOREA ECO-GUARDIANS ALLIANCE
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2 flex items-center justify-center gap-2">
                <span>대한민국 생태 수호 공로 인증서</span>
              </h2>
              <p className="text-xs text-amber-200/80 font-mono mt-1">
                CERTIFICATE OF ECOLOGICAL MERIT & BIODIVERSITY GUARDIANSHIP
              </p>
            </div>

            {/* Recipient Details */}
            <div className="py-2 border-y border-slate-800/80 space-y-1">
              <p className="text-xs text-slate-400">수호 대원</p>
              <h3 className="text-xl font-black text-emerald-300">
                {player.name} <span className="text-sm text-slate-300 font-semibold">({player.title})</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">가디언 식별 등급: LEVEL {player.level}</p>
            </div>

            {/* Commendation Body */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg mx-auto font-sans">
              위 대원은 우리 동네 생태계의 다양성을 보존하고 외래 생태계교란 생물의 확산을 차단하며,
              멸종위기 야생생물의 구조 및 실시간 GPS 감시망 구축에 혁혁한 공을 세웠으므로
              <strong>『이정빈 생태 연구 총괄 사령부』</strong>의 이름으로 본 수호 공로 인증서를 수여합니다.
            </p>

            {/* Achievement Matrix */}
            <div className="grid grid-cols-3 gap-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">외래 교란종 정화</span>
                <span className="font-mono font-bold text-rose-400 text-base">{player.purifiedCount}회</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">멸종위기종 보호·구조</span>
                <span className="font-mono font-bold text-emerald-400 text-base">{player.rescuedCount}회</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">동네 생태 정화율</span>
                <span className="font-mono font-bold text-cyan-400 text-base">{cleansingRate}%</span>
              </div>
            </div>

            {/* Signature & Seal */}
            <div className="pt-4 flex items-center justify-between border-t border-slate-800">
              <div className="text-left text-xs">
                <span className="text-slate-400 block text-[10px]">인증 일자</span>
                <span className="text-slate-200 font-mono">{currentDate}</span>
              </div>

              {/* Official Seal of Lee Jeongbin */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] text-amber-400/90 block font-semibold">생태 연구 총괄 사령관 / 제작자</span>
                  <strong className="text-base font-black text-white tracking-wide">이 정 빈</strong>
                </div>

                <div className="w-14 h-14 rounded-full border-2 border-red-500 bg-red-950/40 text-red-400 flex flex-col items-center justify-center font-serif text-[10px] font-black shadow-lg shadow-red-950/80 rotate-[-8deg]">
                  <span>이정빈</span>
                  <span className="text-[8px]">연구인</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>인증서 인쇄 / PDF 저장</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-950/60 cursor-pointer"
          >
            확인 및 복귀
          </button>
        </div>
      </div>
    </div>
  );
};

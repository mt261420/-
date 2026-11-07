import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  X, 
  Filter, 
  Sparkles,
  Info,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { Species, TaxonCategory } from '../types/game';
import { SPECIES_DATABASE } from '../data/speciesData';
import { soundFX } from '../utils/audio';

interface EncyclopediaProps {
  discoveredSpeciesIds: Set<string>;
  onClose?: () => void;
}

export const Encyclopedia: React.FC<EncyclopediaProps> = ({
  discoveredSpeciesIds,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'endangered' | 'invasive'>('all');
  const [selectedTaxon, setSelectedTaxon] = useState<string>('all');
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);

  const taxa = [
    { id: 'all', label: '전체 분류군' },
    { id: 'mammal', label: '포유류 (수달·곰 등)' },
    { id: 'bird', label: '조류 (저어새·두루미)' },
    { id: 'reptile_amphibian', label: '양서·파충류 (개구리·도롱뇽)' },
    { id: 'fish', label: '어류 (배스·블루길)' },
    { id: 'insect', label: '곤충류 (말벌·나비)' },
    { id: 'plant', label: '식물류 (가시박·돼지풀)' },
  ];

  const filtered = SPECIES_DATABASE.filter((species) => {
    if (selectedCategory !== 'all' && species.category !== selectedCategory) return false;
    if (selectedTaxon !== 'all' && species.taxon !== selectedTaxon) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = species.name.toLowerCase().includes(q);
      const matchSci = species.scientificName.toLowerCase().includes(q);
      const matchHab = species.habitat.toLowerCase().includes(q);
      const matchWeak = species.weakness.toLowerCase().includes(q);
      if (!matchName && !matchSci && !matchHab && !matchWeak) return false;
    }
    return true;
  });

  const discoveredCount = SPECIES_DATABASE.filter((s) => discoveredSpeciesIds.has(s.id)).length;
  const discoveryPercent = Math.round((discoveredCount / SPECIES_DATABASE.length) * 100);

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-black text-white">
              우리 동네 종합 생태 도감 (Bio-Encyclopedia)
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              총 {SPECIES_DATABASE.length}종 수록
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            이정빈 생태 연구소가 공인한 대한민국 환경부 지정 멸종위기 야생생물과 생태계교란 외래 생물의 통합 도감입니다.
          </p>
        </div>

        {/* Discovery Rate Meter */}
        <div className="bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 flex items-center gap-3 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">수호단 도감 해금률</span>
            <span className="font-mono font-bold text-emerald-400 text-sm">
              {discoveredCount} / {SPECIES_DATABASE.length}종 ({discoveryPercent}%)
            </span>
          </div>
          <div className="w-16 h-2.5 bg-slate-800 rounded-full overflow-hidden border border-emerald-900/40">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
              style={{ width: `${discoveryPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="생물명, 학명, 서식지 검색 (예: 가시박, 수달, 맹꽁이 등)"
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Category Toggle */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => {
              soundFX.playClick();
              setSelectedCategory('all');
            }}
            className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            전체 ({SPECIES_DATABASE.length})
          </button>
          <button
            onClick={() => {
              soundFX.playClick();
              setSelectedCategory('endangered');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
              selectedCategory === 'endangered'
                ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-700/60 shadow-xs'
                : 'text-slate-400 hover:text-emerald-300'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>멸종위기종 (18종)</span>
          </button>
          <button
            onClick={() => {
              soundFX.playClick();
              setSelectedCategory('invasive');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
              selectedCategory === 'invasive'
                ? 'bg-rose-950/80 text-rose-300 border border-rose-700/60 shadow-xs'
                : 'text-slate-400 hover:text-rose-300'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>생태교란종 (18종)</span>
          </button>
        </div>
      </div>

      {/* Taxon Pills */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-xs">
        {taxa.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              soundFX.playClick();
              setSelectedTaxon(t.id);
            }}
            className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap cursor-pointer transition-all ${
              selectedTaxon === t.id
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Species Card Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {filtered.map((species) => {
          const isDiscovered = discoveredSpeciesIds.has(species.id);
          const isEndangered = species.category === 'endangered';

          return (
            <div
              key={species.id}
              onClick={() => {
                soundFX.playClick();
                setSelectedSpecies(species);
              }}
              className={`rounded-xl border p-3 flex flex-col justify-between transition-all duration-300 cursor-pointer hover:scale-[1.02] shadow-lg group ${
                isEndangered
                  ? 'bg-slate-950 hover:bg-slate-900 border-emerald-900/40 hover:border-emerald-500/70'
                  : 'bg-slate-950 hover:bg-slate-900 border-rose-900/40 hover:border-rose-500/70'
              }`}
            >
              {/* Card Image / Avatar */}
              <div className="relative w-full h-32 rounded-lg bg-slate-900 overflow-hidden mb-2.5 border border-slate-800">
                {species.sampleImageUrl ? (
                  <img
                    src={species.sampleImageUrl}
                    alt={species.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    {species.emoji}
                  </div>
                )}

                {/* Status Badges */}
                <span
                  className={`absolute top-2 left-2 text-[9px] font-black px-1.5 py-0.5 rounded shadow-md ${
                    species.rarity === 'SSR'
                      ? 'bg-amber-500 text-slate-950'
                      : species.rarity === 'SR'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700 text-slate-200'
                  }`}
                >
                  {species.rarity}
                </span>

                {isDiscovered && (
                  <span className="absolute top-2 right-2 bg-emerald-950/90 text-emerald-300 text-[9px] font-bold px-1.5 py-0.5 rounded border border-emerald-600 flex items-center gap-0.5 shadow-md">
                    <CheckCircle className="w-2.5 h-2.5" />
                    <span>발견완료</span>
                  </span>
                )}
              </div>

              {/* Title & Scientific Name */}
              <div>
                <div className="flex items-center justify-between gap-1">
                  <h4 className="font-extrabold text-white text-sm group-hover:text-emerald-300 transition-colors truncate">
                    {species.emoji} {species.name}
                  </h4>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                      isEndangered
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}
                  >
                    {isEndangered ? '보호' : '교란'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono italic truncate mt-0.5">
                  {species.scientificName}
                </p>
                <p className="text-[11px] text-slate-300 line-clamp-2 mt-1.5">
                  {species.description}
                </p>
              </div>

              {/* Micro Bottom Info */}
              <div className="mt-3 pt-2 border-t border-slate-900 text-[10px] text-slate-400 flex items-center justify-between">
                <span>{species.designation}</span>
                <span className="font-bold text-slate-300">상세보기 &gt;</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Species Modal Dialog */}
      {selectedSpecies && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-5 sm:p-6 text-left shadow-2xl space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selectedSpecies.emoji}</span>
                  <h3 className="text-xl font-black text-white">{selectedSpecies.name}</h3>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      selectedSpecies.category === 'endangered'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                        : 'bg-rose-950 text-rose-300 border border-rose-700'
                    }`}
                  >
                    {selectedSpecies.designation}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono italic mt-0.5">
                  {selectedSpecies.scientificName}
                </p>
              </div>

              <button
                onClick={() => setSelectedSpecies(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Photo Banner */}
            {selectedSpecies.sampleImageUrl && (
              <div className="w-full h-44 rounded-xl overflow-hidden border border-slate-800">
                <img
                  src={selectedSpecies.sampleImageUrl}
                  alt={selectedSpecies.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Biological Lore & Habitat */}
            <div className="space-y-2 text-xs leading-relaxed text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <p>{selectedSpecies.description}</p>
              <div className="border-t border-slate-800/80 pt-2 text-[11px] text-slate-400">
                <strong className="text-slate-300">대표 서식지: </strong>
                <span>{selectedSpecies.habitat}</span>
              </div>
            </div>

            {/* RPG Battle / Ecology Stats Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">
                  {selectedSpecies.category === 'endangered' ? '보호 우선도' : '생태계 위협도'}
                </span>
                <span className="font-bold text-amber-400 text-sm">
                  ★ {selectedSpecies.category === 'endangered' ? selectedSpecies.conservationPriority : selectedSpecies.threatLevel} / 5
                </span>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">전투 체력 / 수호력</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  {selectedSpecies.hp} HP
                </span>
              </div>
            </div>

            {/* Trivia & Guidelines */}
            <div className="space-y-1.5 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div>
                <strong className="text-amber-300">💡 생태 비하인드 / 트리비아: </strong>
                <span className="text-slate-300">{selectedSpecies.trivia}</span>
              </div>
              <div className="pt-1.5 border-t border-slate-800/60">
                <strong className="text-emerald-300">🌿 수호단 행동 수칙: </strong>
                <span className="text-slate-300">{selectedSpecies.purificationMethod}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedSpecies(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

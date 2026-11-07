import React, { useState } from 'react';
import { 
  MapPin, 
  Radar, 
  Crosshair, 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles, 
  Navigation, 
  LocateFixed, 
  AlertTriangle, 
  RefreshCw,
  Search,
  Eye,
  Swords,
  HeartHandshake
} from 'lucide-react';
import { EcoMarker, Species } from '../types/game';
import { SPECIES_DATABASE } from '../data/speciesData';
import { soundFX } from '../utils/audio';

interface EcoMapProps {
  markers: EcoMarker[];
  onSelectMarker: (marker: EcoMarker, species: Species) => void;
  onQuickSpotEncounter: () => void;
  playerLevel: number;
}

export const EcoMap: React.FC<EcoMapProps> = ({
  markers,
  onSelectMarker,
  onQuickSpotEncounter,
  playerLevel,
}) => {
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [filterType, setFilterType] = useState<'all' | 'endangered' | 'invasive'>('all');
  const [isScanning, setIsScanning] = useState(false);
  const [userGpsStatus, setUserGpsStatus] = useState<string>('기본 좌표계 가동 중');
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);

  // Sectors list
  const sectors = [
    { id: 'all', name: '전체 동네 구역' },
    { id: '하천습지', name: '우리 동네 수변 하천' },
    { id: '근린공원', name: '도심 근린공원 & 숲길' },
    { id: '생태습지', name: '자연 늪지 & 저수지' },
    { id: '야산둘레길', name: '동네 뒷산 생태통로' },
  ];

  const filteredMarkers = markers.filter((m) => {
    if (selectedSector !== 'all' && !m.sectorName.includes(selectedSector)) return false;
    if (filterType !== 'all' && m.category !== filterType) return false;
    return true;
  });

  const handleScanSector = () => {
    soundFX.playScan();
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      onQuickSpotEncounter();
    }, 1200);
  };

  const handleRequestGps = () => {
    soundFX.playClick();
    if ('geolocation' in navigator) {
      setUserGpsStatus('GPS 수신 위성 탐색 중...');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserGpsStatus(`현위치 수신 성공: 위도 ${pos.coords.latitude.toFixed(4)}, 경도 ${pos.coords.longitude.toFixed(4)}`);
        },
        () => {
          setUserGpsStatus('실내/권한 미제공: 이정빈 연구소 가상 GPS 고정밀 모드로 자동 전환됨');
        },
        { timeout: 4000 }
      );
    } else {
      setUserGpsStatus('가상 GPS 로컬 시뮬레이션 활성화');
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Controls & Map Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-4 shadow-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Radar className="w-5 h-5 text-emerald-400 animate-spin" style={{ animationDuration: '8s' }} />
              우리 동네 생태 레이더 지도 (Neighborhood Eco Radar)
            </h2>
            <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-semibold border border-emerald-800/40">
              실시간 감시망
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            이정빈 생태 수호대 GPS 망을 통해 발견된 생물 신호입니다. 마커를 클릭하여 정화 또는 구조 활동을 시작하세요.
          </p>
        </div>

        {/* Buttons: Scan & GPS */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRequestGps}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
          >
            <LocateFixed className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">GPS 보정</span>
          </button>

          <button
            onClick={handleScanSector}
            disabled={isScanning}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white shadow-lg transition-all cursor-pointer ${
              isScanning
                ? 'bg-emerald-800 opacity-80 cursor-wait'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-900/40 hover:scale-[1.02]'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? '주변 생태 탐사 중...' : '주변 생태 레이더 스캔 (+발견)'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Sector Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          {sectors.map((sec) => (
            <button
              key={sec.id}
              onClick={() => {
                soundFX.playClick();
                setSelectedSector(sec.id);
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
                selectedSector === sec.id
                  ? 'bg-slate-800 text-emerald-300 border border-emerald-500/40 shadow-xs'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {sec.name}
            </button>
          ))}
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer ${
              filterType === 'all'
                ? 'bg-slate-700 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            전체 ({markers.length})
          </button>
          <button
            onClick={() => setFilterType('endangered')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium cursor-pointer ${
              filterType === 'endangered'
                ? 'bg-emerald-900/70 text-emerald-300 font-bold border border-emerald-600/40'
                : 'text-slate-400 hover:text-emerald-300'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>멸종위기종</span>
          </button>
          <button
            onClick={() => setFilterType('invasive')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium cursor-pointer ${
              filterType === 'invasive'
                ? 'bg-rose-950/70 text-rose-300 font-bold border border-rose-600/40'
                : 'text-slate-400 hover:text-rose-300'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>교란생물</span>
          </button>
        </div>
      </div>

      {/* Interactive Map Visual Radar Display */}
      <div className="relative w-full h-[460px] sm:h-[520px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col justify-between p-4">
        {/* Radar Background Grid & Topo Contours */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
        
        {/* River & Mountain topographical visual mock */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
          <path d="M-100,280 C200,240 350,380 600,320 C850,260 1100,340 1400,290" fill="none" stroke="#0ea5e9" strokeWidth="32" strokeLinecap="round" />
          <path d="M-50,120 C300,90 500,180 800,110 C1000,60 1200,140 1500,100" fill="none" stroke="#10b981" strokeWidth="18" strokeDasharray="6 6" />
        </svg>

        {/* Circular Radar Sweep */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-72 sm:w-96 h-72 sm:h-96 rounded-full border border-emerald-500/20">
            <div className="absolute inset-0 rounded-full border border-emerald-500/10 animate-ping" style={{ animationDuration: '4s' }} />
            <div className="absolute inset-8 rounded-full border border-dashed border-emerald-500/15" />
            <div className="absolute inset-16 rounded-full border border-emerald-500/20" />
            {/* Center crosshair */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-emerald-500/20 -translate-y-1/2" />
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-emerald-500/20 -translate-x-1/2" />
          </div>
        </div>

        {/* Top Overlay Badges */}
        <div className="relative z-10 flex items-center justify-between text-xs pointer-events-none">
          <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/60 pointer-events-auto">
            <span className="text-slate-400">탐사 지대: </span>
            <span className="font-bold text-white">
              {selectedSector === 'all' ? '우리 동네 전 구역 통합 레이더' : selectedSector}
            </span>
          </div>

          <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/60 text-[11px] text-slate-300 pointer-events-auto">
            <span>{userGpsStatus}</span>
          </div>
        </div>

        {/* Map Markers Overlay */}
        <div className="absolute inset-0 p-8 sm:p-12 overflow-hidden">
          {filteredMarkers.map((marker, index) => {
            const species = SPECIES_DATABASE.find((s) => s.id === marker.speciesId) || SPECIES_DATABASE[0];
            const isEndangered = marker.category === 'endangered';
            const isSelected = selectedMarkerId === marker.id;

            // Deterministic positions based on index and coords
            const posX = 15 + ((index * 29) % 70);
            const posY = 15 + ((index * 37) % 68);

            return (
              <div
                key={marker.id}
                className="absolute transition-all duration-300 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${posX}%`, top: `${posY}%` }}
              >
                {/* Marker Button */}
                <button
                  onClick={() => {
                    soundFX.playClick();
                    setSelectedMarkerId(isSelected ? null : marker.id);
                  }}
                  className={`group relative flex items-center justify-center cursor-pointer transition-transform hover:scale-125 ${
                    isSelected ? 'scale-125 z-30' : 'z-20'
                  }`}
                >
                  {/* Pulsing ring */}
                  <span
                    className={`absolute -inset-2 rounded-full animate-ping opacity-40 pointer-events-none ${
                      isEndangered ? 'bg-emerald-400' : 'bg-rose-500'
                    }`}
                  />

                  {/* Marker Pin Icon Container */}
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-base sm:text-lg shadow-lg border-2 ${
                      isEndangered
                        ? 'bg-slate-900 border-emerald-400 text-emerald-300 shadow-emerald-950/80'
                        : 'bg-slate-900 border-rose-500 text-rose-300 shadow-rose-950/80'
                    }`}
                  >
                    <span>{species.emoji}</span>
                  </div>

                  {/* Micro Name Label below pin */}
                  <span
                    className={`absolute top-full mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold whitespace-nowrap shadow-md pointer-events-none ${
                      isEndangered
                        ? 'bg-emerald-950/90 text-emerald-200 border border-emerald-700/60'
                        : 'bg-rose-950/90 text-rose-200 border border-rose-700/60'
                    }`}
                  >
                    {marker.name}
                  </span>
                </button>

                {/* Popover Card when marker is clicked */}
                {isSelected && (
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-64 sm:w-72 bg-slate-900/95 backdrop-blur-md rounded-xl p-3 border border-slate-700 shadow-2xl z-40 text-left">
                    <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2 mb-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-base">{species.emoji}</span>
                          <h4 className="font-extrabold text-white text-sm">{species.name}</h4>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              isEndangered
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                                : 'bg-rose-950 text-rose-300 border border-rose-700'
                            }`}
                          >
                            {species.rarity}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono italic">{species.scientificName}</p>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
                        {marker.sectorName}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300 line-clamp-2 mb-2">
                      {species.description}
                    </p>

                    <div className="grid grid-cols-2 gap-1.5 text-[10px] bg-slate-950/80 p-2 rounded border border-slate-800 mb-3">
                      <div>
                        <span className="text-slate-400">구분: </span>
                        <span className={`font-bold ${isEndangered ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {species.designation}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">약점/정화법: </span>
                        <span className="font-semibold text-slate-200 truncate block">
                          {species.weakness}
                        </span>
                      </div>
                    </div>

                    {/* Action Button: Battle or Rescue */}
                    <button
                      onClick={() => onSelectMarker(marker, species)}
                      className={`w-full py-2 px-3 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
                        isEndangered
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500'
                          : 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500'
                      }`}
                    >
                      {isEndangered ? (
                        <>
                          <HeartHandshake className="w-4 h-4 text-emerald-200" />
                          <span>응급 보호 & 비콘 등록 진행</span>
                        </>
                      ) : (
                        <>
                          <Swords className="w-4 h-4 text-rose-200" />
                          <span>생태 정화 턴제 배틀 출격!</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Status Bar inside map */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>탐사 레이더 활성 신호: <strong className="text-white font-mono">{filteredMarkers.length}개</strong></span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>멸종위기 보호종</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>외래 생태교란종</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

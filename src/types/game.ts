export type SpeciesCategory = 'endangered' | 'invasive' | 'native';
export type SpeciesDesignation = 
  | '멸종위기 야생생물 I급' 
  | '멸종위기 야생생물 II급' 
  | '생태계교란 생물' 
  | '일반 자생생물';

export type TaxonCategory = 'mammal' | 'bird' | 'reptile_amphibian' | 'fish' | 'insect' | 'plant';

export interface Species {
  id: string;
  name: string;
  scientificName: string;
  category: SpeciesCategory;
  designation: SpeciesDesignation;
  taxon: TaxonCategory;
  rarity: 'SSR' | 'SR' | 'R';
  badgeColor: string;
  emoji: string;
  imageUrl?: string;
  description: string;
  habitat: string;
  threatLevel: number; // 1-5 (for invasive)
  conservationPriority: number; // 1-5 (for endangered)
  hp: number;
  atk: number;
  weakness: string;
  purificationMethod: string;
  dropExp: number;
  dropGold: number;
  trivia: string;
  sampleImageUrl?: string;
}

export interface PlayerStats {
  name: string;
  title: string;
  level: number;
  exp: number;
  maxExp: number;
  hp: number;
  maxHp: number;
  energy: number;
  maxEnergy: number;
  gold: number;
  bioCores: number;
  scannerLevel: number; // 1-4
  toolLevel: number; // 1-4
  radarLevel: number; // 1-4
  purifiedCount: number;
  rescuedCount: number;
  scannedCount: number;
}

export interface EcoMarker {
  id: string;
  speciesId: string;
  name: string;
  category: SpeciesCategory;
  designation: string;
  lat: number;
  lng: number;
  sectorName: string;
  isPurified?: boolean;
  isRescued?: boolean;
  discoveredAt: string;
  hp: number;
  maxHp: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  targetCount: number;
  currentCount: number;
  isCompleted: boolean;
  isClaimed: boolean;
  rewardExp: number;
  rewardGold: number;
  rewardCores: number;
  type: 'purify' | 'rescue' | 'scan' | 'explore';
}

export interface BattleActionLog {
  sender: 'player' | 'enemy' | 'system';
  message: string;
  type?: 'damage' | 'heal' | 'buff' | 'crit' | 'special';
}

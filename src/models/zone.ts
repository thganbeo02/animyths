import { ZoneId } from './branded';
import { Faction } from './faction';

export type PatrolDurationTier = 'quick' | 'short' | 'standard' | 'extended' | 'overnight';

export interface PatrolDurationOption {
  tier: PatrolDurationTier;
  durationSeconds: number;
  isGated: boolean;
}

export interface Zone {
  id: ZoneId;
  name: string;
  primaryFaction: Faction;
  recommendedFactions: readonly Faction[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  durations: readonly PatrolDurationOption[];
  artUrl: string;
  lore: string;
  unlockAt: number;
}

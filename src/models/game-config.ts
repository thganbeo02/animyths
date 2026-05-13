import { MvpVariant, Rarity, Variant } from './card';
import { CurrencyAmount } from './currency';
import { Faction } from './faction';

export type PackTier = 'standard' | 'premium' | 'event';

export interface GameConfig {
  variantRates: Record<PackTier, Partial<Record<Variant, number>>>;
  patrolVariantRates: Record<MvpVariant, number>;
  packRarityRates: Record<PackTier, Record<Rarity, number>>;
  factionAffinityBonus: Partial<Record<Faction, number>>;
  patrolBaseRewards: Record<string, CurrencyAmount[]>;
  fusionCost: Record<string, FusionCostEntry>;
}

export interface FusionCostEntry {
  duplicatesRequired: number;
  essenceCost: number;
}

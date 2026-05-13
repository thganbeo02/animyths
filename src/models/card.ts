import { CardInstanceId, TemplateId } from './branded';
import { Faction } from './faction';

export type Variant = 'standard' | 'foil' | 'prismatic' | 'mythic';
export const VARIANTS = ['standard', 'foil', 'prismatic', 'mythic'] as const;

export type MvpVariant = Exclude<Variant, 'mythic'>;
export const MVP_VARIANTS = ['standard', 'foil', 'prismatic'] as const;

export type Rarity = 'common' | 'rare' | 'epic' | 'legendary' | 'ultimate';
export const RARITIES = ['common', 'rare', 'epic', 'legendary', 'ultimate'] as const;

export type AcquisitionSource = 'patrol' | 'pack' | 'starter' | 'combat' | 'admin';
export type MythicEdition = 'genesis' | 'resonance';

export interface CardTemplate {
  id: TemplateId;
  name: string;
  faction: Faction;
  rarity: Rarity;
  artUrl: string;
  lore: string;
  baseStats: CardBaseStats;
}

export interface CardBaseStats {
  hp: number;
  attack: number;
  defense: number;
  speed: number;
}

export interface CardStackInstance {
  kind: 'stack';
  id: CardInstanceId;
  templateId: TemplateId;
  variant: Exclude<Variant, 'mythic'>;
  rarity: Rarity;
  level: number;
  locked: boolean;
  acquiredFrom: AcquisitionSource;
  acquiredAt: Date;
}

export interface MythicCardInstance {
  kind: 'mythic';
  id: CardInstanceId;
  templateId: TemplateId;
  variant: 'mythic';
  rarity: Rarity;
  edition: MythicEdition;
  mintNumber: number;
  mintCap: number;
  isFounder: boolean;
  acquiredFrom: AcquisitionSource;
  acquiredAt: Date;
}

export type CardInstance = CardStackInstance | MythicCardInstance;

export function isFoil(
  instance: CardInstance,
): instance is CardStackInstance & { variant: 'foil' } {
  return instance.kind === 'stack' && instance.variant === 'foil';
}

export function isPrismatic(
  instance: CardInstance,
): instance is CardStackInstance & { variant: 'prismatic' } {
  return instance.kind === 'stack' && instance.variant === 'prismatic';
}

export function isMythic(instance: CardInstance): instance is MythicCardInstance {
  return instance.kind === 'mythic';
}

export function isFusable(instance: CardInstance): instance is CardStackInstance {
  return instance.kind === 'stack' && !instance.locked;
}

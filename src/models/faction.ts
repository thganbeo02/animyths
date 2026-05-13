export const FACTIONS = ['Forge', 'Wilds', 'Arcane', 'Circuit', 'Underworld', 'Ledger'] as const;

export type Faction = (typeof FACTIONS)[number];

export function isFaction(s: string): s is Faction {
  return (FACTIONS as readonly string[]).includes(s);
}

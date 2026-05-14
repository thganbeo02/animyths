import type { Rarity, Variant } from '@/models/card';
import type { Faction } from '@/models/faction';

import { colorPrimitives } from './primitives';

export const colors = {
  surface: {
    app: colorPrimitives.surfaceBackground,
    card: colorPrimitives.white,
    cardWarm: colorPrimitives.cream,
    panelLavender: colorPrimitives.lavenderPanel,
    panelBlue: colorPrimitives.bluePanel,
    panelPeach: colorPrimitives.peachPanel,
    panelDark: colorPrimitives.surfaceDark,
  },
  text: {
    primary: colorPrimitives.charcoal,
    secondary: colorPrimitives.textSecondary,
    tertiary: colorPrimitives.textTertiary,
    inverse: colorPrimitives.white,
    numeric: colorPrimitives.charcoal,
  },
  border: {
    subtle: colorPrimitives.borderSubtle,
    strong: colorPrimitives.borderStrong,
  },
  state: {
    success: colorPrimitives.green,
    warning: colorPrimitives.goldWarm,
    error: colorPrimitives.error,
    info: colorPrimitives.blue,
  },
  action: {
    primary: colorPrimitives.purple,
    primarySoft: colorPrimitives.lavender,
  },
  faction: {
    Forge: colorPrimitives.coral,
    Wilds: colorPrimitives.green,
    Arcane: colorPrimitives.purple,
    Circuit: colorPrimitives.cyan,
    Underworld: colorPrimitives.underworld,
    Ledger: colorPrimitives.gold,
  } satisfies Record<Faction, string>,
  factionSoft: {
    Forge: colorPrimitives.peach,
    Wilds: colorPrimitives.greenSoft,
    Arcane: colorPrimitives.lavenderSoft,
    Circuit: colorPrimitives.blueSoft,
    Underworld: colorPrimitives.underworldSoft,
    Ledger: colorPrimitives.goldSoft,
  } satisfies Record<Faction, string>,
  rarity: {
    common: colorPrimitives.gray,
    rare: colorPrimitives.blueRare,
    epic: colorPrimitives.purpleRich,
    legendary: colorPrimitives.goldWarm,
    ultimate: colorPrimitives.goldWarm,
  } satisfies Record<Rarity, string>,
  rarityGlow: {
    common: colorPrimitives.transparent,
    rare: colorPrimitives.rareGlow,
    epic: colorPrimitives.epicGlow,
    legendary: colorPrimitives.legendaryGlow,
    ultimateGold: colorPrimitives.ultimateGoldGlow,
    ultimatePurple: colorPrimitives.ultimatePurpleGlow,
  },
  variant: {
    standard: {
      sigil: '',
      overlayOpacity: 0,
      staticGradient: [] as const,
    },
    foil: {
      sigil: '✦',
      overlayOpacity: 0.25,
      staticGradient: [colorPrimitives.foilBlueSoft, colorPrimitives.white, colorPrimitives.foilBlue] as const,
    },
    prismatic: {
      sigil: '✶',
      overlayOpacity: 0.3,
      staticGradient: [colorPrimitives.prismaticGold, colorPrimitives.prismaticPink, colorPrimitives.blue] as const,
    },
    mythic: {
      sigil: '✸',
      overlayOpacity: 0.35,
      staticGradient: [colorPrimitives.goldWarm, colorPrimitives.purple, colorPrimitives.cyan] as const,
    },
  } satisfies Record<Variant, { sigil: string; overlayOpacity: number; staticGradient: readonly string[] }>,
  gradient: {
    purple: [colorPrimitives.purple, colorPrimitives.purpleSoft] as const,
    blue: [colorPrimitives.blue, colorPrimitives.blueSoft] as const,
    sunset: [colorPrimitives.coral, colorPrimitives.coralSoft] as const,
    night: [colorPrimitives.purpleDeep, colorPrimitives.purple] as const,
    gold: [colorPrimitives.gold, colorPrimitives.goldSoft] as const,
  },
} as const;

import { colors } from './tokens/colors';
import { motion } from './tokens/motion';
import { radius } from './tokens/radius';
import { shadows } from './tokens/shadows';
import { spacing } from './tokens/spacing';
import { typeScale } from './tokens/typography';

export const theme = {
  colors,
  motion,
  radius,
  shadows,
  spacing,
  typeScale,
} as const;

export type Theme = typeof theme;

export function useTheme(): Theme {
  return theme;
}

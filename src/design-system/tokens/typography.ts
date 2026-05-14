export const fontFamily = {
  sans: {
    regular: 'PlusJakartaSans-Regular',
    medium: 'PlusJakartaSans-Medium',
    semibold: 'PlusJakartaSans-SemiBold',
    bold: 'PlusJakartaSans-Bold',
    extrabold: 'PlusJakartaSans-ExtraBold',
  },
  mono: {
    regular: 'JetBrainsMono-Regular',
    medium: 'JetBrainsMono-Medium',
    semibold: 'JetBrainsMono-SemiBold',
    bold: 'JetBrainsMono-Bold',
  },
} as const;

export const typeScale = {
  display: { fontSize: 32, lineHeight: 36, fontFamily: fontFamily.sans.extrabold },
  h1: { fontSize: 28, lineHeight: 34, fontFamily: fontFamily.sans.bold },
  h2: { fontSize: 22, lineHeight: 28, fontFamily: fontFamily.sans.bold },
  h3: { fontSize: 18, lineHeight: 24, fontFamily: fontFamily.sans.semibold },
  bodyLg: { fontSize: 16, lineHeight: 24, fontFamily: fontFamily.sans.regular },
  body: { fontSize: 14, lineHeight: 22, fontFamily: fontFamily.sans.regular },
  caption: { fontSize: 12, lineHeight: 18, fontFamily: fontFamily.sans.medium },
  micro: { fontSize: 10, lineHeight: 14, fontFamily: fontFamily.sans.semibold },
  numXl: { fontSize: 36, lineHeight: 36, fontFamily: fontFamily.mono.bold },
  numLg: { fontSize: 22, lineHeight: 26, fontFamily: fontFamily.mono.bold },
  numMd: { fontSize: 16, lineHeight: 20, fontFamily: fontFamily.mono.semibold },
  numSm: { fontSize: 12, lineHeight: 16, fontFamily: fontFamily.mono.semibold },
  button: { fontSize: 16, lineHeight: 16, fontFamily: fontFamily.sans.semibold },
  buttonSm: { fontSize: 14, lineHeight: 14, fontFamily: fontFamily.sans.semibold },
} as const;

export type TextVariant = keyof typeof typeScale;

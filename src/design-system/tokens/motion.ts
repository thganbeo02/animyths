export const motion = {
  fast: {
    duration: 150,
    easing: 'ease-out',
  },
  standard: {
    duration: 250,
    easing: 'ease-in-out',
  },
  slow: {
    duration: 400,
    easing: 'ease-out',
  },
  cinematic: {
    duration: 1000,
    minDuration: 800,
    maxDuration: 1200,
    easing: 'custom',
  },
  ambient: {
    duration: 2000,
    easing: 'linear',
  },
} as const;

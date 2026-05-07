import { ExpoConfig } from 'expo/config';

const ENV = process.env.EXPO_PUBLIC_ENV ?? 'development';

const isDev = ENV === 'development';
const isPrev = ENV === 'preview';

const config: ExpoConfig = {
  name: isDev ? 'AniMyths (Dev)' : isPrev ? 'AniMyths (Preview)' : 'AniMyths',
  slug: 'animyths',
  version: '0.1.0',
  orientation: 'portrait',
  icon: './src/assets/icon.png',
  scheme: 'animyths',
  userInterfaceStyle: 'light',
  newArchEnabled: true,
  splash: {
    image: './src/assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#FFFFFF',
  },
  ios: {
    bundleIdentifier: isDev
      ? 'com.animyths.app.dev'
      : isPrev
        ? 'com.animyths.app.preview'
        : 'com.animyths.app',
    supportsTablet: false,
  },
  android: {
    package: isDev
      ? 'com.animyths.app.dev'
      : isPrev
        ? 'com.animyths.app.preview'
        : 'com.animyths.app',
    adaptiveIcon: {
      foregroundImage: './src/assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
  },
  plugins: [
    'expo-router',
    'expo-secure-store',
    [
      'expo-build-properties',
      {
        ios: { newArchEnabled: true },
        android: { newArchEnabled: true },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    env: ENV,
    eas: {
      // Filled in by eas build:configure later
    },
  },
};

export default config;

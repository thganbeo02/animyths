import { SplashScreen, useSegments, Slot, router } from 'expo-router';
import { useFonts } from 'expo-font';
import { useAuthStore } from '@/stores/auth-store';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'PlusJakartaSans-Regular': require('@/assets/fonts/PlusJakartaSans-Regular.ttf'),
    'PlusJakartaSans-Medium': require('@/assets/fonts/PlusJakartaSans-Medium.ttf'),
    'PlusJakartaSans-SemiBold': require('@/assets/fonts/PlusJakartaSans-SemiBold.ttf'),
    'PlusJakartaSans-Bold': require('@/assets/fonts/PlusJakartaSans-Bold.ttf'),
    'JetBrainsMono-Regular': require('@/assets/fonts/JetBrainsMono-Regular.ttf'),
    'JetBrainsMono-Medium': require('@/assets/fonts/JetBrainsMono-Medium.ttf'),
  });

  const { status } = useAuthStore();
  const segments = useSegments();

  const ready = fontsLoaded && status !== 'idle' && status !== 'loading';

  useEffect(() => {
    if (!ready) return;

    SplashScreen.hideAsync();

    const inAuthGroup = segments[0] === '(auth)';
    const inApp = segments[0] === '(app)';

    if (status === 'unauthenticated' && !inAuthGroup) {
      router.replace('/(auth)/welcome');
    }
    if (status === 'authenticated' && !inApp) {
      router.replace('/(app)/(tabs)/');
    }
  }, [ready, status, segments]);

  return <Slot />;
}

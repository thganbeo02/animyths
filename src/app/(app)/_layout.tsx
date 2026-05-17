import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack>
      {/* Tab navigator */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Full screen modals - tab bar hidden */}
      <Stack.Screen
        name="patrol-result"
        options={{ presentation: 'fullScreenModal', headerShown: false }}
      />
      <Stack.Screen
        name="pack-open"
        options={{ presentation: 'fullScreenModal', headerShown: false }}
      />
      {/* Standard modals */}
      <Stack.Screen name="squad-select" options={{ presentation: 'modal', headerShown: false }} />
    </Stack>
  );
}

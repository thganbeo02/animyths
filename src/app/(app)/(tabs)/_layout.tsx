import { theme } from '@/design-system/theme';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: theme.colors.surface.card },
        tabBarActiveTintColor: theme.colors.action.primary,
        tabBarInactiveTintColor: theme.colors.text.tertiary,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="patrol" options={{ title: 'Home' }} />
      <Tabs.Screen name="atlas" options={{ title: 'Home' }} />
      <Tabs.Screen name="collection" options={{ title: 'Home' }} />
      <Tabs.Screen name="profile" options={{ title: 'Home' }} />
    </Tabs>
  );
}

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export function App() {
  return (
    <View style={styles.container}>
      <Text>AniMyths v0.1</Text>
      <Text>Env: {process.env.EXPO_PUBLIC_ENV}</Text>
      <Text>Supabase URL: {process.env.EXPO_PUBLIC_SUPABASE_URL}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

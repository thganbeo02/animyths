import { View } from 'react-native';
import { Text } from '@/design-system/primitives/Text';
import { theme } from '@/design-system/theme';

export default function AtlasScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Atlas</Text>
      <Text>Coming in Phase 2!</Text>
    </View>
  );
}

import { Pressable as RNPressable, type PressableProps } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import React from 'react';

interface Props extends PressableProps {
  haptic?: 'light' | 'medium' | 'heavy' | 'none';
}

export function Pressable({ children, onPress, haptic = 'light', style, ...props }: Props) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function handlePressIn() {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
  }

  function handlePressOut() {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  }

  async function handlePress(event: Parameters<NonNullable<PressableProps['onPress']>>[0]) {
    if (haptic !== 'none') {
      await Haptics.impactAsync(
        haptic === 'light'
          ? Haptics.ImpactFeedbackStyle.Light
          : haptic === 'medium'
            ? Haptics.ImpactFeedbackStyle.Medium
            : Haptics.ImpactFeedbackStyle.Heavy,
      );
    }
    onPress?.(event);
  }

  return (
    <Animated.View style={[animatedStyle, style as object]}>
      <RNPressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        hitSlop={8}
        {...props}
      ></RNPressable>
    </Animated.View>
  );
}

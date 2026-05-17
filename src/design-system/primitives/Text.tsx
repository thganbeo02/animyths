import React from 'react';
import { Text as RNText, StyleSheet, type TextProps as RNTextProps } from 'react-native';

import { typeScale, type TextVariant } from '../tokens/typography';

interface TextProps extends RNTextProps {
  variant?: TextVariant;
}

export function Text({ variant = 'body', style, ...props }: TextProps) {
  return <RNText style={[styles[variant], style]} {...props} />;
}

const styles = StyleSheet.create(
  Object.fromEntries(Object.entries(typeScale).map(([key, value]) => [key, value])) as Record<
    TextVariant,
    object
  >,
);

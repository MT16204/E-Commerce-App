import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useIsFocused } from '@react-navigation/native';

export function FocusAwareStatusBar(props: any) {
  const isFocused = useIsFocused();
  return isFocused ? <StatusBar {...props} /> : null;
}
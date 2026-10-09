import React from 'react';
import { StyleSheet, Text } from 'react-native';

export default function AppText({ children, style, ...props }) {
  return (
    <Text style={[styles.text, style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Commissioner',
    color: '#000000',
  },
});


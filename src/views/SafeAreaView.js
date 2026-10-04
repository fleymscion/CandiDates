import React from 'react';
import { StyleSheet, Text, View, Platform, StatusBar, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CustomTemplate({ title, children, navigation, showMenu = true }) {
  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.headerContainer}>
        {showMenu ? (
          <TouchableOpacity onPress={() => navigation?.toggleDrawer()}>
            <Ionicons name="menu" size={28} color="#ffffff" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 28 }} />
        )}

        <Text style={styles.headerText}>{title}</Text>

        <View style={{ width: 28 }} />
      </View>

      {/* Main Body */}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#011F5B',
    // Adds top padding specifically on Android so header text isn't under status bar
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 44,
  },
  headerContainer: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
  },
  content: {
    flex: 1,
    backgroundColor: '#F5F9FF',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
});
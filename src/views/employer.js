import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Platform, StatusBar, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function EmployerTemplate({ title = "Profile", children, navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>

      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation?.toggleDrawer()}>
          <Ionicons name="menu" size={32} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerText}>{title}</Text>

        <View style={{ width: 32 }} />
      </View>
          
      <View style={styles.content}>
        {children}
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#011F5B',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerContainer: {
    height: 65,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  content: {
    flex: 1,
    backgroundColor: '#F5F9FF',
  },
});

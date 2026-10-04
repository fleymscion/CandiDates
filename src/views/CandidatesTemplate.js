import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Platform, StatusBar } from 'react-native';


export default function Template({ title, children }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>{title}</Text>
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
    borderRadius: 10,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerContainer: {
    height: 75,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,


  },
  headerText: {
    fontSize: 36,
    fontFamily: "Commissioner",
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 10,
  },

  content: {
      flex: 1,
      backgroundColor: '#F5F9FF',
      paddingHorizontal: 20,
      paddingVertical: 20,
    },
});
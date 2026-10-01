import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Platform, StatusBar } from 'react-native';


export default function MyHeader() {
  return (
    //Safe Area note safe area view is deprecated Snack.expo.dev. does not have is as a dependency
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>App Title</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
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
    marginBottom: 10
  },
});

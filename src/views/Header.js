import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Platform, StatusBar, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Template({ title = "title", children, navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      
      <View style={styles.headerContainer}>

        <TouchableOpacity onPress={() => navigation?.toggleDrawer()}>
          <Ionicons name="menu" size={35} color="white" />
        </TouchableOpacity>

        <Text style={styles.headerText}>{title}</Text>

        <View style={{ width: 28 }} />
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
    justifyContent: 'space-between', // <-- Changed from 'center' to push elements to edges
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerText: {
    fontSize: 36,
    fontFamily: "Commissioner",
    fontWeight: 'bold',
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

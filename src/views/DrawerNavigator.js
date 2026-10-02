import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Template from './Template'; // <-- Adjust the path if needed

const Drawer = createDrawerNavigator();

function HomeScreen({ navigation }) {
  return (
    <Template title="Home" navigation={navigation}>
      <Text style={styles.bodyText}>Welcome to the Home Screen!</Text>
    </Template>
  );
}

function SettingsScreen({ navigation }) {
  return (
    <Template title="Settings" navigation={navigation}>
      <Text style={styles.bodyText}>Manage your configurations here.</Text>
    </Template>
  );
}

function ProfileScreen({ navigation }) {
  return (
    <Template title="Profile" navigation={navigation}>
      <Text style={styles.bodyText}>Manage your Profile here.</Text>
    </Template>
  );
}


// Export the Navigator so App.js can use it
export default function DrawerNavigator() {
  return (
    <Drawer.Navigator 
      initialRouteName="Home"
      screenOptions={{ 
        headerShown: false, // Hides default header so your Template header displays
         drawerType: 'front'
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  bodyText: { fontSize: 16, color: '#333' }
});

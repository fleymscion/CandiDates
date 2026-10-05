import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Template from './Header';
import { GeneralCalendar, HighlightCalendar, HiddenCalendar } from './CalendarScreens';
import { EventProvider } from './EventContext';

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

export default function DrawerNavigator() {
  return (
    <EventProvider>
      <Drawer.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          drawerType: 'front',
          drawerLabelStyle: { fontSize: 22 },
        }}
      >
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="General Calendar" component={GeneralCalendar} />
        <Drawer.Screen name="Highlight Calendar" component={HighlightCalendar} />
        <Drawer.Screen name="Hidden Dates" component={HiddenCalendar} />
        <Drawer.Screen name="Profile" component={ProfileScreen} />
        <Drawer.Screen name="Settings" component={SettingsScreen} />
      </Drawer.Navigator>
    </EventProvider>
  );
}

const styles = StyleSheet.create({
  bodyText: { fontSize: 16, color: '#333333', padding: 16 },
});

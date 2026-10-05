import React, { useState } from 'react';
import { Text, StyleSheet, FlatList } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Template from './Header';
import EventCard from './EventCard';
import { DateModel } from '../models/DateModel';

const Drawer = createDrawerNavigator();

const initialEvents = [
  new DateModel('1', '', 'Calendar', 'March 1, 2026', '10:00 AM', ['TIP'], 'Description here', 'regular'),
  new DateModel('2', '', 'TESTHIGHLIGHT', 'March 12, 2026', '02:00 PM', ['TIP'], 'Description here', 'highlighted'),
  new DateModel('3', '', 'Calendar', 'March 15, 2026', '09:00 AM', ['TIP'], 'Description here', 'regular'),
  new DateModel('4', '', 'Calendar', 'March 20, 2026', '04:00 PM', ['TIP'], 'Description here', 'highlighted'),
];

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

function HighlightCalendar({ navigation, events, onDelete }) {
  const highlightedEvents = events.filter(
    (item) => item.classification === 'highlighted'
  );

  return (
    <Template title="Highlight Calendar" navigation={navigation}>
      <FlatList
        data={highlightedEvents}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <EventCard item={item} onDelete={onDelete} />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No highlighted events found.</Text>
        }
      />
    </Template>
  );
}

function GeneralCalendar({ navigation, events, onDelete }) {
  return (
    <Template title="General Calendar" navigation={navigation}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <EventCard item={item} onDelete={onDelete} />
        )}
      />
    </Template>
  );
}

export default function DrawerNavigator() {
  const [events, setEvents] = useState(initialEvents);

  const handleDelete = (id) => {
    setEvents((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerLabelStyle: { fontSize: 22 },
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="General Calendar">
        {(props) => (
          <GeneralCalendar {...props} events={events} onDelete={handleDelete} />
        )}
      </Drawer.Screen>
      <Drawer.Screen name="Highlight Calendar">
        {(props) => (
          <HighlightCalendar {...props} events={events} onDelete={handleDelete} />
        )}
      </Drawer.Screen>
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  bodyText: {
    fontSize: 16,
    color: '#333333',
    padding: 16,
  },
  listContent: {
    padding: 8,
  },
  columnWrapper: {
    justifyContent: 'flex-start',
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 40,
  },
});

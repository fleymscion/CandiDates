import React from 'react';
import { Text, StyleSheet, FlatList } from 'react-native';
import Template from './Header';
import EventCard from './EventCard';
import { useEvents } from './EventContext';

export function GeneralCalendar({ navigation }) {
  const { events, hideFromGeneral } = useEvents();
  const visibleEvents = events.filter((item) => !item.isHidden);

  return (
    <Template title="General Calendar" navigation={navigation}>
      <FlatList
        data={visibleEvents}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <EventCard item={item} onDelete={hideFromGeneral} />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No events found.</Text>
        }
      />
    </Template>
  );
}

export function HighlightCalendar({ navigation }) {
  const { events, removeFromHighlight } = useEvents();
  const highlightedEvents = events.filter(
    (item) => item.classification === 'highlighted' && !item.isHidden
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
          <EventCard item={item} onDelete={removeFromHighlight} />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No highlighted events found.</Text>
        }
      />
    </Template>
  );
}

export function HiddenCalendar({ navigation }) {
  const { events, unhideEvent } = useEvents();
  const hiddenEvents = events.filter((item) => item.isHidden);

  return (
    <Template title="Hidden Dates" navigation={navigation}>
      <FlatList
        data={hiddenEvents}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <EventCard item={item} onUnhide={unhideEvent} />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hidden dates found.</Text>
        }
      />
    </Template>
  );
}

const styles = StyleSheet.create({
  listContent: { padding: 8 },
  columnWrapper: { justifyContent: 'flex-start' },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 40,
  },
});

import { FlatList, StyleSheet, Text } from 'react-native';
import EventCard from './EventCard';
import { useEvents } from './EventContext';
import Template from './Header';

export function GeneralCalendar({ navigation }) {
  // 1. Extract toggleHighlight (or your context's highlight handler name)
  const { events, hideFromGeneral, toggleHighlight } = useEvents();
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
          // 2. Pass onToggleHighlight to EventCard
          <EventCard 
            item={item} 
            onDelete={hideFromGeneral} 
            onToggleHighlight={toggleHighlight}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No events found.</Text>
        }
      />
    </Template>
  );
}

export function HighlightCalendar({ navigation }) {
  const { events, removeFromHighlight, toggleHighlight } = useEvents();
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
          <EventCard 
            item={item} 
            onDelete={removeFromHighlight} 
            onToggleHighlight={toggleHighlight}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No highlighted events found.</Text>
        }
      />
    </Template>
  );
}

export function HiddenCalendar({ navigation }) {
  const { events, unhideEvent, toggleHighlight } = useEvents();
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
          <EventCard 
            item={item} 
            onUnhide={unhideEvent} 
            onToggleHighlight={toggleHighlight}
          />
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
import { FlatList, StyleSheet, Text } from 'react-native';
import EventCard from './EventCard';
import { useEvents } from './EventContext';
import { usePreferences } from './PreferencesContext';
import Template from './Header';

// Renders events as a 2-column grid or a 1-column list depending on the
// "Calendar View Mode" preference.
function EventList({ data, emptyText, cardProps }) {
  const { calendarViewMode } = usePreferences();
  const isList = calendarViewMode === 'list';
  const numColumns = isList ? 1 : 2;

  return (
    <FlatList
      // numColumns can't change on a live FlatList, so a new key forces a fresh one
      key={`cols-${numColumns}`}
      data={data}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      contentContainerStyle={styles.listContent}
      // columnWrapperStyle is only allowed when numColumns > 1
      columnWrapperStyle={isList ? undefined : styles.columnWrapper}
      renderItem={({ item }) => <EventCard item={item} fullWidth={isList} {...cardProps} />}
      ListEmptyComponent={<Text style={styles.emptyText}>{emptyText}</Text>}
    />
  );
}

export function GeneralCalendar({ navigation }) {
  const { events, hideFromGeneral, toggleHighlight } = useEvents();
  const visibleEvents = events.filter((item) => !item.isHidden);

  return (
    <Template title="General Calendar" navigation={navigation}>
      <EventList
        data={visibleEvents}
        emptyText="No events found."
        cardProps={{ onDelete: hideFromGeneral, onToggleHighlight: toggleHighlight }}
      />
    </Template>
  );
}

export function HighlightCalendar({ navigation }) {
  const { events, removeFromHighlight, toggleHighlight } = useEvents();
  const highlightedEvents = events.filter((item) => item.classification === 'highlighted' && !item.isHidden);

  return (
    <Template title="Highlight Calendar" navigation={navigation}>
      <EventList
        data={highlightedEvents}
        emptyText="No highlighted events found."
        cardProps={{ onDelete: removeFromHighlight, onToggleHighlight: toggleHighlight }}
      />
    </Template>
  );
}

export function HiddenCalendar({ navigation }) {
  const { events, unhideEvent, toggleHighlight } = useEvents();
  const hiddenEvents = events.filter((item) => item.isHidden);

  return (
    <Template title="Hidden Dates" navigation={navigation}>
      <EventList
        data={hiddenEvents}
        emptyText="No hidden dates found."
        cardProps={{ onUnhide: unhideEvent, onToggleHighlight: toggleHighlight }}
      />
    </Template>
  );
}

const styles = StyleSheet.create({
  listContent: { padding: 8 },
  columnWrapper: { justifyContent: 'flex-start' },
  emptyText: { fontSize: 16, color: '#666666', textAlign: 'center', marginTop: 40 },
});

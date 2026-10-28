import { useMemo } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useEvents } from './EventContext';

const getUserId = (userData) => userData?.id || userData?.uid;

// Works with a few possible field names, since the event shape comes from EmployerProfileController.buildEvent
const getOwnerId = (e) => e?.employerId || e?.postedBy || e?.userId || e?.ownerId;
const getTitle = (e) => e?.title || e?.eventTitle || e?.name || 'Untitled event';
const getDate = (e) => e?.date || e?.startDate || '';
const getDescription = (e) => e?.description || e?.details || '';

const formatDate = (value) => {
  if (!value) return '';
  // Firestore Timestamp support
  const raw = typeof value?.toDate === 'function' ? value.toDate() : value;
  const d = new Date(raw);
  return isNaN(d.getTime()) ? String(value) : d.toLocaleDateString();
};

export default function EmployerPostsView({ navigation, userData }) {
  const { events = [] } = useEvents();
  const myId = getUserId(userData);

  // Guard: if myId is missing, show nothing (prevents undefined === undefined matches)
  const myPosts = useMemo(
    () =>
      myId
        ? events.filter((e) => {
            const ownerId = getOwnerId(e);
            return ownerId != null && String(ownerId) === String(myId);
          })
        : [],
    [events, myId]
  );

  const renderItem = ({ item }) => {
    const date = formatDate(getDate(item));
    const description = getDescription(item);
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{getTitle(item)}</Text>
        {!!date && <Text style={styles.cardMeta}>{date}</Text>}
        {!!description && (
          <Text style={styles.cardBody} numberOfLines={3}>
            {description}
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerSide}
          onPress={() => navigation.openDrawer()}
          accessibilityRole="button"
          accessibilityLabel="Open menu"
        >
          <Text style={styles.menu}>Menu</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Posted events</Text>
        <View style={styles.headerSide} />
      </View>

      <TouchableOpacity
        style={styles.postButton}
        onPress={() => navigation.navigate('PostNewEvent')}
        accessibilityRole="button"
        accessibilityLabel="Post new event"
      >
        <Text style={styles.postButtonText}>+ Post new event</Text>
      </TouchableOpacity>

      <FlatList
        data={myPosts}
        keyExtractor={(item, index) => String(item?.id ?? index)}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingTop: 8 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Start your first post</Text>
            <Text style={styles.emptyBody}>Events you post will show up here.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F9FF' },
  header: {
    backgroundColor: '#011F5B',
    paddingTop: 40,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerSide: { width: 60 },
  menu: { color: '#fff', fontSize: 14 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '600' },
  postButton: {
    backgroundColor: '#011F5B',
    margin: 16,
    marginBottom: 8,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  postButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E1E8F5',
  },
  cardTitle: { fontSize: 17, fontWeight: '600', color: '#011F5B' },
  cardMeta: { fontSize: 13, color: '#5A6B8C', marginTop: 2 },
  cardBody: { fontSize: 14, color: '#2A3550', marginTop: 6 },
  empty: { alignItems: 'center', marginTop: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#011F5B' },
  emptyBody: { fontSize: 14, color: '#5A6B8C', marginTop: 4 },
});
import { getAuth } from 'firebase/auth';
import { useMemo } from 'react';
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import EventCard from './EventCard';
import { useEvents } from './EventContext';
import showAlert from './showAlert';

const getUserId = (userData) =>
  userData?.id || userData?.uid || getAuth().currentUser?.uid;

const confirmDelete = (onConfirm) => {
  if (Platform.OS === 'web') {
    if (window.confirm('Delete this event?')) onConfirm();
  } else {
    // Imported lazily so web builds don't depend on it
    const { Alert } = require('react-native');
    Alert.alert('Delete event', 'Delete this event?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: onConfirm },
    ]);
  }
};

export default function EmployerPostsView({ navigation, userData }) {
  const { events = [], loading, deleteEvent } = useEvents();
  const myId = getUserId(userData);

  // Only events this employer created (employerId is set when posting)
  const myPosts = useMemo(
    () =>
      myId
        ? events
            .filter((e) => e?.employerId && String(e.employerId) === String(myId))
            .sort((a, b) => {
              const ta = a.createdAt?.toMillis?.() ?? 0;
              const tb = b.createdAt?.toMillis?.() ?? 0;
              return tb - ta;
            })
        : [],
    [events, myId]
  );

  const handleDelete = (id) => {
    confirmDelete(async () => {
      const ok = await deleteEvent(id);
      if (!ok) showAlert('Delete Failed', 'Could not delete the event.');
    });
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
        numColumns={2}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <EventCard item={item} onDelete={handleDelete} />}
        contentContainerStyle={{ padding: 10, paddingTop: 4 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>
              {loading ? 'Loading...' : 'Start your first post'}
            </Text>
            {!loading && (
              <Text style={styles.emptyBody}>Events you post will show up here.</Text>
            )}
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
  empty: { alignItems: 'center', marginTop: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#011F5B' },
  emptyBody: { fontSize: 14, color: '#5A6B8C', marginTop: 4 },
});
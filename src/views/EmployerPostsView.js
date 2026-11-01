import { getAuth } from 'firebase/auth';
import { useMemo } from 'react';
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import EventCard from './EventCard';
import { useEvents } from './EventContext';
import showAlert from './showAlert';
import Template from './Header';

const getUserId = (userData) =>
  userData?.id || userData?.uid || getAuth().currentUser?.uid;

const confirmDelete = (onConfirm) => {
  if (Platform.OS === 'web') {
    if (window.confirm('Delete this event?')) onConfirm();
  } else {
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
    <Template title="Posted Events" navigation={navigation}>
      <TouchableOpacity
        style={styles.postButton}
        onPress={() => navigation.navigate('PostNewEvent')}
        accessibilityRole="button"
        accessibilityLabel="Post New Event"
      >
        <Text style={styles.postButtonText}>Post New Event</Text>
      </TouchableOpacity>

      <FlatList
        data={myPosts}
        numColumns={2}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <EventCard item={item} onDelete={handleDelete} />
        )}
        contentContainerStyle={{ padding: 10, paddingTop: 4 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>
              {loading ? 'Loading...' : 'Start your first post'}
            </Text>
            {!loading && (
              <Text style={styles.emptyBody}>
                Events you post will show up here.
              </Text>
            )}
          </View>
        }
      />
    </Template>
  );
}

const styles = StyleSheet.create({
  postButton: {
    backgroundColor: '#011F5B',
    margin: 16,
    marginBottom: 8,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  postButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  empty: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#011F5B',
  },
  emptyBody: {
    fontSize: 14,
    color: '#5A6B8C',
    marginTop: 4,
  },
});
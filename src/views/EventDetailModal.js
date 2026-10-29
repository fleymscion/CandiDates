import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import {
    Image,
    Modal,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { auth } from '../config/firebase';
import PostAnalyticsController from '../controllers/PostAnalyticsController';
import AppText from './AppText';

const NAVY = '#011F5B';

export default function EventDetailModal({ visible, event, onClose }) {
  // Count a view when someone other than the owner opens the popup.
  useEffect(() => {
    if (!visible || !event?.id || !event?.employerId) return;
    if (event.employerId === auth.currentUser?.uid) return;
    PostAnalyticsController.trackView(event.id, event.employerId).then((r) => {
      if (!r.success) console.warn('Could not track view:', r.error);
    });
  }, [visible, event?.id, event?.employerId]);

  if (!event) return null;

  const isSaved = event.classification === 'highlighted';
  const tags = Array.isArray(event.tags) ? event.tags : [];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable onPress={onClose} hitSlop={10} style={styles.backButton}>
            <Ionicons name="arrow-back-circle" size={30} color="#FFFFFF" />
          </Pressable>
          <AppText style={styles.headerTitle}>
            {isSaved ? 'Date Saved' : 'Event Details'}
          </AppText>
        </View>

        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.bodyContent}
          showsVerticalScrollIndicator={false}
        >
          {event.imageUrl ? (
            <Image
              source={{ uri: event.imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder} />
          )}

          {tags.length > 0 && (
            <View style={styles.tagRow}>
              {tags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <AppText style={styles.tagText}>#{tag}</AppText>
                </View>
              ))}
            </View>
          )}

          <View style={styles.section}>
            <AppText style={styles.eventTitle}>
              {event.eventTitle || 'Untitled event'}
            </AppText>
            {!!event.companyName && (
              <AppText style={styles.company}>{event.companyName}</AppText>
            )}
            {!!event.description && (
              <AppText style={styles.description}>{event.description}</AppText>
            )}

            <View style={styles.infoRow}>
              <View style={styles.infoLabelWrap}>
                <Ionicons name="mail-outline" size={16} color="#777777" />
                <AppText style={styles.infoLabel}>Email</AppText>
              </View>
              <AppText style={styles.infoValue}>
                {event.contactEmail || '-'}
              </AppText>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoLabelWrap}>
                <Ionicons name="call-outline" size={16} color="#777777" />
                <AppText style={styles.infoLabel}>Phone</AppText>
              </View>
              <AppText style={styles.infoValue}>
                {event.contactPhone || '-'}
              </AppText>
            </View>
          </View>

          <View style={styles.bigRows}>
            <View style={styles.bigRow}>
              <Ionicons name="location-outline" size={24} color="#777777" />
              <AppText style={styles.bigLabel}>Location</AppText>
              <AppText style={styles.bigValue}>{event.location || '-'}</AppText>
            </View>

            <View style={styles.bigRow}>
              <Ionicons name="calendar-outline" size={24} color="#777777" />
              <AppText style={styles.bigLabel}>Date</AppText>
              <AppText style={styles.bigValue}>{event.date || '-'}</AppText>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer} />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: NAVY },
  header: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backButton: { marginRight: 16 },
  headerTitle: { color: '#FFFFFF', fontSize: 28 },

  body: { flex: 1, backgroundColor: '#FFFFFF' },
  bodyContent: { paddingBottom: 30 },

  image: {
    height: 210,
    marginHorizontal: 40,
    marginTop: 40,
    marginBottom: 24,
    borderRadius: 24,
  },
  imagePlaceholder: {
    height: 210,
    marginHorizontal: 40,
    marginTop: 40,
    marginBottom: 24,
    borderRadius: 24,
    backgroundColor: '#D9D9D9',
  },

  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#EAEAEA',
  },
  tag: {
    backgroundColor: '#E6EEFF',
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 22,
    margin: 5,
  },
  tagText: { fontSize: 11, color: '#1F4E9C' },

  section: { paddingHorizontal: 14, paddingTop: 24 },
  eventTitle: { fontSize: 20, fontWeight: '600', color: NAVY, marginBottom: 4 },
  company: { fontSize: 13, fontWeight: '600', marginBottom: 6 },
  description: { fontSize: 13, color: '#666666', marginBottom: 12 },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoLabelWrap: { flexDirection: 'row', alignItems: 'center', width: '35%' },
  infoLabel: { fontSize: 13, color: '#666666', marginLeft: 6 },
  infoValue: { fontSize: 13, color: '#666666', width: '62%' },

  bigRows: { paddingHorizontal: 40, marginTop: 28 },
  bigRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  bigLabel: { fontSize: 18, color: '#777777', marginLeft: 8, width: 90 },
  bigValue: { fontSize: 18, color: '#000000', flex: 1, marginLeft: 12 },

  footer: { height: 56, backgroundColor: NAVY },
});
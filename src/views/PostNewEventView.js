import { doc, getDoc } from 'firebase/firestore';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { auth, db } from '../config/firebase';
import { useEvents } from './EventContext';
import showAlert from './showAlert';

export default function PostNewEventView({ navigation }) {
  const { addEvent } = useEvents();

  const [eventTitle, setEventTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [tagsText, setTagsText] = useState('');
  const [posting, setPosting] = useState(false);

  const canPost = eventTitle.trim() !== '' && date.trim() !== '';

  const handlePost = async () => {
    if (posting) return;

    if (!canPost) {
      showAlert('Missing Info', 'Please enter at least a title and a date.');
      return;
    }

    setPosting(true);

    // Copy the employer's company info onto the event so employees can see it
    // without needing read access to the employer's private profile.
    let profile = {};
    try {
      const snap = await getDoc(doc(db, 'users', auth.currentUser.uid));
      profile = snap.exists() ? snap.data() : {};
    } catch (error) {
      console.error('Could not load employer profile:', error);
    }

    const tags = tagsText
      .split(/[,\s]+/)
      .map((t) => t.replace(/^#/, '').trim())
      .filter(Boolean)
      .slice(0, 5);

    const ok = await addEvent({
      eventTitle: eventTitle.trim(),
      date: date.trim(),
      location: location.trim(),
      description: description.trim(),
      tags,
      companyName: profile.companyName || profile.username || '',
      contactEmail: profile.contactEmail || profile.email || '',
      contactPhone: contactPhone.trim() || profile.phone || '',
    });
    setPosting(false);

    if (ok) {
      setEventTitle('');
      setDate('');
      setLocation('');
      setDescription('');
      setContactPhone('');
      setTagsText('');
      showAlert('Posted', 'Your event has been posted.', () =>
        navigation.goBack()
      );
    } else {
      showAlert(
        'Post Failed',
        'Could not save the event. Check your connection and permissions.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable style={styles.headerSide} onPress={() => navigation.goBack()}>
          <Text style={styles.headerLink}>Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Post new event</Text>
        <View style={styles.headerSide} />
      </View>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
        >
          <Text style={styles.label}>Event title</Text>
          <TextInput
            style={styles.input}
            placeholder="eg. Walk-in Interviews"
            placeholderTextColor="#777777"
            value={eventTitle}
            onChangeText={setEventTitle}
          />

          <Text style={styles.label}>Date</Text>
          <TextInput
            style={styles.input}
            placeholder="eg. March 15, 2026"
            placeholderTextColor="#777777"
            value={date}
            onChangeText={setDate}
          />

          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="eg. Main Office - Room 302"
            placeholderTextColor="#777777"
            value={location}
            onChangeText={setLocation}
          />

          <Text style={styles.label}>Description (optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tell candidates what to expect..."
            placeholderTextColor="#777777"
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />

          <Text style={styles.label}>Contact phone (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="eg. +63 917 553 0251"
            placeholderTextColor="#777777"
            value={contactPhone}
            onChangeText={setContactPhone}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Tags (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="eg. engineering, CS/IT, onsite"
            placeholderTextColor="#777777"
            value={tagsText}
            onChangeText={setTagsText}
            autoCapitalize="none"
          />

          <Pressable
            style={[styles.postButton, canPost && styles.postButtonActive]}
            onPress={handlePost}
            disabled={posting}
          >
            <Text style={styles.postButtonText}>
              {posting ? 'Posting...' : 'Post event'}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#011F5B' },
  header: {
    height: 70,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerSide: { width: 60 },
  headerLink: { color: '#FFFFFF', fontSize: 14 },
  headerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '600' },
  content: {
    flex: 1,
    backgroundColor: '#F5F9FF',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  container: { paddingBottom: 30 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: {
    height: 40,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#B5B5B5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontFamily: 'Commissioner',
    fontSize: 14,
    marginBottom: 18,
  },
  textArea: { height: 110, paddingTop: 10 },
  postButton: {
    height: 46,
    backgroundColor: '#7F9DD5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  postButtonActive: { backgroundColor: '#2B5195' },
  postButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
});
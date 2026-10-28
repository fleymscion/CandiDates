import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Template from './Header';
import TextStyle from './AppText';

export default function PostNewEventView({ navigation, onSubmit }) {
  const [eventTitle, setEventTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');

  return (
    <Template title="Create New Event" navigation={navigation} showBack>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Add Photo Button Box */}
        <Pressable style={styles.photoBox}>
          <Ionicons name="add" size={32} color="#FFFFFF" />
          <TextStyle style={styles.photoText}>Add a photo</TextStyle>
        </Pressable>

        {/* Form Inputs */}
        <TextStyle style={styles.label}>Event Title</TextStyle>
        <TextInput
          style={styles.input}
          placeholder="Event Title"
          placeholderTextColor="#777777"
          value={eventTitle}
          onChangeText={setEventTitle}
        />

        <TextStyle style={styles.label}>Date/Time</TextStyle>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Date"
            placeholderTextColor="#777777"
            value={date}
            onChangeText={setDate}
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Time"
            placeholderTextColor="#777777"
            value={time}
            onChangeText={setTime}
          />
        </View>

        <TextStyle style={styles.label}>Event Description</TextStyle>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter a brief description about the event"
          placeholderTextColor="#777777"
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />

        {/* Submit Button */}
        <Pressable
          style={styles.submitButton}
          onPress={() => {
            onSubmit?.({ eventTitle, date, time, description });
            navigation?.goBack();
          }}
        >
          <TextStyle style={styles.submitButtonText}>Post New Event</TextStyle>
        </Pressable>
      </ScrollView>
    </Template>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1 },
  photoBox: {
    height: 120,
    backgroundColor: '#7F9DD5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  photoText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600', marginTop: 4 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#B5B5B5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    marginBottom: 16,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  halfInput: { width: '48%' },
  textArea: { height: 100, textAlignVertical: 'top' },
  submitButton: {
    backgroundColor: '#284B91',
    height: 46,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  submitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});
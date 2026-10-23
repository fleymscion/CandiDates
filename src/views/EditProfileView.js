import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Template from './Header';
import TextStyle from './AppText';

export default function EditProfileView({ navigation, userData, onSave }) {
  const [username, setUsername] = useState(userData?.name || userData?.username || '');
  const [email, setEmail] = useState(userData?.email || '');
  const [contactNumber, setContactNumber] = useState(userData?.contactNumber || '');
  const [location, setLocation] = useState(userData?.location || '');
  const [tags, setTags] = useState('');
  const [additionalContacts, setAdditionalContacts] = useState('');

  const handleSave = () => {
    const updatedData = {
      name: username,
      email,
      contactNumber,
      location,
      tags,
      additionalContacts,
    };
    onSave?.(updatedData);
    navigation?.goBack();
  };

  return (
    <Template title="Edit Profile" navigation={navigation}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Avatar with Edit Badge */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={80} color="#B5B5B5" />
          </View>
          <View style={styles.cameraBadge}>
            <Ionicons name="pencil" size={16} color="#FFFFFF" />
          </View>
        </View>

        {/* Input Fields */}
        <TextStyle style={styles.label}>Username</TextStyle>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#777777"
          value={username}
          onChangeText={setUsername}
        />

        <TextStyle style={styles.label}>Email</TextStyle>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#777777"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextStyle style={styles.label}>Phone Number</TextStyle>
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor="#777777"
          keyboardType="phone-pad"
          value={contactNumber}
          onChangeText={setContactNumber}
        />

        <TextStyle style={styles.label}>Location</TextStyle>
        <TextInput
          style={styles.input}
          placeholder="Location"
          placeholderTextColor="#777777"
          value={location}
          onChangeText={setLocation}
        />

        <TextStyle style={styles.label}>Personal / Professional Tags</TextStyle>
        <TextInput
          style={styles.input}
          placeholder="Tags"
          placeholderTextColor="#777777"
          value={tags}
          onChangeText={setTags}
        />

        <TextStyle style={styles.label}>Additional Contacts</TextStyle>
        <TextInput
          style={styles.input}
          placeholder="Additional Contacts"
          placeholderTextColor="#777777"
          value={additionalContacts}
          onChangeText={setAdditionalContacts}
        />

        {/* Save Changes Button */}
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <TextStyle style={styles.saveButtonText}>Save Changes / Update Profile</TextStyle>
        </Pressable>
      </ScrollView>
    </Template>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1 },
  avatarContainer: {
    alignSelf: 'center',
    marginVertical: 10,
    position: 'relative',
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#B5B5B5',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  cameraBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#011F5B',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 4, color: '#333333' },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#B5B5B5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    marginBottom: 14,
  },
  saveButton: {
    backgroundColor: '#284B91',
    height: 46,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  saveButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' },
});
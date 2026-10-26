import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Template from './Header';
import TextStyle from './AppText';

const toForm = (data) => ({
  username: data?.name || data?.username || '',
  email: data?.email || '',
  contactNumber: data?.contactNumber || '',
  location: data?.location || '',
  tags: data?.tags || '',
  additionalContacts: data?.additionalContacts || '',
});

const FIELDS = [
  { key: 'username', label: 'Username' },
  { key: 'email', label: 'Email', readOnly: true }, // email is tied to the login account, so it can't be changed here
  { key: 'contactNumber', label: 'Phone Number', keyboardType: 'phone-pad' },
  { key: 'location', label: 'Location' },
  { key: 'tags', label: 'Personal/Professional Tags' },
  { key: 'additionalContacts', label: 'Additional Contacts' },
];

// userRole: 'Employee' = plain grey avatar, 'Employer' = person silhouette (as in the designs)
export default function EditProfileView({ navigation, userData, userRole = 'Employee', onSave }) {
  const [form, setForm] = useState(toForm(userData));
  const [saving, setSaving] = useState(false);

  // Refill the form when fresh profile data arrives.
  useEffect(() => {
    setForm(toForm(userData));
  }, [userData]);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await onSave?.({
        name: form.username.trim(),
        contactNumber: form.contactNumber.trim(),
        location: form.location.trim(),
        tags: form.tags.trim(),
        additionalContacts: form.additionalContacts.trim(),
      });
      navigation?.goBack();
    } catch (e) {
      Alert.alert('Could not save', 'Your changes were not saved. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Template title="Edit Profile" navigation={navigation}>
      <View style={styles.body}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation?.goBack()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="arrow-back" size={14} color="#011F5B" />
          </TouchableOpacity>

          {/* Avatar with blue edit badge */}
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              {userRole === 'Employer' && <Ionicons name="person" size={70} color="#8A8A8A" style={styles.avatarIcon} />}
            </View>
            <View style={styles.editBadge}>
              <Ionicons name="pencil" size={13} color="#FFFFFF" />
            </View>
          </View>

          <TextStyle style={styles.title}>Edit Profile</TextStyle>

          {FIELDS.map((f) => (
            <View key={f.key}>
              <TextStyle style={styles.label}>{f.label}</TextStyle>
              <TextInput
                style={[styles.input, f.readOnly && styles.inputReadOnly]}
                value={form[f.key]}
                onChangeText={(v) => setField(f.key, v)}
                editable={!f.readOnly}
                keyboardType={f.keyboardType}
                autoCapitalize={f.key === 'email' ? 'none' : 'sentences'}
                placeholder={f.label}
                placeholderTextColor="#9A9A9A"
              />
            </View>
          ))}

          <Pressable style={[styles.saveBtn, saving && { opacity: 0.6 }]} onPress={handleSave} disabled={saving}>
            <TextStyle style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save Changes / Update Profile'}</TextStyle>
          </Pressable>
        </ScrollView>
      </View>
    </Template>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, backgroundColor: '#011F5B' },
  content: { paddingHorizontal: 28, paddingTop: 16, paddingBottom: 40 },
  backBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarWrap: { alignSelf: 'center', marginTop: 4, marginBottom: 6 },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarIcon: { marginTop: 16 },
  editBadge: {
    position: 'absolute',
    right: 2,
    bottom: 4,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#0047CC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold', marginBottom: 14 },
  label: { color: '#FFFFFF', fontSize: 12, marginBottom: 4 },
  input: {
    backgroundColor: '#F4F6FB',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: '#111111',
    marginBottom: 14,
  },
  inputReadOnly: { backgroundColor: '#C9CFDD', color: '#444444' },
  saveBtn: {
    alignSelf: 'center',
    backgroundColor: '#0047CC',
    borderRadius: 8,
    paddingHorizontal: 22,
    paddingVertical: 11,
    marginTop: 10,
  },
  saveBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: 'bold' },
});

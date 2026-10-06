import React, { useState } from 'react';
import { View, Text, Switch, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Template from './Header';

const NAVY = '#011F5B'; // same as the Header background

const COMPANY = {
  tags: ['Technology', 'Software', 'Hiring'],
  overview: 'Short description of what the company does.',
  address: 'Quezon City, Philippines',
  phone: '0912 345 6789',
  email: 'hello@company.com',
};

export default function InfoHighlightModule({ navigation }) {
  const [isHighlighted, setIsHighlighted] = useState(false);

  return (
    <Template title="Company Profile" navigation={navigation}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Logo placeholder */}
        <View style={styles.logo} />

        {/* Tags */}
        <View style={styles.tagRow}>
          {COMPANY.tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        {/* Company overview */}
        <Text style={styles.heading}>Company Overview</Text>
        <Text style={styles.body}>{COMPANY.overview}</Text>

        {/* Contact information */}
        <Text style={styles.heading}>Contact Information</Text>
        <View style={styles.contactRow}>
          <Ionicons name="location-outline" size={18} color={NAVY} />
          <Text style={styles.contactText}>{COMPANY.address}</Text>
        </View>
        <View style={styles.contactRow}>
          <Ionicons name="call-outline" size={18} color={NAVY} />
          <Text style={styles.contactText}>{COMPANY.phone}</Text>
        </View>
        <View style={styles.contactRow}>
          <Ionicons name="mail-outline" size={18} color={NAVY} />
          <Text style={styles.contactText}>{COMPANY.email}</Text>
        </View>

        {/* Highlight toggle */}
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Highlight this listing</Text>
          <Switch
            value={isHighlighted}
            onValueChange={setIsHighlighted}
            trackColor={{ false: '#ccc', true: NAVY }}
            thumbColor="white"
          />
        </View>
      </ScrollView>
    </Template>
  );
}

const styles = StyleSheet.create({
  logo: { height: 140, backgroundColor: '#d9d9d9', borderRadius: 8, marginBottom: 16 },
  tagRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  tag: { flex: 1, backgroundColor: '#E6EEFF', borderRadius: 16, paddingVertical: 8, marginHorizontal: 4, alignItems: 'center' },
  tagText: { fontSize: 12, color: NAVY },
  heading: { fontSize: 16, fontWeight: 'bold', color: NAVY, marginTop: 12, marginBottom: 6 },
  body: { fontSize: 13, color: '#444' },
  contactRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  contactText: { marginLeft: 8, fontSize: 13, color: '#444' },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, marginBottom: 24 },
  toggleLabel: { fontSize: 14, fontWeight: '600', color: NAVY },
});
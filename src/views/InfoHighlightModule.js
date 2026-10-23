import React, { useState, useCallback } from 'react';
import { View, Text, Switch, ScrollView, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Template from './Header';
import InfoHighlightController from '../controllers/InfoHighlightController';

const NAVY = '#011F5B';

export default function InfoHighlightModule({ navigation, route }) {
   const companyId = route?.params?.companyId ?? 'company1';

  const [company, setCompany] = useState(null);
  const [error, setError] = useState(null);


  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const result = await InfoHighlightController.getCompanyProfile(companyId);
        if (!active) return;
        if (result.success) {
          setCompany(result.data);
          setError(null);
        } else {
          setError(result.error);
        }
      })();
      return () => {
        active = false;
      };
    }, [companyId])
  );

  const handleToggle = async (value) => {
    setCompany((prev) => ({ ...prev, isHighlighted: value })); // update right away
    const result = await InfoHighlightController.toggleHighlight(companyId, value);
    if (!result.success) {
      setCompany((prev) => ({ ...prev, isHighlighted: !value })); // undo if it failed
      setError(result.error);
    }
  };

  if (error) {
    return (
      <Template title="Company Profile" navigation={navigation}>
        <Text style={styles.body}>{error}</Text>
      </Template>
    );
  }

  if (!company) {
    return (
      <Template title="Company Profile" navigation={navigation}>
        <Text style={styles.body}>Loading...</Text>
      </Template>
    );
  }

  return (
    <Template title="Company Profile" navigation={navigation}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Logo placeholder */}
        <View style={styles.logo} />

        {/* Tags */}
        <View style={styles.tagRow}>
          {(company.tags ?? []).map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        {/* Company overview */}
        <Text style={styles.heading}>Company Overview</Text>
        <Text style={styles.body}>{company.overview}</Text>

        {/* Contact information */}
        <Text style={styles.heading}>Contact Information</Text>
        <View style={styles.contactRow}>
          <Ionicons name="location-outline" size={18} color={NAVY} />
          <Text style={styles.contactText}>{company.address}</Text>
        </View>
        <View style={styles.contactRow}>
          <Ionicons name="call-outline" size={18} color={NAVY} />
          <Text style={styles.contactText}>{company.phone}</Text>
        </View>
        <View style={styles.contactRow}>
          <Ionicons name="mail-outline" size={18} color={NAVY} />
          <Text style={styles.contactText}>{company.email}</Text>
        </View>

        {/* Highlight toggle */}
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Highlight this listing</Text>
          <Switch
            value={!!company.isHighlighted}
            onValueChange={handleToggle}
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
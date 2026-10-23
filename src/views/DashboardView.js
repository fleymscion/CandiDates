import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Template from './Header';
import TextStyle from './AppText';

export default function DashboardView({ navigation }) {
  return (
    <Template title="Dashboard" navigation={navigation}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Metric Card: Highlights */}
        <View style={styles.metricCard}>
          <TextStyle style={styles.metricNumber}>5</TextStyle>
          <TextStyle style={styles.metricLabel}>HIGHLIGHTS</TextStyle>
          <Ionicons name="bookmark-outline" size={24} color="#011F5B" style={styles.metricIcon} />
        </View>

        {/* Metric Card: Views */}
        <View style={styles.metricCard}>
          <TextStyle style={styles.metricNumber}>10</TextStyle>
          <TextStyle style={styles.metricLabel}>VIEWS</TextStyle>
          <Ionicons name="eye-outline" size={24} color="#011F5B" style={styles.metricIcon} />
        </View>

        {/* Section Header */}
        <View style={styles.analyticsHeader}>
          <TextStyle style={styles.analyticsTitle}>Candidate Analytics</TextStyle>
        </View>

        {/* Sample Candidate Row items matching Figma */}
        {[1, 2, 3, 4, 5].map((item) => (
          <View key={item} style={styles.candidateRow}>
            <View style={styles.candidateAvatar} />
            <View style={styles.candidateInfo}>
              <TextStyle style={styles.candidateName}>Candidate Name</TextStyle>
              <TextStyle style={styles.candidateSub}>resume/portfolio</TextStyle>
            </View>
          </View>
        ))}
      </ScrollView>
    </Template>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1 },
  metricCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#B5B5B5',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginBottom: 14,
    position: 'relative',
  },
  metricNumber: { fontSize: 28, fontWeight: 'bold', color: '#011F5B' },
  metricLabel: { fontSize: 12, fontWeight: '600', color: '#555555', marginTop: 2 },
  metricIcon: { position: 'absolute', right: 16, top: 16 },
  analyticsHeader: {
    backgroundColor: '#011F5B',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 12,
  },
  analyticsTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
  candidateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 8,
  },
  candidateAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#C4C4C4' },
  candidateInfo: { marginLeft: 12 },
  candidateName: { fontSize: 14, fontWeight: 'bold' },
  candidateSub: { fontSize: 11, color: '#777777' },
});
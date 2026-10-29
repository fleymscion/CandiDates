import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import PostAnalyticsController from '../controllers/PostAnalyticsController';
import TextStyle from './AppText';
import Template from './Header';

export default function DashboardView({ navigation, route }) {
  // Set by the Stats button on a post
  const postId = route?.params?.postId;

  const [stats, setStats] = useState({ views: 0, saves: 0 });
  const [tab, setTab] = useState('saves');
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState(null);

  useFocusEffect(
    useCallback(() => {
      if (!postId) return undefined;
      let active = true;
      (async () => {
        const s = await PostAnalyticsController.getPostStats(postId);
        const c = await PostAnalyticsController.getCandidates(postId, tab);
        if (!active) return;
        setError(null);
        if (s.success) setStats(s.data); else setError(s.error);
        if (c.success) setCandidates(c.data); else setError(c.error);
      })();
      return () => { active = false; };
    }, [postId, tab])
  );

  if (!postId) {
    return (
      <Template title="Dashboard" navigation={navigation}>
        <TextStyle style={styles.candidateSub}>
          Open one of your posts and tap Stats to see its analytics.
        </TextStyle>
      </Template>
    );
  }

  return (
    <Template title="Dashboard" navigation={navigation}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {error ? <TextStyle style={styles.candidateSub}>{error}</TextStyle> : null}

        <View style={styles.metricCard}>
          <TextStyle style={styles.metricNumber}>{stats.saves}</TextStyle>
          <TextStyle style={styles.metricLabel}>SAVES</TextStyle>
          <Ionicons name="bookmark-outline" size={24} color="#011F5B" style={styles.metricIcon} />
        </View>

        <View style={styles.metricCard}>
          <TextStyle style={styles.metricNumber}>{stats.views}</TextStyle>
          <TextStyle style={styles.metricLabel}>VIEWS</TextStyle>
          <Ionicons name="eye-outline" size={24} color="#011F5B" style={styles.metricIcon} />
        </View>

        <View style={styles.analyticsHeader}>
          <TextStyle style={styles.analyticsTitle}>Candidate Analytics</TextStyle>
        </View>

        <View style={styles.tabRow}>
          {['saves', 'views'].map((t) => (
            <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
              <TextStyle style={[styles.tabText, tab === t && styles.tabTextActive]}>
                {t === 'saves' ? 'Saves' : 'Views'}
              </TextStyle>
            </TouchableOpacity>
          ))}
        </View>

        {candidates.length === 0 ? (
          <TextStyle style={styles.candidateSub}>No candidates yet.</TextStyle>
        ) : (
          candidates.map((c) => (
            <View key={c.id} style={styles.candidateRow}>
              <View style={styles.candidateAvatar} />
              <View style={styles.candidateInfo}>
                <TextStyle style={styles.candidateName}>{c.name}</TextStyle>
                <TextStyle style={styles.candidateSub}>resume/portfolio</TextStyle>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </Template>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1 },
  metricCard: {
    backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: '#B5B5B5',
    borderRadius: 10, padding: 16, alignItems: 'center', marginBottom: 14, position: 'relative',
  },
  metricNumber: { fontSize: 28, fontWeight: 'bold', color: '#011F5B' },
  metricLabel: { fontSize: 12, fontWeight: '600', color: '#555555', marginTop: 2 },
  metricIcon: { position: 'absolute', right: 16, top: 16 },
  analyticsHeader: {
    backgroundColor: '#011F5B', paddingVertical: 8, paddingHorizontal: 12,
    borderRadius: 8, marginTop: 10, marginBottom: 12,
  },
  analyticsTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
  tabRow: { flexDirection: 'row', marginBottom: 12 },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: '#E0E0E0' },
  tabActive: { borderBottomColor: '#011F5B' },
  tabText: { fontSize: 13, color: '#777777' },
  tabTextActive: { color: '#011F5B', fontWeight: 'bold' },
  candidateRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 10,
    borderRadius: 8, borderWidth: 1, borderColor: '#E0E0E0', marginBottom: 8,
  },
  candidateAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#C4C4C4' },
  candidateInfo: { marginLeft: 12 },
  candidateName: { fontSize: 14, fontWeight: 'bold', color: '#011F5B' },
  candidateSub: { fontSize: 12, color: '#777777' },
});
import React from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Template from './Header';
import TextStyle from './AppText';

export default function ResumesAndPortfoliosView({ navigation }) {
  return (
    <Template title="Resumes & Portfolios" navigation={navigation}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar} />
          <View style={styles.profileInfo}>
            <TextStyle style={styles.name}>Employee Name</TextStyle>
            <TextStyle style={styles.subText}>Resume/Portfolio</TextStyle>
          </View>
        </View>

        {/* Sample uploaded resume/portfolio file items */}
        {[1, 2, 3, 4].map((item) => (
          <View key={item} style={styles.fileCard}>
            <Ionicons name="document-text-outline" size={24} color="#011F5B" />
            <View style={styles.fileInfo}>
              <TextStyle style={styles.fileName}>Resume_Document_{item}.pdf</TextStyle>
              <TextStyle style={styles.fileDate}>Uploaded on March {item}, 2026</TextStyle>
            </View>
          </View>
        ))}

        {/* Add Resume / Portfolio Button */}
        <TouchableOpacity style={styles.addButton} onPress={() => console.log('Add Resume pressed')}>
          <Ionicons name="add" size={20} color="#FFFFFF" style={{ marginRight: 6 }} />
          <TextStyle style={styles.addText}>Add Resume/Portfolio</TextStyle>
        </TouchableOpacity>
      </ScrollView>
    </Template>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1 },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#C4C4C4' },
  profileInfo: { marginLeft: 14 },
  name: { fontSize: 16, fontWeight: 'bold' },
  subText: { fontSize: 12, color: '#777777' },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#B5B5B5',
    marginBottom: 10,
  },
  fileInfo: { marginLeft: 12, flex: 1 },
  fileName: { fontSize: 14, fontWeight: '600', color: '#011F5B' },
  fileDate: { fontSize: 11, color: '#777777', marginTop: 2 },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#284B91',
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  addText: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' },
});
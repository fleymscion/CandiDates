import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import Template from './Header';
import TextStyle from './AppText';
import { EmployeeProfileController } from '../controllers/EmployeeProfileController';

const SECTIONS = [
  { kind: 'resume', title: 'Resumes', uploadLabel: 'Upload Resume', empty: 'No resumes uploaded yet.' },
  { kind: 'portfolio', title: 'Portfolio Files', uploadLabel: 'Upload Portfolio', empty: 'No portfolio files uploaded yet.' },
];

const formatSize = (bytes) => {
  if (!bytes) return '';
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function ResumesPortfoliosView({ navigation, userData }) {
  const userId = userData?.id || userData?.uid;

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingKind, setUploadingKind] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        try {
          const list = await EmployeeProfileController.fetchFiles(userId);
          if (active) setFiles(list);
        } catch (e) {
          console.error(e);
        } finally {
          if (active) setLoading(false);
        }
      })();
      return () => {
        active = false;
      };
    }, [userId])
  );

  const upload = async (kind) => {
    if (uploadingKind) return;
    setUploadingKind(kind);
    const result = await EmployeeProfileController.pickAndUploadFile(userId, kind);
    setUploadingKind(null);
    if (result.success) setFiles((prev) => [...prev, result.file]);
    else if (!result.canceled) Alert.alert('Upload failed', result.error);
  };

  const open = (file) =>
    Linking.openURL(file.url).catch(() => Alert.alert('Cannot open file', 'No app could open this file.'));

  const confirmRemove = (file) =>
    Alert.alert('Remove file', `Remove "${file.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          const result = await EmployeeProfileController.removeFile(userId, file);
          if (result.success) setFiles((prev) => prev.filter((f) => f.id !== file.id));
          else Alert.alert('Could not remove', result.error);
        },
      },
    ]);

  return (
    <Template title="Resume & Portfolio" navigation={navigation}>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#011F5B" />
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {SECTIONS.map((section) => {
            const sectionFiles = files.filter((f) => f.kind === section.kind);
            const busy = uploadingKind === section.kind;
            return (
              <View key={section.kind} style={styles.section}>
                <View style={styles.sectionHeader}>
                  <TextStyle style={styles.sectionTitle}>{section.title}</TextStyle>
                </View>

                {sectionFiles.length === 0 && <TextStyle style={styles.emptyText}>{section.empty}</TextStyle>}

                {sectionFiles.map((file) => (
                  <View key={file.id} style={styles.fileRow}>
                    <TouchableOpacity style={styles.fileMain} onPress={() => open(file)}>
                      <Ionicons name="document-text-outline" size={22} color="#011F5B" />
                      <View style={styles.fileText}>
                        <TextStyle style={styles.fileName} numberOfLines={1}>
                          {file.name}
                        </TextStyle>
                        <TextStyle style={styles.fileMeta}>{formatSize(file.size)}</TextStyle>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => confirmRemove(file)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                      <Ionicons name="trash-outline" size={20} color="#B00020" />
                    </TouchableOpacity>
                  </View>
                ))}

                <Pressable
                  style={[styles.uploadBtn, (busy || uploadingKind) && { opacity: 0.6 }]}
                  onPress={() => upload(section.kind)}
                  disabled={!!uploadingKind}
                >
                  {busy ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <Ionicons name="cloud-upload-outline" size={18} color="#FFFFFF" />
                      <TextStyle style={styles.uploadBtnText}>{section.uploadLabel}</TextStyle>
                    </>
                  )}
                </Pressable>
              </View>
            );
          })}
          <TextStyle style={styles.note}>Accepted: PDF, DOC, DOCX (resumes); PDF and images (portfolio). Max 5 MB.</TextStyle>
        </ScrollView>
      )}
    </Template>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, padding: 16 },
  section: { marginBottom: 22 },
  sectionHeader: { backgroundColor: '#011F5B', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, marginBottom: 10 },
  sectionTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
  emptyText: { fontSize: 13, color: '#777777', marginBottom: 10 },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 8,
  },
  fileMain: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  fileText: { marginLeft: 10, flex: 1 },
  fileName: { fontSize: 14, fontWeight: 'bold' },
  fileMeta: { fontSize: 11, color: '#777777' },
  uploadBtn: {
    flexDirection: 'row',
    backgroundColor: '#284B91',
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  uploadBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold', marginLeft: 8 },
  note: { fontSize: 11, color: '#777777', textAlign: 'center', marginBottom: 30 },
});

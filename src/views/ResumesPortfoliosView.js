import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
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

const isImage = (file) => (file.mimeType || '').startsWith('image/');

const formatSize = (bytes) => {
  if (!bytes) return '';
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function ResumesPortfoliosView({ navigation, userData }) {
  const userId = userData?.id || userData?.uid;

  const [profile, setProfile] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingKind, setUploadingKind] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        try {
          const [list, prof] = await Promise.all([
            EmployeeProfileController.fetchFiles(userId),
            EmployeeProfileController.fetchProfile(userId),
          ]);
          if (!active) return;
          setFiles(list);
          setProfile(prof);
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

  // One "+ Add Resume/Portfolio" button (as in the design); ask which one it is.
  const chooseKind = () => {
    if (uploadingKind) return;
    Alert.alert('Add file', 'What are you adding?', [
      { text: 'Resume', onPress: () => upload('resume') },
      { text: 'Portfolio', onPress: () => upload('portfolio') },
      { text: 'Cancel', style: 'cancel' },
    ]);
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
    <Template title="Resumes & Portfolios" navigation={navigation} showBack>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#011F5B" />
        </View>
      ) : (
        <>
          <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Owner row */}
            <View style={styles.ownerRow}>
              <View style={styles.ownerAvatar} />
              <View style={styles.ownerText}>
                <TextStyle style={styles.ownerName}>{profile?.name || userData?.name || 'Employee Name'}</TextStyle>
                <TextStyle style={styles.ownerSub}>Resume/Portfolio</TextStyle>
              </View>
            </View>
            <View style={styles.rule} />

            {files.length === 0 && (
              <View style={[styles.preview, styles.emptyPreview]}>
                <Ionicons name="document-outline" size={40} color="#8A8A8A" />
                <TextStyle style={styles.emptyText}>No resumes or portfolios yet.</TextStyle>
              </View>
            )}

            {files.map((file) => (
              <View key={file.id} style={styles.card}>
                <TouchableOpacity activeOpacity={0.85} onPress={() => open(file)} style={styles.preview}>
                  {isImage(file) ? (
                    <Image source={{ uri: file.url }} style={styles.previewImage} resizeMode="cover" />
                  ) : (
                    <View style={styles.docPlaceholder}>
                      <Ionicons name="document-text-outline" size={52} color="#6B6B6B" />
                      <TextStyle style={styles.docName} numberOfLines={2}>
                        {file.name}
                      </TextStyle>
                      <TextStyle style={styles.docHint}>Tap to open</TextStyle>
                    </View>
                  )}
                </TouchableOpacity>

                <View style={styles.cardFooter}>
                  <View style={styles.badge}>
                    <TextStyle style={styles.badgeText}>{file.kind === 'portfolio' ? 'Portfolio' : 'Resume'}</TextStyle>
                  </View>
                  <TextStyle style={styles.cardName} numberOfLines={1}>
                    {file.name}
                    {file.size ? `  ·  ${formatSize(file.size)}` : ''}
                  </TextStyle>
                  <TouchableOpacity onPress={() => confirmRemove(file)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Ionicons name="trash-outline" size={20} color="#B00020" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Pinned bottom button */}
          <View style={styles.bottomBar}>
            <Pressable style={[styles.addBtn, uploadingKind && { opacity: 0.6 }]} onPress={chooseKind} disabled={!!uploadingKind}>
              {uploadingKind ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="add" size={18} color="#FFFFFF" />
                  <TextStyle style={styles.addBtnText}>Add Resume/Portfolio</TextStyle>
                </>
              )}
            </Pressable>
          </View>
        </>
      )}
    </Template>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 24 },
  ownerRow: { flexDirection: 'row', alignItems: 'center' },
  ownerAvatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#D9D9D9' },
  ownerText: { marginLeft: 14 },
  ownerName: { fontSize: 15, fontWeight: 'bold', color: '#000000' },
  ownerSub: { fontSize: 12, color: '#777777', marginTop: 2 },
  rule: { height: 1, backgroundColor: '#C9C9C9', marginVertical: 14 },
  card: { marginBottom: 18 },
  preview: { width: '100%', aspectRatio: 0.8, backgroundColor: '#D9D9D9', borderRadius: 4, overflow: 'hidden' },
  previewImage: { width: '100%', height: '100%' },
  docPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  docName: { fontSize: 13, fontWeight: 'bold', color: '#333333', marginTop: 10, textAlign: 'center' },
  docHint: { fontSize: 11, color: '#777777', marginTop: 4 },
  emptyPreview: { justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 13, color: '#666666', marginTop: 8 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  badge: { backgroundColor: '#011F5B', borderRadius: 4, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' },
  cardName: { flex: 1, fontSize: 12, color: '#333333', marginHorizontal: 10 },
  bottomBar: { alignItems: 'center', paddingVertical: 14, backgroundColor: '#FFFFFF' },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0047CC',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    minWidth: 180,
    justifyContent: 'center',
  },
  addBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: 'bold', marginLeft: 6 },
});

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes, deleteObject } from 'firebase/storage';
import * as DocumentPicker from 'expo-document-picker';
import { auth, db, storage } from '../config/firebase';
import { Employee } from '../models/UserModel';
import { UserFile } from '../models/UserPreferencesModel';
import { PreferencesController, resolveUid } from './PreferencesController';

const MAX_FILE_BYTES = 5 * 1024 * 1024; // same 5MB limit as onboarding

const ACCEPTED_TYPES = {
  resume: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  portfolio: ['application/pdf', 'image/*'],
};

export const EmployeeProfileController = {
  // ---------- Profile ----------
  fetchProfile: async (userId) => {
    try {
      const uid = userId || auth.currentUser?.uid;
      if (!uid) return new Employee();

      const docSnap = await getDoc(doc(db, 'users', uid));
      if (docSnap.exists()) {
        const data = docSnap.data();
        return new Employee(
          uid,
          data.username || data.name || 'Candidate Name',
          data.email || '',
          data.contactNumber || '',
          data.profileImageUrl || '',
          'Employee',
          data.location || '',
          data.resumeimageUrl || '',
          data.workExp || [],
          data.education || [],
          data.skills || []
        );
      }
      return new Employee();
    } catch (error) {
      console.error('Error fetching employee profile:', error);
      throw error;
    }
  },

  updateProfile: async (userId, data = {}) => {
    const uid = resolveUid(userId);
    if (!uid) throw new Error('You need to be signed in to edit your profile.');
    const { name, contactNumber, location, tags, additionalContacts } = data;
    await setDoc(
      doc(db, 'users', uid),
      { name, contactNumber, location, tags, additionalContacts },
      { merge: true }
    );
  },

  // ---------- Menu navigation ----------
  // Route names must match the <Drawer.Screen name="..."> entries in DrawerNavigator.js
  handleHighlightedEvents: (navigation) => navigation?.navigate('Highlight Calendar'),
  handleResumesAndPortfolios: (navigation) => navigation?.navigate('ResumesAndPortfolios'),
  handleJobCategories: (navigation) => navigation?.navigate('JobCategories'),
  handleCalendarViewMode: (navigation) => navigation?.navigate('CalendarViewMode'),

  // ---------- Notification preferences (modal on the profile screen) ----------
  loadNotificationPrefs: (userId) => PreferencesController.loadNotificationPrefs(userId),
  saveNotificationPrefs: (userId, prefs) => PreferencesController.saveNotificationPrefs(userId, prefs),

  // ---------- Job categories / interests ----------
  fetchJobCategories: async (userId) => {
    const prefs = await PreferencesController.load(userId);
    return prefs.jobCategories;
  },

  saveJobCategories: (userId, jobCategories) =>
    PreferencesController.save(userId, { jobCategories }),

  // ---------- Resume & portfolio files ----------
  fetchFiles: async (userId) => {
    const uid = resolveUid(userId);
    if (!uid) return [];
    const snap = await getDoc(doc(db, 'users', uid));
    const files = snap.exists() ? snap.data().files : [];
    return Array.isArray(files) ? files.map((f) => new UserFile(f)) : [];
  },

  // Returns { success, file } | { success: false, canceled } | { success: false, error }
  pickAndUploadFile: async (userId, kind = 'resume') => {
    const uid = resolveUid(userId);
    if (!uid) return { success: false, error: 'You need to be signed in to upload files.' };

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ACCEPTED_TYPES[kind] || ACCEPTED_TYPES.resume,
        copyToCacheDirectory: true,
        multiple: false,
      });
      if (result.canceled) return { success: false, canceled: true };

      const asset = result.assets?.[0];
      if (!asset) return { success: false, canceled: true };

      if (asset.size && asset.size > MAX_FILE_BYTES) {
        return { success: false, error: 'Please choose a file that is 5MB or smaller.' };
      }

      const blob = await (await fetch(asset.uri)).blob();
      const safeName = (asset.name || 'file').replace(/[^\w.\-]+/g, '_');
      const storagePath = `users/${uid}/${kind}/${Date.now()}_${safeName}`;
      const fileRef = ref(storage, storagePath);
      await uploadBytes(fileRef, blob, asset.mimeType ? { contentType: asset.mimeType } : undefined);
      const url = await getDownloadURL(fileRef);

      const file = new UserFile({
        id: String(Date.now()),
        name: asset.name || safeName,
        kind,
        url,
        storagePath,
        size: asset.size ?? blob.size ?? 0,
        mimeType: asset.mimeType || '',
        uploadedAt: new Date().toISOString(),
      });

      const existing = await EmployeeProfileController.fetchFiles(uid);
      const update = { files: [...existing, file].map((f) => f.toFirebase()) };
      if (kind === 'resume') update.resumeimageUrl = url; // keeps Employee.resumeimageUrl in sync
      await setDoc(doc(db, 'users', uid), update, { merge: true });

      return { success: true, file };
    } catch (error) {
      console.error('File upload error:', error);
      return { success: false, error: 'Upload failed. Check your connection and try again.' };
    }
  },

  removeFile: async (userId, file) => {
    const uid = resolveUid(userId);
    if (!uid) return { success: false, error: 'You need to be signed in.' };
    try {
      if (file.storagePath) {
        try {
          await deleteObject(ref(storage, file.storagePath));
        } catch (e) {
          console.warn('Could not delete stored file (continuing):', e?.message);
        }
      }
      const existing = await EmployeeProfileController.fetchFiles(uid);
      const remaining = existing.filter((f) => f.id !== file.id);
      const update = { files: remaining.map((f) => f.toFirebase()) };

      if (file.kind === 'resume') {
        const latestResume = [...remaining].reverse().find((f) => f.kind === 'resume');
        update.resumeimageUrl = latestResume ? latestResume.url : '';
      }
      await setDoc(doc(db, 'users', uid), update, { merge: true });
      return { success: true };
    } catch (error) {
      console.error('Remove file error:', error);
      return { success: false, error: 'Could not remove that file. Please try again.' };
    }
  },

  // ---------- Logout ----------
  // The app switches screens with state in App.js (not a navigator route),
  // so this only signs out; the view then calls onNavigate('Login').
  handleLogout: async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: 'We could not log you out. Please try again.' };
    }
  },
};

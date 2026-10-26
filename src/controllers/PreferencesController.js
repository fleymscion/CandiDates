import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { UserPreferences } from '../models/UserPreferencesModel';

const cacheKey = (uid) => `prefs:${uid}`;

export const resolveUid = (userId) => userId || auth.currentUser?.uid || null;

async function readCache(uid) {
  try {
    const raw = await AsyncStorage.getItem(cacheKey(uid));
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

async function writeCache(uid, data) {
  try {
    await AsyncStorage.setItem(cacheKey(uid), JSON.stringify(data));
  } catch (e) {
    // cache is best-effort only
  }
}

// Shared by Employee and Employer controllers.
// Preferences live on the user's own document: users/{uid}
export const PreferencesController = {
  async load(userId) {
    const uid = resolveUid(userId);
    if (!uid) return new UserPreferences();
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      const prefs = new UserPreferences(snap.exists() ? snap.data() : {});
      await writeCache(uid, prefs.toFirebase());
      return prefs;
    } catch (error) {
      console.warn('Using cached preferences:', error?.message);
      return new UserPreferences(await readCache(uid));
    }
  },

  async save(userId, partial) {
    const uid = resolveUid(userId);
    if (!uid) throw new Error('You need to be signed in to save preferences.');
    const cached = await readCache(uid);
    await writeCache(uid, { ...cached, ...partial });
    await setDoc(doc(db, 'users', uid), partial, { merge: true });
  },

  // Fields shown on the Edit Profile screen, read straight from users/{uid}
  async loadEditableProfile(userId) {
    const uid = resolveUid(userId);
    if (!uid) return {};
    const snap = await getDoc(doc(db, 'users', uid));
    const data = snap.exists() ? snap.data() : {};
    return {
      name: data.username || data.name || '',
      email: data.email || '',
      contactNumber: data.contactNumber || '',
      location: data.location || '',
      tags: data.tags || '',
      additionalContacts: data.additionalContacts || '',
    };
  },

  async loadNotificationPrefs(userId) {
    const prefs = await PreferencesController.load(userId);
    return prefs.notificationPrefs;
  },

  saveNotificationPrefs(userId, notificationPrefs) {
    return PreferencesController.save(userId, { notificationPrefs });
  },

  async loadCalendarViewMode(userId) {
    const prefs = await PreferencesController.load(userId);
    return prefs.calendarViewMode;
  },

  saveCalendarViewMode(userId, calendarViewMode) {
    return PreferencesController.save(userId, { calendarViewMode });
  },
};

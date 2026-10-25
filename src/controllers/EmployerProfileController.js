import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { Employer } from '../models/UserModel';
import { DateModel } from '../models/DateModel';
import { PreferencesController, resolveUid } from './PreferencesController';

export const EmployerProfileController = {
  // ---------- Profile ----------
  fetchProfile: async (userId) => {
    try {
      const uid = userId || auth.currentUser?.uid;
      if (!uid) return new Employer();

      const docSnap = await getDoc(doc(db, 'users', uid));
      if (docSnap.exists()) {
        const data = docSnap.data();
        return new Employer(
          uid,
          data.username || data.name || 'Employer Name',
          data.email || '',
          data.contactNumber || '',
          data.profileImageUrl || '',
          'Employer',
          data.location || '',
          data.isVerified || false,
          data.companyPermitOrRegUrl || ''
        );
      }
      return new Employer();
    } catch (error) {
      console.error('Error fetching employer profile:', error);
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
  handlePostEvent: (navigation) => navigation?.navigate('PostNewEvent'),
  handleDashboard: (navigation) => navigation?.navigate('Dashboard'),
  handleCalendarViewMode: (navigation) => navigation?.navigate('CalendarViewMode'),

  // ---------- Notification preferences (modal on the profile screen) ----------
  loadNotificationPrefs: (userId) => PreferencesController.loadNotificationPrefs(userId),
  saveNotificationPrefs: (userId, prefs) => PreferencesController.saveNotificationPrefs(userId, prefs),

  // ---------- Post a new event ----------
  // buildEvent is synchronous so the UI can show the event immediately;
  // postEvent then saves it to Firestore in the background.
  buildEvent: (userId, { eventTitle = '', date = '', time = '', description = '' } = {}) => {
    const id = doc(collection(db, 'events')).id; // generates an id locally, no network call
    const event = new DateModel(
      id,
      '',
      eventTitle.trim() || 'Untitled Event',
      date.trim(),
      time.trim(),
      [],
      description.trim(),
      'normal'
    );
    return {
      ...event.toFirebase(),
      employerId: resolveUid(userId) || '',
      createdAt: new Date().toISOString(),
    };
  },

  postEvent: async (event) => {
    await setDoc(doc(db, 'events', event.id), event);
  },

  // ---------- Offline calendar cache ----------
  // Clears any cached calendar data kept under keys starting with "calendarCache:".
  handleClearCalendarCache: async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter((k) => k.startsWith('calendarCache:'));
      if (cacheKeys.length > 0) await AsyncStorage.multiRemove(cacheKeys);
      return { success: true, cleared: cacheKeys.length };
    } catch (error) {
      console.error('Clear cache error:', error);
      return { success: false, error: 'Could not clear the offline calendar cache.' };
    }
  },

  // ---------- Logout ----------
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

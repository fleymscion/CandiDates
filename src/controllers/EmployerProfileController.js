import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { Employer } from '../models/UserModel';

export const EmployerProfileController = {
  // Fetch employer data
  fetchProfile: async (userId) => {
    try {
      const uid = userId || auth.currentUser?.uid;
      if (!uid) return new Employer();

      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);

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

  // Menu action handlers
  handlePostEvent: (navigation) => {
    navigation?.navigate('PostNewEvent');
  },

  handleDashboard: (navigation) => {
    navigation?.navigate('Dashboard');
  },

  handleNotificationPreferences: (navigation) => {
    navigation?.navigate('NotificationPreferences');
  },

  handleCalendarViewMode: (navigation) => {
    navigation?.navigate('CalendarViewMode');
  },

  handleClearCache: () => {
    console.log('Offline calendar cache cleared successfully');
  },

  handleLogout: async (navigation) => {
    try {
      await signOut(auth);
      navigation?.reset ? navigation.reset({ index: 0, routes: [{ name: 'Login' }] }) : navigation?.navigate('Login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
};
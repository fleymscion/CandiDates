import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { Employee } from '../models/UserModel';

export const EmployeeProfileController = {
  // Fetch employee details from Firestore
  fetchProfile: async (userId) => {
    try {
      const uid = userId || auth.currentUser?.uid;
      if (!uid) return new Employee();

      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return new Employee(
          uid,
          data.username || data.name || 'Employee Name',
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

  // Update profile details in Firestore
  updateProfile: async (userId, updateFields) => {
    try {
      const uid = userId || auth.currentUser?.uid;
      if (!uid) throw new Error('No user authenticated');

      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, updateFields);
    } catch (error) {
      console.error('Error updating employee profile:', error);
      throw error;
    }
  },

  // Navigation handlers
  handleHighlightedEvents: (navigation) => {
    navigation?.navigate('HighlightedEvents');
  },

  handleResumesAndPortfolios: (navigation) => {
    navigation?.navigate('ResumesAndPortfolios');
  },

  handleJobCategories: (navigation) => {
    navigation?.navigate('JobCategories');
  },

  handleNotificationPreferences: (navigation) => {
    navigation?.navigate('NotificationPreferences');
  },

  handleCalendarViewMode: (navigation) => {
    navigation?.navigate('CalendarViewMode');
  },

  // Firebase Sign-out
  handleLogout: async (navigation) => {
    try {
      await signOut(auth);
      if (navigation?.reset) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      } else {
        navigation?.navigate('Login');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  },
};

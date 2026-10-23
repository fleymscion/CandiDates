import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { Employee } from '../models/UserModel';

export const EmployeeProfileController = {
  // Fetch employee profile data from Firestore[span_0](start_span)[span_0](end_span)
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

  // Save profile updates (Edit Profile)[span_1](start_span)[span_1](end_span)
  updateProfile: async (userId, updatedFields) => {
    try {
      const uid = userId || auth.currentUser?.uid;
      if (!uid) throw new Error('No user authenticated');

      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, updatedFields);
      console.log('Employee profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  // Navigation handlers
  handleHighlightedEvents: (navigation) => {
    navigation?.navigate('Highlight Calendar');
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

  handleLogout: async (navigation) => {
    try {
      await signOut(auth);
      navigation?.reset ? navigation.reset({ index: 0, routes: [{ name: 'Login' }] }) : navigation?.navigate('Login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
};
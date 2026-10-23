import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { Employee } from '../models/UserModel';

export const EmployeeProfileController = {
  // Fetch employee data
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

  // Menu action handlers
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
// src/controllers/InfoHighlightController.js
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

class InfoHighlightController {
  async getCompanyProfile(id) {
    if (!id) return { success: false, error: 'Company ID is required' };
    try {
      const snap = await getDoc(doc(db, 'companies', id));
      if (!snap.exists()) return { success: false, error: 'Company not found' };
      return { success: true, data: { id: snap.id, ...snap.data() } };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async toggleHighlight(id, value) {
    if (!id) return { success: false, error: 'Company ID is required' };
    if (typeof value !== 'boolean') return { success: false, error: 'Highlight value must be true or false' };
    try {
      await updateDoc(doc(db, 'companies', id), { isHighlighted: value });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new InfoHighlightController();
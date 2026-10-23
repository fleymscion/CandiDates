import { doc, getDoc, updateDoc, increment, collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

class InfoHighlightController {

  async toggleHighlight(id, value) {
    if (!id) return { success: false, error: 'Company ID is required' };
    if (typeof value !== 'boolean') return { success: false, error: 'Highlight value must be true or false' };
    try {
      await updateDoc(doc(db, 'companies', id), {
        isHighlighted: value,
        highlightCount: increment(value ? 1 : -1),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async trackView(id) {
    if (!id) return { success: false, error: 'Company ID is required' };
    try {
      await updateDoc(doc(db, 'companies', id), { viewCount: increment(1) });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getDashboardStats() {
    try {
      const snap = await getDocs(collection(db, 'companies'));
      let highlights = 0;
      let views = 0;
      snap.forEach((d) => {
        const data = d.data();
        highlights += data.highlightCount || 0;
        views += data.viewCount || 0;
      });
      return { success: true, data: { highlights, views } };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new InfoHighlightController();
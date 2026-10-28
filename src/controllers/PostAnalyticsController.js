import { collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { SavedDate } from '../models/SavedDateModel';

const VIEWS = 'postViews';
const SAVES = 'savedDates';
const fail = (e) => ({ success: false, error: e.message });
const check = (id, userId) => (!id ? 'Post ID is required' : !userId ? 'You must be logged in' : null);

class PostAnalyticsController {
  getUserId() {
    return auth.currentUser?.uid ?? null;
  }

  async _username(userId) {
    const snap = await getDoc(doc(db, 'users', userId));
    return snap.exists() ? snap.data().username ?? '' : '';
  }

  async trackView(postId) {
    const userId = this.getUserId();
    const problem = check(postId, userId);
    if (problem) return { success: false, error: problem };
    try {
      const username = await this._username(userId);
      await setDoc(doc(db, VIEWS, `${userId}_${postId}`), { userId, postId, username, viewedAt: serverTimestamp() });
      return { success: true };
    } catch (e) {
      return fail(e);
    }
  }

  async saveDate(event) {
    const userId = this.getUserId();
    const problem = check(event?.id, userId);
    if (problem) return { success: false, error: problem };
    try {
      const username = await this._username(userId);
      const saved = new SavedDate({
        id: `${userId}_${event.id}`,
        userId,
        postId: event.id,
        title: event.eventTitle ?? '',
        date: event.date ?? '',
        savedAt: new Date().toISOString(),
      });
      await setDoc(doc(db, SAVES, saved.id), { ...saved.toFirebase(), username });
      return { success: true };
    } catch (e) {
      return fail(e);
    }
  }

  async removeSavedDate(postId) {
    const userId = this.getUserId();
    const problem = check(postId, userId);
    if (problem) return { success: false, error: problem };
    try {
      await deleteDoc(doc(db, SAVES, `${userId}_${postId}`));
      return { success: true };
    } catch (e) {
      return fail(e);
    }
  }

  async _records(col, postId) {
    const snap = await getDocs(query(collection(db, col), where('postId', '==', postId)));
    return snap.docs.map((d) => d.data());
  }

  async getPostStats(postId) {
    if (!postId) return { success: false, error: 'Post ID is required' };
    try {
      const [views, saves] = await Promise.all([this._records(VIEWS, postId), this._records(SAVES, postId)]);
      return { success: true, data: { views: views.length, saves: saves.length } };
    } catch (e) {
      return fail(e);
    }
  }

  async getCandidates(postId, type) {
    if (!postId) return { success: false, error: 'Post ID is required' };
    try {
      const records = await this._records(type === 'saves' ? SAVES : VIEWS, postId);
      return {
        success: true,
        data: records.map((r) => ({ id: r.userId, name: r.username || 'Unknown candidate' })),
      };
    } catch (e) {
      return fail(e);
    }
  }
}

export default new PostAnalyticsController();
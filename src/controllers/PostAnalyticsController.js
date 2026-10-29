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

  // employerId (the post owner) is stored on each record so the security rules
  // can let only that employer read the stats for their own post.
  async trackView(postId, employerId) {
    const userId = this.getUserId();
    const problem = check(postId, userId);
    if (problem) return { success: false, error: problem };
    if (!employerId) return { success: false, error: 'Employer ID is required' };
    try {
      const username = await this._username(userId);
      await setDoc(doc(db, VIEWS, `${userId}_${postId}`), {
        userId,
        postId,
        employerId,
        username,
        viewedAt: serverTimestamp(),
      });
      return { success: true };
    } catch (e) {
      return fail(e);
    }
  }

  async saveDate(event) {
    const userId = this.getUserId();
    const problem = check(event?.id, userId);
    if (problem) return { success: false, error: problem };
    if (!event?.employerId) return { success: false, error: 'Employer ID is required' };
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
      await setDoc(doc(db, SAVES, saved.id), {
        ...saved.toFirebase(),
        username,
        employerId: event.employerId,
      });
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

  // Only returns records for posts owned by the signed-in employer.
  async _records(col, postId) {
    const ownerId = this.getUserId();
    const snap = await getDocs(
      query(
        collection(db, col),
        where('postId', '==', postId),
        where('employerId', '==', ownerId)
      )
    );
    return snap.docs.map((d) => d.data());
  }

  async getPost(postId) {
    if (!postId) return { success: false, error: 'Post ID is required' };
    try {
      const snap = await getDoc(doc(db, 'events', postId));
      if (!snap.exists()) return { success: false, error: 'Post not found' };
      return { success: true, data: { id: snap.id, ...snap.data() } };
    } catch (e) {
      return fail(e);
    }
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
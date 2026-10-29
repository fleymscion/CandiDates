import { onAuthStateChanged } from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { auth, db } from '../config/firebase'; // Adjust path if needed
import PostAnalyticsController from '../controllers/PostAnalyticsController';

const EventContext = createContext();

export function EventProvider({ children }) {
  const [rawEvents, setRawEvents] = useState([]);
  // Per-user state: { [eventId]: { classification, isHidden } }
  const [prefs, setPrefs] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubEvents = null;
    let unsubPrefs = null;

    const stop = () => {
      if (unsubEvents) unsubEvents();
      if (unsubPrefs) unsubPrefs();
      unsubEvents = null;
      unsubPrefs = null;
    };

    // Only listen to Firestore while a user is signed in.
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      stop();

      if (!user) {
        setRawEvents([]);
        setPrefs({});
        setLoading(false);
        return;
      }

      setLoading(true);

      // Shared postings (created by employers)
      unsubEvents = onSnapshot(
        collection(db, 'events'),
        (snapshot) => {
          setRawEvents(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
          setLoading(false);
        },
        (error) => {
          console.error('Error listening to Firestore events:', error);
          setLoading(false);
        }
      );

      // This user's own saved/hidden state, private to them
      unsubPrefs = onSnapshot(
        collection(db, 'users', user.uid, 'eventPrefs'),
        (snapshot) => {
          const map = {};
          snapshot.docs.forEach((d) => {
            map[d.id] = d.data();
          });
          setPrefs(map);
        },
        (error) => {
          console.error('Error listening to event prefs:', error);
        }
      );
    });

    return () => {
      stop();
      unsubAuth();
    };
  }, []);

  // Shared posting + this user's own state. Ignores any classification/isHidden
  // stored on the shared document so one user's choices never leak to another.
  const events = useMemo(
    () =>
      rawEvents.map((e) => ({
        ...e,
        classification: prefs[e.id]?.classification ?? 'normal',
        isHidden: prefs[e.id]?.isHidden ?? false,
      })),
    [rawEvents, prefs]
  );

  const setPref = async (id, patch) => {
    const user = auth.currentUser;
    if (!user) return false;
    try {
      await setDoc(doc(db, 'users', user.uid, 'eventPrefs', id), patch, {
        merge: true,
      });
      return true;
    } catch (error) {
      console.error('Error saving event preference:', error);
      return false;
    }
  };

  // Employer posts a new shared event. Returns true on success.
  const addEvent = async (event) => {
    const user = auth.currentUser;
    if (!user) {
      console.error('Cannot add event: not signed in');
      return false;
    }

    try {
      await addDoc(collection(db, 'events'), {
        imageUrl: '',
        ...event,
        employerId: user.uid,
        createdAt: new Date(),
      });
      return true;
    } catch (error) {
      console.error('Error adding event to Firestore:', error);
      return false;
    }
  };

  // Only the employer who posted it can delete it (enforced by rules too).
  const deleteEvent = async (id) => {
    try {
      await deleteDoc(doc(db, 'events', id));
      return true;
    } catch (error) {
      console.error('Error deleting event from Firestore:', error);
      return false;
    }
  };

  const toggleHighlight = async (id) => {
    const target = events.find((item) => item.id === id);
    if (!target) return;
    const saving = target.classification !== 'highlighted';
    const ok = await setPref(id, {
      classification: saving ? 'highlighted' : 'normal',
    });

    // Also record the save for the employer's Stats dashboard (best effort).
    if (ok && target.employerId) {
      const result = saving
        ? await PostAnalyticsController.saveDate(target)
        : await PostAnalyticsController.removeSavedDate(id);
      if (!result.success) {
        console.warn('Could not update save analytics:', result.error);
      }
    }
  };

  const hideFromGeneral = (id) => setPref(id, { isHidden: true });
  const removeFromHighlight = (id) => setPref(id, { classification: 'normal' });
  const unhideEvent = (id) => setPref(id, { isHidden: false });

  return (
    <EventContext.Provider
      value={{
        events,
        loading,
        addEvent,
        deleteEvent,
        toggleHighlight,
        hideFromGeneral,
        removeFromHighlight,
        unhideEvent,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export const useEvents = () => useContext(EventContext);
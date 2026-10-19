import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth, getReactNativePersistence, } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

  const firebaseConfig = {
    apiKey: "AIzaSyAcMWH99RM8979kex5qLYMxh51jUgqE60c",
    authDomain: "candidates-45ee5.firebaseapp.com",
    projectId: "candidates-45ee5",
    storageBucket: "candidates-45ee5.firebasestorage.app",
    messagingSenderId: "388132624350",
    appId: "1:388132624350:web:01ea977bcc07b0376eef4f"
  };

  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

  export const auth = (() => {
    try {
     return initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage),
      });
    } catch (error) {
      return getAuth(app);
    }
  })();

  export const db = getFirestore(app);

  export default app;
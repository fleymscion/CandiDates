import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import { auth, db } from '../config/firebase';

export async function loginUser(email, password) {
  if (!email.trim()) {
    throw new Error('Email is required.');
  }

  if (!password) {
    throw new Error('Password is required.');
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );

    const user = userCredential.user;

    const userDoc = await getDoc(doc(db, 'users', user.uid));

    if (!userDoc.exists()) {
      throw new Error('User profile not found.');
    }

    return {
      user,
      profile: userDoc.data(),
    };
  } catch (error) {
    if (error.message === 'User profile not found.') {
      throw error;
    }

    if (
      error.code === 'auth/invalid-credential' ||
      error.code === 'auth/user-not-found' ||
      error.code === 'auth/wrong-password' ||
      error.code === 'auth/invalid-email'
    ) {
      throw new Error('Invalid email or password.');
    }

    if (error.code === 'auth/too-many-requests') {
      throw new Error('Too many attempts. Please try again later.');
    }

    console.error('Login error:', error);
    throw new Error('Unable to log in. Please try again.');
  }
}
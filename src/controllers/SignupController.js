import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export async function signupUser(username, email, password, confirmPassword, accountType) {
  if (!accountType) {
    throw new Error('Please select Employee or Employer.');
  }

  if (!username.trim()) {
    throw new Error('Username is required.');
  }

  if (!email.trim()) {
    throw new Error('Email is required.');
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email.trim())) {
    throw new Error('Please enter a valid email address.');
  }

  if (!password) {
    throw new Error('Password is required.');
  }

  if (!confirmPassword) {
    throw new Error('Please confirm your password.');
  }

  if (password !== confirmPassword) {
    throw new Error('Passwords do not match.');
  }

  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters.');
  }

  let userCredential;

  try {
    userCredential = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('Email already in use.');
    }

    throw error;
  }

  const user = userCredential.user;

  await updateProfile(user, {
    displayName: username.trim(),
  });

  const profile = {
    uid: user.uid,
    username: username.trim(),
    email: user.email,
    role: accountType,
    createdAt: serverTimestamp(),
    provider: 'password',
  };

  await setDoc(doc(db, 'users', user.uid), profile);

  return { user, profile };
}
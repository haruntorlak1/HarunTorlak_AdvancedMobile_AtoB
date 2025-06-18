import {
    User,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    signInWithEmailAndPassword,
    updatePassword,
    updateProfile,
} from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
      }
    } catch (error) {
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      throw error;
    }
  };

  const updateUserProfile = async (displayName: string) => {
    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, { displayName });
      } catch (error) {
        throw error;
      }
    }
  };

  const updateUserPassword = async (newPassword: string) => {
    if (auth.currentUser) {
      try {
        await updatePassword(auth.currentUser, newPassword);
      } catch (error) {
        throw error;
      }
    }
  };

  return {
    user,
    signUp,
    signIn,
    signOut,
    updateUserProfile,
    updateUserPassword,
  };
}

'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { createUserDocument, updateUserDocument, getUserDocument } from '../firebase/users';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get the complete user profile from Firestore
          const userDataFromFirestore = await getUserDocument(firebaseUser.uid);
          
          // Combine Firestore data with the definitive Auth data
          setUser({
            ...userDataFromFirestore, // Base data from our DB
            uid: firebaseUser.uid, // Definitive from Auth
            email: firebaseUser.email, // Definitive from Auth
            displayName: firebaseUser.displayName, // Auth is source of truth for this
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null); // Fallback to null on error
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email, password, name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('Firebase Auth user object created:', user);

      // Update Firebase auth profile
      await updateProfile(user, {
        displayName: name
      });
      console.log('Firebase Auth profile updated with displayName.');

      // Instead of passing the whole user object, explicitly pass the data we need.
      // This prevents potential issues with complex objects from real Gmail accounts.
      const userDataForFirestore = {
        uid: user.uid,
        email: user.email,
        displayName: name, // Use the name from the form directly
        photoURL: user.photoURL, // Pass this along if it exists
      };
      
      await createUserDocument(userDataForFirestore);
      console.log('Firestore document creation initiated.');
      
      return userCredential;
    } catch (error) {
      console.error('Full error during signup:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  const updateUserProfile = async (data) => {
    try {
      if (!user?.uid) throw new Error('No user found');

      // 1. Update Firebase Auth if displayName is provided
      const { photoURL, bio, location, website, ...authUpdateData } = data;
      if (authUpdateData.displayName) {
        await updateProfile(auth.currentUser, authUpdateData);
      }

      // 2. Update our Firestore document with all the data
      const updatedDoc = await updateUserDocument(user.uid, data);

      // 3. Update local state with the fresh, complete document from Firestore
      setUser(prev => ({
        ...prev, // Keep the old state
        ...updatedDoc, // Overwrite with the full updated document
        displayName: authUpdateData.displayName || prev.displayName, // Ensure displayName from auth is updated
      }));
      
    } catch (error) {
      console.error('Error updating profile:', error);
      throw new Error('Failed to update user profile. Please try again.');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      signup, 
      login, 
      logout, 
      updateUserProfile,
      loading,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}; 
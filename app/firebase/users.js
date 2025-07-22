import { db } from './config';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

// In updateUserDocument, ensure we handle the nested profile updates correctly.
export async function updateUserDocument(uid, data) {
  if (!uid) {
    console.error('No user ID provided to updateUserDocument');
    return null;
  }

  const userRef = doc(db, 'users', uid);

  try {
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      throw new Error('User document does not exist');
    }

    const updates = {};
    const profileUpdates = {};

    Object.keys(data).forEach(key => {
      // Separate profile fields from top-level fields
      if (['bio', 'location', 'photoURL', 'website'].includes(key)) {
        if (data[key] !== undefined) {
          profileUpdates[key] = data[key];
        }
      } else {
        if (data[key] !== undefined) {
          updates[key] = data[key];
        }
      }
    });

    // Merge profile updates into the main updates object using dot notation
    if (Object.keys(profileUpdates).length > 0) {
      Object.keys(profileUpdates).forEach(key => {
        updates[`profile.${key}`] = profileUpdates[key];
      });
    }

    updates.updatedAt = serverTimestamp();
    
    // Perform the update
    await updateDoc(userRef, updates);
    console.log('User document updated successfully with:', updates);

    // Return the fresh, complete document
    const updatedSnap = await getDoc(userRef);
    return updatedSnap.data();
    
  } catch (error) {
    console.error('Error updating user document:', error);
    throw new Error('Failed to update user profile. Please try again.');
  }
}

// In createUserDocument, initialize the profile object correctly.
export async function createUserDocument(userData) {
  if (!userData?.uid) {
    console.error('No user ID provided to createUserDocument');
    return null;
  }
  const userRef = doc(db, 'users', userData.uid);
  try {
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      const newUserDoc = {
        uid: userData.uid,
        email: userData.email || '',
        displayName: userData.displayName || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        profile: {
          bio: '',
          location: '',
          website: '',
          photoURL: userData.photoURL || '',
        },
        settings: {
          emailNotifications: true,
          darkMode: false,
        },
      };
      await setDoc(userRef, newUserDoc);
      console.log('User document created successfully with:', newUserDoc);
      return newUserDoc;
    } else {
      console.log('User document already exists');
      return userSnap.data();
    }
  } catch (error) {
    console.error('Error creating user document:', error);
    throw new Error('Failed to create user profile. Please try again.');
  }
}

export async function getUserDocument(uid) {
  if (!uid) {
    console.error('No user ID provided to getUserDocument');
    return null;
  }

  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() };
    } else {
      console.log('No user document found for ID:', uid);
      return null;
    }
  } catch (error) {
    console.error('Error fetching user document:', error);
    throw new Error('Failed to fetch user profile. Please try again.');
  }
} 
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  UserCredential,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/firebase.config'

const googleProvider = new GoogleAuthProvider()

// Sign up with email and password
export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string
): Promise<UserCredential> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  
  // Update profile with display name
  await updateProfile(userCredential.user, { displayName })
  
  // Create user document in Firestore
  await createUserDocument(userCredential.user)
  
  return userCredential
}

// Sign in with email and password
export async function signInWithEmail(
  email: string,
  password: string
): Promise<UserCredential> {
  return await signInWithEmailAndPassword(auth, email, password)
}

// Sign in with Google
export async function signInWithGoogle(): Promise<UserCredential> {
  const userCredential = await signInWithPopup(auth, googleProvider)
  
  // Create user document if first time
  const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid))
  if (!userDoc.exists()) {
    await createUserDocument(userCredential.user)
  }
  
  return userCredential
}

// Sign out
export async function signOut(): Promise<void> {
  return await firebaseSignOut(auth)
}

// Reset password
export async function resetPassword(email: string): Promise<void> {
  return await sendPasswordResetEmail(auth, email)
}

// Create user document in Firestore
async function createUserDocument(user: User): Promise<void> {
  const userRef = doc(db, 'users', user.uid)
  
  const userData = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || '',
    photoURL: user.photoURL || '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    role: 'user', // default role
    preferences: {
      city: 'Mumbai',
      notifications: {
        email: true,
        sms: true,
        push: true,
      },
    },
    bookings: [],
    wishlist: [],
  }
  
  await setDoc(userRef, userData, { merge: true })
}

// Get current user
export function getCurrentUser(): User | null {
  return auth.currentUser
}

// Check if user is admin
export async function isAdmin(uid: string): Promise<boolean> {
  const userDoc = await getDoc(doc(db, 'users', uid))
  if (userDoc.exists()) {
    const userData = userDoc.data()
    return userData.role === 'admin' || userData.role === 'organizer'
  }
  return false
}


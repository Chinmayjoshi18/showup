import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAuth, Auth } from 'firebase/auth'
import { getFirestore, Firestore } from 'firebase/firestore'
import { getStorage, FirebaseStorage } from 'firebase/storage'
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics'
import { getMessaging, Messaging, isSupported as isMessagingSupported } from 'firebase/messaging'
import { getRemoteConfig, RemoteConfig } from 'firebase/remote-config'

// Firebase configuration
// These values are safe to be public - Firebase security comes from Firestore/Storage rules
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBZAcO-S8cAX23YCZ6G5HHJ4_VBycELXyA",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "showup-e088f.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "showup-e088f",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "showup-e088f.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "761321497235",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:761321497235:web:da6cf57a39dcb1fa0ce366",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-TYBM19ZNF8"
}

// Initialize Firebase
let app: FirebaseApp | undefined
let auth: Auth | undefined
let db: Firestore | undefined
let storage: FirebaseStorage | undefined
let analytics: Analytics | null = null
let messaging: Messaging | null = null
let remoteConfig: RemoteConfig | undefined

// Only initialize Firebase if we have valid config (client-side only)
if (typeof window !== 'undefined') {
  // Initialize Firebase app
  if (!getApps().length) {
    try {
      app = initializeApp(firebaseConfig)
    } catch (error) {
      console.error('Firebase initialization error:', error)
    }
  } else {
    app = getApps()[0]
  }

  // Initialize services only if app is initialized
  if (app) {
    try {
      auth = getAuth(app)
      db = getFirestore(app)
      storage = getStorage(app)
    } catch (error) {
      console.error('Firebase services initialization error:', error)
    }
  }
}

// Initialize Analytics (only in browser and if supported)
if (typeof window !== 'undefined' && app) {
  isSupported().then(yes => {
    if (yes && app) {
      analytics = getAnalytics(app)
    }
  }).catch(err => {
    console.log('Analytics not supported:', err)
  })
}

// Initialize Messaging (only in browser and if supported)
if (typeof window !== 'undefined' && app) {
  isMessagingSupported().then(yes => {
    if (yes && app) {
      messaging = getMessaging(app)
    }
  }).catch(err => {
    console.log('Messaging not supported:', err)
  })
}

// Initialize Remote Config (only in browser)
if (typeof window !== 'undefined' && app) {
  try {
    remoteConfig = getRemoteConfig(app)
    remoteConfig.settings = {
      minimumFetchIntervalMillis: 3600000, // 1 hour
      fetchTimeoutMillis: 60000, // 1 minute
    }

    // Default Remote Config values
    remoteConfig.defaultConfig = {
      show_offers_banner: true,
      max_booking_seats: 10,
      enable_referral_program: false,
      maintenance_mode: false,
      featured_event_id: '',
    }
  } catch (error) {
    console.log('Remote Config not initialized:', error)
  }
}

export { app, auth, db, storage, analytics, messaging, remoteConfig }


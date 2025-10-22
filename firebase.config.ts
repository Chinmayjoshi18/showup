import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAuth, Auth } from 'firebase/auth'
import { getFirestore, Firestore } from 'firebase/firestore'
import { getStorage, FirebaseStorage } from 'firebase/storage'
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics'
import { getMessaging, Messaging, isSupported as isMessagingSupported } from 'firebase/messaging'
import { getRemoteConfig, RemoteConfig } from 'firebase/remote-config'

// Firebase configuration
// Replace these with your actual Firebase config values
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

// Initialize Firebase
let app: FirebaseApp
let auth: Auth
let db: Firestore
let storage: FirebaseStorage
let analytics: Analytics | null = null
let messaging: Messaging | null = null
let remoteConfig: RemoteConfig | undefined

// Initialize Firebase app
if (!getApps().length) {
  app = initializeApp(firebaseConfig)
} else {
  app = getApps()[0]
}

// Initialize services
auth = getAuth(app)
db = getFirestore(app)
storage = getStorage(app)

// Initialize Analytics (only in browser and if supported)
if (typeof window !== 'undefined') {
  isSupported().then(yes => {
    if (yes) {
      analytics = getAnalytics(app)
    }
  }).catch(err => {
    console.log('Analytics not supported:', err)
  })
}

// Initialize Messaging (only in browser and if supported)
if (typeof window !== 'undefined') {
  isMessagingSupported().then(yes => {
    if (yes) {
      messaging = getMessaging(app)
    }
  }).catch(err => {
    console.log('Messaging not supported:', err)
  })
}

// Initialize Remote Config (only in browser)
if (typeof window !== 'undefined') {
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


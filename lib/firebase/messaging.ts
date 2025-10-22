import { getToken, onMessage, MessagePayload } from 'firebase/messaging'
import { messaging } from '@/firebase.config'

// Request notification permission and get FCM token
export async function requestNotificationPermission(): Promise<string | null> {
  try {
    if (!messaging) {
      console.warn('Messaging not supported')
      return null
    }
    
    const permission = await Notification.requestPermission()
    
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      })
      
      console.log('FCM Token:', token)
      return token
    } else {
      console.log('Notification permission denied')
      return null
    }
  } catch (error) {
    console.error('Error getting FCM token:', error)
    return null
  }
}

// Listen for foreground messages
export function onMessageListener(callback: (payload: MessagePayload) => void): void {
  if (!messaging) {
    console.warn('Messaging not supported')
    return
  }
  
  onMessage(messaging, (payload) => {
    console.log('Message received:', payload)
    callback(payload)
    
    // Show browser notification
    if (payload.notification) {
      const { title, body, icon } = payload.notification
      
      if (Notification.permission === 'granted') {
        new Notification(title || 'ShowUp', {
          body: body || '',
          icon: icon || '/logo.png',
          badge: '/logo.png',
          tag: payload.messageId,
        })
      }
    }
  })
}

// Send FCM token to backend (to store in Firestore)
export async function saveFCMToken(userId: string, token: string): Promise<void> {
  try {
    // This would be an API call to your backend or direct Firestore update
    const { doc, updateDoc, arrayUnion } = await import('firebase/firestore')
    const { db } = await import('@/firebase.config')
    
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
      fcmTokens: arrayUnion(token),
    })
    
    console.log('FCM token saved successfully')
  } catch (error) {
    console.error('Error saving FCM token:', error)
  }
}

// Remove FCM token (on logout)
export async function removeFCMToken(userId: string, token: string): Promise<void> {
  try {
    const { doc, updateDoc, arrayRemove } = await import('firebase/firestore')
    const { db } = await import('@/firebase.config')
    
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
      fcmTokens: arrayRemove(token),
    })
    
    console.log('FCM token removed successfully')
  } catch (error) {
    console.error('Error removing FCM token:', error)
  }
}


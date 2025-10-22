'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/firebase.config'
import { logLogin, setAnalyticsUserId } from '@/lib/firebase/analytics'

interface AuthContextType {
  user: User | null
  loading: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      
      if (user) {
        // Set analytics user ID (safely)
        try {
          setAnalyticsUserId(user.uid)
        } catch (error) {
          console.log('Analytics not initialized:', error)
        }
        
        // Initialize user profile in Firestore if needed
        try {
          const { initializeUserProfile } = await import('@/lib/firebase/admin')
          await initializeUserProfile(
            user.uid,
            user.email || '',
            user.displayName,
            user.photoURL
          )
        } catch (error) {
          console.error('Error initializing user profile:', error)
        }
        
        // Check if user is admin
        try {
          const { isAdmin: checkAdmin } = await import('@/lib/firebase/auth')
          const adminStatus = await checkAdmin(user.uid)
          setIsAdmin(adminStatus)
        } catch (error) {
          console.error('Error checking admin status:', error)
          setIsAdmin(false)
        }
      } else {
        setIsAdmin(false)
      }
      
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const value = {
    user,
    loading,
    isAdmin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}


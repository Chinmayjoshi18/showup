import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where,
  orderBy,
  Timestamp,
  deleteDoc
} from 'firebase/firestore'
import { db } from '@/firebase.config'
import { UserRole, UserProfile, OrganizerRequest, EventApproval } from '@/lib/types/roles'

/**
 * Check if a user is an admin
 */
export async function isUserAdmin(uid: string): Promise<boolean> {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid))
    if (!userDoc.exists()) return false
    
    const userData = userDoc.data()
    return userData.role === 'admin'
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

/**
 * Check if user has organizer role
 */
export async function isUserOrganizer(uid: string): Promise<boolean> {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid))
    if (!userDoc.exists()) return false
    
    const userData = userDoc.data()
    return userData.role === 'organizer' || userData.role === 'admin'
  } catch (error) {
    console.error('Error checking organizer status:', error)
    return false
  }
}

/**
 * Get user profile with role
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid))
    if (!userDoc.exists()) return null
    
    return userDoc.data() as UserProfile
  } catch (error) {
    console.error('Error getting user profile:', error)
    return null
  }
}

/**
 * Initialize user profile (called on first sign-in)
 */
export async function initializeUserProfile(
  uid: string,
  email: string,
  displayName: string | null,
  photoURL: string | null
): Promise<void> {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid))
    
    if (!userDoc.exists()) {
      const profile: UserProfile = {
        uid,
        email,
        displayName,
        photoURL,
        role: 'customer',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true
      }
      
      await setDoc(doc(db, 'users', uid), profile)
    }
  } catch (error) {
    console.error('Error initializing user profile:', error)
    throw error
  }
}

/**
 * Admin: Add organizer by email
 */
export async function addOrganizerByEmail(
  adminUid: string,
  email: string,
  name: string,
  organization?: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Verify admin status
    const isAdmin = await isUserAdmin(adminUid)
    if (!isAdmin) {
      return { success: false, message: 'Unauthorized: Admin access required' }
    }
    
    // Check if user exists
    const usersQuery = query(collection(db, 'users'), where('email', '==', email))
    const usersSnapshot = await getDocs(usersQuery)
    
    if (usersSnapshot.empty) {
      return { 
        success: false, 
        message: 'User not found. The user must sign in to ShowUp first.' 
      }
    }
    
    const userDoc = usersSnapshot.docs[0]
    const userData = userDoc.data()
    
    // Check if already an organizer
    if (userData.role === 'organizer' || userData.role === 'admin') {
      return { success: false, message: 'User is already an organizer or admin' }
    }
    
    // Upgrade to organizer
    await updateDoc(doc(db, 'users', userDoc.id), {
      role: 'organizer',
      organizerApprovedAt: new Date().toISOString(),
      organizerApprovedBy: adminUid,
      organization: organization || null,
      updatedAt: new Date().toISOString()
    })
    
    return { success: true, message: 'Successfully added as organizer' }
  } catch (error) {
    console.error('Error adding organizer:', error)
    return { success: false, message: 'Error adding organizer' }
  }
}

/**
 * Admin: Remove organizer role
 */
export async function removeOrganizerRole(
  adminUid: string,
  organizerUid: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Verify admin status
    const isAdmin = await isUserAdmin(adminUid)
    if (!isAdmin) {
      return { success: false, message: 'Unauthorized: Admin access required' }
    }
    
    // Don't allow removing admin
    const targetUser = await getUserProfile(organizerUid)
    if (targetUser?.role === 'admin') {
      return { success: false, message: 'Cannot remove admin role' }
    }
    
    // Downgrade to customer
    await updateDoc(doc(db, 'users', organizerUid), {
      role: 'customer',
      organizerRemovedAt: new Date().toISOString(),
      organizerRemovedBy: adminUid,
      updatedAt: new Date().toISOString()
    })
    
    return { success: true, message: 'Organizer role removed' }
  } catch (error) {
    console.error('Error removing organizer:', error)
    return { success: false, message: 'Error removing organizer' }
  }
}

/**
 * Admin: Get all users
 */
export async function getAllUsers(): Promise<UserProfile[]> {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'))
    return usersSnapshot.docs.map(doc => doc.data() as UserProfile)
  } catch (error) {
    console.error('Error getting all users:', error)
    return []
  }
}

/**
 * Admin: Get all organizers
 */
export async function getAllOrganizers(): Promise<UserProfile[]> {
  try {
    const organizersQuery = query(
      collection(db, 'users'), 
      where('role', 'in', ['organizer', 'admin'])
    )
    const organizersSnapshot = await getDocs(organizersQuery)
    return organizersSnapshot.docs.map(doc => doc.data() as UserProfile)
  } catch (error) {
    console.error('Error getting organizers:', error)
    return []
  }
}

/**
 * Submit event for approval
 */
export async function submitEventForApproval(
  organizerId: string,
  eventData: any,
  type: 'create' | 'edit' | 'price_change'
): Promise<{ success: boolean; message: string; approvalId?: string }> {
  try {
    // Verify organizer status
    const isOrg = await isUserOrganizer(organizerId)
    if (!isOrg) {
      return { success: false, message: 'Unauthorized: Organizer access required' }
    }
    
    const approval: EventApproval = {
      id: `approval_${Date.now()}`,
      eventId: eventData.id || `event_${Date.now()}`,
      organizerId,
      type,
      status: 'pending',
      changes: eventData,
      submittedAt: new Date().toISOString()
    }
    
    await setDoc(doc(db, 'eventApprovals', approval.id), approval)
    
    return { 
      success: true, 
      message: 'Event submitted for admin approval',
      approvalId: approval.id
    }
  } catch (error) {
    console.error('Error submitting for approval:', error)
    return { success: false, message: 'Error submitting for approval' }
  }
}

/**
 * Admin: Approve or reject event
 */
export async function reviewEventApproval(
  adminUid: string,
  approvalId: string,
  approved: boolean,
  adminNotes?: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Verify admin status
    const isAdmin = await isUserAdmin(adminUid)
    if (!isAdmin) {
      return { success: false, message: 'Unauthorized: Admin access required' }
    }
    
    const approvalDoc = await getDoc(doc(db, 'eventApprovals', approvalId))
    if (!approvalDoc.exists()) {
      return { success: false, message: 'Approval not found' }
    }
    
    const approval = approvalDoc.data() as EventApproval
    
    // Update approval status
    await updateDoc(doc(db, 'eventApprovals', approvalId), {
      status: approved ? 'approved' : 'rejected',
      reviewedAt: new Date().toISOString(),
      reviewedBy: adminUid,
      adminNotes: adminNotes || null
    })
    
    // If approved, create/update the actual event
    if (approved) {
      if (approval.type === 'create') {
        await setDoc(doc(db, 'events', approval.eventId), {
          ...approval.changes,
          status: 'active',
          approvedBy: adminUid,
          approvedAt: new Date().toISOString()
        })
      } else if (approval.type === 'edit' || approval.type === 'price_change') {
        await updateDoc(doc(db, 'events', approval.eventId), {
          ...approval.changes,
          lastApprovedBy: adminUid,
          lastApprovedAt: new Date().toISOString()
        })
      }
    }
    
    return { 
      success: true, 
      message: approved ? 'Event approved' : 'Event rejected'
    }
  } catch (error) {
    console.error('Error reviewing approval:', error)
    return { success: false, message: 'Error reviewing approval' }
  }
}

/**
 * Admin: Get pending approvals
 */
export async function getPendingApprovals(): Promise<EventApproval[]> {
  try {
    const approvalsQuery = query(
      collection(db, 'eventApprovals'),
      where('status', '==', 'pending'),
      orderBy('submittedAt', 'desc')
    )
    const approvalsSnapshot = await getDocs(approvalsQuery)
    return approvalsSnapshot.docs.map(doc => doc.data() as EventApproval)
  } catch (error) {
    console.error('Error getting pending approvals:', error)
    return []
  }
}


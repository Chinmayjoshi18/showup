import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  serverTimestamp,
  QueryConstraint,
  DocumentData,
} from 'firebase/firestore'
import { db } from '@/firebase.config'
import { Event, Review, Booking } from '@/lib/data'

// ==================== EVENTS ====================

// Get all events with pagination
export async function getEvents(
  limitCount: number = 20,
  lastDoc?: DocumentData
): Promise<{ events: Event[]; lastVisible: DocumentData | null }> {
  const constraints: QueryConstraint[] = [
    orderBy('createdAt', 'desc'),
    limit(limitCount),
  ]
  
  if (lastDoc) {
    constraints.push(startAfter(lastDoc))
  }
  
  const q = query(collection(db, 'events'), ...constraints)
  const snapshot = await getDocs(q)
  
  const events = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Event[]
  
  const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null
  
  return { events, lastVisible }
}

// Get event by ID
export async function getEventById(eventId: string): Promise<Event | null> {
  const docRef = doc(db, 'events', eventId)
  const docSnap = await getDoc(docRef)
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Event
  }
  
  return null
}

// Get events by category
export async function getEventsByCategory(
  category: string,
  limitCount: number = 20
): Promise<Event[]> {
  const q = query(
    collection(db, 'events'),
    where('category', '==', category),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  )
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Event[]
}

// Search events
export async function searchEvents(searchTerm: string): Promise<Event[]> {
  // Note: This is a basic implementation. For production, use Algolia or similar
  const q = query(collection(db, 'events'))
  const snapshot = await getDocs(q)
  
  const allEvents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Event[]
  
  // Client-side filtering (not ideal for large datasets)
  const searchTermLower = searchTerm.toLowerCase()
  return allEvents.filter(event =>
    event.title.toLowerCase().includes(searchTermLower) ||
    event.description?.toLowerCase().includes(searchTermLower) ||
    event.genre.some(g => g.toLowerCase().includes(searchTermLower))
  )
}

// Add event (Organizer/Admin only)
export async function addEvent(eventData: Omit<Event, 'id'>): Promise<string> {
  const eventsRef = collection(db, 'events')
  const docRef = await addDoc(eventsRef, {
    ...eventData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  
  return docRef.id
}

// Update event
export async function updateEvent(eventId: string, eventData: Partial<Event>): Promise<void> {
  const docRef = doc(db, 'events', eventId)
  await updateDoc(docRef, {
    ...eventData,
    updatedAt: serverTimestamp(),
  })
}

// Delete event
export async function deleteEvent(eventId: string): Promise<void> {
  const docRef = doc(db, 'events', eventId)
  await deleteDoc(docRef)
}

// ==================== BOOKINGS ====================

// Create booking
export async function createBooking(bookingData: {
  userId: string
  eventId: string
  seats: any[]
  date: string
  time: string
  total: number
  paymentStatus: 'pending' | 'completed' | 'failed'
}): Promise<string> {
  const bookingsRef = collection(db, 'bookings')
  const docRef = await addDoc(bookingsRef, {
    ...bookingData,
    status: 'confirmed',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  
  // Update user's bookings array
  const userRef = doc(db, 'users', bookingData.userId)
  const userDoc = await getDoc(userRef)
  
  if (userDoc.exists()) {
    const currentBookings = userDoc.data().bookings || []
    await updateDoc(userRef, {
      bookings: [...currentBookings, docRef.id],
    })
  }
  
  return docRef.id
}

// Get user bookings
export async function getUserBookings(userId: string): Promise<Booking[]> {
  const q = query(
    collection(db, 'bookings'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Booking[]
}

// Get booking by ID
export async function getBookingById(bookingId: string): Promise<Booking | null> {
  const docRef = doc(db, 'bookings', bookingId)
  const docSnap = await getDoc(docRef)
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Booking
  }
  
  return null
}

// Cancel booking
export async function cancelBooking(bookingId: string): Promise<void> {
  const docRef = doc(db, 'bookings', bookingId)
  await updateDoc(docRef, {
    status: 'cancelled',
    updatedAt: serverTimestamp(),
  })
}

// ==================== REVIEWS ====================

// Add review
export async function addReview(reviewData: {
  eventId: string
  userId: string
  userName: string
  userPhoto?: string
  rating: number
  title: string
  content: string
  photos?: string[]
}): Promise<string> {
  const reviewsRef = collection(db, 'reviews')
  const docRef = await addDoc(reviewsRef, {
    ...reviewData,
    helpful: 0,
    notHelpful: 0,
    verified: false,
    createdAt: serverTimestamp(),
  })
  
  return docRef.id
}

// Get reviews for event
export async function getEventReviews(eventId: string): Promise<Review[]> {
  const q = query(
    collection(db, 'reviews'),
    where('eventId', '==', eventId),
    orderBy('createdAt', 'desc')
  )
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Review[]
}

// ==================== WISHLIST ====================

// Add to wishlist
export async function addToWishlist(userId: string, eventId: string): Promise<void> {
  const userRef = doc(db, 'users', userId)
  const userDoc = await getDoc(userRef)
  
  if (userDoc.exists()) {
    const currentWishlist = userDoc.data().wishlist || []
    if (!currentWishlist.includes(eventId)) {
      await updateDoc(userRef, {
        wishlist: [...currentWishlist, eventId],
      })
    }
  }
}

// Remove from wishlist
export async function removeFromWishlist(userId: string, eventId: string): Promise<void> {
  const userRef = doc(db, 'users', userId)
  const userDoc = await getDoc(userRef)
  
  if (userDoc.exists()) {
    const currentWishlist = userDoc.data().wishlist || []
    await updateDoc(userRef, {
      wishlist: currentWishlist.filter((id: string) => id !== eventId),
    })
  }
}

// Get user wishlist
export async function getUserWishlist(userId: string): Promise<Event[]> {
  const userRef = doc(db, 'users', userId)
  const userDoc = await getDoc(userRef)
  
  if (userDoc.exists()) {
    const wishlist = userDoc.data().wishlist || []
    
    if (wishlist.length === 0) return []
    
    // Fetch all events in wishlist
    const events = await Promise.all(
      wishlist.map((eventId: string) => getEventById(eventId))
    )
    
    return events.filter((event): event is Event => event !== null)
  }
  
  return []
}


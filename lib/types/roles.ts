// Role-based access control types

export type UserRole = 'admin' | 'organizer' | 'customer'

export interface UserProfile {
  uid: string
  email: string
  displayName: string | null
  photoURL: string | null
  role: UserRole
  createdAt: string
  updatedAt: string
  isActive: boolean
}

export interface OrganizerRequest {
  id: string
  email: string
  name: string
  organization?: string
  phone?: string
  message?: string
  status: 'pending' | 'approved' | 'rejected'
  requestedAt: string
  reviewedAt?: string
  reviewedBy?: string // Admin UID
}

export interface EventApproval {
  id: string
  eventId: string
  organizerId: string
  type: 'create' | 'edit' | 'price_change' | 'delete'
  status: 'pending' | 'approved' | 'rejected'
  changes: any // The actual changes being requested
  originalData?: any // For edits, store original
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string // Admin UID
  adminNotes?: string
}

export interface AdminStats {
  totalUsers: number
  totalOrganizers: number
  totalEvents: number
  pendingApprovals: number
  totalBookings: number
  totalRevenue: number
}


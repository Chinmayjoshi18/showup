'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  UserCheck, 
  FileCheck, 
  AlertCircle, 
  TrendingUp, 
  DollarSign,
  Shield,
  Plus,
  Check,
  X,
  Search,
  Filter,
  Download,
  Eye,
  Ban
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { 
  isUserAdmin, 
  getAllUsers, 
  getAllOrganizers,
  getPendingApprovals,
  addOrganizerByEmail,
  removeOrganizerRole,
  reviewEventApproval,
  ADMIN_EMAIL
} from '@/lib/firebase/admin'
import { UserProfile, EventApproval } from '@/lib/types/roles'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function AdminPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [checkingAdmin, setCheckingAdmin] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'organizers' | 'approvals'>('overview')
  
  // Data states
  const [users, setUsers] = useState<UserProfile[]>([])
  const [organizers, setOrganizers] = useState<UserProfile[]>([])
  const [pendingApprovals, setPendingApprovals] = useState<EventApproval[]>([])
  const [loadingData, setLoadingData] = useState(false)
  
  // Add organizer state
  const [showAddOrganizer, setShowAddOrganizer] = useState(false)
  const [newOrganizerEmail, setNewOrganizerEmail] = useState('')
  const [newOrganizerName, setNewOrganizerName] = useState('')
  const [newOrganizerOrg, setNewOrganizerOrg] = useState('')
  const [addingOrganizer, setAddingOrganizer] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  // Search and filter
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'organizer' | 'customer'>('all')

  // Check admin access
  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!loading && user) {
        // Quick email check first
        if (user.email !== ADMIN_EMAIL) {
          router.push('/')
          return
        }
        
        try {
          const adminStatus = await isUserAdmin(user.uid)
          setIsAdmin(adminStatus)
          
          if (!adminStatus) {
            router.push('/')
          }
        } catch (error) {
          console.error('Error checking admin status:', error)
          router.push('/')
        } finally {
          setCheckingAdmin(false)
        }
      } else if (!loading && !user) {
        router.push('/signin')
      }
    }
    
    checkAdminAccess()
  }, [user, loading, router])

  // Load data
  useEffect(() => {
    const loadData = async () => {
      if (!isAdmin) return
      
      setLoadingData(true)
      try {
        const [usersData, organizersData, approvalsData] = await Promise.all([
          getAllUsers(),
          getAllOrganizers(),
          getPendingApprovals()
        ])
        
        setUsers(usersData)
        setOrganizers(organizersData)
        setPendingApprovals(approvalsData)
      } catch (error) {
        console.error('Error loading admin data:', error)
      } finally {
        setLoadingData(false)
      }
    }
    
    loadData()
  }, [isAdmin])

  const handleAddOrganizer = async () => {
    if (!user || !newOrganizerEmail || !newOrganizerName) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' })
      return
    }
    
    setAddingOrganizer(true)
    setMessage(null)
    
    try {
      const result = await addOrganizerByEmail(
        user.uid,
        newOrganizerEmail,
        newOrganizerName,
        newOrganizerOrg
      )
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message })
        setNewOrganizerEmail('')
        setNewOrganizerName('')
        setNewOrganizerOrg('')
        setShowAddOrganizer(false)
        
        // Reload data
        const [usersData, organizersData] = await Promise.all([
          getAllUsers(),
          getAllOrganizers()
        ])
        setUsers(usersData)
        setOrganizers(organizersData)
      } else {
        setMessage({ type: 'error', text: result.message })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error adding organizer' })
    } finally {
      setAddingOrganizer(false)
    }
  }

  const handleRemoveOrganizer = async (organizerUid: string) => {
    if (!user) return
    
    if (!confirm('Are you sure you want to remove this organizer role? They will become a regular customer.')) {
      return
    }
    
    try {
      const result = await removeOrganizerRole(user.uid, organizerUid)
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message })
        
        // Reload data
        const [usersData, organizersData] = await Promise.all([
          getAllUsers(),
          getAllOrganizers()
        ])
        setUsers(usersData)
        setOrganizers(organizersData)
      } else {
        setMessage({ type: 'error', text: result.message })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error removing organizer' })
    }
  }

  const handleReviewApproval = async (approvalId: string, approved: boolean) => {
    if (!user) return
    
    const action = approved ? 'approve' : 'reject'
    if (!confirm(`Are you sure you want to ${action} this event?`)) {
      return
    }
    
    try {
      const result = await reviewEventApproval(user.uid, approvalId, approved)
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message })
        
        // Reload approvals
        const approvalsData = await getPendingApprovals()
        setPendingApprovals(approvalsData)
      } else {
        setMessage({ type: 'error', text: result.message })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error reviewing approval' })
    }
  }

  if (loading || checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null // Will redirect
  }

  const stats = {
    totalUsers: users.length,
    totalOrganizers: organizers.length,
    pendingApprovals: pendingApprovals.length,
    activeCustomers: users.filter(u => u.role === 'customer').length
  }

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         u.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = filterRole === 'all' || u.role === filterRole
    return matchesSearch && matchesRole
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-8 h-8" />
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              </div>
              <p className="text-white/90">Full control over users, organizers, and events</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-white/80">Logged in as</div>
              <div className="font-semibold">{user?.email}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Message Banner */}
      {message && (
        <div className={`${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'} border-t-4 px-4 py-3`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <p className="font-medium">{message.text}</p>
            <button onClick={() => setMessage(null)} className="text-current hover:opacity-70">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium transition ${
                activeTab === 'overview'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium transition ${
                activeTab === 'users'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users className="w-5 h-5" />
              All Users ({stats.totalUsers})
            </button>
            <button
              onClick={() => setActiveTab('organizers')}
              className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium transition ${
                activeTab === 'organizers'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <UserCheck className="w-5 h-5" />
              Organizers ({stats.totalOrganizers})
            </button>
            <button
              onClick={() => setActiveTab('approvals')}
              className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium transition ${
                activeTab === 'approvals'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileCheck className="w-5 h-5" />
              Pending Approvals
              {stats.pendingApprovals > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {stats.pendingApprovals}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Total Users</h3>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                <p className="text-sm text-gray-500 mt-1">{stats.activeCustomers} customers</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Organizers</h3>
                  <UserCheck className="w-8 h-8 text-purple-500" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.totalOrganizers}</p>
                <p className="text-sm text-gray-500 mt-1">Active event creators</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Pending Approvals</h3>
                  <AlertCircle className="w-8 h-8 text-orange-500" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.pendingApprovals}</p>
                <p className="text-sm text-gray-500 mt-1">Needs your review</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
                  <DollarSign className="w-8 h-8 text-green-500" />
                </div>
                <p className="text-3xl font-bold text-gray-900">₹0</p>
                <p className="text-sm text-gray-500 mt-1">Coming soon</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setShowAddOrganizer(true)}
                  className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition"
                >
                  <Plus className="w-6 h-6 text-purple-600" />
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Add Organizer</div>
                    <div className="text-sm text-gray-600">Grant organizer access</div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('approvals')}
                  className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition"
                >
                  <FileCheck className="w-6 h-6 text-orange-600" />
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Review Events</div>
                    <div className="text-sm text-gray-600">{stats.pendingApprovals} pending</div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('users')}
                  className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
                >
                  <Users className="w-6 h-6 text-blue-600" />
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Manage Users</div>
                    <div className="text-sm text-gray-600">View all users</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by email or name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 placeholder:text-gray-400"
                  />
                </div>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value as any)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="organizer">Organizer</option>
                  <option value="customer">Customer</option>
                </select>
              </div>
            </div>

            {/* Users List */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.map(user => (
                      <tr key={user.uid} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                              {user.displayName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.displayName || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                            user.role === 'organizer' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Organizers Tab */}
        {activeTab === 'organizers' && (
          <div className="space-y-6">
            {/* Add Organizer Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Manage Organizers</h2>
              <button
                onClick={() => setShowAddOrganizer(true)}
                className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
              >
                <Plus className="w-5 h-5" />
                Add Organizer
              </button>
            </div>

            {/* Organizers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {organizers.map(org => (
                <div key={org.uid} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:border-purple-500 transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {org.displayName?.charAt(0) || org.email.charAt(0).toUpperCase()}
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      org.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {org.role}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{org.displayName || 'N/A'}</h3>
                  <p className="text-sm text-gray-600 mb-4">{org.email}</p>
                  
                  <div className="pt-4 border-t border-gray-100">
                    <div className="text-xs text-gray-500 mb-2">Joined: {new Date(org.createdAt).toLocaleDateString()}</div>
                    {org.role !== 'admin' && (
                      <button
                        onClick={() => handleRemoveOrganizer(org.uid)}
                        className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition text-sm"
                      >
                        <Ban className="w-4 h-4" />
                        Remove Organizer Role
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {organizers.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <UserCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Organizers Yet</h3>
                <p className="text-gray-600 mb-6">Start by adding your first organizer</p>
                <button
                  onClick={() => setShowAddOrganizer(true)}
                  className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
                >
                  <Plus className="w-5 h-5" />
                  Add Organizer
                </button>
              </div>
            )}
          </div>
        )}

        {/* Approvals Tab */}
        {activeTab === 'approvals' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Pending Event Approvals</h2>

            {pendingApprovals.length > 0 ? (
              <div className="space-y-4">
                {pendingApprovals.map(approval => (
                  <div key={approval.id} className="bg-white rounded-xl shadow-sm p-6 border border-orange-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            approval.type === 'create' ? 'bg-green-100 text-green-800' :
                            approval.type === 'edit' ? 'bg-blue-100 text-blue-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {approval.type.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(approval.submittedAt).toLocaleString()}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {approval.changes.title || 'Untitled Event'}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {approval.changes.description || 'No description'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Category</div>
                        <div className="font-medium text-gray-900">{approval.changes.category}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Venue</div>
                        <div className="font-medium text-gray-900">{approval.changes.venue}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Price Range</div>
                        <div className="font-medium text-gray-900">
                          ₹{approval.changes.minPrice} - ₹{approval.changes.maxPrice}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Organizer ID</div>
                        <div className="font-medium text-gray-900 text-xs truncate">{approval.organizerId.slice(0, 8)}...</div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleReviewApproval(approval.id, true)}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                      >
                        <Check className="w-5 h-5" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReviewApproval(approval.id, false)}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                      >
                        <X className="w-5 h-5" />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <FileCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">All Caught Up!</h3>
                <p className="text-gray-600">No pending approvals at the moment</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Organizer Modal */}
      {showAddOrganizer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddOrganizer(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scaleIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Organizer</h2>
              <button
                onClick={() => setShowAddOrganizer(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  value={newOrganizerEmail}
                  onChange={(e) => setNewOrganizerEmail(e.target.value)}
                  placeholder="organizer@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 placeholder:text-gray-400"
                />
                <p className="text-xs text-gray-500 mt-1">User must be registered on ShowUp first</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={newOrganizerName}
                  onChange={(e) => setNewOrganizerName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Organization (Optional)</label>
                <input
                  type="text"
                  value={newOrganizerOrg}
                  onChange={(e) => setNewOrganizerOrg(e.target.value)}
                  placeholder="Event Company Ltd."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 placeholder:text-gray-400"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddOrganizer(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddOrganizer}
                  disabled={addingOrganizer || !newOrganizerEmail || !newOrganizerName}
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addingOrganizer ? 'Adding...' : 'Add Organizer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


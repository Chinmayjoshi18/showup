'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  UserCheck, 
  FileCheck, 
  AlertCircle, 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Shield,
  Plus,
  Check,
  X,
  Search,
  Filter,
  Download,
  Eye,
  Ban,
  BarChart3,
  PieChart,
  Calendar,
  Clock,
  Star,
  Ticket,
  MapPin,
  Mail,
  Phone,
  Globe,
  Activity,
  Zap,
  Award,
  LogOut
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
  const [activeView, setActiveView] = useState<'overview' | 'users' | 'organizers' | 'approvals' | 'analytics' | 'bookings'>('overview')
  
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
    const checkAdminAccess = () => {
      // Check if admin session exists
      const isAdmin = localStorage.getItem('isAdmin') === 'true'
      const adminLoginTime = localStorage.getItem('adminLoginTime')
      
      if (!isAdmin || !adminLoginTime) {
        router.push('/admin/login')
        return
      }
      
      // Check if session is expired (24 hours)
      const loginTime = parseInt(adminLoginTime)
      const now = Date.now()
      const twentyFourHours = 24 * 60 * 60 * 1000
      
      if (now - loginTime > twentyFourHours) {
        localStorage.removeItem('isAdmin')
        localStorage.removeItem('adminLoginTime')
        router.push('/admin/login')
        return
      }
      
      setIsAdmin(true)
      setCheckingAdmin(false)
    }
    
    checkAdminAccess()
  }, [router])

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
    
    if (!confirm('Are you sure you want to remove this organizer role?')) {
      return
    }
    
    try {
      const result = await removeOrganizerRole(user.uid, organizerUid)
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message })
        
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
        
        const approvalsData = await getPendingApprovals()
        setPendingApprovals(approvalsData)
      } else {
        setMessage({ type: 'error', text: result.message })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error reviewing approval' })
    }
  }

  const handleAdminSignOut = () => {
    if (confirm('Are you sure you want to sign out from admin panel?')) {
      localStorage.removeItem('isAdmin')
      localStorage.removeItem('adminLoginTime')
      router.push('/admin/login')
    }
  }

  if (loading || checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  const stats = {
    totalUsers: users.length,
    totalOrganizers: organizers.length,
    pendingApprovals: pendingApprovals.length,
    activeCustomers: users.filter(u => u.role === 'customer').length,
    revenue: 528976, // Mock data - replace with real data
    growth: 7.9,
    topSales: 72,
    deals: 256
  }

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         u.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = filterRole === 'all' || u.role === filterRole
    return matchesSearch && matchesRole
  })

  // Top performers mock data
  const topPerformers = [
    { name: 'Mumbai Events', revenue: 209633, percentage: 39.63, avatar: '🏙️' },
    { name: 'Bangalore Tech', revenue: 156841, percentage: 29.65, avatar: '💼' },
    { name: 'Delhi Sports', revenue: 117115, percentage: 22.14, avatar: '🏛️' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto">
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">ShowUp</h1>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveView('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${
                activeView === 'overview'
                  ? 'bg-gradient-to-r from-pink-50 to-purple-50 text-pink-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveView('analytics')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${
                activeView === 'analytics'
                  ? 'bg-gradient-to-r from-pink-50 to-purple-50 text-pink-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span>Analytics</span>
            </button>

            <button
              onClick={() => setActiveView('users')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${
                activeView === 'users'
                  ? 'bg-gradient-to-r from-pink-50 to-purple-50 text-pink-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>All Users</span>
              <span className="ml-auto bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">
                {stats.totalUsers}
              </span>
            </button>

            <button
              onClick={() => setActiveView('organizers')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${
                activeView === 'organizers'
                  ? 'bg-gradient-to-r from-pink-50 to-purple-50 text-pink-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <UserCheck className="w-5 h-5" />
              <span>Organizers</span>
              <span className="ml-auto bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">
                {stats.totalOrganizers}
              </span>
            </button>

            <button
              onClick={() => setActiveView('approvals')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${
                activeView === 'approvals'
                  ? 'bg-gradient-to-r from-pink-50 to-purple-50 text-pink-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FileCheck className="w-5 h-5" />
              <span>Approvals</span>
              {stats.pendingApprovals > 0 && (
                <span className="ml-auto bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                  {stats.pendingApprovals}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveView('bookings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${
                activeView === 'bookings'
                  ? 'bg-gradient-to-r from-pink-50 to-purple-50 text-pink-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Ticket className="w-5 h-5" />
              <span>Bookings</span>
            </button>
          </nav>

          {/* Admin Sign Out */}
          <div className="mt-auto pt-6 border-t border-gray-200">
            <div className="px-4 py-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  A
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900">Admin User</div>
                  <div className="text-xs text-gray-500">Full Access</div>
                </div>
              </div>
            </div>
            <button
              onClick={handleAdminSignOut}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {activeView === 'overview' && 'Dashboard Overview'}
                {activeView === 'analytics' && 'Analytics & Reports'}
                {activeView === 'users' && 'User Management'}
                {activeView === 'organizers' && 'Organizer Management'}
                {activeView === 'approvals' && 'Event Approvals'}
                {activeView === 'bookings' && 'Booking Management'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {activeView === 'overview' && 'Complete overview of your platform'}
                {activeView === 'analytics' && 'Deep insights into performance metrics'}
                {activeView === 'users' && 'Manage all registered users'}
                {activeView === 'organizers' && 'Control event organizer access'}
                {activeView === 'approvals' && 'Review and approve events'}
                {activeView === 'bookings' && 'Monitor all ticket bookings'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Export</span>
              </button>
              {activeView === 'organizers' && (
                <button
                  onClick={() => setShowAddOrganizer(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-semibold">Add Organizer</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Message Banner */}
        {message && (
          <div className={`${message.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border-l-4 px-8 py-4`}>
            <div className="flex items-center justify-between">
              <p className={`text-sm font-medium ${message.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                {message.text}
              </p>
              <button onClick={() => setMessage(null)} className="text-current hover:opacity-70">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-8">
          {/* Overview Dashboard */}
          {activeView === 'overview' && (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                      <TrendingUp className="w-4 h-4" />
                      <span>12%</span>
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Total Users</h3>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                  <p className="text-xs text-gray-500 mt-2">{stats.activeCustomers} customers</p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <UserCheck className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                      <TrendingUp className="w-4 h-4" />
                      <span>8%</span>
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Organizers</h3>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalOrganizers}</p>
                  <p className="text-xs text-gray-500 mt-2">Active event creators</p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-white" />
                    </div>
                    {stats.pendingApprovals > 0 && (
                      <div className="flex items-center gap-1 text-orange-600 text-sm font-semibold animate-pulse">
                        <Clock className="w-4 h-4" />
                        <span>Pending</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Pending Approvals</h3>
                  <p className="text-3xl font-bold text-gray-900">{stats.pendingApprovals}</p>
                  <p className="text-xs text-gray-500 mt-2">Needs your review</p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                      <TrendingUp className="w-4 h-4" />
                      <span>{stats.growth}%</span>
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Total Revenue</h3>
                  <p className="text-3xl font-bold text-gray-900">₹{stats.revenue.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-2">vs prev. period</p>
                </div>
              </div>

              {/* Revenue and Top Sales */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Card */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Revenue</h3>
                      <div className="flex items-center gap-3">
                        <p className="text-3xl font-bold text-gray-900">₹{stats.revenue.toLocaleString()}</p>
                        <span className="text-sm text-gray-500">82</span>
                        <span className="flex items-center gap-1 bg-pink-100 text-pink-600 text-xs font-bold px-2 py-1 rounded-full">
                          <TrendingUp className="w-3 h-3" />
                          {stats.growth}%
                        </span>
                        <span className="bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          ₹27,335.09
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">vs prev. ₹501,641.73 Jun 1 - Aug 31, 2023</p>
                    </div>
                  </div>

                  {/* Top Performers */}
                  <div className="grid grid-cols-3 gap-4">
                    {topPerformers.map((performer, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg">
                          {performer.avatar}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">₹{performer.revenue.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">{performer.percentage}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium opacity-90">Top sales 💪</h3>
                      <Star className="w-5 h-5" />
                    </div>
                    <p className="text-4xl font-bold mb-1">{stats.topSales}</p>
                    <p className="text-sm opacity-90">Most selling events</p>
                    <div className="mt-4 pt-4 border-t border-white/20">
                      <p className="text-sm font-semibold">Top Performer</p>
                      <p className="text-xs opacity-90">Mumbai Events</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-600">Deals</h3>
                      <Ticket className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-4xl font-bold text-gray-900 mb-1">{stats.deals}</p>
                    <p className="text-sm text-gray-500">Active bookings</p>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                  <button className="text-sm text-pink-600 font-semibold hover:text-pink-700">
                    View all →
                  </button>
                </div>
                <div className="space-y-4">
                  {users.slice(0, 5).map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {user.displayName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{user.displayName || 'User'}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                          user.role === 'organizer' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Other views remain similar but with updated styling... */}
          {activeView === 'users' && (
            <div className="space-y-6">
              {/* Search and Filter */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users by name or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value as any)}
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900"
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="organizer">Organizer</option>
                    <option value="customer">Customer</option>
                  </select>
                </div>
              </div>

              {/* Users List */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Joined</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredUsers.map(user => (
                        <tr key={user.uid} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                {user.displayName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-gray-900">{user.displayName || 'N/A'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
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
                            <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
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

          {/* Organizers View */}
          {activeView === 'organizers' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {organizers.map(org => (
                <div key={org.uid} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {org.displayName?.charAt(0) || org.email.charAt(0).toUpperCase()}
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      org.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {org.role}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{org.displayName || 'N/A'}</h3>
                  <p className="text-sm text-gray-600 mb-4">{org.email}</p>
                  
                  <div className="pt-4 border-t border-gray-100 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Joined:</span>
                      <span className="font-medium text-gray-900">{new Date(org.createdAt).toLocaleDateString()}</span>
                    </div>
                    {org.role !== 'admin' && (
                      <button
                        onClick={() => handleRemoveOrganizer(org.uid)}
                        className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-xl font-semibold hover:bg-red-100 transition mt-4"
                      >
                        <Ban className="w-4 h-4" />
                        Remove Role
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {organizers.length === 0 && (
                <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-gray-200">
                  <UserCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No Organizers Yet</h3>
                  <p className="text-gray-600 mb-6">Start by adding your first organizer</p>
                  <button
                    onClick={() => setShowAddOrganizer(true)}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition"
                  >
                    <Plus className="w-5 h-5" />
                    Add Organizer
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Approvals View */}
          {activeView === 'approvals' && (
            <div className="space-y-6">
              {pendingApprovals.length > 0 ? (
                pendingApprovals.map(approval => (
                  <div key={approval.id} className="bg-white rounded-2xl p-6 border border-orange-200 hover:shadow-lg transition">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            approval.type === 'create' ? 'bg-green-100 text-green-800' :
                            approval.type === 'edit' ? 'bg-blue-100 text-blue-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {approval.type.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(approval.submittedAt).toLocaleString()}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {approval.changes.title || 'Untitled Event'}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                          {approval.changes.description || 'No description'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl">
                      <div>
                        <div className="text-xs text-gray-500 mb-1 font-medium">Category</div>
                        <div className="font-semibold text-gray-900">{approval.changes.category}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1 font-medium">Venue</div>
                        <div className="font-semibold text-gray-900">{approval.changes.venue}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1 font-medium">Price Range</div>
                        <div className="font-semibold text-gray-900">
                          ₹{approval.changes.minPrice} - ₹{approval.changes.maxPrice}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1 font-medium">Organizer</div>
                        <div className="font-semibold text-gray-900 text-xs truncate">
                          {approval.organizerId.slice(0, 8)}...
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleReviewApproval(approval.id, true)}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 hover:shadow-lg transition"
                      >
                        <Check className="w-5 h-5" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReviewApproval(approval.id, false)}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 hover:shadow-lg transition"
                      >
                        <X className="w-5 h-5" />
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
                  <FileCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">All Caught Up!</h3>
                  <p className="text-gray-600">No pending approvals at the moment</p>
                </div>
              )}
            </div>
          )}

          {/* Analytics View */}
          {activeView === 'analytics' && (
            <div className="space-y-6">
              {/* Chart Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Over Time */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue Trend</h3>
                  <div className="h-64 flex items-end justify-between gap-2">
                    {[45, 52, 38, 65, 72, 58, 88, 92, 85, 95, 78, 89].map((height, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div 
                          className="w-full bg-gradient-to-t from-pink-500 to-purple-600 rounded-t-lg hover:opacity-80 transition cursor-pointer"
                          style={{ height: `${height}%` }}
                        />
                        <span className="text-xs text-gray-500">
                          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Category Performance */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Performance by Category</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'Movies', value: 35, color: 'from-blue-500 to-blue-600' },
                      { name: 'Events', value: 28, color: 'from-purple-500 to-purple-600' },
                      { name: 'Sports', value: 18, color: 'from-green-500 to-green-600' },
                      { name: 'Plays', value: 12, color: 'from-orange-500 to-orange-600' },
                      { name: 'Workshops', value: 7, color: 'from-pink-500 to-pink-600' },
                    ].map((cat, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-gray-900">{cat.name}</span>
                          <span className="text-sm font-bold text-gray-900">{cat.value}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${cat.color} rounded-full transition-all duration-500`}
                            style={{ width: `${cat.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* City Performance */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Top Performing Cities</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { city: 'Mumbai', bookings: 1543, revenue: 2456789, growth: 12.5 },
                    { city: 'Bangalore', bookings: 1287, revenue: 1987654, growth: 8.3 },
                    { city: 'Delhi', bookings: 1156, revenue: 1765432, growth: -2.1 },
                    { city: 'Hyderabad', bookings: 987, revenue: 1456789, growth: 15.7 },
                    { city: 'Chennai', bookings: 856, revenue: 1234567, growth: 5.4 },
                    { city: 'Pune', bookings: 743, revenue: 987654, growth: 9.8 },
                  ].map((city, i) => (
                    <div key={i} className="p-4 bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-gray-900">{city.city}</h4>
                        <div className={`flex items-center gap-1 text-xs font-bold ${
                          city.growth > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {city.growth > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {Math.abs(city.growth)}%
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Bookings</span>
                          <span className="text-sm font-bold text-gray-900">{city.bookings.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Revenue</span>
                          <span className="text-sm font-bold text-gray-900">₹{(city.revenue / 1000).toFixed(0)}K</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Bookings View */}
          {activeView === 'bookings' && (
            <div className="space-y-6">
              {/* Booking Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <Ticket className="w-8 h-8 text-blue-500" />
                    <span className="text-sm font-semibold text-green-600">+24%</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
                  <p className="text-3xl font-bold text-gray-900">3,847</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <DollarSign className="w-8 h-8 text-green-500" />
                    <span className="text-sm font-semibold text-green-600">+18%</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Booking Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">₹5.2M</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <Activity className="w-8 h-8 text-purple-500" />
                    <span className="text-sm font-semibold text-green-600">+7%</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Avg. Booking Value</p>
                  <p className="text-3xl font-bold text-gray-900">₹1,352</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <Award className="w-8 h-8 text-orange-500" />
                    <span className="text-sm font-semibold text-orange-600">Live</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Active Events</p>
                  <p className="text-3xl font-bold text-gray-900">127</p>
                </div>
              </div>

              {/* Recent Bookings */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900">Recent Bookings</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Booking ID</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Event</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Seats</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {[...Array(12)].map((_, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-mono text-gray-600">#BK{10000 + i}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-semibold text-gray-900">Event Name {i + 1}</div>
                            <div className="text-xs text-gray-500">Movies • Mumbai</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">Customer {i + 1}</div>
                            <div className="text-xs text-gray-500">user{i + 1}@example.com</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {new Date(Date.now() - i * 86400000).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                            {Math.floor(Math.random() * 5) + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                            ₹{(Math.random() * 2000 + 500).toFixed(0)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                              i % 3 === 0 ? 'bg-green-100 text-green-800' :
                              i % 3 === 1 ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {i % 3 === 0 ? 'Confirmed' : i % 3 === 1 ? 'Pending' : 'Completed'}
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
        </div>
      </div>

      {/* Add Organizer Modal */}
      {showAddOrganizer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn bg-black/50 backdrop-blur-sm">
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-scaleIn">
            <button
              onClick={() => setShowAddOrganizer(false)}
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Organizer</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  value={newOrganizerEmail}
                  onChange={(e) => setNewOrganizerEmail(e.target.value)}
                  placeholder="organizer@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 placeholder:text-gray-400"
                />
                <p className="text-xs text-gray-500 mt-2">User must be registered first</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={newOrganizerName}
                  onChange={(e) => setNewOrganizerName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Organization (Optional)</label>
                <input
                  type="text"
                  value={newOrganizerOrg}
                  onChange={(e) => setNewOrganizerOrg(e.target.value)}
                  placeholder="Event Company Ltd."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 placeholder:text-gray-400"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddOrganizer(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddOrganizer}
                  disabled={addingOrganizer || !newOrganizerEmail || !newOrganizerName}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
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

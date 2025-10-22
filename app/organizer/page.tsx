'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Calendar, 
  Plus, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Eye,
  Edit,
  Trash2,
  BarChart3,
  Download
} from 'lucide-react'

export default function OrganizerPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'analytics'>('overview')
  
  // Mock data
  const stats = {
    totalEvents: 12,
    activeEvents: 8,
    totalTicketsSold: 3456,
    totalRevenue: 2456789
  }
  
  const myEvents = [
    {
      id: 1,
      title: 'Summer Music Festival 2025',
      category: 'Concert',
      date: '2025-11-15',
      venue: 'Phoenix Arena',
      ticketsSold: 1250,
      totalSeats: 2000,
      revenue: 875000,
      status: 'active'
    },
    {
      id: 2,
      title: 'Stand-up Comedy Night',
      category: 'Comedy',
      date: '2025-10-28',
      venue: 'Laugh Factory',
      ticketsSold: 450,
      totalSeats: 500,
      revenue: 225000,
      status: 'active'
    },
    {
      id: 3,
      title: 'Tech Workshop: AI & ML',
      category: 'Workshop',
      date: '2025-11-05',
      venue: 'Tech Hub',
      ticketsSold: 89,
      totalSeats: 100,
      revenue: 89000,
      status: 'active'
    }
  ]
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Organizer Dashboard</h1>
              <p className="text-white/90">Manage your events and track performance</p>
            </div>
            <div className="flex gap-3">
              <Link 
                href="/organizer/create"
                className="flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition"
              >
                <Plus className="w-5 h-5" />
                Create Event
              </Link>
              <Link 
                href="/profile"
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-lg font-medium transition"
              >
                User View
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="bg-white border-b sticky top-16 z-40 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium transition ${
                activeTab === 'overview'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium transition ${
                activeTab === 'events'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar className="w-5 h-5" />
              My Events
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium transition ${
                activeTab === 'analytics'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              Analytics
            </button>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-primary-500">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-600">Total Events</div>
                  <Calendar className="w-5 h-5 text-primary-500" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{stats.totalEvents}</div>
                <div className="text-sm text-gray-500 mt-1">{stats.activeEvents} active</div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-600">Tickets Sold</div>
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{stats.totalTicketsSold.toLocaleString()}</div>
                <div className="text-sm text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +12% this month
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-600">Total Revenue</div>
                  <DollarSign className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-gray-900">₹{(stats.totalRevenue / 100000).toFixed(1)}L</div>
                <div className="text-sm text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +18% this month
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-600">Avg. Attendance</div>
                  <Users className="w-5 h-5 text-purple-500" />
                </div>
                <div className="text-3xl font-bold text-gray-900">68%</div>
                <div className="text-sm text-gray-500 mt-1">Across all events</div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link 
                  href="/organizer/create"
                  className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition group"
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-200 transition">
                    <Plus className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Create New Event</h3>
                  <p className="text-sm text-gray-600">List a new event and start selling tickets</p>
                </Link>
                
                <button className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition group text-left">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">View Analytics</h3>
                  <p className="text-sm text-gray-600">Track performance and insights</p>
                </button>
                
                <button className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition group text-left">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition">
                    <Download className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Export Reports</h3>
                  <p className="text-sm text-gray-600">Download sales and attendance data</p>
                </button>
              </div>
            </div>
            
            {/* Recent Events */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Recent Events</h2>
                <button 
                  onClick={() => setActiveTab('events')}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  View All →
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {myEvents.slice(0, 3).map(event => (
                  <div key={event.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-gray-900 mb-1">{event.title}</h3>
                          <p className="text-sm text-gray-600">{event.category}</p>
                        </div>
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                          Active
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tickets Sold</span>
                          <span className="font-semibold">{event.ticketsSold}/{event.totalSeats}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full"
                            style={{ width: `${(event.ticketsSold / event.totalSeats) * 100}%` }}
                          />
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Revenue</span>
                          <span className="font-semibold">₹{(event.revenue / 1000).toFixed(0)}K</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button className="flex-1 flex items-center justify-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition">
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-1 bg-primary-100 hover:bg-primary-200 text-primary-700 px-4 py-2 rounded-lg text-sm font-medium transition">
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'events' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Events</h2>
              <Link 
                href="/organizer/create"
                className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition"
              >
                <Plus className="w-5 h-5" />
                Create Event
              </Link>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Event</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Date</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Venue</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Tickets Sold</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Revenue</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Status</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {myEvents.map(event => (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{event.title}</div>
                        <div className="text-sm text-gray-600">{event.category}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(event.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{event.venue}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-semibold text-gray-900">{event.ticketsSold}/{event.totalSeats}</div>
                          <div className="text-gray-600">{Math.round((event.ticketsSold / event.totalSeats) * 100)}% sold</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        ₹{(event.revenue / 1000).toFixed(0)}K
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                            <Eye className="w-4 h-4 text-gray-700" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                            <Edit className="w-4 h-4 text-gray-700" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {activeTab === 'analytics' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics & Insights</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Sales Overview</h3>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center text-gray-500">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                    <p>Chart visualization would go here</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Ticket Sales by Category</h3>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center text-gray-500">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                    <p>Chart visualization would go here</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
                <h3 className="font-semibold text-gray-900 mb-4">Revenue Trends</h3>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center text-gray-500">
                    <TrendingUp className="w-12 h-12 mx-auto mb-2" />
                    <p>Line chart would go here</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


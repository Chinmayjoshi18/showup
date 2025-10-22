'use client'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { User, Ticket, Heart, Settings, MapPin, Calendar, Download, Share2, ChevronRight, Bell, Star, X } from 'lucide-react'
import NotificationPreferencesComponent from '@/components/NotificationPreferences'
import { getWishlistEvents, removeFromWishlist, Event } from '@/lib/data'
import HeartButton from '@/components/HeartButton'

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'bookings' | 'favorites' | 'settings' | 'notifications'>('bookings')
  const [bookings, setBookings] = useState<any[]>([])
  const [favorites, setFavorites] = useState<Event[]>([])
  const [favoritesKey, setFavoritesKey] = useState(0) // Key to force re-render
  
  useEffect(() => {
    const myBookings = JSON.parse(localStorage.getItem('myBookings') || '[]')
    setBookings(myBookings)
    
    // Load favorites
    const wishlistEvents = getWishlistEvents()
    setFavorites(wishlistEvents)
    
    // Check URL params for tab
    const urlParams = new URLSearchParams(window.location.search)
    const tab = urlParams.get('tab')
    if (tab && ['bookings', 'favorites', 'settings', 'notifications'].includes(tab)) {
      setActiveTab(tab as 'bookings' | 'favorites' | 'settings' | 'notifications')
    }
  }, [favoritesKey])
  
  const handleRemoveFavorite = (eventId: string) => {
    removeFromWishlist(eventId)
    setFavoritesKey(prev => prev + 1) // Force re-render
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-primary-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
              <p className="text-white/90">guest@showup.com</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="bg-white border-b sticky top-16 z-40 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium transition ${
                activeTab === 'bookings'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Ticket className="w-5 h-5" />
              My Bookings
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium transition ${
                activeTab === 'favorites'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Heart className="w-5 h-5" />
              Favorites
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium transition ${
                activeTab === 'settings'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Settings className="w-5 h-5" />
              Settings
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium transition ${
                activeTab === 'notifications'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Bell className="w-5 h-5" />
              Notifications
            </button>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'bookings' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
              <div className="text-sm text-gray-600">{bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'}</div>
            </div>
            
            {bookings.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="text-6xl mb-4">🎫</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No bookings yet</h3>
                <p className="text-gray-600 mb-6">Start exploring events and book your first experience!</p>
                <Link 
                  href="/browse"
                  className="inline-block bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition"
                >
                  Browse Events
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {bookings.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition">
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Event Image */}
                        <div className="w-full md:w-48 h-64 md:h-auto rounded-lg overflow-hidden flex-shrink-0">
                          <img 
                            src={booking.event.image} 
                            alt={booking.event.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Booking Details */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-2xl font-bold text-gray-900 mb-2">{booking.event.title}</h3>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {booking.event.venue}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(booking.date).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                                <Share2 className="w-5 h-5 text-gray-700" />
                              </button>
                              <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                                <Download className="w-5 h-5 text-gray-700" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <div className="text-sm text-gray-500">Booking ID</div>
                              <div className="font-semibold text-gray-900">{booking.id}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Show Time</div>
                              <div className="font-semibold text-gray-900">{booking.time}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Tickets</div>
                              <div className="font-semibold text-gray-900">{booking.seats.length}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Total Paid</div>
                              <div className="font-semibold text-gray-900">₹{(booking.total + Math.round(booking.total * 0.05)).toLocaleString()}</div>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <div className="text-sm text-gray-500 mb-1">Seat Numbers</div>
                            <div className="flex flex-wrap gap-2">
                              {booking.seats.map((seat: any) => (
                                <span key={seat.id} className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                                  {seat.id}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between pt-4 border-t">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                              <span className="text-sm font-medium text-green-700">Confirmed</span>
                            </div>
                            <button className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition">
                              View Tickets
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* QR Code Section */}
                    <div className="bg-gray-50 px-6 py-4 border-t">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center border">
                            <div className="text-xs text-center">QR<br/>Code</div>
                          </div>
                          <div className="text-sm text-gray-600">
                            Show this QR code at the venue for entry
                          </div>
                        </div>
                        <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition">
                          Download Ticket
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'favorites' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Favorites</h2>
              <div className="text-sm text-gray-600">{favorites.length} {favorites.length === 1 ? 'event' : 'events'}</div>
            </div>
            
            {favorites.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="text-6xl mb-4">❤️</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No favorites yet</h3>
                <p className="text-gray-600 mb-6">Save events you're interested in to find them easily later</p>
                <Link 
                  href="/browse"
                  className="inline-block bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition"
                >
                  Discover Events
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {favorites.map((event) => (
                  <div key={event.id} className="group animate-fadeIn">
                    <Link href={`/event/${event.id}`}>
                      <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        <img 
                          src={event.image} 
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Remove Button */}
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleRemoveFavorite(event.id)
                          }}
                          className="absolute top-2 right-2 z-10 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition-all transform hover:scale-110"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                        
                        {event.rating && (
                          <div className="absolute bottom-2 left-2 right-2 glass-dark text-white px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-current text-yellow-400" />
                              <span className="font-bold">{event.rating}</span>/10
                            </span>
                            <span>{event.votes?.toLocaleString()} votes</span>
                          </div>
                        )}
                      </div>
                    </Link>
                    
                    <Link href={`/event/${event.id}`}>
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-primary-600 transition">
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{event.genre.join(', ')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 mt-1">
                        <span>₹{event.price.min.toLocaleString()}</span>
                        {event.price.max > event.price.min && (
                          <span className="text-gray-500">- ₹{event.price.max.toLocaleString()}</span>
                        )}
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  defaultValue="Guest User"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 placeholder:text-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  defaultValue="guest@showup.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 placeholder:text-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  defaultValue="+91 9876543210"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 placeholder:text-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred City</label>
                <select className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900">
                  <option>Mumbai</option>
                  <option>Delhi</option>
                  <option>Bangalore</option>
                  <option>Hyderabad</option>
                  <option>Chennai</option>
                </select>
              </div>
              
              <div className="pt-6 border-t">
                <h3 className="font-semibold text-gray-900 mb-4">Notifications</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="w-5 h-5 text-primary-600 rounded" />
                    <span className="text-gray-700">Email notifications for new events</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="w-5 h-5 text-primary-600 rounded" />
                    <span className="text-gray-700">SMS notifications for bookings</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="w-5 h-5 text-primary-600 rounded" />
                    <span className="text-gray-700">Promotional offers and discounts</span>
                  </label>
                </div>
              </div>
              
              <div className="pt-6 flex gap-4">
                <button className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition">
                  Save Changes
                </button>
                <button className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'notifications' && (
          <div>
            <NotificationPreferencesComponent />
          </div>
        )}
      </div>
    </div>
  )
}


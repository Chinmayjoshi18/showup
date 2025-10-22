'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MapPin, Search, Menu, X, User, Ticket, LogOut } from 'lucide-react'
import LocationModal from './LocationModal'
import SearchBar from './SearchBar'
import NotificationCenter from './NotificationCenter'
import { useAuth } from '@/contexts/AuthContext'
import { signOut as firebaseSignOut } from '@/lib/firebase/auth'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedCity, setSelectedCity] = useState('Mumbai')
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  
  useEffect(() => {
    const savedCity = localStorage.getItem('selectedCity')
    if (savedCity) {
      setSelectedCity(savedCity)
    }
  }, [])
  
  const handleSelectCity = (city: string) => {
    setSelectedCity(city)
    localStorage.setItem('selectedCity', city)
  }
  
  const handleSignOut = async () => {
    try {
      await firebaseSignOut()
      setShowUserMenu(false)
      router.push('/')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-[1920px] mx-auto">
          <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <Ticket className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              ShowUp
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link href="/browse?category=movies" className="text-gray-700 hover:text-primary-600 transition font-medium whitespace-nowrap">
              Movies
            </Link>
            <Link href="/browse?category=events" className="text-gray-700 hover:text-primary-600 transition font-medium whitespace-nowrap">
              Events
            </Link>
            <Link href="/browse?category=sports" className="text-gray-700 hover:text-primary-600 transition font-medium whitespace-nowrap">
              Sports
            </Link>
            <Link href="/browse?category=plays" className="text-gray-700 hover:text-primary-600 transition font-medium whitespace-nowrap">
              Plays & Comedy
            </Link>
          </div>

          {/* Search and Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {/* City Selector */}
            <button
              onClick={() => setShowLocationModal(true)}
              className="flex items-center gap-1.5 text-gray-700 hover:text-primary-600 transition whitespace-nowrap"
            >
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">{selectedCity}</span>
            </button>

            {/* Search */}
            <div className="hidden xl:block">
              <SearchBar />
            </div>

            {/* Notifications */}
            <NotificationCenter />

            {/* User Menu / Sign In */}
            {!loading && (
              <>
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-full transition"
                    >
                      {user.photoURL ? (
                        <img 
                          src={user.photoURL} 
                          alt={user.displayName || 'User'} 
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </button>
                    
                    {/* User Dropdown */}
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 animate-fadeIn z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900">{user.displayName || 'User'}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        <Link 
                          href="/profile" 
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-700">My Profile</span>
                        </Link>
                        <Link 
                          href="/profile?tab=bookings" 
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Ticket className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-700">My Bookings</span>
                        </Link>
                        <button 
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition text-left border-t border-gray-100 mt-1"
                        >
                          <LogOut className="w-4 h-4 text-red-600" />
                          <span className="text-sm text-red-600 font-medium">Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/signin"
                    className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-5 py-2 rounded-lg font-semibold hover:shadow-lg transition whitespace-nowrap"
                  >
                    Sign In
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-3 space-y-3">
            {/* Mobile Search */}
            <div className="pb-3 border-b">
              <SearchBar isMobile onClose={() => setIsMenuOpen(false)} />
            </div>
            
            <Link href="/browse?category=movies" className="block py-2 text-gray-700">
              Movies
            </Link>
            <Link href="/browse?category=events" className="block py-2 text-gray-700">
              Events
            </Link>
            <Link href="/browse?category=sports" className="block py-2 text-gray-700">
              Sports
            </Link>
            <Link href="/browse?category=plays" className="block py-2 text-gray-700">
              Plays & Comedy
            </Link>
            <div className="pt-3 border-t">
              <button
                onClick={() => setShowLocationModal(true)}
                className="w-full flex items-center justify-center gap-2 bg-gray-100 rounded-lg px-4 py-2 text-sm font-medium"
              >
                <MapPin className="w-4 h-4" />
                {selectedCity}
              </button>
            </div>
            <Link 
              href="/signin" 
              className="block w-full text-center bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-2 rounded-lg font-medium"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
      
      {/* Location Modal */}
      <LocationModal
        isOpen={showLocationModal}
        onSelectCity={handleSelectCity}
        onClose={() => setShowLocationModal(false)}
      />
    </nav>
  )
}


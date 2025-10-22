'use client'

import { useState, useEffect } from 'react'
import { MapPin, X } from 'lucide-react'

interface LocationModalProps {
  isOpen: boolean
  onSelectCity: (city: string) => void
  onClose: () => void
}

export default function LocationModal({ isOpen, onSelectCity, onClose }: LocationModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  
  // Comprehensive list of Indian cities - Tier 1, Tier 2, and Tier 3
  const cities = [
    // Tier 1 Cities
    { name: 'Mumbai', icon: '🏙️', tier: 1 },
    { name: 'Delhi-NCR', icon: '🏛️', tier: 1 },
    { name: 'Bangalore', icon: '💼', tier: 1 },
    { name: 'Hyderabad', icon: '🏰', tier: 1 },
    { name: 'Ahmedabad', icon: '🕌', tier: 1 },
    { name: 'Chennai', icon: '🏖️', tier: 1 },
    { name: 'Kolkata', icon: '📚', tier: 1 },
    { name: 'Pune', icon: '🎓', tier: 1 },
    
    // Tier 2 Cities
    { name: 'Surat', icon: '💎', tier: 2 },
    { name: 'Jaipur', icon: '🏰', tier: 2 },
    { name: 'Lucknow', icon: '🕌', tier: 2 },
    { name: 'Kanpur', icon: '🏭', tier: 2 },
    { name: 'Nagpur', icon: '🍊', tier: 2 },
    { name: 'Indore', icon: '🏛️', tier: 2 },
    { name: 'Thane', icon: '🏙️', tier: 2 },
    { name: 'Bhopal', icon: '🏞️', tier: 2 },
    { name: 'Visakhapatnam', icon: '🚢', tier: 2 },
    { name: 'Pimpri-Chinchwad', icon: '🏭', tier: 2 },
    { name: 'Patna', icon: '📚', tier: 2 },
    { name: 'Vadodara', icon: '🎨', tier: 2 },
    { name: 'Ghaziabad', icon: '🏘️', tier: 2 },
    { name: 'Ludhiana', icon: '🧵', tier: 2 },
    { name: 'Agra', icon: '🕌', tier: 2 },
    { name: 'Nashik', icon: '🍇', tier: 2 },
    { name: 'Faridabad', icon: '🏘️', tier: 2 },
    { name: 'Meerut', icon: '🏛️', tier: 2 },
    { name: 'Rajkot', icon: '🏭', tier: 2 },
    { name: 'Varanasi', icon: '🕉️', tier: 2 },
    { name: 'Srinagar', icon: '🏔️', tier: 2 },
    { name: 'Amritsar', icon: '🕌', tier: 2 },
    { name: 'Chandigarh', icon: '🌳', tier: 2 },
    { name: 'Kochi', icon: '🌴', tier: 2 },
    { name: 'Coimbatore', icon: '🏭', tier: 2 },
    { name: 'Madurai', icon: '🕌', tier: 2 },
    { name: 'Jodhpur', icon: '🏰', tier: 2 },
    { name: 'Guwahati', icon: '🌊', tier: 2 },
    { name: 'Bhubaneswar', icon: '🕌', tier: 2 },
    { name: 'Dehradun', icon: '⛰️', tier: 2 },
    { name: 'Mysore', icon: '🏰', tier: 2 },
    { name: 'Raipur', icon: '🏭', tier: 2 },
    { name: 'Ranchi', icon: '🏞️', tier: 2 },
    { name: 'Jabalpur', icon: '💧', tier: 2 },
    { name: 'Gwalior', icon: '🏰', tier: 2 },
    { name: 'Vijayawada', icon: '🏞️', tier: 2 },
    { name: 'Tirupati', icon: '🕉️', tier: 2 },
    { name: 'Udaipur', icon: '🏰', tier: 2 },
    { name: 'Mangalore', icon: '🌊', tier: 2 },
    { name: 'Aurangabad', icon: '🏛️', tier: 2 },
    { name: 'Thiruvananthapuram', icon: '🌴', tier: 2 },
    
    // Tier 3 Cities
    { name: 'Allahabad', icon: '🕉️', tier: 3 },
    { name: 'Jammu', icon: '🏔️', tier: 3 },
    { name: 'Jamshedpur', icon: '🏭', tier: 3 },
    { name: 'Guntur', icon: '🌾', tier: 3 },
    { name: 'Warangal', icon: '🏛️', tier: 3 },
    { name: 'Hubli-Dharwad', icon: '🏙️', tier: 3 },
    { name: 'Belgaum', icon: '🌳', tier: 3 },
    { name: 'Jalandhar', icon: '🏭', tier: 3 },
    { name: 'Shimla', icon: '🏔️', tier: 3 },
    { name: 'Kolhapur', icon: '👑', tier: 3 },
    { name: 'Gorakhpur', icon: '🕉️', tier: 3 },
    { name: 'Cuttack', icon: '🏛️', tier: 3 },
    { name: 'Kota', icon: '📚', tier: 3 },
    { name: 'Bikaner', icon: '🐪', tier: 3 },
    { name: 'Ajmer', icon: '🕌', tier: 3 },
    { name: 'Siliguri', icon: '🏔️', tier: 3 },
    { name: 'Nanded', icon: '🕉️', tier: 3 },
    { name: 'Imphal', icon: '🌸', tier: 3 },
    { name: 'Shillong', icon: '🏔️', tier: 3 },
    { name: 'Agartala', icon: '🌳', tier: 3 },
    { name: 'Rourkela', icon: '🏭', tier: 3 },
    { name: 'Durgapur', icon: '🏭', tier: 3 },
    { name: 'Asansol', icon: '🏭', tier: 3 },
    { name: 'Dhanbad', icon: '⛏️', tier: 3 },
    { name: 'Bhilai', icon: '🏭', tier: 3 },
    { name: 'Amravati', icon: '🌾', tier: 3 },
    { name: 'Nellore', icon: '🌾', tier: 3 },
    { name: 'Kurnool', icon: '🏞️', tier: 3 },
    { name: 'Rajahmundry', icon: '🌊', tier: 3 },
    { name: 'Tirunelveli', icon: '🕌', tier: 3 },
    { name: 'Salem', icon: '🏭', tier: 3 },
    { name: 'Vellore', icon: '🏥', tier: 3 },
    { name: 'Erode', icon: '🌾', tier: 3 },
    { name: 'Thrissur', icon: '🎭', tier: 3 },
    { name: 'Kozhikode', icon: '🌊', tier: 3 },
    { name: 'Kollam', icon: '🌴', tier: 3 }
  ]
  
  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  // Show top 16 popular cities when no search query
  const popularCities = cities.filter(city => city.tier <= 2).slice(0, 16)
  const citiesToShow = searchQuery ? filteredCities : popularCities
  
  const handleSelectCity = (cityName: string) => {
    onSelectCity(cityName)
    onClose()
  }
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-20 animate-fadeIn overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-all duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden animate-slideDown transform">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-primary-50 to-secondary-50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold gradient-text">Select Your City</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:shadow-md rounded-full transition-all duration-200 transform hover:rotate-90"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative group">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
            <input
              type="text"
              placeholder="Search for your city"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md text-gray-900 placeholder:text-gray-400"
            />
          </div>
          
          {/* Detect Location */}
          <button className="mt-4 flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium group transition-all duration-200 hover:gap-3">
            <MapPin className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="relative">
              Detect my location
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"></span>
            </span>
          </button>
        </div>
        
        {/* Cities Grid */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-220px)]">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            {searchQuery ? `Results for "${searchQuery}"` : 'Popular Cities'}
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {citiesToShow.map((city, index) => (
              <button
                key={city.name}
                onClick={() => handleSelectCity(city.name)}
                style={{ animationDelay: `${index * 30}ms` }}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl border-2 border-gray-200 hover:border-primary-500 hover:bg-gradient-to-br hover:from-primary-50 hover:to-secondary-50 transition-all duration-300 group transform hover:scale-105 hover:shadow-lg animate-fadeIn"
              >
                <div className="text-4xl transform group-hover:scale-110 transition-transform duration-300">{city.icon}</div>
                <span className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                  {city.name}
                </span>
              </button>
            ))}
          </div>
          
          {citiesToShow.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No cities found matching "{searchQuery}"
            </div>
          )}
          
          {/* Show total cities count */}
          {!searchQuery && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-3">
                Showing {popularCities.length} of {cities.length} cities
              </p>
              <p className="text-xs text-gray-500">
                💡 Search above to find more cities across India
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


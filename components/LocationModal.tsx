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
    { name: 'Mumbai', tier: 1 },
    { name: 'Delhi-NCR', tier: 1 },
    { name: 'Bangalore', tier: 1 },
    { name: 'Hyderabad', tier: 1 },
    { name: 'Ahmedabad', tier: 1 },
    { name: 'Chennai', tier: 1 },
    { name: 'Kolkata', tier: 1 },
    { name: 'Pune', tier: 1 },
    
    // Tier 2 Cities
    { name: 'Surat', tier: 2 },
    { name: 'Jaipur', tier: 2 },
    { name: 'Lucknow', tier: 2 },
    { name: 'Kanpur', tier: 2 },
    { name: 'Nagpur', tier: 2 },
    { name: 'Indore', tier: 2 },
    { name: 'Thane', tier: 2 },
    { name: 'Bhopal', tier: 2 },
    { name: 'Visakhapatnam', tier: 2 },
    { name: 'Pimpri-Chinchwad', tier: 2 },
    { name: 'Patna', tier: 2 },
    { name: 'Vadodara', tier: 2 },
    { name: 'Ghaziabad', tier: 2 },
    { name: 'Ludhiana', tier: 2 },
    { name: 'Agra', tier: 2 },
    { name: 'Nashik', tier: 2 },
    { name: 'Faridabad', tier: 2 },
    { name: 'Meerut', tier: 2 },
    { name: 'Rajkot', tier: 2 },
    { name: 'Varanasi', tier: 2 },
    { name: 'Srinagar', tier: 2 },
    { name: 'Amritsar', tier: 2 },
    { name: 'Chandigarh', tier: 2 },
    { name: 'Kochi', tier: 2 },
    { name: 'Coimbatore', tier: 2 },
    { name: 'Madurai', tier: 2 },
    { name: 'Jodhpur', tier: 2 },
    { name: 'Guwahati', tier: 2 },
    { name: 'Bhubaneswar', tier: 2 },
    { name: 'Dehradun', tier: 2 },
    { name: 'Mysore', tier: 2 },
    { name: 'Raipur', tier: 2 },
    { name: 'Ranchi', tier: 2 },
    { name: 'Jabalpur', tier: 2 },
    { name: 'Gwalior', tier: 2 },
    { name: 'Vijayawada', tier: 2 },
    { name: 'Tirupati', tier: 2 },
    { name: 'Udaipur', tier: 2 },
    { name: 'Mangalore', tier: 2 },
    { name: 'Aurangabad', tier: 2 },
    { name: 'Thiruvananthapuram', tier: 2 },
    
    // Tier 3 Cities
    { name: 'Allahabad', tier: 3 },
    { name: 'Jammu', tier: 3 },
    { name: 'Jamshedpur', tier: 3 },
    { name: 'Guntur', tier: 3 },
    { name: 'Warangal', tier: 3 },
    { name: 'Hubli-Dharwad', tier: 3 },
    { name: 'Belgaum', tier: 3 },
    { name: 'Jalandhar', tier: 3 },
    { name: 'Shimla', tier: 3 },
    { name: 'Kolhapur', tier: 3 },
    { name: 'Gorakhpur', tier: 3 },
    { name: 'Cuttack', tier: 3 },
    { name: 'Kota', tier: 3 },
    { name: 'Bikaner', tier: 3 },
    { name: 'Ajmer', tier: 3 },
    { name: 'Siliguri', tier: 3 },
    { name: 'Nanded', tier: 3 },
    { name: 'Imphal', tier: 3 },
    { name: 'Shillong', tier: 3 },
    { name: 'Agartala', tier: 3 },
    { name: 'Rourkela', tier: 3 },
    { name: 'Durgapur', tier: 3 },
    { name: 'Asansol', tier: 3 },
    { name: 'Dhanbad', tier: 3 },
    { name: 'Bhilai', tier: 3 },
    { name: 'Amravati', tier: 3 },
    { name: 'Nellore', tier: 3 },
    { name: 'Kurnool', tier: 3 },
    { name: 'Rajahmundry', tier: 3 },
    { name: 'Tirunelveli', tier: 3 },
    { name: 'Salem', tier: 3 },
    { name: 'Vellore', tier: 3 },
    { name: 'Erode', tier: 3 },
    { name: 'Thrissur', tier: 3 },
    { name: 'Kozhikode', tier: 3 },
    { name: 'Kollam', tier: 3 }
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
                    className="flex items-center justify-center p-4 rounded-2xl border-2 border-gray-200 hover:border-primary-500 hover:bg-gradient-to-br hover:from-primary-50 hover:to-secondary-50 transition-all duration-300 group transform hover:scale-105 hover:shadow-lg animate-fadeIn"
                  >
                    <span className="text-base font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
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


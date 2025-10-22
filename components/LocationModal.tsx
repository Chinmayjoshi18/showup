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
  
  const cities = [
    { name: 'Mumbai', icon: '🏙️' },
    { name: 'Delhi-NCR', icon: '🏛️' },
    { name: 'Bangalore', icon: '💼' },
    { name: 'Hyderabad', icon: '🏰' },
    { name: 'Ahmedabad', icon: '🕌' },
    { name: 'Chandigarh', icon: '🌳' },
    { name: 'Chennai', icon: '🏖️' },
    { name: 'Pune', icon: '🎓' },
    { name: 'Kolkata', icon: '📚' },
    { name: 'Kochi', icon: '🌴' }
  ]
  
  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  const handleSelectCity = (cityName: string) => {
    onSelectCity(cityName)
    onClose()
  }
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-all duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden animate-scaleIn transform">
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
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
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
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-200px)]">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Popular Cities
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredCities.map((city, index) => (
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
          
          {filteredCities.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No cities found matching "{searchQuery}"
            </div>
          )}
          
          {/* View All Cities */}
          <button className="mt-6 w-full text-center text-primary-600 hover:text-primary-700 font-medium py-2">
            View All Cities →
          </button>
        </div>
      </div>
    </div>
  )
}


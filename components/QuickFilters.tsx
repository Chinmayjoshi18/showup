'use client'

import { useState, useEffect } from 'react'
import { X, Filter, MapPin, Calendar, DollarSign, Star, ChevronRight } from 'lucide-react'

interface QuickFiltersProps {
  isOpen: boolean
  onClose: () => void
  onApplyFilters: (filters: FilterOptions) => void
}

export interface FilterOptions {
  categories: string[]
  cities: string[]
  priceRange: { min: number; max: number }
  dateRange: 'today' | 'tomorrow' | 'weekend' | 'all'
  rating?: number
}

export default function QuickFilters({ isOpen, onClose, onApplyFilters }: QuickFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    cities: [],
    priceRange: { min: 0, max: 10000 },
    dateRange: 'all'
  })

  const categories = [
    { id: 'movies', label: '🎬 Movies' },
    { id: 'events', label: '🎵 Events' },
    { id: 'sports', label: '⚽ Sports' },
    { id: 'plays', label: '🎭 Plays & Comedy' },
    { id: 'workshops', label: '🎓 Workshops' }
  ]

  const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 
    'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow'
  ]

  const priceRanges = [
    { label: 'Under ₹500', min: 0, max: 500 },
    { label: '₹500 - ₹1000', min: 500, max: 1000 },
    { label: '₹1000 - ₹2000', min: 1000, max: 2000 },
    { label: '₹2000 - ₹5000', min: 2000, max: 5000 },
    { label: 'Above ₹5000', min: 5000, max: 100000 }
  ]

  const dateOptions = [
    { value: 'today', label: 'Today' },
    { value: 'tomorrow', label: 'Tomorrow' },
    { value: 'weekend', label: 'This Weekend' },
    { value: 'all', label: 'All Dates' }
  ]

  const toggleCategory = (categoryId: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(c => c !== categoryId)
        : [...prev.categories, categoryId]
    }))
  }

  const toggleCity = (city: string) => {
    setFilters(prev => ({
      ...prev,
      cities: prev.cities.includes(city)
        ? prev.cities.filter(c => c !== city)
        : [...prev.cities, city]
    }))
  }

  const handleApply = () => {
    onApplyFilters(filters)
    onClose()
  }

  const handleClear = () => {
    setFilters({
      categories: [],
      cities: [],
      priceRange: { min: 0, max: 10000 },
      dateRange: 'all'
    })
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 md:hidden animate-fadeIn"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl max-h-[85vh] overflow-hidden md:hidden animate-slideUp">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-bold text-gray-900">Filters</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-6 py-4 pb-32 space-y-6" style={{ maxHeight: 'calc(85vh - 140px)' }}>
          {/* Categories */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span>Categories</span>
              {filters.categories.length > 0 && (
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
                  {filters.categories.length}
                </span>
              )}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => toggleCategory(category.id)}
                  className={`
                    p-3 rounded-xl border-2 font-medium text-sm transition-all
                    ${filters.categories.includes(category.id)
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cities */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Cities</span>
              {filters.cities.length > 0 && (
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
                  {filters.cities.length}
                </span>
              )}
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => toggleCity(city)}
                  className={`
                    px-3 py-2 rounded-lg border font-medium text-xs transition-all
                    ${filters.cities.includes(city)
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span>Price Range</span>
            </h3>
            <div className="space-y-2">
              {priceRanges.map((range) => (
                <button
                  key={range.label}
                  onClick={() => setFilters(prev => ({ ...prev, priceRange: { min: range.min, max: range.max } }))}
                  className={`
                    w-full p-3 rounded-lg border text-left font-medium text-sm transition-all
                    flex items-center justify-between
                    ${filters.priceRange.min === range.min && filters.priceRange.max === range.max
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <span>{range.label}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>When</span>
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {dateOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilters(prev => ({ ...prev, dateRange: option.value as any }))}
                  className={`
                    p-3 rounded-lg border font-medium text-sm transition-all
                    ${filters.dateRange === option.value
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex gap-3">
          <button
            onClick={handleClear}
            className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            Clear All
          </button>
          <button
            onClick={handleApply}
            className="flex-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  )
}


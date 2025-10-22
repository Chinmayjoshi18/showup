'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Film, Music, Trophy, Theater, GraduationCap, Star, MapPin, Calendar, Filter } from 'lucide-react'
import { events, getEventsByCategory } from '@/lib/data'

export default function BrowsePage() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')
  
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'all')
  const [selectedGenre, setSelectedGenre] = useState<string>('all')
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('featured')
  
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
  }, [categoryParam])
  
  const categories = [
    { id: 'all', label: 'All Events', icon: Filter },
    { id: 'movies', label: 'Movies', icon: Film },
    { id: 'events', label: 'Events', icon: Music },
    { id: 'sports', label: 'Sports', icon: Trophy },
    { id: 'plays', label: 'Plays & Comedy', icon: Theater },
    { id: 'workshops', label: 'Workshops', icon: GraduationCap }
  ]
  
  // Get filtered events
  let filteredEvents = getEventsByCategory(selectedCategory === 'all' ? undefined : selectedCategory)
  
  // Apply genre filter
  if (selectedGenre !== 'all') {
    filteredEvents = filteredEvents.filter(event => 
      event.genre.some(g => g.toLowerCase() === selectedGenre.toLowerCase())
    )
  }
  
  // Apply language filter
  if (selectedLanguage !== 'all') {
    filteredEvents = filteredEvents.filter(event => 
      event.language?.toLowerCase() === selectedLanguage.toLowerCase()
    )
  }
  
  // Apply sorting
  if (sortBy === 'featured') {
    filteredEvents = [...filteredEvents].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
  } else if (sortBy === 'price-low') {
    filteredEvents = [...filteredEvents].sort((a, b) => a.price.min - b.price.min)
  } else if (sortBy === 'price-high') {
    filteredEvents = [...filteredEvents].sort((a, b) => b.price.max - a.price.max)
  } else if (sortBy === 'rating') {
    filteredEvents = [...filteredEvents].sort((a, b) => (b.rating || 0) - (a.rating || 0))
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-12">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Discover Events</h1>
          <p className="text-lg text-white/90">Find the best entertainment experiences in your city</p>
        </div>
      </div>
      
      {/* Category Tabs */}
      <div className="bg-white border-b sticky top-16 z-40 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
            {categories.map(category => {
              const Icon = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {category.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-4">Filters</h3>
              
              {/* Sort By */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="featured">Featured</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
              
              {/* Genre Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Genres</option>
                  <option value="action">Action</option>
                  <option value="comedy">Comedy</option>
                  <option value="drama">Drama</option>
                  <option value="sci-fi">Sci-Fi</option>
                  <option value="rock">Rock</option>
                  <option value="edm">EDM</option>
                  <option value="cricket">Cricket</option>
                  <option value="football">Football</option>
                </select>
              </div>
              
              {/* Language Filter (for movies) */}
              {selectedCategory === 'movies' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="all">All Languages</option>
                    <option value="english">English</option>
                    <option value="hindi">Hindi</option>
                    <option value="tamil">Tamil</option>
                    <option value="telugu">Telugu</option>
                  </select>
                </div>
              )}
              
              <button 
                onClick={() => {
                  setSelectedGenre('all')
                  setSelectedLanguage('all')
                  setSortBy('featured')
                }}
                className="w-full text-primary-600 font-medium hover:text-primary-700 transition"
              >
                Clear All Filters
              </button>
            </div>
          </aside>
          
          {/* Events Grid */}
          <div className="flex-1">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {filteredEvents.length} {filteredEvents.length === 1 ? 'Event' : 'Events'} Found
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredEvents.map(event => (
                <Link 
                  key={event.id}
                  href={`/event/${event.id}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  {/* Image */}
                  <div className="relative h-80 overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {event.featured && (
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                        <Star className="w-4 h-4 fill-current" />
                        Featured
                      </div>
                    )}
                    {event.rating && (
                      <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                        <Star className="w-4 h-4 fill-current text-yellow-400" />
                        {event.rating}/10
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition">
                      {event.title}
                    </h3>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {event.genre.slice(0, 3).map(genre => (
                        <span key={genre} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                          {genre}
                        </span>
                      ))}
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{event.venue}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{event.dates.length} {event.dates.length === 1 ? 'show' : 'shows'} available</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-500">Starting from</div>
                        <div className="text-2xl font-bold text-gray-900">₹{event.price.min}</div>
                      </div>
                      <button className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition">
                        Book Now
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {filteredEvents.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🎭</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No events found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or check back later for new events</p>
                <button
                  onClick={() => {
                    setSelectedCategory('all')
                    setSelectedGenre('all')
                    setSelectedLanguage('all')
                  }}
                  className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition"
                >
                  View All Events
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


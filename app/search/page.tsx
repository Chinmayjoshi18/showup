'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Star, MapPin, Calendar, Search, SlidersHorizontal } from 'lucide-react'
import { searchEvents } from '@/lib/data'

// Disable static generation for this page
export const dynamic = 'force-dynamic'

function SearchPageContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [results, setResults] = useState<any[]>([])
  const [filteredResults, setFilteredResults] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('relevance')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    if (query) {
      const searchResults = searchEvents(query)
      setResults(searchResults)
      setFilteredResults(searchResults)
    }
  }, [query])

  useEffect(() => {
    let filtered = [...results]

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(event => event.category === selectedCategory)
    }

    // Sort results
    if (sortBy === 'rating') {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    } else if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price.min - b.price.min)
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price.max - a.price.max)
    }

    setFilteredResults(filtered)
  }, [results, selectedCategory, sortBy])

  const categories = [
    { id: 'all', label: 'All Results' },
    { id: 'movies', label: 'Movies' },
    { id: 'events', label: 'Events' },
    { id: 'sports', label: 'Sports' },
    { id: 'plays', label: 'Plays & Comedy' },
    { id: 'workshops', label: 'Workshops' }
  ]

  if (!query) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Start Searching</h2>
          <p className="text-gray-600">Use the search bar above to find events</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Search Results for "{query}"
              </h1>
              <p className="text-gray-600 mt-1">
                Found {filteredResults.length} {filteredResults.length === 1 ? 'result' : 'results'}
              </p>
            </div>
            
            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg font-medium transition"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all transform hover:scale-105 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
                {category.id !== 'all' && (
                  <span className="ml-2 text-xs opacity-75">
                    ({results.filter(e => e.category === category.id).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5" />
                Filters
              </h3>
              
              {/* Sort By */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="relevance">Relevance</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setSelectedCategory('all')
                  setSortBy('relevance')
                }}
                className="w-full text-primary-600 font-medium hover:text-primary-700 transition"
              >
                Clear All Filters
              </button>
            </div>
          </aside>

          {/* Results Grid */}
          <div className="flex-1">
            {filteredResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResults.map((event, index) => (
                  <Link
                    key={event.id}
                    href={`/event/${event.id}`}
                    className="group animate-fadeIn"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                      {/* Image */}
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {event.featured && (
                          <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-2 py-1 rounded-md text-xs font-bold shadow-lg">
                            ⭐ Featured
                          </div>
                        )}
                        {event.rating && (
                          <div className="absolute bottom-2 left-2 right-2 glass-dark text-white px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-current text-yellow-400" />
                              <span className="font-bold">{event.rating}</span>/10
                            </span>
                            <span className="text-xs text-white/80">{event.votes?.toLocaleString()}</span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                          {event.title}
                        </h3>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {event.genre.slice(0, 3).map((genre: string) => (
                            <span key={genre} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                              {genre}
                            </span>
                          ))}
                        </div>

                        <div className="space-y-2 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{event.venue}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 flex-shrink-0" />
                            <span>{event.dates.length} {event.dates.length === 1 ? 'show' : 'shows'} available</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t">
                          <div>
                            <div className="text-xs text-gray-500">Starting from</div>
                            <div className="text-lg font-bold text-gray-900">₹{event.price.min}</div>
                          </div>
                          <button className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition text-sm">
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              /* No Results */
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find any events matching "{query}" in {selectedCategory === 'all' ? 'any category' : `${categories.find(c => c.id === selectedCategory)?.label}`}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-medium transition"
                  >
                    View All Categories
                  </button>
                  <Link
                    href="/browse"
                    className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition"
                  >
                    Browse All Events
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Wrap with Suspense for useSearchParams
export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading search results...</p>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  )
}


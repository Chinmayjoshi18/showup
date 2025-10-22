'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Star, MapPin, Calendar, Gift, Filter } from 'lucide-react'
import { events, getFeaturedEvents, getFeaturedCoupons } from '@/lib/data'
import LocationModal from '@/components/LocationModal'
import OfferBanner from '@/components/OfferBanner'
import HeartButton from '@/components/HeartButton'
import PullToRefresh from '@/components/PullToRefresh'
import QuickFilters, { FilterOptions } from '@/components/QuickFilters'

// Force dynamic rendering - no static generation
export const dynamic = 'force-dynamic'

export default function Home() {
  const [selectedCity, setSelectedCity] = useState('')
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  
  useEffect(() => {
    // Check if city is already selected
    const savedCity = localStorage.getItem('selectedCity')
    if (savedCity) {
      setSelectedCity(savedCity)
    } else {
      // Show location modal on first visit
      setShowLocationModal(true)
    }
  }, [])
  
  const handleSelectCity = (city: string) => {
    setSelectedCity(city)
    localStorage.setItem('selectedCity', city)
  }
  
  const handleRefresh = async () => {
    // Simulate refresh - in real app, would fetch new data
    await new Promise(resolve => setTimeout(resolve, 1000))
    setRefreshKey(prev => prev + 1)
  }
  
  const handleApplyFilters = (filters: FilterOptions) => {
    // Apply filters logic here
    console.log('Filters applied:', filters)
    // You can filter events based on the filters object
  }
  
  const categories = [
    { id: 'all', label: 'All' },
    { id: 'movies', label: 'Movies' },
    { id: 'events', label: 'Events' },
    { id: 'sports', label: 'Sports' },
    { id: 'plays', label: 'Plays' },
    { id: 'workshops', label: 'Workshops' }
  ]
  
  // Filter events
  let filteredEvents = selectedCategory === 'all' 
    ? events 
    : events.filter(event => event.category === selectedCategory)
  
  // Get featured events for hero carousel
  const featuredEvents = getFeaturedEvents()
  
  // Get featured coupons for offers section
  const featuredCoupons = getFeaturedCoupons()
  
  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="min-h-screen bg-gray-50">
      {/* Location Modal */}
      <LocationModal
        isOpen={showLocationModal}
        onSelectCity={handleSelectCity}
        onClose={() => setShowLocationModal(false)}
      />
      
      {/* Hero Banner Carousel */}
      <section className="bg-gradient-to-r from-primary-600 via-purple-600 to-secondary-600 overflow-hidden">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-12">
          <div className="max-w-[1920px] mx-auto">
            <div className="relative h-80 rounded-2xl overflow-hidden shadow-2xl group">
            {featuredEvents.length > 0 && (
              <div className="relative h-full">
                <img 
                  src={featuredEvents[0].image} 
                  alt={featuredEvents[0].title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 text-white animate-fadeIn">
                  <div className="inline-flex items-center gap-1.5 bg-yellow-400 text-black px-3 py-1.5 rounded-full text-sm font-bold mb-3 shadow-lg">
                    <span>⭐</span>
                    <span>Featured Event</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg">{featuredEvents[0].title}</h2>
                  <p className="text-white/90 mb-5 line-clamp-2 max-w-2xl">{featuredEvents[0].description}</p>
                  <Link 
                    href={`/event/${featuredEvents[0].id}`}
                    className="inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-xl font-bold hover:shadow-xl hover:scale-105 transform transition-all duration-300"
                  >
                    Book Now
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Offers Section */}
      {featuredCoupons.length > 0 && (
        <section className="py-8 bg-gradient-to-b from-white to-gray-50">
          <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="max-w-[1920px] mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Exclusive Offers</h2>
                  <p className="text-sm text-gray-600">Save more on your bookings!</p>
                </div>
              </div>
              <Link href="/browse" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                View All →
              </Link>
            </div>
            
            {/* Horizontal Scrollable Offers */}
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
              {featuredCoupons.map((coupon, index) => (
                <OfferBanner key={coupon.id} coupon={coupon} index={index} />
              ))}
            </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Category Filter Tabs */}
      <section className="glass sticky top-16 z-40 border-b border-gray-200/50 backdrop-blur-md bg-white/80">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="max-w-[1920px] mx-auto">
          <div className="flex gap-3 overflow-x-auto py-4 scrollbar-hide">
            {categories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                style={{ animationDelay: `${index * 50}ms` }}
                className={`px-5 py-2.5 rounded-full font-semibold whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
          </div>
        </div>
      </section>
      
      {/* Recommended Movies/Events */}
      <section className="py-8">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="max-w-[1920px] mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory === 'all' ? 'Recommended' : categories.find(c => c.id === selectedCategory)?.label}
            </h2>
            <Link href="/browse" className="text-primary-600 hover:text-primary-700 font-medium">
              See All →
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 md:gap-6">
            {filteredEvents.slice(0, 10).map((event, index) => (
              <Link 
                key={event.id}
                href={`/event/${event.id}`}
                className="group animate-fadeIn"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3 shadow-md hover:shadow-xl transition-all duration-300">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Featured Badge */}
                  {event.featured && (
                    <div className="absolute top-3 left-3 bg-yellow-400 text-black px-2.5 py-1 rounded-md text-xs font-bold shadow-lg flex items-center gap-1">
                      <span>⭐</span>
                      <span>Featured</span>
                    </div>
                  )}
                  
                  {/* Heart Button */}
                  <div className="absolute top-3 right-3 z-10">
                    <HeartButton eventId={event.id} size="sm" />
                  </div>
                  
                  {/* Rating Badge */}
                  {event.rating && (
                    <div className="absolute bottom-3 left-3 right-3 glass-dark text-white px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 fill-current text-yellow-400" />
                        <span className="font-bold text-sm">{event.rating}</span>
                        <span className="text-white/70">/10</span>
                      </span>
                      <span className="text-xs text-white/70">{event.votes?.toLocaleString()}</span>
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
                  {event.title}
                </h3>
                <div className="flex flex-wrap gap-1 mb-1">
                  {event.genre.slice(0, 2).map(genre => (
                    <span key={genre} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full hover:bg-primary-100 hover:text-primary-700 transition-colors">
                      {genre}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
          </div>
        </div>
      </section>
      
      {/* The Best of Live Events */}
      <section className="py-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="max-w-[1920px] mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 animate-slideIn">The Best Of Live Events</h2>
          
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            <Link 
              href="/browse?category=sports"
              className="relative min-w-[180px] h-56 rounded-2xl overflow-hidden group flex-shrink-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] snap-start"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-800 group-hover:from-purple-500 group-hover:to-purple-700 transition-all duration-500" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
              <div className="relative z-10 h-full flex flex-col items-center justify-center text-white p-6 transform group-hover:scale-110 transition-transform duration-500">
                <div className="text-5xl mb-3 animate-float">🏏</div>
                <h3 className="text-xl font-bold text-center uppercase tracking-wide drop-shadow-lg">Sports Events</h3>
                <p className="text-sm text-white/90 mt-2 font-medium">100+ Events</p>
              </div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 via-transparent to-transparent" />
              </div>
            </Link>
            
            <Link 
              href="/browse?category=plays"
              className="relative min-w-[180px] h-56 rounded-2xl overflow-hidden group flex-shrink-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] snap-start"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-pink-700" />
              <div className="relative z-10 h-full flex flex-col items-center justify-center text-white p-6">
                <div className="text-5xl mb-3">😂</div>
                <h3 className="text-xl font-bold text-center uppercase tracking-wide">Comedy Shows</h3>
                <p className="text-sm text-white/90 mt-2">245+ Events</p>
              </div>
            </Link>
            
            <Link 
              href="/browse?category=events"
              className="relative min-w-[180px] h-56 rounded-2xl overflow-hidden group flex-shrink-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] snap-start"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500" />
              <div className="relative z-10 h-full flex flex-col items-center justify-center text-white p-6">
                <div className="text-5xl mb-3">🎡</div>
                <h3 className="text-xl font-bold text-center uppercase tracking-wide">Amusement Park</h3>
                <p className="text-sm text-white/90 mt-2">15+ Events</p>
              </div>
            </Link>
            
            <Link 
              href="/browse?category=plays"
              className="relative min-w-[180px] h-56 rounded-2xl overflow-hidden group flex-shrink-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] snap-start"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800" />
              <div className="relative z-10 h-full flex flex-col items-center justify-center text-white p-6">
                <div className="text-5xl mb-3">🎭</div>
                <h3 className="text-xl font-bold text-center uppercase tracking-wide">Theatre Shows</h3>
                <p className="text-sm text-white/90 mt-2">100+ Events</p>
              </div>
            </Link>
            
            <Link 
              href="/browse?category=workshops"
              className="relative min-w-[180px] h-56 rounded-2xl overflow-hidden group flex-shrink-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] snap-start"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600" />
              <div className="relative z-10 h-full flex flex-col items-center justify-center text-white p-6">
                <div className="text-5xl mb-3">👶</div>
                <h3 className="text-xl font-bold text-center uppercase tracking-wide">Kids</h3>
                <p className="text-sm text-white/90 mt-2">30+ Events</p>
              </div>
            </Link>
          </div>
          </div>
        </div>
      </section>
      
      {/* Outdoor Events */}
      <section className="py-8 bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="max-w-[1920px] mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Outdoor Events</h2>
            <Link href="/browse?category=events" className="text-primary-600 hover:text-primary-700 font-medium">
              See All →
            </Link>
          </div>
          
          <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {events.filter(e => e.category === 'events' || e.category === 'plays').slice(0, 6).map(event => (
              <Link 
                key={event.id}
                href={`/event/${event.id}`}
                className="group min-w-[260px] flex-shrink-0 snap-start"
              >
                <div className="relative h-80 rounded-xl overflow-hidden mb-3 shadow-lg hover:shadow-xl transition-all duration-300">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {event.featured && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1.5 rounded-md text-xs font-bold uppercase shadow-md">
                      Promoted
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent text-white px-4 py-3">
                    <div className="text-sm font-semibold">
                      {event.dates[0] ? new Date(event.dates[0]).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' }) : 'Date TBA'}
                    </div>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors">
                  {event.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-1">{event.venue}</p>
              </Link>
            ))}
          </div>
          </div>
        </div>
      </section>
      
      {/* Premiere Events */}
      {getFeaturedEvents().length > 1 && (
        <section className="py-8">
          <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="max-w-[1920px] mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Premieres</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 md:gap-6">
              {getFeaturedEvents().map(event => (
                <Link 
                  key={event.id}
                  href={`/event/${event.id}`}
                  className="group"
                >
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3 shadow-md hover:shadow-xl transition-all duration-300">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-yellow-400 text-black px-2.5 py-1 rounded-md text-xs font-bold shadow-md flex items-center gap-1">
                      <span>🎬</span>
                      <span>PREMIERE</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-600">₹{event.price.min.toLocaleString()} onwards</p>
                </Link>
              ))}
            </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Floating Filter Button - Mobile Only */}
      <button
        onClick={() => setShowFilters(true)}
        className="md:hidden fixed bottom-20 right-4 z-40 w-14 h-14 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform animate-pulse"
      >
        <Filter className="w-6 h-6" />
      </button>
      
      {/* Quick Filters Drawer */}
      <QuickFilters
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onApplyFilters={handleApplyFilters}
      />
    </div>
    </PullToRefresh>
  )
}

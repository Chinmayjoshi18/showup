'use client'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Star, MapPin, Clock, Calendar, Share2, ChevronRight, Users } from 'lucide-react'
import { getEventById, getReviewsByEventId, getReviewSummary } from '@/lib/data'
import { format } from 'date-fns'
import RatingSummary from '@/components/RatingSummary'
import ReviewList from '@/components/ReviewList'
import HeartButton from '@/components/HeartButton'
import BookingCard from '@/components/BookingCard'

export default function EventPage({ params }: { params: { id: string } }) {
  const event = getEventById(params.id)
  
  if (!event) {
    notFound()
  }

  // Get reviews for this event
  const reviews = getReviewsByEventId(params.id)
  const reviewSummary = getReviewSummary(params.id)
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden">
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0">
          <div className="w-full px-4 sm:px-6 lg:px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div className="flex-1">
                {event.featured && (
                  <div className="inline-flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold mb-3">
                    <Star className="w-4 h-4 fill-current" />
                    Featured Event
                  </div>
                )}
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">{event.title}</h1>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {event.genre.map(genre => (
                    <span key={genre} className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                      {genre}
                    </span>
                  ))}
                </div>
                
                {event.rating && (
                  <div className="flex items-center gap-4 text-white">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 fill-current text-yellow-400" />
                      <span className="text-xl font-bold">{event.rating}/10</span>
                      <span className="text-sm text-white/80">({event.votes?.toLocaleString()} votes)</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex gap-3">
                <button className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full text-white transition">
                  <Share2 className="w-5 h-5" />
                </button>
                <HeartButton eventId={params.id} size="lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
              <p className="text-gray-700 leading-relaxed">{event.description}</p>
            </div>
            
            {/* Event Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-primary-100 rounded-lg">
                    <MapPin className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Venue</div>
                    <div className="font-semibold text-gray-900">{event.venue}</div>
                    <div className="text-sm text-gray-600">{event.city}</div>
                  </div>
                </div>
                
                {event.duration && (
                  <div className="flex items-start gap-3">
                    <div className="p-3 bg-secondary-100 rounded-lg">
                      <Clock className="w-5 h-5 text-secondary-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Duration</div>
                      <div className="font-semibold text-gray-900">{event.duration}</div>
                    </div>
                  </div>
                )}
                
                {event.language && (
                  <div className="flex items-start gap-3">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Language</div>
                      <div className="font-semibold text-gray-900">{event.language}</div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Available Dates</div>
                    <div className="font-semibold text-gray-900">{event.dates.length} shows</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Reviews Section */}
            {reviews.length > 0 && (
              <div className="space-y-6">
                <RatingSummary summary={reviewSummary} />
                <ReviewList reviews={reviews} eventId={params.id} />
              </div>
            )}
            
            {/* Similar Events */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">You Might Also Like</h2>
              <div className="text-gray-600">More recommendations coming soon...</div>
            </div>
          </div>
          
          {/* Booking Card */}
          <div className="lg:col-span-1">
            <BookingCard event={event} />
          </div>
        </div>
      </div>
    </div>
  )
}


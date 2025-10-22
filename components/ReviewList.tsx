'use client'

import { useState } from 'react'
import { Star, TrendingUp, Clock, Award } from 'lucide-react'
import { Review, sortReviews } from '@/lib/data'
import ReviewCard from './ReviewCard'

interface ReviewListProps {
  reviews: Review[]
  eventId: string
}

export default function ReviewList({ reviews, eventId }: ReviewListProps) {
  const [sortBy, setSortBy] = useState<'helpful' | 'recent' | 'rating'>('helpful')
  const [filterRating, setFilterRating] = useState<number | null>(null)

  // Apply filters
  const filteredReviews = filterRating
    ? reviews.filter(review => review.rating === filterRating)
    : reviews

  // Apply sorting
  const sortedReviews = sortReviews(filteredReviews, sortBy)

  const sortOptions = [
    { value: 'helpful', label: 'Most Helpful', icon: TrendingUp },
    { value: 'recent', label: 'Most Recent', icon: Clock },
    { value: 'rating', label: 'Highest Rated', icon: Award }
  ]

  const ratingFilters = [
    { value: null, label: 'All Ratings' },
    { value: 5, label: '5 Stars' },
    { value: 4, label: '4 Stars' },
    { value: 3, label: '3 Stars' },
    { value: 2, label: '2 Stars' },
    { value: 1, label: '1 Star' }
  ]

  return (
    <div className="space-y-6">
      {/* Sort and Filter Controls */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Sort By */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <div className="flex gap-2">
              {sortOptions.map((option) => {
                const Icon = option.icon
                return (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value as 'helpful' | 'recent' | 'rating')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all transform hover:scale-105 ${
                      sortBy === option.value
                        ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{option.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Filter by Rating */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            <select
              value={filterRating ?? ''}
              onChange={(e) => setFilterRating(e.target.value ? parseInt(e.target.value) : null)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm font-medium"
            >
              {ratingFilters.map((filter) => (
                <option key={filter.value ?? 'all'} value={filter.value ?? ''}>
                  {filter.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters Info */}
        <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between text-sm">
          <span className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{sortedReviews.length}</span> of{' '}
            <span className="font-semibold text-gray-900">{reviews.length}</span> reviews
            {filterRating && (
              <span className="text-primary-600">
                {' '}
                · Filtered by {filterRating} star{filterRating !== 1 ? 's' : ''}
              </span>
            )}
          </span>
          {filterRating && (
            <button
              onClick={() => setFilterRating(null)}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>

      {/* Reviews Grid */}
      {sortedReviews.length > 0 ? (
        <div className="space-y-4">
          {sortedReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        /* No Reviews State */
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
          <div className="text-6xl mb-4">⭐</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No reviews found</h3>
          <p className="text-gray-600">
            {filterRating
              ? `No ${filterRating}-star reviews yet. Try a different filter!`
              : 'Be the first to review this event!'}
          </p>
        </div>
      )}
    </div>
  )
}


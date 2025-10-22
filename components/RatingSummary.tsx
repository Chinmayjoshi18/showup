'use client'

import { Star } from 'lucide-react'
import { ReviewSummary } from '@/lib/data'

interface RatingSummaryProps {
  summary: ReviewSummary
  onWriteReview?: () => void
}

export default function RatingSummary({ summary, onWriteReview }: RatingSummaryProps) {
  const { averageRating, totalReviews, ratingDistribution } = summary

  const getPercentage = (count: number): number => {
    return totalReviews > 0 ? (count / totalReviews) * 100 : 0
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Overall Rating */}
        <div className="flex flex-col items-center justify-center text-center py-4">
          <div className="text-6xl font-bold text-gray-900 mb-2">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-6 h-6 ${
                  star <= Math.round(averageRating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-gray-200 text-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-gray-600">
            Based on <span className="font-semibold">{totalReviews.toLocaleString()}</span>{' '}
            {totalReviews === 1 ? 'review' : 'reviews'}
          </p>
          {onWriteReview && (
            <button
              onClick={onWriteReview}
              className="mt-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105"
            >
              Write a Review
            </button>
          )}
        </div>

        {/* Rating Distribution */}
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = ratingDistribution[rating as keyof typeof ratingDistribution]
            const percentage = getPercentage(count)

            return (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm font-medium text-gray-700">{rating}</span>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="w-16 text-right">
                  <span className="text-sm font-medium text-gray-700">{count}</span>
                  <span className="text-xs text-gray-500 ml-1">({percentage.toFixed(0)}%)</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Review Highlights */}
      {totalReviews > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(((ratingDistribution[5] + ratingDistribution[4]) / totalReviews) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Recommended</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {ratingDistribution[5]}
              </div>
              <div className="text-sm text-gray-600">5-Star Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary-600">
                {Math.round((ratingDistribution[5] / totalReviews) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Excellent</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


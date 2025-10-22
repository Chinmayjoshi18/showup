'use client'

import { useState } from 'react'
import { Star, ThumbsUp, ThumbsDown, Check, ImageIcon } from 'lucide-react'
import { Review } from '@/lib/data'
import { format } from 'date-fns'

interface ReviewCardProps {
  review: Review
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const [helpful, setHelpful] = useState(review.helpful)
  const [notHelpful, setNotHelpful] = useState(review.notHelpful)
  const [userVote, setUserVote] = useState<'helpful' | 'not-helpful' | null>(null)
  const [showAllPhotos, setShowAllPhotos] = useState(false)

  const handleVote = (voteType: 'helpful' | 'not-helpful') => {
    if (userVote === voteType) {
      // Undo vote
      if (voteType === 'helpful') {
        setHelpful(helpful - 1)
      } else {
        setNotHelpful(notHelpful - 1)
      }
      setUserVote(null)
    } else {
      // New vote or change vote
      if (userVote === 'helpful') {
        setHelpful(helpful - 1)
        setNotHelpful(notHelpful + 1)
      } else if (userVote === 'not-helpful') {
        setNotHelpful(notHelpful - 1)
        setHelpful(helpful + 1)
      } else {
        if (voteType === 'helpful') {
          setHelpful(helpful + 1)
        } else {
          setNotHelpful(notHelpful + 1)
        }
      }
      setUserVote(voteType)
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-primary-500 to-secondary-500 flex-shrink-0">
            {review.userAvatar ? (
              <img
                src={review.userAvatar}
                alt={review.userName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
                {review.userName[0]}
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-gray-900">{review.userName}</h4>
              {review.verified && (
                <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">
                  <Check className="w-3 h-3" />
                  <span>Verified</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span>{format(new Date(review.date), 'MMM dd, yyyy')}</span>
              {renderStars(review.rating)}
            </div>
          </div>
        </div>

        {/* Rating Badge */}
        <div className="flex-shrink-0 ml-4">
          <div className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold text-sm ${
            review.rating >= 4
              ? 'bg-green-100 text-green-700'
              : review.rating >= 3
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-red-100 text-red-700'
          }`}>
            <Star className="w-4 h-4 fill-current" />
            <span>{review.rating}.0</span>
          </div>
        </div>
      </div>

      {/* Review Title */}
      <h3 className="font-bold text-lg text-gray-900 mb-2">{review.title}</h3>

      {/* Review Content */}
      <p className="text-gray-700 leading-relaxed mb-4">{review.content}</p>

      {/* Review Photos */}
      {review.photos && review.photos.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <ImageIcon className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              {review.photos.length} {review.photos.length === 1 ? 'Photo' : 'Photos'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {review.photos.slice(0, showAllPhotos ? undefined : 3).map((photo, index) => (
              <div
                key={index}
                className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 cursor-pointer group"
                onClick={() => setShowAllPhotos(!showAllPhotos)}
              >
                <img
                  src={photo}
                  alt={`Review photo ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {!showAllPhotos && index === 2 && review.photos && review.photos.length > 3 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      +{review.photos.length - 3}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
          {review.photos.length > 3 && (
            <button
              onClick={() => setShowAllPhotos(!showAllPhotos)}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2"
            >
              {showAllPhotos ? 'Show Less' : `View All ${review.photos.length} Photos`}
            </button>
          )}
        </div>
      )}

      {/* Helpful Section */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-medium">Was this helpful?</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleVote('helpful')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105 ${
              userVote === 'helpful'
                ? 'bg-primary-100 text-primary-700 shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${userVote === 'helpful' ? 'fill-current' : ''}`} />
            <span>{helpful}</span>
          </button>
          <button
            onClick={() => handleVote('not-helpful')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105 ${
              userVote === 'not-helpful'
                ? 'bg-red-100 text-red-700 shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ThumbsDown className={`w-4 h-4 ${userVote === 'not-helpful' ? 'fill-current' : ''}`} />
            <span>{notHelpful}</span>
          </button>
        </div>
      </div>
    </div>
  )
}


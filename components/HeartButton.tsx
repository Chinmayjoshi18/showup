'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { toggleWishlist, isInWishlist } from '@/lib/data'

interface HeartButtonProps {
  eventId: string
  size?: 'sm' | 'md' | 'lg'
  showToast?: boolean
  className?: string
}

export default function HeartButton({ 
  eventId, 
  size = 'md', 
  showToast = true,
  className = '' 
}: HeartButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showMessage, setShowMessage] = useState(false)

  useEffect(() => {
    // Check wishlist status on mount
    setIsWishlisted(isInWishlist(eventId))
  }, [eventId])

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Toggle wishlist
    const newStatus = toggleWishlist(eventId)
    setIsWishlisted(newStatus)
    
    // Trigger animation
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 600)
    
    // Show toast message
    if (showToast) {
      setShowMessage(true)
      setTimeout(() => setShowMessage(false), 2000)
    }
  }

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  return (
    <>
      <button
        onClick={handleClick}
        className={`
          ${sizeClasses[size]}
          ${className}
          flex items-center justify-center
          rounded-full
          backdrop-blur-sm
          transition-all duration-300
          transform hover:scale-110
          ${isWishlisted 
            ? 'bg-red-500 shadow-lg shadow-red-500/50' 
            : 'bg-white/80 hover:bg-white shadow-md'
          }
          ${isAnimating ? 'animate-bounce' : ''}
        `}
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart
          className={`
            ${iconSizes[size]}
            transition-all duration-300
            ${isWishlisted 
              ? 'fill-white text-white scale-110' 
              : 'text-gray-700'
            }
            ${isAnimating ? 'animate-pulse' : ''}
          `}
        />
      </button>

      {/* Toast Message */}
      {showMessage && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 animate-slideIn">
          <div className={`
            px-6 py-3 rounded-full shadow-2xl backdrop-blur-md
            flex items-center gap-2 font-medium
            ${isWishlisted 
              ? 'bg-red-500 text-white' 
              : 'bg-gray-900 text-white'
            }
          `}>
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            <span>
              {isWishlisted 
                ? 'Added to wishlist!' 
                : 'Removed from wishlist'
              }
            </span>
          </div>
        </div>
      )}
    </>
  )
}


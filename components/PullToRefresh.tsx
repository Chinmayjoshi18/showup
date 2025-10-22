'use client'

import { useState, useRef, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: React.ReactNode
}

export default function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const [isPulling, setIsPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const startY = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const threshold = 80 // Distance needed to trigger refresh

  const handleTouchStart = (e: TouchEvent) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY
    }
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (window.scrollY > 0 || isRefreshing) return

    const currentY = e.touches[0].clientY
    const distance = currentY - startY.current

    if (distance > 0) {
      setIsPulling(true)
      setPullDistance(Math.min(distance, threshold * 1.5))
    }
  }

  const handleTouchEnd = async () => {
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
        setIsPulling(false)
        setPullDistance(0)
      }
    } else {
      setIsPulling(false)
      setPullDistance(0)
    }
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, { passive: true })
    container.addEventListener('touchend', handleTouchEnd)

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [pullDistance, isRefreshing])

  const rotation = Math.min((pullDistance / threshold) * 360, 360)
  const opacity = Math.min(pullDistance / threshold, 1)

  return (
    <div ref={containerRef} className="relative">
      {/* Pull Indicator */}
      {(isPulling || isRefreshing) && (
        <div 
          className="fixed top-0 left-0 right-0 z-40 flex justify-center pt-4 md:hidden"
          style={{
            transform: `translateY(${Math.min(pullDistance - 40, 40)}px)`,
            transition: isPulling && !isRefreshing ? 'none' : 'transform 0.3s ease'
          }}
        >
          <div 
            className="bg-white rounded-full p-3 shadow-lg"
            style={{ opacity }}
          >
            <RefreshCw 
              className={`w-6 h-6 text-primary-600 ${isRefreshing ? 'animate-spin' : ''}`}
              style={{ 
                transform: isRefreshing ? 'none' : `rotate(${rotation}deg)`,
                transition: 'transform 0.1s ease'
              }}
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div
        style={{
          transform: isPulling && !isRefreshing ? `translateY(${pullDistance * 0.4}px)` : 'translateY(0)',
          transition: isPulling && !isRefreshing ? 'none' : 'transform 0.3s ease'
        }}
      >
        {children}
      </div>
    </div>
  )
}


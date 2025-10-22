'use client'

import Link from 'next/link'
import { Tag, Clock, TrendingUp, Sparkles } from 'lucide-react'
import { Coupon } from '@/lib/data'

interface OfferBannerProps {
  coupon: Coupon
  index?: number
}

export default function OfferBanner({ coupon, index = 0 }: OfferBannerProps) {
  const getDiscountText = () => {
    if (coupon.discountType === 'flat') {
      return `₹${coupon.discountValue} OFF`
    } else if (coupon.discountType === 'percentage') {
      return `${coupon.discountValue}% OFF`
    } else {
      return `${coupon.discountValue}% CASHBACK`
    }
  }

  const gradients = [
    'from-purple-600 to-pink-600',
    'from-blue-600 to-cyan-600',
    'from-orange-600 to-red-600',
    'from-green-600 to-teal-600',
    'from-indigo-600 to-purple-600'
  ]

  const gradient = gradients[index % gradients.length]

  return (
    <div className={`relative group min-w-[340px] sm:min-w-[420px] flex-shrink-0 animate-fadeIn`}
         style={{ animationDelay: `${index * 100}ms` }}>
      <div className={`relative h-44 rounded-2xl overflow-hidden bg-gradient-to-r ${gradient} shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]`}>
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
        
        <div className="relative h-full p-6 flex flex-col justify-between">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white/20 backdrop-blur-sm rounded-lg">
                  <Tag className="w-4 h-4 text-white" />
                </div>
                {coupon.urgencyText && (
                  <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium animate-pulse">
                    <Clock className="w-3 h-3" />
                    <span>{coupon.urgencyText}</span>
                  </div>
                )}
              </div>
              <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                <span className="text-white text-sm font-bold">{getDiscountText()}</span>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-1">{coupon.title}</h3>
            <p className="text-white/90 text-sm line-clamp-2">{coupon.description}</p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg font-mono text-sm font-bold border border-white/30 border-dashed">
                {coupon.code}
              </div>
              <div className="flex items-center gap-1 text-white/80 text-xs">
                <TrendingUp className="w-3 h-3" />
                <span>{coupon.usedCount}+ used</span>
              </div>
            </div>
            <Link
              href="/browse"
              className="flex items-center gap-1 bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold text-sm hover:shadow-lg transition-all transform hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
              Explore
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}


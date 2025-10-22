'use client'

import { useState } from 'react'
import { Tag, X, Check, AlertCircle, ChevronDown, Percent } from 'lucide-react'
import { validateCoupon, Coupon, getActiveCoupons } from '@/lib/data'

interface CouponInputProps {
  amount: number
  category?: string
  isNewUser?: boolean
  onApply: (discount: number, coupon: Coupon) => void
  onRemove: () => void
}

export default function CouponInput({ 
  amount, 
  category, 
  isNewUser = false, 
  onApply, 
  onRemove 
}: CouponInputProps) {
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null)
  const [discount, setDiscount] = useState(0)
  const [message, setMessage] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isValidating, setIsValidating] = useState(false)

  const availableCoupons = getActiveCoupons().filter(coupon => {
    // Filter relevant coupons
    if (coupon.userType === 'new' && !isNewUser) return false
    if (coupon.categories && category && !coupon.categories.includes(category as any)) return false
    if (coupon.minPurchase > amount) return false
    return true
  }).slice(0, 5) // Show top 5

  const handleApply = () => {
    if (!couponCode.trim()) {
      setMessage('Please enter a coupon code')
      return
    }

    setIsValidating(true)
    
    // Simulate API call delay
    setTimeout(() => {
      const result = validateCoupon(couponCode, amount, category, isNewUser)
      
      if (result.valid && result.coupon) {
        setAppliedCoupon(result.coupon)
        setDiscount(result.discount)
        setMessage(result.message)
        onApply(result.discount, result.coupon)
      } else {
        setMessage(result.message)
        setAppliedCoupon(null)
        setDiscount(0)
      }
      
      setIsValidating(false)
    }, 500)
  }

  const handleRemove = () => {
    setAppliedCoupon(null)
    setDiscount(0)
    setCouponCode('')
    setMessage('')
    onRemove()
  }

  const handleSuggestionClick = (code: string) => {
    setCouponCode(code)
    setShowSuggestions(false)
  }

  return (
    <div className="space-y-4">
      {/* Applied Coupon Display */}
      {appliedCoupon ? (
        <div className="bg-green-50 border-2 border-green-500 rounded-xl p-4 animate-scaleIn">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-green-500 rounded-lg">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <h4 className="font-bold text-green-900">{appliedCoupon.title}</h4>
              </div>
              <p className="text-green-700 text-sm mb-2">{appliedCoupon.description}</p>
              <div className="flex items-center gap-3">
                <div className="bg-white border border-green-300 px-3 py-1 rounded-lg font-mono text-sm font-bold text-green-900">
                  {appliedCoupon.code}
                </div>
                <div className="text-green-700 font-semibold text-sm">
                  You saved ₹{discount}!
                </div>
              </div>
            </div>
            <button
              onClick={handleRemove}
              className="p-2 hover:bg-green-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-green-700" />
            </button>
          </div>
        </div>
      ) : (
        /* Coupon Input Form */
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-5 h-5 text-primary-600" />
            <h3 className="font-bold text-gray-900">Apply Coupon</h3>
          </div>

          <div className="flex gap-2 mb-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Enter coupon code"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm font-bold uppercase text-gray-900 placeholder:text-gray-400"
              />
            </div>
            <button
              onClick={handleApply}
              disabled={isValidating || !couponCode.trim()}
              className={`px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                isValidating || !couponCode.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:shadow-lg'
              }`}
            >
              {isValidating ? 'Applying...' : 'Apply'}
            </button>
          </div>

          {/* Message */}
          {message && (
            <div className={`flex items-start gap-2 p-3 rounded-lg ${
              appliedCoupon 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {appliedCoupon ? (
                <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              )}
              <p className="text-sm font-medium">{message}</p>
            </div>
          )}

          {/* Available Coupons Suggestions */}
          {showSuggestions && availableCoupons.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-700">Available Coupons</h4>
                <button
                  onClick={() => setShowSuggestions(!showSuggestions)}
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                >
                  {showSuggestions ? 'Hide' : 'Show'}
                </button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {availableCoupons.map((coupon) => {
                  const getDiscountText = () => {
                    if (coupon.discountType === 'flat') {
                      return `₹${coupon.discountValue} OFF`
                    } else if (coupon.discountType === 'percentage') {
                      return `${coupon.discountValue}% OFF`
                    } else {
                      return `${coupon.discountValue}% CASHBACK`
                    }
                  }

                  return (
                    <div
                      key={coupon.id}
                      className="flex items-center justify-between p-3 bg-gradient-to-r from-primary-50 to-secondary-50 hover:from-primary-100 hover:to-secondary-100 rounded-lg cursor-pointer transition-all transform hover:scale-102 border border-primary-200"
                      onClick={() => handleSuggestionClick(coupon.code)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Percent className="w-4 h-4 text-primary-600" />
                          <h5 className="font-bold text-gray-900 text-sm">{coupon.title}</h5>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{coupon.description}</p>
                        <div className="flex items-center gap-2">
                          <span className="bg-white border border-primary-300 px-2 py-0.5 rounded font-mono text-xs font-bold text-primary-700">
                            {coupon.code}
                          </span>
                          {coupon.urgencyText && (
                            <span className="text-xs text-orange-600 font-medium">
                              {coupon.urgencyText}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="ml-3 text-right">
                        <div className="text-lg font-bold text-primary-600">{getDiscountText()}</div>
                        <div className="text-xs text-gray-500">Min ₹{coupon.minPurchase}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}


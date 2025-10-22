'use client'

import { CreditCard, Gift, Sparkles } from 'lucide-react'
import { BankOffer } from '@/lib/data'

interface OfferCardProps {
  offer: BankOffer
}

export default function OfferCard({ offer }: OfferCardProps) {
  const getDiscountText = () => {
    if (offer.discountType === 'flat') {
      return `₹${offer.discountValue} OFF`
    } else if (offer.discountType === 'percentage') {
      return `${offer.discountValue}% OFF`
    } else {
      return `${offer.discountValue}% CASHBACK`
    }
  }

  const getCardTypeText = () => {
    if (offer.cardType === 'credit') return 'Credit Cards'
    if (offer.cardType === 'debit') return 'Debit Cards'
    return 'All Cards'
  }

  return (
    <div className="group bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 hover:border-primary-300 rounded-xl p-4 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
      <div className="flex items-start gap-4">
        {/* Bank Logo */}
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
          {offer.logo}
        </div>

        {/* Offer Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-1 line-clamp-1">{offer.title}</h4>
              <p className="text-sm text-gray-600 line-clamp-2">{offer.description}</p>
            </div>
            {offer.featured && (
              <div className="ml-2 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-xs font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Popular
              </div>
            )}
          </div>

          {/* Offer Details Grid */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-200">
            <div>
              <div className="text-xs text-gray-500 mb-1">Discount</div>
              <div className="text-sm font-bold text-primary-600">{getDiscountText()}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Min Purchase</div>
              <div className="text-sm font-bold text-gray-900">₹{offer.minPurchase}</div>
            </div>
            {offer.maxDiscount && (
              <>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Max Discount</div>
                  <div className="text-sm font-bold text-gray-900">₹{offer.maxDiscount}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Card Type</div>
                  <div className="text-sm font-bold text-gray-900">{getCardTypeText()}</div>
                </div>
              </>
            )}
          </div>

          {/* Bank and Validity */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">{offer.bank}</span>
            </div>
            <div className="text-xs text-gray-500">
              Valid till {new Date(offer.validUntil).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


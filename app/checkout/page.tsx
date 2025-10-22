'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CreditCard, Smartphone, Building, CheckCircle, Lock, Gift, Loader2 } from 'lucide-react'
import CouponInput from '@/components/CouponInput'
import OfferCard from '@/components/OfferCard'
import PaymentMethods from '@/components/PaymentMethods'
import { Coupon, getFeaturedBankOffers } from '@/lib/data'
import { createPaymentOrder, processPayment } from '@/lib/juspay/payment'

export default function CheckoutPage() {
  const router = useRouter()
  const [booking, setBooking] = useState<any>(null)
  const [paymentMethod, setPaymentMethod] = useState<string>('')
  const [paymentDetails, setPaymentDetails] = useState<any>(null)
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string>('')
  const [discount, setDiscount] = useState(0)
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null)
  
  useEffect(() => {
    const bookingData = localStorage.getItem('booking')
    if (bookingData) {
      setBooking(JSON.parse(bookingData))
    } else {
      router.push('/browse')
    }
  }, [router])
  
  if (!booking) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }
  
  const subtotal = booking.total
  const convenienceFee = Math.round(subtotal * 0.05)
  const totalBeforeDiscount = subtotal + convenienceFee
  const total = Math.max(0, totalBeforeDiscount - discount)
  const bankOffers = getFeaturedBankOffers()
  
  const handleApplyCoupon = (discountAmount: number, coupon: Coupon) => {
    setDiscount(discountAmount)
    setAppliedCoupon(coupon)
  }
  
  const handleRemoveCoupon = () => {
    setDiscount(0)
    setAppliedCoupon(null)
  }
  
  const handlePaymentMethodSelect = (method: string, details: any) => {
    setPaymentMethod(method)
    setPaymentDetails(details)
  }

  const handlePayment = async () => {
    if (!paymentMethod || !paymentDetails) {
      setError('Please select a payment method')
      return
    }

    setProcessing(true)
    setError('')
    
    try {
      // Create payment order with Juspay
      const orderId = `ORD_${Date.now()}`
      const paymentOrder = await createPaymentOrder({
        orderId,
        amount: total,
        currency: 'INR',
        customerId: 'customer_' + Date.now(),
        customerEmail: 'user@example.com', // From auth in production
        customerPhone: '+919876543210', // From auth in production
        description: `Booking for ${booking.event.title}`,
        metadata: {
          bookingId: `BK${Date.now()}`,
          eventId: booking.event.id,
          seats: booking.seats,
        },
      })

      // Process payment with selected method
      const paymentResponse = await processPayment(
        orderId,
        paymentMethod,
        paymentDetails
      )

      if (paymentResponse.success) {
        setSuccess(true)
        
        // Save booking to localStorage
        const existingBookings = JSON.parse(localStorage.getItem('myBookings') || '[]')
        const newBooking = {
          id: `BK${Date.now()}`,
          ...booking,
          paymentMethod,
          paymentId: paymentResponse.paymentId,
          orderId,
          bookingDate: new Date().toISOString(),
          status: 'confirmed',
          total,
          discount,
          appliedCoupon: appliedCoupon?.code,
        }
        existingBookings.push(newBooking)
        localStorage.setItem('myBookings', JSON.stringify(existingBookings))
        localStorage.removeItem('booking')
        
        // Redirect to profile after 3 seconds
        setTimeout(() => {
          router.push('/profile?tab=bookings')
        }, 3000)
      } else {
        setError(paymentResponse.message || 'Payment failed. Please try again.')
      }
    } catch (err: any) {
      console.error('Payment error:', err)
      setError(err.message || 'An error occurred. Please try again.')
    } finally {
      setProcessing(false)
    }
  }
  
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">Your tickets have been booked</p>
          
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <div className="text-sm text-gray-500 mb-1">Booking ID</div>
            <div className="text-2xl font-bold text-gray-900 mb-4">BK{Date.now()}</div>
            
            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <div className="text-sm text-gray-500">Event</div>
                <div className="font-semibold text-gray-900">{booking.event.title}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Tickets</div>
                <div className="font-semibold text-gray-900">{booking.seats.length}</div>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-6">
            E-tickets have been sent to your email and SMS. You can also view them in your profile.
          </p>
          
          <Link 
            href="/profile"
            className="inline-block bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition"
          >
            View My Bookings
          </Link>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-16 z-40 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href={`/book/${booking.event.id}`} className="p-2 hover:bg-gray-100 rounded-full transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Complete Payment</h1>
              <p className="text-sm text-gray-600">Review and pay securely</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            {/* Security Badge */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
              <Lock className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-semibold text-green-900">Secure Payment</div>
                <div className="text-sm text-green-700">Your payment information is encrypted and secure</div>
              </div>
            </div>
            
            {/* Coupon Input */}
            <CouponInput
              amount={subtotal}
              category={booking.event.category}
              isNewUser={false}
              onApply={handleApplyCoupon}
              onRemove={handleRemoveCoupon}
            />
            
            {/* Bank Offers */}
            {bankOffers.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Gift className="w-5 h-5 text-primary-600" />
                  <h2 className="text-xl font-bold text-gray-900">Bank Offers</h2>
                </div>
                <div className="space-y-3">
                  {bankOffers.map(offer => (
                    <OfferCard key={offer.id} offer={offer} />
                  ))}
                </div>
              </div>
            )}
            
            {/* Payment Methods - Juspay Integration */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                <div className="text-sm text-red-800">{error}</div>
              </div>
            )}
            
            <PaymentMethods
              amount={total}
              onPaymentMethodSelect={handlePaymentMethodSelect}
              selectedMethod={paymentMethod}
            />
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6 pb-6 border-b">
                <div>
                  <div className="font-semibold text-gray-900 mb-1">{booking.event.title}</div>
                  <div className="text-sm text-gray-600">{booking.event.venue}</div>
                </div>
                
                <div className="text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{new Date(booking.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">{booking.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Seats:</span>
                    <span className="font-medium">{booking.seats.map((s: any) => s.id).join(', ')}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mb-6 pb-6 border-b">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal ({booking.seats.length} tickets)</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Convenience Fee</span>
                  <span>₹{convenienceFee.toLocaleString()}</span>
                </div>
                {discount > 0 && appliedCoupon && (
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span className="flex items-center gap-1">
                      <Gift className="w-4 h-4" />
                      Discount ({appliedCoupon.code})
                    </span>
                    <span>-₹{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="text-sm text-green-600 font-medium text-right">
                    You saved ₹{discount.toLocaleString()}! 🎉
                  </div>
                )}
              </div>
              
              <button
                onClick={handlePayment}
                disabled={processing || !paymentMethod}
                className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 ${
                  (processing || !paymentMethod) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {processing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Pay ₹{total.toLocaleString()} Securely
                  </>
                )}
              </button>
              
              {!paymentMethod && (
                <p className="text-sm text-red-600 text-center mt-2">
                  Please select a payment method above
                </p>
              )}
              
              <div className="mt-6 pt-6 border-t space-y-2 text-xs text-gray-500">
                <p>✓ 256-bit SSL encrypted payment</p>
                <p>✓ Instant e-ticket delivery</p>
                <p>✓ 24/7 customer support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ChevronRight, Info } from 'lucide-react'
import { getEventById } from '@/lib/data'

interface Seat {
  id: string
  row: string
  number: number
  type: 'premium' | 'gold' | 'silver'
  price: number
  status: 'available' | 'selected' | 'booked'
}

export default function BookingPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const event = getEventById(params.id)
  
  if (!event) {
    return <div>Event not found</div>
  }
  
  // Generate seat layout
  const generateSeats = (): Seat[] => {
    const seats: Seat[] = []
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
    const seatsPerRow = 16
    
    rows.forEach((row, rowIndex) => {
      for (let i = 1; i <= seatsPerRow; i++) {
        let type: 'premium' | 'gold' | 'silver'
        let price: number
        
        if (rowIndex < 3) {
          type = 'premium'
          price = event.price.max
        } else if (rowIndex < 6) {
          type = 'gold'
          price = Math.round((event.price.min + event.price.max) / 2)
        } else {
          type = 'silver'
          price = event.price.min
        }
        
        // Random booked seats for demo
        const isBooked = Math.random() < 0.3
        
        seats.push({
          id: `${row}${i}`,
          row,
          number: i,
          type,
          price,
          status: isBooked ? 'booked' : 'available'
        })
      }
    })
    
    return seats
  }
  
  const [seats, setSeats] = useState<Seat[]>(generateSeats())
  const [selectedDate] = useState(event.dates[0])
  const [selectedTime] = useState('20:00')
  
  const selectedSeats = seats.filter(seat => seat.status === 'selected')
  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0)
  
  const toggleSeat = (seatId: string) => {
    setSeats(seats.map(seat => {
      if (seat.id === seatId && seat.status !== 'booked') {
        return {
          ...seat,
          status: seat.status === 'selected' ? 'available' : 'selected'
        }
      }
      return seat
    }))
  }
  
  const getSeatColor = (seat: Seat) => {
    if (seat.status === 'booked') return 'bg-gray-400 cursor-not-allowed'
    if (seat.status === 'selected') return 'bg-green-500 hover:bg-green-600 cursor-pointer'
    
    switch (seat.type) {
      case 'premium':
        return 'bg-purple-500 hover:bg-purple-600 cursor-pointer'
      case 'gold':
        return 'bg-yellow-500 hover:bg-yellow-600 cursor-pointer'
      case 'silver':
        return 'bg-blue-500 hover:bg-blue-600 cursor-pointer'
    }
  }
  
  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat')
      return
    }
    
    // Store booking data in localStorage for demo
    localStorage.setItem('booking', JSON.stringify({
      event,
      date: selectedDate,
      time: selectedTime,
      seats: selectedSeats,
      total: totalPrice
    }))
    
    router.push('/checkout')
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-16 z-40 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/event/${event.id}`} className="p-2 hover:bg-gray-100 rounded-full transition">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{event.title}</h1>
                <p className="text-sm text-gray-600">{event.venue} • {selectedDate}</p>
              </div>
            </div>
            
            {selectedSeats.length > 0 && (
              <div className="hidden md:block text-right">
                <div className="text-sm text-gray-500">{selectedSeats.length} {selectedSeats.length === 1 ? 'seat' : 'seats'} selected</div>
                <div className="text-xl font-bold text-gray-900">₹{totalPrice.toLocaleString()}</div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Seat Selection */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              {/* Legend */}
              <div className="mb-6 pb-6 border-b">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="w-5 h-5 text-gray-500" />
                  <span className="font-semibold text-gray-900">Seat Types</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-500 rounded" />
                    <span className="text-sm">Premium - ₹{event.price.max}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-yellow-500 rounded" />
                    <span className="text-sm">Gold - ₹{Math.round((event.price.min + event.price.max) / 2)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-500 rounded" />
                    <span className="text-sm">Silver - ₹{event.price.min}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-500 rounded" />
                    <span className="text-sm">Selected</span>
                  </div>
                </div>
              </div>
              
              {/* Screen */}
              <div className="mb-8">
                <div className="text-center mb-2">
                  <div className="inline-block bg-gray-800 text-white px-6 py-2 rounded-t-lg text-sm">
                    SCREEN THIS WAY
                  </div>
                </div>
                <div className="h-2 bg-gradient-to-b from-gray-300 to-transparent rounded-full" />
              </div>
              
              {/* Seats Grid */}
              <div className="overflow-x-auto">
                <div className="min-w-[600px]">
                  {Array.from(new Set(seats.map(s => s.row))).map(row => (
                    <div key={row} className="flex items-center gap-2 mb-2">
                      <div className="w-8 text-center font-semibold text-gray-700">{row}</div>
                      <div className="flex-1 flex justify-center gap-1">
                        {seats
                          .filter(seat => seat.row === row)
                          .map((seat, index) => (
                            <div key={seat.id} className="flex gap-1">
                              {index === 8 && <div className="w-4" />}
                              <button
                                onClick={() => toggleSeat(seat.id)}
                                disabled={seat.status === 'booked'}
                                className={`w-7 h-7 rounded-t-lg text-xs text-white font-medium transition-all duration-200 ${getSeatColor(seat)} ${
                                  seat.status === 'selected' ? 'scale-110' : ''
                                }`}
                                title={`${seat.id} - ₹${seat.price} (${seat.type})`}
                              >
                                {seat.number}
                              </button>
                            </div>
                          ))}
                      </div>
                      <div className="w-8 text-center font-semibold text-gray-700">{row}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Booking Summary</h2>
              
              <div className="space-y-4 mb-6 pb-6 border-b">
                <div>
                  <div className="text-sm text-gray-500">Event</div>
                  <div className="font-semibold text-gray-900">{event.title}</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-500">Venue</div>
                  <div className="font-semibold text-gray-900">{event.venue}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Date</div>
                    <div className="font-semibold text-gray-900">{new Date(selectedDate).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Time</div>
                    <div className="font-semibold text-gray-900">{selectedTime}</div>
                  </div>
                </div>
              </div>
              
              {selectedSeats.length > 0 ? (
                <>
                  <div className="space-y-3 mb-6 pb-6 border-b max-h-48 overflow-y-auto">
                    {selectedSeats.map(seat => (
                      <div key={seat.id} className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-gray-900">Seat {seat.id}</div>
                          <div className="text-sm text-gray-500 capitalize">{seat.type}</div>
                        </div>
                        <div className="font-semibold text-gray-900">₹{seat.price}</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal ({selectedSeats.length} {selectedSeats.length === 1 ? 'ticket' : 'tickets'})</span>
                      <span>₹{totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Convenience Fee</span>
                      <span>₹{Math.round(totalPrice * 0.05).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                      <span>Total</span>
                      <span>₹{(totalPrice + Math.round(totalPrice * 0.05)).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleProceedToPayment}
                    className="group w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-4 rounded-xl font-semibold hover:shadow-2xl transition-all duration-300"
                  >
                    Proceed to Payment
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">🎫</div>
                  <p className="text-gray-600">Select seats to continue</p>
                </div>
              )}
              
              <div className="mt-6 pt-6 border-t space-y-2 text-xs text-gray-500">
                <p>• Please review your selection before proceeding</p>
                <p>• Seats will be held for 10 minutes</p>
                <p>• All sales are final - no refunds</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Footer */}
      {selectedSeats.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm text-gray-600">{selectedSeats.length} {selectedSeats.length === 1 ? 'seat' : 'seats'} selected</div>
              <div className="text-xl font-bold text-gray-900">₹{(totalPrice + Math.round(totalPrice * 0.05)).toLocaleString()}</div>
            </div>
            <button
              onClick={handleProceedToPayment}
              className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-8 py-3 rounded-lg font-semibold"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  )
}


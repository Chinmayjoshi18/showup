'use client'

import { Clock, Zap } from 'lucide-react'

export interface TimeSlot {
  time: string
  label: string
  available: boolean
  price?: number
  isPrime?: boolean
}

interface TimeSlotPickerProps {
  timeSlots: TimeSlot[]
  selectedTime?: string
  onSelectTime: (time: string) => void
  className?: string
}

export default function TimeSlotPicker({
  timeSlots,
  selectedTime,
  onSelectTime,
  className = ''
}: TimeSlotPickerProps) {
  // Group time slots by time of day
  const morningSlots = timeSlots.filter(slot => {
    const hour = parseInt(slot.time.split(':')[0])
    return hour < 12
  })

  const afternoonSlots = timeSlots.filter(slot => {
    const hour = parseInt(slot.time.split(':')[0])
    return hour >= 12 && hour < 17
  })

  const eveningSlots = timeSlots.filter(slot => {
    const hour = parseInt(slot.time.split(':')[0])
    return hour >= 17
  })

  const renderTimeSlot = (slot: TimeSlot) => {
    const isSelected = selectedTime === slot.time
    const isAvailable = slot.available

    return (
      <button
        key={slot.time}
        onClick={() => isAvailable && onSelectTime(slot.time)}
        disabled={!isAvailable}
        className={`
          relative px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
          ${isSelected
            ? 'bg-gradient-to-br from-primary-600 to-secondary-600 text-white shadow-lg scale-105'
            : isAvailable
            ? 'bg-white border-2 border-gray-200 hover:border-primary-400 hover:bg-primary-50 hover:scale-105 text-gray-900'
            : 'bg-gray-50 border-2 border-gray-100 text-gray-400 cursor-not-allowed opacity-60'
          }
        `}
      >
        <div className="flex flex-col items-center gap-1">
          <span className="font-bold">{slot.label}</span>
          {slot.price && (
            <span className={`text-xs ${isSelected ? 'text-white/90' : 'text-gray-500'}`}>
              ₹{slot.price}
            </span>
          )}
        </div>
        
        {/* Prime time indicator */}
        {slot.isPrime && isAvailable && !isSelected && (
          <div className="absolute -top-1 -right-1 bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-md animate-pulse">
            <Zap className="w-2.5 h-2.5" />
            <span>Prime</span>
          </div>
        )}
        
        {/* Sold out badge */}
        {!isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] font-bold text-red-500 bg-white px-2 py-0.5 rounded-full border border-red-200">
              SOLD OUT
            </span>
          </div>
        )}
      </button>
    )
  }

  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-primary-600" />
        <h3 className="text-lg font-bold text-gray-900">Select Show Time</h3>
      </div>

      <div className="space-y-6">
        {/* Morning */}
        {morningSlots.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="text-sm font-semibold text-gray-700">🌅 Morning</div>
              <div className="text-xs text-gray-500">({morningSlots.length} shows)</div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {morningSlots.map(renderTimeSlot)}
            </div>
          </div>
        )}

        {/* Afternoon */}
        {afternoonSlots.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="text-sm font-semibold text-gray-700">☀️ Afternoon</div>
              <div className="text-xs text-gray-500">({afternoonSlots.length} shows)</div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {afternoonSlots.map(renderTimeSlot)}
            </div>
          </div>
        )}

        {/* Evening */}
        {eveningSlots.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="text-sm font-semibold text-gray-700">🌙 Evening</div>
              <div className="text-xs text-gray-500">({eveningSlots.length} shows)</div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {eveningSlots.map(renderTimeSlot)}
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-gradient-to-br from-primary-600 to-secondary-600" />
          <span className="text-gray-600">Selected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded border-2 border-primary-400 bg-white" />
          <span className="text-gray-600">Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-gray-100 border-2 border-gray-200" />
          <span className="text-gray-600">Sold Out</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Zap className="w-3 h-3 text-yellow-500" />
          <span className="text-gray-600">Prime Time</span>
        </div>
      </div>
    </div>
  )
}


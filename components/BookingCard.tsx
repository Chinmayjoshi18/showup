'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Calendar as CalendarIcon, Clock, X } from 'lucide-react'
import { format, addDays } from 'date-fns'
import Calendar from './Calendar'
import TimeSlotPicker, { TimeSlot } from './TimeSlotPicker'
import { Event } from '@/lib/data'

interface BookingCardProps {
  event: Event
}

export default function BookingCard({ event }: BookingCardProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined)
  const [showCalendar, setShowCalendar] = useState(false)
  const [showTimeSlots, setShowTimeSlots] = useState(false)

  // Convert event dates to Date objects
  const availableDates = event.dates.map(dateStr => new Date(dateStr))

  // Sample time slots (in real app, this would come from the backend based on selected date)
  const timeSlots: TimeSlot[] = [
    { time: '09:30', label: '9:30 AM', available: true, price: event.price.min },
    { time: '10:00', label: '10:00 AM', available: false, price: event.price.min },
    { time: '11:30', label: '11:30 AM', available: true, price: event.price.min + 50 },
    { time: '12:30', label: '12:30 PM', available: true, price: event.price.min + 50 },
    { time: '14:00', label: '2:00 PM', available: true, price: event.price.min + 100, isPrime: true },
    { time: '15:30', label: '3:30 PM', available: true, price: event.price.min + 100 },
    { time: '17:00', label: '5:00 PM', available: false, price: event.price.min + 150 },
    { time: '18:30', label: '6:30 PM', available: true, price: event.price.min + 150, isPrime: true },
    { time: '20:00', label: '8:00 PM', available: true, price: event.price.max, isPrime: true },
    { time: '21:30', label: '9:30 PM', available: true, price: event.price.max, isPrime: true },
  ]

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setShowCalendar(false)
    // Automatically show time slots after date selection
    setTimeout(() => setShowTimeSlots(true), 300)
    // Reset time selection when date changes
    setSelectedTime(undefined)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setShowTimeSlots(false)
  }

  const canProceed = selectedDate && selectedTime

  return (
    <div className="space-y-4">
      {/* Price Card */}
      <div className="sticky top-24 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-1">Starting from</div>
          <div className="text-4xl font-bold text-gray-900">
            ₹{event.price.min.toLocaleString()}
          </div>
          {event.price.max > event.price.min && (
            <div className="text-sm text-gray-500">
              Up to ₹{event.price.max.toLocaleString()}
            </div>
          )}
        </div>

        {/* Date Selection Button */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <button
              onClick={() => {
                setShowCalendar(!showCalendar)
                setShowTimeSlots(false)
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all ${
                selectedDate
                  ? 'border-primary-400 bg-primary-50'
                  : 'border-gray-300 hover:border-primary-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <CalendarIcon className="w-5 h-5 text-primary-600" />
                <span
                  className={`font-medium ${
                    selectedDate ? 'text-gray-900' : 'text-gray-500'
                  }`}
                >
                  {selectedDate
                    ? format(selectedDate, 'EEEE, MMMM d, yyyy')
                    : 'Choose a date'}
                </span>
              </div>
              <ChevronRight
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  showCalendar ? 'rotate-90' : ''
                }`}
              />
            </button>
          </div>

          {/* Time Selection Button (only show after date is selected) */}
          {selectedDate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Time
              </label>
              <button
                onClick={() => {
                  setShowTimeSlots(!showTimeSlots)
                  setShowCalendar(false)
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all ${
                  selectedTime
                    ? 'border-primary-400 bg-primary-50'
                    : 'border-gray-300 hover:border-primary-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary-600" />
                  <span
                    className={`font-medium ${
                      selectedTime ? 'text-gray-900' : 'text-gray-500'
                    }`}
                  >
                    {selectedTime
                      ? timeSlots.find(slot => slot.time === selectedTime)?.label
                      : 'Choose a time'}
                  </span>
                </div>
                <ChevronRight
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    showTimeSlots ? 'rotate-90' : ''
                  }`}
                />
              </button>
            </div>
          )}
        </div>

        {/* Book Button */}
        <Link
          href={canProceed ? `/book/${event.id}?date=${selectedDate?.toISOString()}&time=${selectedTime}` : '#'}
          className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg transition-all ${
            canProceed
              ? 'bg-gradient-to-r from-primary-600 to-secondary-600 hover:shadow-xl hover:scale-105 text-white'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          onClick={(e) => !canProceed && e.preventDefault()}
        >
          Select Seats
          <ChevronRight className="w-5 h-5" />
        </Link>

        {/* Benefits */}
        <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>Instant confirmation</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>E-tickets via email & SMS</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>Secure payment</span>
          </div>
        </div>
      </div>

      {/* Calendar Modal Overlay */}
      {showCalendar && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCalendar(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-3xl max-h-[90vh] overflow-hidden animate-slideUp sm:animate-scaleIn shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-primary-50 to-secondary-50">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Select Date</h3>
                <p className="text-sm text-gray-600 mt-1">Choose your preferred show date</p>
              </div>
              <button
                onClick={() => setShowCalendar(false)}
                className="p-2 hover:bg-white rounded-full transition-all"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Calendar */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
              <Calendar
                selectedDate={selectedDate}
                onSelectDate={handleDateSelect}
                availableDates={availableDates}
                minDate={new Date()}
              />
            </div>
          </div>
        </div>
      )}

      {/* Time Slots Modal Overlay */}
      {showTimeSlots && selectedDate && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowTimeSlots(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-white w-full sm:max-w-3xl sm:rounded-2xl rounded-t-3xl max-h-[90vh] overflow-hidden animate-slideUp sm:animate-scaleIn shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-primary-50 to-secondary-50">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Select Time</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </p>
              </div>
              <button
                onClick={() => setShowTimeSlots(false)}
                className="p-2 hover:bg-white rounded-full transition-all"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Time Slots */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
              <TimeSlotPicker
                timeSlots={timeSlots}
                selectedTime={selectedTime}
                onSelectTime={handleTimeSelect}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


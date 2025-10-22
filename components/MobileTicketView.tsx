'use client'

import { useState } from 'react'
import { QrCode, Download, Share2, MapPin, Calendar, Clock, Users, ChevronDown, ChevronUp } from 'lucide-react'

interface MobileTicketViewProps {
  booking: any
}

export default function MobileTicketView({ booking }: MobileTicketViewProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="md:hidden bg-white rounded-2xl overflow-hidden shadow-xl animate-fadeIn">
      {/* Ticket Header */}
      <div className="relative h-32 bg-gradient-to-r from-primary-600 to-secondary-600 p-4 flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-white font-bold text-lg line-clamp-2 mb-1">
            {booking.event.title}
          </h3>
          <div className="flex items-center gap-2 text-white/90 text-sm">
            <MapPin className="w-4 h-4" />
            <span>{booking.event.venue}</span>
          </div>
        </div>
        <div className="flex-shrink-0 ml-4">
          <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
            <QrCode className="w-12 h-12 text-gray-800" />
          </div>
        </div>
      </div>

      {/* Perforated Edge Effect */}
      <div className="relative h-4 bg-white">
        <div className="absolute top-0 left-0 right-0 flex justify-between px-2">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="w-4 h-4 bg-gray-50 rounded-full transform -translate-y-2" />
          ))}
        </div>
      </div>

      {/* Ticket Body */}
      <div className="p-5 space-y-4">
        {/* Booking ID */}
        <div className="text-center py-2 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500 mb-1">Booking ID</div>
          <div className="text-lg font-bold text-gray-900">{booking.id}</div>
        </div>

        {/* Event Details Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
            <Calendar className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs text-gray-500">Date</div>
              <div className="font-semibold text-gray-900 text-sm">
                {new Date(booking.date).toLocaleDateString('en-IN', { 
                  day: 'numeric', 
                  month: 'short',
                  year: 'numeric'
                })}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
            <Clock className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs text-gray-500">Time</div>
              <div className="font-semibold text-gray-900 text-sm">{booking.time}</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
            <Users className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs text-gray-500">Seats</div>
              <div className="font-semibold text-gray-900 text-sm">
                {booking.seats.length} {booking.seats.length === 1 ? 'Seat' : 'Seats'}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
            <span className="text-2xl">💰</span>
            <div>
              <div className="text-xs text-gray-500">Total</div>
              <div className="font-semibold text-gray-900 text-sm">
                ₹{booking.total?.toLocaleString() || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Expandable Section */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
        >
          <span className="font-medium text-gray-900">More Details</span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </button>

        {isExpanded && (
          <div className="space-y-3 animate-fadeIn">
            {/* Seat Details */}
            <div className="p-4 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl border border-primary-200">
              <div className="font-semibold text-gray-900 mb-2">Seat Numbers</div>
              <div className="flex flex-wrap gap-2">
                {booking.seats.map((seat: any, index: number) => (
                  <div key={index} className="px-3 py-1.5 bg-white border border-primary-300 rounded-lg text-sm font-medium text-gray-900">
                    {seat.id}
                  </div>
                ))}
              </div>
            </div>

            {/* Venue Details */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="font-semibold text-gray-900 mb-2">Venue Address</div>
              <p className="text-sm text-gray-600">
                {booking.event.venue}, {booking.event.city}
              </p>
            </div>

            {/* Important Info */}
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <div className="font-semibold text-yellow-900 mb-2">⚠️ Important</div>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Arrive 30 minutes before showtime</li>
                <li>• Carry a valid ID proof</li>
                <li>• Show this QR code at entry</li>
                <li>• No outside food allowed</li>
              </ul>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button className="flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition">
            <Download className="w-5 h-5" />
            Download
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition">
            <Share2 className="w-5 h-5" />
            Share
          </button>
        </div>

        {/* QR Code Section */}
        <div className="pt-4 border-t border-gray-200">
          <div className="text-center mb-3">
            <div className="text-sm font-semibold text-gray-900 mb-1">Scan to Enter</div>
            <div className="text-xs text-gray-500">Show this QR code at the venue</div>
          </div>
          <div className="flex justify-center">
            <div className="w-48 h-48 bg-white border-4 border-gray-200 rounded-2xl flex items-center justify-center">
              <QrCode className="w-32 h-32 text-gray-800" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


'use client'

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, isToday, startOfWeek, endOfWeek, isBefore, startOfDay } from 'date-fns'

interface CalendarProps {
  selectedDate?: Date
  onSelectDate: (date: Date) => void
  minDate?: Date
  maxDate?: Date
  availableDates?: Date[]
  className?: string
}

export default function Calendar({
  selectedDate,
  onSelectDate,
  minDate = new Date(),
  maxDate,
  availableDates,
  className = ''
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date())

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth))
    const end = endOfWeek(endOfMonth(currentMonth))
    return eachDayOfInterval({ start, end })
  }, [currentMonth])

  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const isDateDisabled = (date: Date) => {
    const today = startOfDay(new Date())
    if (isBefore(date, today)) return true
    if (maxDate && date > maxDate) return true
    if (availableDates && availableDates.length > 0) {
      return !availableDates.some(availableDate => isSameDay(date, availableDate))
    }
    return false
  }

  const isDateAvailable = (date: Date) => {
    if (!availableDates || availableDates.length === 0) return true
    return availableDates.some(availableDate => isSameDay(date, availableDate))
  }

  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={previousMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-bold text-gray-900">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
        </div>

        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const isCurrentMonth = isSameMonth(day, currentMonth)
          const isSelected = selectedDate && isSameDay(day, selectedDate)
          const isTodayDate = isToday(day)
          const isDisabled = isDateDisabled(day)
          const isAvailable = isDateAvailable(day)

          return (
            <button
              key={index}
              onClick={() => !isDisabled && onSelectDate(day)}
              disabled={isDisabled}
              className={`
                relative h-12 rounded-xl text-sm font-medium transition-all duration-200
                ${!isCurrentMonth ? 'text-gray-300' : ''}
                ${isSelected 
                  ? 'bg-gradient-to-br from-primary-600 to-secondary-600 text-white shadow-lg scale-105' 
                  : isDisabled
                  ? 'text-gray-300 cursor-not-allowed opacity-50'
                  : isAvailable
                  ? 'hover:bg-primary-50 hover:scale-105 text-gray-900 bg-white'
                  : 'text-gray-400 cursor-not-allowed'
                }
                ${isTodayDate && !isSelected ? 'ring-2 ring-primary-400 ring-opacity-50' : ''}
              `}
            >
              <span className="relative z-10">{format(day, 'd')}</span>
              
              {/* Today indicator */}
              {isTodayDate && !isSelected && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary-600 rounded-full" />
              )}
              
              {/* Available indicator */}
              {isAvailable && !isDisabled && !isSelected && isCurrentMonth && (
                <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-green-500 rounded-full" />
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-gradient-to-br from-primary-600 to-secondary-600" />
          <span className="text-gray-600">Selected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded ring-2 ring-primary-400 ring-opacity-50" />
          <span className="text-gray-600">Today</span>
        </div>
        {availableDates && availableDates.length > 0 && (
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-white border border-gray-200 relative">
              <div className="absolute top-0 right-0 w-1 h-1 bg-green-500 rounded-full" />
            </div>
            <span className="text-gray-600">Available</span>
          </div>
        )}
      </div>
    </div>
  )
}


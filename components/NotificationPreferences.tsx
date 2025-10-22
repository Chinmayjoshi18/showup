'use client'

import { useState, useEffect } from 'react'
import { Mail, MessageSquare, Bell, Check, Zap, Calendar, Clock } from 'lucide-react'
import { NotificationPreferences, defaultNotificationPreferences } from '@/lib/data'

export default function NotificationPreferencesComponent() {
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultNotificationPreferences)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    // Load preferences from localStorage
    const savedPrefs = localStorage.getItem('notificationPreferences')
    if (savedPrefs) {
      setPreferences(JSON.parse(savedPrefs))
    }
  }, [])

  const handleToggle = (channel: 'email' | 'sms' | 'push', setting: string) => {
    setPreferences(prev => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        [setting]: !prev[channel][setting as keyof typeof prev[typeof channel]]
      }
    }))
    setSaved(false)
  }

  const handleFrequencyChange = (frequency: 'instant' | 'daily' | 'weekly') => {
    setPreferences(prev => ({
      ...prev,
      frequency
    }))
    setSaved(false)
  }

  const handleSave = () => {
    localStorage.setItem('notificationPreferences', JSON.stringify(preferences))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const notificationTypes = [
    {
      id: 'bookingConfirmation',
      label: 'Booking Confirmations',
      description: 'Receive confirmation when your booking is successful',
      icon: Check,
      channels: ['email', 'sms']
    },
    {
      id: 'eventReminders',
      label: 'Event Reminders',
      description: 'Get notified 1 day before your booked events',
      icon: Calendar,
      channels: ['email', 'sms', 'push']
    },
    {
      id: 'priceDrops',
      label: 'Price Drop Alerts',
      description: 'Know when ticket prices drop for events you\'re interested in',
      icon: Zap,
      channels: ['email', 'push']
    },
    {
      id: 'newEvents',
      label: 'New Events in Your City',
      description: 'Discover new events happening near you',
      icon: Bell,
      channels: ['email', 'push']
    },
    {
      id: 'offers',
      label: 'Offers & Promotions',
      description: 'Receive exclusive deals and discount codes',
      icon: MessageSquare,
      channels: ['email', 'sms', 'push']
    },
    {
      id: 'newsletter',
      label: 'Newsletter',
      description: 'Weekly roundup of trending events and entertainment news',
      icon: Mail,
      channels: ['email']
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6 border border-primary-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Notification Preferences</h2>
        </div>
        <p className="text-gray-600">Manage how you receive updates and alerts from ShowUp</p>
      </div>

      {/* Channel Headers */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900">Notification Type</h3>
          </div>
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center gap-1">
              <Mail className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-medium text-gray-700">Email</span>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center gap-1">
              <MessageSquare className="w-5 h-5 text-green-600" />
              <span className="text-xs font-medium text-gray-700">SMS</span>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center gap-1">
              <Bell className="w-5 h-5 text-purple-600" />
              <span className="text-xs font-medium text-gray-700">Push</span>
            </div>
          </div>
        </div>

        {/* Notification Types */}
        <div className="space-y-4">
          {notificationTypes.map((type) => {
            const Icon = type.icon
            return (
              <div
                key={type.id}
                className="grid grid-cols-4 gap-4 items-center py-4 border-t border-gray-100 hover:bg-gray-50 rounded-lg px-2 transition-colors"
              >
                <div className="col-span-1">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
                      <Icon className="w-4 h-4 text-gray-700" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900 mb-1">{type.label}</h4>
                      <p className="text-xs text-gray-600">{type.description}</p>
                    </div>
                  </div>
                </div>

                {/* Email Toggle */}
                <div className="flex items-center justify-center">
                  {type.channels.includes('email') ? (
                    <button
                      onClick={() => handleToggle('email', type.id)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        preferences.email[type.id as keyof typeof preferences.email]
                          ? 'bg-primary-600'
                          : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          preferences.email[type.id as keyof typeof preferences.email]
                            ? 'translate-x-7'
                            : 'translate-x-1'
                        }`}
                      />
                    </button>
                  ) : (
                    <span className="text-gray-400 text-sm">—</span>
                  )}
                </div>

                {/* SMS Toggle */}
                <div className="flex items-center justify-center">
                  {type.channels.includes('sms') ? (
                    <button
                      onClick={() => handleToggle('sms', type.id)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        preferences.sms[type.id as keyof typeof preferences.sms]
                          ? 'bg-green-600'
                          : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          preferences.sms[type.id as keyof typeof preferences.sms]
                            ? 'translate-x-7'
                            : 'translate-x-1'
                        }`}
                      />
                    </button>
                  ) : (
                    <span className="text-gray-400 text-sm">—</span>
                  )}
                </div>

                {/* Push Toggle */}
                <div className="flex items-center justify-center">
                  {type.channels.includes('push') ? (
                    <button
                      onClick={() => handleToggle('push', type.id)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        preferences.push[type.id as keyof typeof preferences.push]
                          ? 'bg-purple-600'
                          : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          preferences.push[type.id as keyof typeof preferences.push]
                            ? 'translate-x-7'
                            : 'translate-x-1'
                        }`}
                      />
                    </button>
                  ) : (
                    <span className="text-gray-400 text-sm">—</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Frequency Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-gray-700" />
          <h3 className="text-lg font-bold text-gray-900">Notification Frequency</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Choose how often you want to receive promotional notifications
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'instant' as const, label: 'Instant', description: 'Receive as they happen' },
            { value: 'daily' as const, label: 'Daily', description: 'Once per day digest' },
            { value: 'weekly' as const, label: 'Weekly', description: 'Weekly summary' }
          ].map((freq) => (
            <button
              key={freq.value}
              onClick={() => handleFrequencyChange(freq.value)}
              className={`p-4 rounded-xl border-2 transition-all ${
                preferences.frequency === freq.value
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">{freq.label}</span>
                {preferences.frequency === freq.value && (
                  <div className="w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-600">{freq.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        {saved ? (
          <div className="flex items-center gap-2 text-green-600">
            <Check className="w-5 h-5" />
            <span className="font-medium">Preferences saved!</span>
          </div>
        ) : (
          <span className="text-sm text-gray-600">Changes not saved</span>
        )}
        <button
          onClick={handleSave}
          disabled={saved}
          className={`px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
            saved
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:shadow-lg'
          }`}
        >
          {saved ? 'Saved' : 'Save Preferences'}
        </button>
      </div>
    </div>
  )
}


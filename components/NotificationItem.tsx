'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Calendar, Tag, TrendingDown, Sparkles, Bell, AlertCircle } from 'lucide-react'
import { Notification, markNotificationAsRead } from '@/lib/data'

interface NotificationItemProps {
  notification: Notification
  onRead?: () => void
  onClose?: () => void
}

export default function NotificationItem({ notification, onRead, onClose }: NotificationItemProps) {
  const handleClick = () => {
    if (!notification.read) {
      markNotificationAsRead(notification.id)
      if (onRead) onRead()
    }
    if (onClose) onClose()
  }

  const getIcon = () => {
    switch (notification.type) {
      case 'booking':
        return <Calendar className="w-5 h-5 text-green-600" />
      case 'reminder':
        return <AlertCircle className="w-5 h-5 text-orange-600" />
      case 'price_drop':
        return <TrendingDown className="w-5 h-5 text-blue-600" />
      case 'new_event':
        return <Sparkles className="w-5 h-5 text-purple-600" />
      case 'offer':
        return <Tag className="w-5 h-5 text-red-600" />
      default:
        return <Bell className="w-5 h-5 text-gray-600" />
    }
  }

  const getIconBgColor = () => {
    switch (notification.type) {
      case 'booking':
        return 'bg-green-100'
      case 'reminder':
        return 'bg-orange-100'
      case 'price_drop':
        return 'bg-blue-100'
      case 'new_event':
        return 'bg-purple-100'
      case 'offer':
        return 'bg-red-100'
      default:
        return 'bg-gray-100'
    }
  }

  const timeAgo = formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })

  const content = (
    <div className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${!notification.read ? 'bg-blue-50/50' : ''}`}>
      <div className="flex gap-3">
        {/* Icon */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full ${getIconBgColor()} flex items-center justify-center`}>
          {getIcon()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className={`font-semibold text-sm ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
              {notification.title}
            </h4>
            {!notification.read && (
              <div className="flex-shrink-0 w-2 h-2 bg-primary-600 rounded-full mt-1" />
            )}
          </div>
          
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
            {notification.message}
          </p>

          {/* Image Preview */}
          {notification.imageUrl && (
            <div className="mb-2 rounded-lg overflow-hidden">
              <img
                src={notification.imageUrl}
                alt={notification.title}
                className="w-full h-24 object-cover"
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">{timeAgo}</span>
            {notification.actionText && (
              <span className="text-xs font-medium text-primary-600">
                {notification.actionText} →
              </span>
            )}
          </div>

          {/* Priority Badge */}
          {notification.priority === 'high' && (
            <div className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium mt-2">
              ⚡ Urgent
            </div>
          )}
        </div>
      </div>
    </div>
  )

  // If there's an action URL, wrap in Link
  if (notification.actionUrl) {
    return (
      <Link href={notification.actionUrl} onClick={handleClick}>
        {content}
      </Link>
    )
  }

  // Otherwise, just make it clickable to mark as read
  return <div onClick={handleClick}>{content}</div>
}


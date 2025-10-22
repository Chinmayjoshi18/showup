'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, Search, Heart, User, Ticket } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getWishlistCount } from '@/lib/data'

export default function BottomNav() {
  const pathname = usePathname()
  const [wishlistCount, setWishlistCount] = useState(0)

  useEffect(() => {
    // Update wishlist count
    const updateCount = () => {
      setWishlistCount(getWishlistCount())
    }
    
    updateCount()
    
    // Listen for storage changes
    window.addEventListener('storage', updateCount)
    
    // Poll for updates (for same-tab changes)
    const interval = setInterval(updateCount, 1000)
    
    return () => {
      window.removeEventListener('storage', updateCount)
      clearInterval(interval)
    }
  }, [])

  const navItems = [
    {
      href: '/',
      icon: Home,
      label: 'Home',
      active: pathname === '/'
    },
    {
      href: '/search',
      icon: Search,
      label: 'Search',
      active: pathname === '/search'
    },
    {
      href: '/browse',
      icon: Ticket,
      label: 'Browse',
      active: pathname === '/browse' || pathname?.startsWith('/event/')
    },
    {
      href: '/profile?tab=favorites',
      icon: Heart,
      label: 'Favorites',
      active: pathname === '/profile' && typeof window !== 'undefined' && window.location.search.includes('tab=favorites'),
      badge: wishlistCount
    },
    {
      href: '/profile',
      icon: User,
      label: 'Profile',
      active: pathname === '/profile' && (typeof window === 'undefined' || !window.location.search.includes('tab=favorites'))
    }
  ]

  return (
    <>
      {/* Bottom Navigation - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-inset-bottom">
        <div className="grid grid-cols-5 h-16">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex flex-col items-center justify-center gap-1 
                  transition-all duration-200 relative
                  ${item.active 
                    ? 'text-primary-600' 
                    : 'text-gray-500 active:text-primary-600'
                  }
                `}
              >
                {/* Active Indicator */}
                {item.active && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-b-full" />
                )}
                
                {/* Icon with badge */}
                <div className="relative">
                  <Icon 
                    className={`w-6 h-6 transition-transform ${
                      item.active ? 'scale-110' : ''
                    }`}
                    strokeWidth={item.active ? 2.5 : 2}
                  />
                  {item.badge && item.badge > 0 && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {item.badge > 9 ? '9+' : item.badge}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Label */}
                <span 
                  className={`text-xs font-medium ${
                    item.active ? 'font-semibold' : ''
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Spacer for content - Mobile Only */}
      <div className="md:hidden h-16" />
    </>
  )
}


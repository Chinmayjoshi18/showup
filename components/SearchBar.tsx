'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, X, Clock, TrendingUp, Mic } from 'lucide-react'
import { searchEvents } from '@/lib/data'

interface SearchBarProps {
  isMobile?: boolean
  onClose?: () => void
}

export default function SearchBar({ isMobile = false, onClose }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isListening, setIsListening] = useState(false)
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load recent searches from localStorage
  useEffect(() => {
    const recent = localStorage.getItem('recentSearches')
    if (recent) {
      setRecentSearches(JSON.parse(recent))
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Search and show suggestions
  useEffect(() => {
    if (query.length > 0) {
      const results = searchEvents(query).slice(0, 6)
      setSuggestions(results)
      setIsOpen(true)
    } else {
      setSuggestions([])
      if (recentSearches.length > 0) {
        setIsOpen(isOpen)
      }
    }
  }, [query])

  const handleSearch = (searchTerm: string) => {
    if (searchTerm.trim()) {
      // Save to recent searches
      const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5)
      setRecentSearches(updated)
      localStorage.setItem('recentSearches', JSON.stringify(updated))
      
      // Navigate to search results
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`)
      setQuery('')
      setIsOpen(false)
      onClose?.()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(query)
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }

  const removeRecentSearch = (search: string) => {
    const updated = recentSearches.filter(s => s !== search)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.lang = 'en-US'
      recognition.continuous = false
      recognition.interimResults = false

      recognition.onstart = () => {
        setIsListening(true)
      }

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setQuery(transcript)
        setIsListening(false)
      }

      recognition.onerror = () => {
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.start()
    } else {
      alert('Voice search is not supported in your browser')
    }
  }

  return (
    <div ref={searchRef} className={`relative ${isMobile ? 'w-full' : ''}`}>
      {/* Search Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className={`relative ${isMobile ? 'w-full' : 'w-96'} group`}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder="Search for movies, events, sports..."
            className="w-full pl-10 pr-24 py-2.5 bg-gray-100 hover:bg-gray-200 focus:bg-white border border-transparent focus:border-primary-500 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 text-gray-900 placeholder-gray-500"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            )}
            <button
              type="button"
              onClick={handleVoiceSearch}
              className={`p-1.5 hover:bg-gray-200 rounded-full transition-all ${
                isListening ? 'bg-red-100 animate-pulse' : ''
              }`}
              title="Voice search"
            >
              <Mic className={`w-4 h-4 ${isListening ? 'text-red-500' : 'text-gray-500'}`} />
            </button>
          </div>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-scaleIn max-h-[70vh] overflow-y-auto">
          {/* Recent Searches */}
          {query.length === 0 && recentSearches.length > 0 && (
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Clock className="w-4 h-4" />
                  Recent Searches
                </div>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                >
                  Clear All
                </button>
              </div>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between group hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
                  >
                    <button
                      onClick={() => {
                        setQuery(search)
                        handleSearch(search)
                      }}
                      className="flex-1 text-left text-sm text-gray-700"
                    >
                      {search}
                    </button>
                    <button
                      onClick={() => removeRecentSearch(search)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all"
                    >
                      <X className="w-3 h-3 text-gray-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trending Searches */}
          {query.length === 0 && (
            <div className="p-4 border-b">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <TrendingUp className="w-4 h-4" />
                Trending Searches
              </div>
              <div className="flex flex-wrap gap-2">
                {['Coldplay', 'IPL 2025', 'Stand-up Comedy', 'Movies This Weekend'].map((trend) => (
                  <button
                    key={trend}
                    onClick={() => {
                      setQuery(trend)
                      handleSearch(trend)
                    }}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-primary-100 hover:text-primary-700 rounded-full text-xs font-medium text-gray-700 transition-colors"
                  >
                    {trend}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-2">
              <div className="text-xs font-semibold text-gray-500 px-3 py-2">
                Suggestions ({suggestions.length})
              </div>
              {suggestions.map((event) => (
                <Link
                  key={event.id}
                  href={`/event/${event.id}`}
                  onClick={() => {
                    handleSearch(query)
                  }}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors group"
                >
                  <div className="w-12 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                      {event.title}
                    </h4>
                    <p className="text-sm text-gray-600 truncate">
                      {event.venue} • {event.genre.slice(0, 2).join(', ')}
                    </p>
                    {event.rating && (
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs font-medium text-yellow-600">★ {event.rating}</span>
                        <span className="text-xs text-gray-500">({event.votes?.toLocaleString()})</span>
                      </div>
                    )}
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    ₹{event.price.min}+
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* No Results */}
          {query.length > 0 && suggestions.length === 0 && (
            <div className="p-8 text-center">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="font-semibold text-gray-900 mb-1">No results found</h3>
              <p className="text-sm text-gray-600">Try searching for movies, events, or venues</p>
            </div>
          )}

          {/* Quick Links */}
          <div className="p-4 bg-gray-50 border-t">
            <div className="text-xs text-gray-500 mb-2">Quick Links</div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/browse?category=movies"
                className="text-xs text-primary-600 hover:underline"
                onClick={() => setIsOpen(false)}
              >
                All Movies
              </Link>
              <span className="text-gray-300">•</span>
              <Link
                href="/browse?category=events"
                className="text-xs text-primary-600 hover:underline"
                onClick={() => setIsOpen(false)}
              >
                Live Events
              </Link>
              <span className="text-gray-300">•</span>
              <Link
                href="/browse?category=sports"
                className="text-xs text-primary-600 hover:underline"
                onClick={() => setIsOpen(false)}
              >
                Sports
              </Link>
              <span className="text-gray-300">•</span>
              <Link
                href="/browse?category=plays"
                className="text-xs text-primary-600 hover:underline"
                onClick={() => setIsOpen(false)}
              >
                Comedy Shows
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube, Ticket } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-12">
        <div className="max-w-[1920px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <Ticket className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">ShowUp</span>
            </div>
            <p className="text-sm">
              Your all-in-one destination for entertainment. Discover, book, and experience the best events in your city.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary-400 transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary-400 transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary-400 transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary-400 transition">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Movies & Events */}
          <div>
            <h3 className="text-white font-semibold mb-4">Browse</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/browse?category=movies" className="hover:text-primary-400 transition">Movies</Link></li>
              <li><Link href="/browse?category=events" className="hover:text-primary-400 transition">Events & Concerts</Link></li>
              <li><Link href="/browse?category=sports" className="hover:text-primary-400 transition">Sports</Link></li>
              <li><Link href="/browse?category=plays" className="hover:text-primary-400 transition">Plays & Comedy</Link></li>
              <li><Link href="/browse?category=workshops" className="hover:text-primary-400 transition">Workshops</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-primary-400 transition">About Us</Link></li>
              <li><Link href="/organizer" className="hover:text-primary-400 transition">For Organizers</Link></li>
              <li><Link href="/careers" className="hover:text-primary-400 transition">Careers</Link></li>
              <li><Link href="/press" className="hover:text-primary-400 transition">Press & Media</Link></li>
              <li><Link href="/contact" className="hover:text-primary-400 transition">Contact Us</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/help" className="hover:text-primary-400 transition">Help Center</Link></li>
              <li><Link href="/refunds" className="hover:text-primary-400 transition">Refunds & Cancellation</Link></li>
              <li><Link href="/privacy" className="hover:text-primary-400 transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary-400 transition">Terms of Service</Link></li>
              <li><Link href="/security" className="hover:text-primary-400 transition">Security</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} ShowUp. All rights reserved. Because every great story begins with showing up.</p>
        </div>
        </div>
      </div>
    </footer>
  )
}


'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BottomNav from '@/components/BottomNav'
import { Providers } from '@/components/Providers'
import { useEffect } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Set document metadata
  useEffect(() => {
    document.title = 'ShowUp - Discover, Book, Experience'
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Your all-in-one destination for entertainment. From movies and concerts to sports events and workshops.')
    }
  }, [])

  return (
    <html lang="en">
      <head>
        <meta name="description" content="Your all-in-one destination for entertainment. From movies and concerts to sports events and workshops." />
        <meta name="keywords" content="movies, concerts, events, sports, booking, tickets, entertainment" />
      </head>
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main className="min-h-screen pb-16 md:pb-0">
            {children}
          </main>
          <Footer />
          <BottomNav />
        </Providers>
      </body>
    </html>
  )
}


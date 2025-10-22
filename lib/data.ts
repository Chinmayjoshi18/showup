// Mock data for the application

export interface Event {
  id: string
  title: string
  category: 'movies' | 'events' | 'sports' | 'plays' | 'workshops'
  image: string
  genre: string[]
  language?: string
  duration?: string
  rating?: number
  votes?: number
  description: string
  venue: string
  city: string
  dates: string[]
  price: {
    min: number
    max: number
  }
  featured?: boolean
}

export interface Review {
  id: string
  eventId: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  title: string
  content: string
  photos?: string[]
  date: string
  verified: boolean
  helpful: number
  notHelpful: number
  likes?: number
}

export interface ReviewSummary {
  eventId: string
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}

export interface Coupon {
  id: string
  code: string
  title: string
  description: string
  discountType: 'percentage' | 'flat' | 'cashback'
  discountValue: number
  minPurchase: number
  maxDiscount?: number
  validFrom: string
  validUntil: string
  categories?: Array<'movies' | 'events' | 'sports' | 'plays' | 'workshops'>
  userType?: 'new' | 'all' | 'premium'
  usageLimit?: number
  usedCount: number
  active: boolean
  featured?: boolean
  urgencyText?: string
}

export interface BankOffer {
  id: string
  bank: string
  cardType: 'credit' | 'debit' | 'both'
  logo: string
  title: string
  description: string
  discountType: 'percentage' | 'flat' | 'cashback'
  discountValue: number
  minPurchase: number
  maxDiscount?: number
  validUntil: string
  categories?: Array<'movies' | 'events' | 'sports' | 'plays' | 'workshops'>
  active: boolean
  featured?: boolean
}

export interface Notification {
  id: string
  type: 'booking' | 'reminder' | 'price_drop' | 'new_event' | 'offer' | 'system'
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
  actionText?: string
  imageUrl?: string
  eventId?: string
  bookingId?: string
  priority: 'low' | 'medium' | 'high'
}

export interface NotificationPreferences {
  email: {
    bookingConfirmation: boolean
    eventReminders: boolean
    priceDrops: boolean
    newEvents: boolean
    offers: boolean
    newsletter: boolean
  }
  sms: {
    bookingConfirmation: boolean
    eventReminders: boolean
    offers: boolean
  }
  push: {
    eventReminders: boolean
    priceDrops: boolean
    newEvents: boolean
    offers: boolean
  }
  frequency: 'instant' | 'daily' | 'weekly'
}

export interface WishlistItem {
  eventId: string
  addedAt: string
  notifyOnPriceDrop: boolean
  originalPrice?: number
}

export interface Booking {
  id: string
  eventId: string
  userId: string
  event: Event
  date: string
  time: string
  seats: Array<{ id: string; type: string; price: number }>
  total: number
  status: 'confirmed' | 'pending' | 'cancelled'
  bookingDate: string
  paymentMethod?: string
  paymentId?: string
  orderId?: string
  discount?: number
  appliedCoupon?: string
  qrCodeUrl?: string
}

export const events: Event[] = [
  // Movies
  {
    id: 'movie-1',
    title: 'Dune: Part Three',
    category: 'movies',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=1200&fit=crop',
    genre: ['Sci-Fi', 'Adventure', 'Drama'],
    language: 'English',
    duration: '2h 45m',
    rating: 9.1,
    votes: 12500,
    description: 'The epic conclusion to the Dune trilogy. Paul Atreides faces his destiny in a spectacular finale.',
    venue: 'Multiple Theatres',
    city: 'Mumbai',
    dates: ['2025-10-22', '2025-10-23', '2025-10-24', '2025-10-25'],
    price: { min: 200, max: 800 },
    featured: true
  },
  {
    id: 'movie-2',
    title: 'The Last Stand',
    category: 'movies',
    image: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=800&h=1200&fit=crop',
    genre: ['Action', 'Thriller'],
    language: 'Hindi',
    duration: '2h 20m',
    rating: 8.5,
    votes: 8900,
    description: 'An action-packed thriller that keeps you on the edge of your seat.',
    venue: 'Multiple Theatres',
    city: 'Mumbai',
    dates: ['2025-10-22', '2025-10-23', '2025-10-24'],
    price: { min: 150, max: 600 }
  },
  {
    id: 'movie-3',
    title: 'Love in Paris',
    category: 'movies',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=1200&fit=crop',
    genre: ['Romance', 'Comedy'],
    language: 'English',
    duration: '1h 55m',
    rating: 7.8,
    votes: 6200,
    description: 'A heartwarming romantic comedy set in the beautiful streets of Paris.',
    venue: 'Multiple Theatres',
    city: 'Mumbai',
    dates: ['2025-10-22', '2025-10-23', '2025-10-24', '2025-10-25'],
    price: { min: 180, max: 700 }
  },
  {
    id: 'movie-4',
    title: 'Pathaan Returns',
    category: 'movies',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=1200&fit=crop',
    genre: ['Action', 'Thriller', 'Spy'],
    language: 'Hindi',
    duration: '2h 30m',
    rating: 8.9,
    votes: 25000,
    description: 'Shah Rukh Khan returns as the legendary agent Pathaan in this high-octane spy thriller.',
    venue: 'Multiple Theatres',
    city: 'Mumbai',
    dates: ['2025-10-22', '2025-10-23', '2025-10-24', '2025-10-25', '2025-10-26'],
    price: { min: 200, max: 900 },
    featured: true
  },
  {
    id: 'movie-5',
    title: 'Jawan 2',
    category: 'movies',
    image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&h=1200&fit=crop',
    genre: ['Action', 'Drama', 'Social'],
    language: 'Hindi',
    duration: '2h 45m',
    rating: 8.7,
    votes: 22000,
    description: 'The vigilante returns with a new mission to fight corruption and injustice.',
    venue: 'Multiple Theatres',
    city: 'Delhi',
    dates: ['2025-10-22', '2025-10-23', '2025-10-24'],
    price: { min: 200, max: 850 }
  },
  {
    id: 'movie-6',
    title: 'Pushpa 2: The Rule',
    category: 'movies',
    image: 'https://images.unsplash.com/photo-1574267432644-f610b2a18b6b?w=800&h=1200&fit=crop',
    genre: ['Action', 'Drama', 'Thriller'],
    language: 'Telugu',
    duration: '3h',
    rating: 9.0,
    votes: 30000,
    description: 'Pushpa Raj dominates the red sandalwood smuggling empire. The most anticipated sequel of the year!',
    venue: 'Multiple Theatres',
    city: 'Hyderabad',
    dates: ['2025-10-22', '2025-10-23', '2025-10-24', '2025-10-25'],
    price: { min: 180, max: 750 },
    featured: true
  },
  {
    id: 'movie-7',
    title: 'Animal Park',
    category: 'movies',
    image: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=800&h=1200&fit=crop',
    genre: ['Action', 'Drama', 'Crime'],
    language: 'Hindi',
    duration: '2h 55m',
    rating: 8.5,
    votes: 18500,
    description: 'The intense saga continues with more action, drama, and family conflict.',
    venue: 'Multiple Theatres',
    city: 'Bangalore',
    dates: ['2025-10-23', '2025-10-24', '2025-10-25'],
    price: { min: 190, max: 800 }
  },
  {
    id: 'movie-8',
    title: 'Tiger 3',
    category: 'movies',
    image: 'https://images.unsplash.com/photo-1571847286937-03a25f854ea1?w=800&h=1200&fit=crop',
    genre: ['Action', 'Thriller', 'Spy'],
    language: 'Hindi',
    duration: '2h 35m',
    rating: 8.4,
    votes: 16000,
    description: 'Tiger faces his most dangerous mission yet in this edge-of-your-seat spy thriller.',
    venue: 'Multiple Theatres',
    city: 'Mumbai',
    dates: ['2025-10-22', '2025-10-23', '2025-10-24'],
    price: { min: 180, max: 700 }
  },
  {
    id: 'movie-9',
    title: 'Gadar 3',
    category: 'movies',
    image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&h=1200&fit=crop',
    genre: ['Action', 'Drama', 'Period'],
    language: 'Hindi',
    duration: '2h 40m',
    rating: 8.2,
    votes: 14000,
    description: 'The legendary love story continues with Tara Singh facing new challenges.',
    venue: 'Multiple Theatres',
    city: 'Delhi',
    dates: ['2025-10-22', '2025-10-23'],
    price: { min: 170, max: 650 }
  },
  {
    id: 'movie-10',
    title: 'Kalki 2898 AD',
    category: 'movies',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&h=1200&fit=crop',
    genre: ['Sci-Fi', 'Action', 'Mythology'],
    language: 'Telugu',
    duration: '3h 5m',
    rating: 9.3,
    votes: 28000,
    description: 'An epic sci-fi spectacle set in 2898 AD, blending mythology with futuristic action.',
    venue: 'Multiple Theatres',
    city: 'Hyderabad',
    dates: ['2025-10-22', '2025-10-23', '2025-10-24', '2025-10-25'],
    price: { min: 220, max: 950 },
    featured: true
  },
  {
    id: 'movie-11',
    title: 'Salaar: Part 2',
    category: 'movies',
    image: 'https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=800&h=1200&fit=crop',
    genre: ['Action', 'Thriller', 'Drama'],
    language: 'Kannada',
    duration: '2h 50m',
    rating: 8.8,
    votes: 20000,
    description: 'The dark and intense saga of Salaar continues with more action and intrigue.',
    venue: 'Multiple Theatres',
    city: 'Bangalore',
    dates: ['2025-10-23', '2025-10-24', '2025-10-25'],
    price: { min: 200, max: 800 }
  },
  {
    id: 'movie-12',
    title: 'Rocky aur Rani ki Prem Kahani 2',
    category: 'movies',
    image: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=800&h=1200&fit=crop',
    genre: ['Romance', 'Comedy', 'Drama'],
    language: 'Hindi',
    duration: '2h 25m',
    rating: 7.9,
    votes: 11000,
    description: 'The beloved couple returns with more romance, comedy, and family drama.',
    venue: 'Multiple Theatres',
    city: 'Mumbai',
    dates: ['2025-10-22', '2025-10-23', '2025-10-24'],
    price: { min: 180, max: 700 }
  },
  {
    id: 'movie-13',
    title: 'Kanguva',
    category: 'movies',
    image: 'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=800&h=1200&fit=crop',
    genre: ['Action', 'Period', 'Fantasy'],
    language: 'Tamil',
    duration: '2h 48m',
    rating: 8.6,
    votes: 17000,
    description: 'A warrior\'s journey through time in this epic period action fantasy.',
    venue: 'Multiple Theatres',
    city: 'Chennai',
    dates: ['2025-10-22', '2025-10-23', '2025-10-24'],
    price: { min: 190, max: 750 }
  },
  {
    id: 'movie-14',
    title: 'Brahmastra 2',
    category: 'movies',
    image: 'https://images.unsplash.com/photo-1611329532995-926d1ffc7c71?w=800&h=1200&fit=crop',
    genre: ['Fantasy', 'Action', 'Adventure'],
    language: 'Hindi',
    duration: '2h 55m',
    rating: 8.7,
    votes: 21000,
    description: 'Shiva\'s journey continues as he discovers more about the Astras and his destiny.',
    venue: 'Multiple Theatres',
    city: 'Mumbai',
    dates: ['2025-10-22', '2025-10-23', '2025-10-24', '2025-10-25'],
    price: { min: 210, max: 850 },
    featured: true
  },
  {
    id: 'movie-15',
    title: 'Adipurush 2',
    category: 'movies',
    image: 'https://images.unsplash.com/photo-1580044848984-d43c490b0e5d?w=800&h=1200&fit=crop',
    genre: ['Mythology', 'Action', 'Drama'],
    language: 'Hindi',
    duration: '3h',
    rating: 7.5,
    votes: 13000,
    description: 'The epic mythological saga continues with stunning visuals and grand storytelling.',
    venue: 'Multiple Theatres',
    city: 'Delhi',
    dates: ['2025-10-23', '2025-10-24'],
    price: { min: 180, max: 700 }
  },
  {
    id: 'movie-16',
    title: 'Oppenheimer',
    category: 'movies',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=1200&fit=crop',
    genre: ['Biography', 'Drama', 'History'],
    language: 'English',
    duration: '3h',
    rating: 9.2,
    votes: 35000,
    description: 'The story of American scientist J. Robert Oppenheimer and his role in developing the atomic bomb.',
    venue: 'Multiple Theatres',
    city: 'Bangalore',
    dates: ['2025-10-22', '2025-10-23', '2025-10-24'],
    price: { min: 250, max: 1000 }
  },
  {
    id: 'movie-17',
    title: 'Barbie',
    category: 'movies',
    image: 'https://images.unsplash.com/photo-1596345200878-4e99cd943440?w=800&h=1200&fit=crop',
    genre: ['Comedy', 'Adventure', 'Fantasy'],
    language: 'English',
    duration: '1h 54m',
    rating: 8.1,
    votes: 19000,
    description: 'Barbie and Ken embark on a journey of self-discovery in the real world.',
    venue: 'Multiple Theatres',
    city: 'Mumbai',
    dates: ['2025-10-22', '2025-10-23', '2025-10-24'],
    price: { min: 200, max: 750 }
  },
  {
    id: 'movie-18',
    title: 'The Batman 2',
    category: 'movies',
    image: 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=800&h=1200&fit=crop',
    genre: ['Action', 'Crime', 'Thriller'],
    language: 'English',
    duration: '2h 50m',
    rating: 9.0,
    votes: 27000,
    description: 'The Dark Knight returns to face new threats in Gotham City.',
    venue: 'Multiple Theatres',
    city: 'Pune',
    dates: ['2025-10-22', '2025-10-23', '2025-10-24', '2025-10-25'],
    price: { min: 220, max: 900 }
  },
  {
    id: 'movie-19',
    title: 'Avatar 3',
    category: 'movies',
    image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&h=1200&fit=crop',
    genre: ['Sci-Fi', 'Adventure', 'Fantasy'],
    language: 'English',
    duration: '3h 12m',
    rating: 9.4,
    votes: 40000,
    description: 'The saga of Pandora continues with breathtaking visuals and an epic story.',
    venue: 'Multiple Theatres',
    city: 'Mumbai',
    dates: ['2025-10-22', '2025-10-23', '2025-10-24', '2025-10-25', '2025-10-26'],
    price: { min: 250, max: 1200 },
    featured: true
  },
  {
    id: 'movie-20',
    title: 'Deadpool 3',
    category: 'movies',
    image: 'https://images.unsplash.com/photo-1608889175157-718b6205a50d?w=800&h=1200&fit=crop',
    genre: ['Action', 'Comedy', 'Superhero'],
    language: 'English',
    duration: '2h 10m',
    rating: 8.8,
    votes: 24000,
    description: 'The Merc with a Mouth returns with more laughs, action, and fourth-wall breaking.',
    venue: 'Multiple Theatres',
    city: 'Bangalore',
    dates: ['2025-10-22', '2025-10-23', '2025-10-24'],
    price: { min: 220, max: 850 }
  },
  {
    id: 'movie-21',
    title: 'Spider-Man: Beyond',
    category: 'movies',
    image: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&h=1200&fit=crop',
    genre: ['Action', 'Adventure', 'Superhero'],
    language: 'English',
    duration: '2h 25m',
    rating: 9.1,
    votes: 32000,
    description: 'Miles Morales faces his biggest challenge yet in this stunning animated sequel.',
    venue: 'Multiple Theatres',
    city: 'Chennai',
    dates: ['2025-10-22', '2025-10-23', '2025-10-24'],
    price: { min: 210, max: 850 }
  },
  {
    id: 'movie-22',
    title: 'Kantara 2',
    category: 'movies',
    image: 'https://images.unsplash.com/photo-1520262494112-9fe481d36ec3?w=800&h=1200&fit=crop',
    genre: ['Thriller', 'Mystery', 'Folklore'],
    language: 'Kannada',
    duration: '2h 35m',
    rating: 9.0,
    votes: 19000,
    description: 'The mystical folklore continues with more thrills and cultural richness.',
    venue: 'Multiple Theatres',
    city: 'Bangalore',
    dates: ['2025-10-23', '2025-10-24', '2025-10-25'],
    price: { min: 180, max: 700 }
  },
  {
    id: 'movie-23',
    title: 'Vikram 2',
    category: 'movies',
    image: 'https://images.unsplash.com/photo-1610396752614-f03b14e14cc4?w=800&h=1200&fit=crop',
    genre: ['Action', 'Thriller', 'Crime'],
    language: 'Tamil',
    duration: '2h 48m',
    rating: 8.9,
    votes: 18000,
    description: 'Kamal Haasan returns as the fierce agent in this action-packed thriller.',
    venue: 'Multiple Theatres',
    city: 'Chennai',
    dates: ['2025-10-22', '2025-10-23', '2025-10-24'],
    price: { min: 200, max: 800 }
  },
  {
    id: 'movie-24',
    title: 'Jailer 2',
    category: 'movies',
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&h=1200&fit=crop',
    genre: ['Action', 'Crime', 'Thriller'],
    language: 'Tamil',
    duration: '2h 40m',
    rating: 8.7,
    votes: 20000,
    description: 'Rajinikanth returns as the retired jailer with a mission to complete.',
    venue: 'Multiple Theatres',
    city: 'Chennai',
    dates: ['2025-10-22', '2025-10-23', '2025-10-24'],
    price: { min: 190, max: 750 }
  },
  {
    id: 'movie-25',
    title: 'Dunki',
    category: 'movies',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1200&fit=crop',
    genre: ['Drama', 'Comedy', 'Social'],
    language: 'Hindi',
    duration: '2h 35m',
    rating: 8.3,
    votes: 15000,
    description: 'A heartwarming story of friendship, dreams, and the journey to a better life.',
    venue: 'Multiple Theatres',
    city: 'Mumbai',
    dates: ['2025-10-22', '2025-10-23', '2025-10-24'],
    price: { min: 180, max: 700 }
  },

  // Events & Concerts
  {
    id: 'event-1',
    title: 'Coldplay: Music of the Spheres',
    category: 'events',
    image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=1200&fit=crop',
    genre: ['Rock', 'Pop', 'Live Concert'],
    duration: '3h',
    rating: 9.5,
    votes: 15000,
    description: 'Experience the magic of Coldplay live in Mumbai. Their biggest tour yet with spectacular visuals and all the hits.',
    venue: 'DY Patil Stadium',
    city: 'Mumbai',
    dates: ['2025-11-15', '2025-11-16'],
    price: { min: 2500, max: 25000 },
    featured: true
  },
  {
    id: 'event-2',
    title: 'Sunburn Festival 2025',
    category: 'events',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=1200&fit=crop',
    genre: ['EDM', 'Electronic', 'Festival'],
    duration: '2 days',
    rating: 9.0,
    votes: 11000,
    description: 'Asia\'s biggest electronic music festival returns with world-class DJs and an unforgettable experience.',
    venue: 'Vagator Beach',
    city: 'Goa',
    dates: ['2025-12-28', '2025-12-29'],
    price: { min: 3500, max: 15000 },
    featured: true
  },
  {
    id: 'event-3',
    title: 'NH7 Weekender',
    category: 'events',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=1200&fit=crop',
    genre: ['Indie', 'Rock', 'Multi-genre'],
    duration: '3 days',
    rating: 8.8,
    votes: 9500,
    description: 'India\'s happiest music festival featuring diverse genres and incredible artists.',
    venue: 'Mahalaxmi Racecourse',
    city: 'Mumbai',
    dates: ['2025-11-22', '2025-11-23', '2025-11-24'],
    price: { min: 2000, max: 8000 }
  },
  {
    id: 'event-4',
    title: 'Arijit Singh Live in Concert',
    category: 'events',
    image: 'https://images.unsplash.com/photo-1501612780327-45045538702b?w=800&h=1200&fit=crop',
    genre: ['Bollywood', 'Romantic', 'Live Concert'],
    duration: '3h 30m',
    rating: 9.6,
    votes: 28000,
    description: 'Experience the soulful voice of Arijit Singh live with all his chart-topping hits.',
    venue: 'Jio World Garden',
    city: 'Mumbai',
    dates: ['2025-11-20', '2025-11-21'],
    price: { min: 2000, max: 20000 },
    featured: true
  },
  {
    id: 'event-5',
    title: 'Diljit Dosanjh: Born to Shine Tour',
    category: 'events',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=1200&fit=crop',
    genre: ['Punjabi', 'Pop', 'Live Concert'],
    duration: '3h',
    rating: 9.2,
    votes: 20000,
    description: 'The Punjabi sensation brings his electrifying performance to Mumbai!',
    venue: 'NSCI Dome',
    city: 'Mumbai',
    dates: ['2025-12-05', '2025-12-06'],
    price: { min: 1800, max: 15000 }
  },
  {
    id: 'event-6',
    title: 'Lollapalooza India 2025',
    category: 'events',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=1200&fit=crop',
    genre: ['Rock', 'Alternative', 'Festival'],
    duration: '2 days',
    rating: 9.1,
    votes: 16000,
    description: 'The iconic music festival returns with an incredible lineup of international and Indian artists.',
    venue: 'Mahalaxmi Racecourse',
    city: 'Mumbai',
    dates: ['2025-11-28', '2025-11-29'],
    price: { min: 3000, max: 12000 },
    featured: true
  },
  {
    id: 'event-7',
    title: 'AP Dhillon: The Brownprint Tour',
    category: 'events',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=1200&fit=crop',
    genre: ['Punjabi', 'Hip-Hop', 'Pop'],
    duration: '2h 30m',
    rating: 8.9,
    votes: 14000,
    description: 'The global Punjabi music star performs his biggest hits live!',
    venue: 'Thyagaraj Stadium',
    city: 'Delhi',
    dates: ['2025-12-10'],
    price: { min: 1500, max: 10000 }
  },
  {
    id: 'event-8',
    title: 'Nucleya - Bass Rani Tour',
    category: 'events',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=1200&fit=crop',
    genre: ['EDM', 'Bass', 'Electronic'],
    duration: '3h',
    rating: 8.7,
    votes: 11000,
    description: 'India\'s bass music king drops the heavy beats in this explosive live show.',
    venue: 'Phoenix Marketcity',
    city: 'Bangalore',
    dates: ['2025-11-25'],
    price: { min: 1200, max: 4000 }
  },
  {
    id: 'event-9',
    title: 'Shreya Ghoshal Live',
    category: 'events',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=1200&fit=crop',
    genre: ['Bollywood', 'Classical', 'Melodies'],
    duration: '3h',
    rating: 9.4,
    votes: 19000,
    description: 'The queen of melody performs her most beloved songs live.',
    venue: 'Shilpakala Vedika',
    city: 'Hyderabad',
    dates: ['2025-12-01', '2025-12-02'],
    price: { min: 1800, max: 12000 }
  },
  {
    id: 'event-10',
    title: 'Pritam Live Concert',
    category: 'events',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&h=1200&fit=crop',
    genre: ['Bollywood', 'Rock', 'Pop'],
    duration: '2h 45m',
    rating: 8.8,
    votes: 13000,
    description: 'Bollywood\'s top music composer performs his chartbusters live!',
    venue: 'Nexus Whitefield',
    city: 'Bangalore',
    dates: ['2025-11-18'],
    price: { min: 1500, max: 8000 }
  },
  {
    id: 'event-11',
    title: 'Badshah - The Power Tour',
    category: 'events',
    image: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=800&h=1200&fit=crop',
    genre: ['Hip-Hop', 'Rap', 'Bollywood'],
    duration: '2h 30m',
    rating: 8.5,
    votes: 12000,
    description: 'The king of Indian hip-hop brings his high-energy show to your city!',
    venue: 'Phoenix Mall of Asia',
    city: 'Bangalore',
    dates: ['2025-12-08'],
    price: { min: 1200, max: 6000 }
  },
  {
    id: 'event-12',
    title: 'Sonu Nigam - The Journey Tour',
    category: 'events',
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&h=1200&fit=crop',
    genre: ['Bollywood', 'Classical', 'Pop'],
    duration: '3h 15m',
    rating: 9.3,
    votes: 17000,
    description: 'The versatile singer takes you on a musical journey spanning three decades.',
    venue: 'Music Academy',
    city: 'Chennai',
    dates: ['2025-11-22'],
    price: { min: 1600, max: 10000 }
  },
  {
    id: 'event-13',
    title: 'Divine - Street Dreams Tour',
    category: 'events',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=1200&fit=crop',
    genre: ['Hip-Hop', 'Rap', 'Gully'],
    duration: '2h',
    rating: 8.9,
    votes: 11000,
    description: 'Mumbai\'s own gully rap star performs his street anthems live!',
    venue: 'Richardson & Cruddas',
    city: 'Mumbai',
    dates: ['2025-12-12'],
    price: { min: 1000, max: 5000 }
  },
  {
    id: 'event-14',
    title: 'Ritviz - Ved Tour',
    category: 'events',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=1200&fit=crop',
    genre: ['Electronic', 'Pop', 'Indie'],
    duration: '2h 15m',
    rating: 8.6,
    votes: 9000,
    description: 'The indie electronic sensation performs his dreamy tracks live.',
    venue: 'Gilly\'s Redefined',
    city: 'Pune',
    dates: ['2025-11-30'],
    price: { min: 1200, max: 4000 }
  },
  {
    id: 'event-15',
    title: 'Amit Trivedi Live',
    category: 'events',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=1200&fit=crop',
    genre: ['Bollywood', 'Indie', 'Fusion'],
    duration: '3h',
    rating: 9.0,
    votes: 12500,
    description: 'The experimental composer performs his innovative soundtracks live.',
    venue: 'Hard Rock Cafe',
    city: 'Mumbai',
    dates: ['2025-12-15'],
    price: { min: 1500, max: 7000 }
  },
  {
    id: 'event-16',
    title: 'Vishal-Shekhar Live',
    category: 'events',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=1200&fit=crop',
    genre: ['Bollywood', 'Pop', 'Rock'],
    duration: '2h 50m',
    rating: 8.7,
    votes: 10500,
    description: 'The dynamic duo performs their biggest Bollywood hits!',
    venue: 'DLF Cyber Hub',
    city: 'Delhi',
    dates: ['2025-12-18'],
    price: { min: 1400, max: 6500 }
  },
  {
    id: 'event-17',
    title: 'Armaan Malik - Next 2 Me Tour',
    category: 'events',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&h=1200&fit=crop',
    genre: ['Pop', 'Bollywood', 'English'],
    duration: '2h 30m',
    rating: 8.4,
    votes: 9500,
    description: 'The young sensation performs his English and Hindi hits.',
    venue: 'Phoenix Marketcity',
    city: 'Chennai',
    dates: ['2025-12-20'],
    price: { min: 1300, max: 5500 }
  },
  {
    id: 'event-18',
    title: 'Guru Randhawa World Tour',
    category: 'events',
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&h=1200&fit=crop',
    genre: ['Punjabi', 'Pop', 'Dance'],
    duration: '2h 45m',
    rating: 8.6,
    votes: 11500,
    description: 'The Punjabi pop star performs his catchy dance numbers live!',
    venue: 'UB City',
    city: 'Bangalore',
    dates: ['2025-12-22'],
    price: { min: 1400, max: 7000 }
  },
  {
    id: 'event-19',
    title: 'Neha Kakkar - O Humsafar Tour',
    category: 'events',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=1200&fit=crop',
    genre: ['Bollywood', 'Pop', 'Dance'],
    duration: '2h 30m',
    rating: 8.3,
    votes: 13000,
    description: 'Bollywood\'s leading female voice performs her party anthems!',
    venue: 'PVR Icon',
    city: 'Mumbai',
    dates: ['2025-12-24'],
    price: { min: 1300, max: 6000 }
  },
  {
    id: 'event-20',
    title: 'The Local Train Live',
    category: 'events',
    image: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=800&h=1200&fit=crop',
    genre: ['Rock', 'Indie', 'Hindi'],
    duration: '2h 15m',
    rating: 9.1,
    votes: 10000,
    description: 'India\'s favorite indie rock band performs their powerful tracks!',
    venue: 'antiSOCIAL',
    city: 'Delhi',
    dates: ['2025-12-26'],
    price: { min: 1000, max: 3500 }
  },
  {
    id: 'event-21',
    title: 'Papon - Acoustic Sessions',
    category: 'events',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=1200&fit=crop',
    genre: ['Folk', 'Bollywood', 'Acoustic'],
    duration: '2h',
    rating: 8.8,
    votes: 7500,
    description: 'The soulful singer performs intimate acoustic versions of his hits.',
    venue: 'The Blue Frog',
    city: 'Pune',
    dates: ['2025-12-28'],
    price: { min: 1100, max: 4000 }
  },
  {
    id: 'event-22',
    title: 'When Chai Met Toast - Tour',
    category: 'events',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&h=1200&fit=crop',
    genre: ['Indie', 'Pop', 'Acoustic'],
    duration: '2h',
    rating: 8.9,
    votes: 8500,
    description: 'The beloved indie band brings their feel-good music to you!',
    venue: 'Hard Rock Cafe',
    city: 'Bangalore',
    dates: ['2025-12-30'],
    price: { min: 1000, max: 3500 }
  },
  {
    id: 'event-23',
    title: 'Prateek Kuhad - Kasoor Tour',
    category: 'events',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=1200&fit=crop',
    genre: ['Indie', 'Pop', 'Acoustic'],
    duration: '2h 30m',
    rating: 9.2,
    votes: 11000,
    description: 'The indie sensation performs his melancholic yet beautiful tracks.',
    venue: 'Phoenix Marketcity',
    city: 'Mumbai',
    dates: ['2026-01-02'],
    price: { min: 1200, max: 5000 }
  },
  {
    id: 'event-24',
    title: 'Raghu Dixit Project Live',
    category: 'events',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=1200&fit=crop',
    genre: ['Folk', 'Fusion', 'Indie'],
    duration: '2h 15m',
    rating: 8.7,
    votes: 7000,
    description: 'Experience Karnataka\'s vibrant folk music with contemporary fusion!',
    venue: 'Chowdiah Memorial Hall',
    city: 'Bangalore',
    dates: ['2026-01-05'],
    price: { min: 900, max: 3000 }
  },
  {
    id: 'event-25',
    title: 'Bombay Jayashri - Classical Concert',
    category: 'events',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=1200&fit=crop',
    genre: ['Classical', 'Carnatic', 'Traditional'],
    duration: '3h',
    rating: 9.5,
    votes: 6500,
    description: 'The legendary Carnatic vocalist presents an evening of divine music.',
    venue: 'Music Academy',
    city: 'Chennai',
    dates: ['2026-01-08'],
    price: { min: 500, max: 2000 }
  },

  // Sports
  {
    id: 'sport-1',
    title: 'Mumbai Indians vs Chennai Super Kings',
    category: 'sports',
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&h=1200&fit=crop',
    genre: ['Cricket', 'IPL'],
    duration: '4h',
    rating: 9.2,
    votes: 18000,
    description: 'The ultimate rivalry! Watch the biggest clash in IPL history live at Wankhede Stadium.',
    venue: 'Wankhede Stadium',
    city: 'Mumbai',
    dates: ['2025-10-28'],
    price: { min: 1000, max: 10000 },
    featured: true
  },
  {
    id: 'sport-2',
    title: 'ISL: Mumbai City FC vs Bengaluru FC',
    category: 'sports',
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=1200&fit=crop',
    genre: ['Football', 'ISL'],
    duration: '2h',
    rating: 8.3,
    votes: 5600,
    description: 'Catch all the action as Mumbai City FC takes on Bengaluru FC in this crucial ISL match.',
    venue: 'Mumbai Football Arena',
    city: 'Mumbai',
    dates: ['2025-11-05'],
    price: { min: 500, max: 3000 }
  },

  // Plays & Comedy
  {
    id: 'play-1',
    title: 'Kapil Sharma Live',
    category: 'plays',
    image: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&h=1200&fit=crop',
    genre: ['Stand-up', 'Comedy'],
    duration: '2h 30m',
    rating: 8.9,
    votes: 12000,
    description: 'Get ready for a night of non-stop laughter with India\'s comedy king Kapil Sharma!',
    venue: 'NSCI Dome',
    city: 'Mumbai',
    dates: ['2025-10-30', '2025-10-31'],
    price: { min: 1500, max: 5000 },
    featured: true
  },
  {
    id: 'play-2',
    title: 'Hamlet: A Modern Retelling',
    category: 'plays',
    image: 'https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=800&h=1200&fit=crop',
    genre: ['Theatre', 'Drama', 'Classic'],
    duration: '2h 15m',
    rating: 8.6,
    votes: 3400,
    description: 'Shakespeare\'s timeless tragedy reimagined for the modern stage with stunning performances.',
    venue: 'Prithvi Theatre',
    city: 'Mumbai',
    dates: ['2025-11-08', '2025-11-09', '2025-11-10'],
    price: { min: 500, max: 1500 }
  },
  {
    id: 'play-3',
    title: 'Zakir Khan: Mannpasand Tour',
    category: 'plays',
    image: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800&h=1200&fit=crop',
    genre: ['Stand-up', 'Hindi Comedy'],
    duration: '2h',
    rating: 9.1,
    votes: 14500,
    description: 'Zakir Khan brings his unique storytelling and humor to Mumbai. Don\'t miss this hilarious show!',
    venue: 'Rangsharda Auditorium',
    city: 'Mumbai',
    dates: ['2025-11-12', '2025-11-13'],
    price: { min: 1200, max: 4000 }
  },

  // Workshops
  {
    id: 'workshop-1',
    title: 'Photography Masterclass',
    category: 'workshops',
    image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&h=1200&fit=crop',
    genre: ['Photography', 'Education'],
    duration: '6h',
    rating: 8.7,
    votes: 2100,
    description: 'Learn professional photography techniques from award-winning photographers.',
    venue: 'Bandra Studio',
    city: 'Mumbai',
    dates: ['2025-10-26', '2025-10-27'],
    price: { min: 2500, max: 2500 }
  },
  {
    id: 'workshop-2',
    title: 'Stand-up Comedy Workshop',
    category: 'workshops',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=1200&fit=crop',
    genre: ['Comedy', 'Performance'],
    duration: '4h',
    rating: 8.4,
    votes: 1800,
    description: 'Discover your inner comedian with this hands-on workshop led by professional comics.',
    venue: 'The Comedy Store',
    city: 'Mumbai',
    dates: ['2025-11-03'],
    price: { min: 1500, max: 1500 }
  }
]

export function getEventsByCategory(category?: string) {
  if (!category || category === 'all') return events
  return events.filter(event => event.category === category)
}

export function getFeaturedEvents() {
  return events.filter(event => event.featured)
}

export function getEventById(id: string) {
  return events.find(event => event.id === id)
}

// Advanced search function that searches across multiple fields
export function searchEvents(query: string): Event[] {
  if (!query || query.trim().length === 0) {
    return []
  }

  const lowerQuery = query.toLowerCase().trim()
  
  return events.filter(event => {
    // Search in title (highest priority)
    if (event.title.toLowerCase().includes(lowerQuery)) return true
    
    // Search in description
    if (event.description.toLowerCase().includes(lowerQuery)) return true
    
    // Search in venue
    if (event.venue.toLowerCase().includes(lowerQuery)) return true
    
    // Search in genres
    if (event.genre.some(g => g.toLowerCase().includes(lowerQuery))) return true
    
    // Search in category
    if (event.category.toLowerCase().includes(lowerQuery)) return true
    
    // Search in language (if exists)
    if (event.language && event.language.toLowerCase().includes(lowerQuery)) return true
    
    return false
  })
}

// Mock Reviews Data
export const reviews: Review[] = [
  // Reviews for Dune: Part Three (movie-1)
  {
    id: 'review-1',
    eventId: 'movie-1',
    userId: 'user-1',
    userName: 'Rajesh Kumar',
    userAvatar: 'https://i.pravatar.cc/150?u=user1',
    rating: 5,
    title: 'Absolutely Mind-Blowing!',
    content: 'This is cinema at its finest! The visuals are breathtaking, the story is gripping, and the performances are stellar. Denis Villeneuve has outdone himself. A must-watch on IMAX!',
    photos: [
      'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=300&fit=crop'
    ],
    date: '2025-10-20',
    verified: true,
    helpful: 245,
    notHelpful: 8
  },
  {
    id: 'review-2',
    eventId: 'movie-1',
    userId: 'user-2',
    userName: 'Priya Sharma',
    userAvatar: 'https://i.pravatar.cc/150?u=user2',
    rating: 5,
    title: 'Epic Conclusion!',
    content: 'The trilogy ends on a high note. Every frame is a work of art. The sound design is phenomenal. Worth every penny!',
    date: '2025-10-19',
    verified: true,
    helpful: 189,
    notHelpful: 5
  },
  {
    id: 'review-3',
    eventId: 'movie-1',
    userId: 'user-3',
    userName: 'Amit Patel',
    userAvatar: 'https://i.pravatar.cc/150?u=user3',
    rating: 4,
    title: 'Great but a bit long',
    content: 'Amazing visuals and story, but the 3-hour runtime felt a bit stretched. Still, a must-watch for sci-fi fans!',
    date: '2025-10-18',
    verified: true,
    helpful: 134,
    notHelpful: 21
  },
  {
    id: 'review-4',
    eventId: 'movie-1',
    userId: 'user-4',
    userName: 'Sarah Williams',
    userAvatar: 'https://i.pravatar.cc/150?u=user4',
    rating: 5,
    title: 'IMAX is a Must!',
    content: 'Watched it in IMAX and it was an experience I\'ll never forget. The scale, the scope, everything is perfect!',
    photos: ['https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=300&fit=crop'],
    date: '2025-10-17',
    verified: false,
    helpful: 98,
    notHelpful: 3
  },

  // Reviews for Coldplay concert (event-1)
  {
    id: 'review-5',
    eventId: 'event-1',
    userId: 'user-5',
    userName: 'Neha Gupta',
    userAvatar: 'https://i.pravatar.cc/150?u=user5',
    rating: 5,
    title: 'Best Night of My Life!',
    content: 'Coldplay live was absolutely magical! The LED wristbands, the energy, Chris Martin\'s voice - everything was perfect. A dream come true!',
    photos: [
      'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=300&fit=crop'
    ],
    date: '2025-11-16',
    verified: true,
    helpful: 567,
    notHelpful: 12
  },
  {
    id: 'review-6',
    eventId: 'event-1',
    userId: 'user-6',
    userName: 'Vikram Singh',
    userAvatar: 'https://i.pravatar.cc/150?u=user6',
    rating: 5,
    title: 'Worth Every Rupee!',
    content: 'The production quality was insane! The visuals, the sound, the atmosphere - Coldplay knows how to put on a show. Will definitely attend again!',
    date: '2025-11-16',
    verified: true,
    helpful: 423,
    notHelpful: 8
  },
  {
    id: 'review-7',
    eventId: 'event-1',
    userId: 'user-7',
    userName: 'Kavya Reddy',
    userAvatar: 'https://i.pravatar.cc/150?u=user7',
    rating: 4,
    title: 'Amazing but crowded',
    content: 'The concert was fantastic but the venue was extremely crowded. Hard to move around. Still, Coldplay was incredible!',
    date: '2025-11-15',
    verified: true,
    helpful: 201,
    notHelpful: 34
  },

  // Reviews for IPL Match (sport-1)
  {
    id: 'review-8',
    eventId: 'sport-1',
    userId: 'user-8',
    userName: 'Rohan Mehta',
    userAvatar: 'https://i.pravatar.cc/150?u=user8',
    rating: 5,
    title: 'Electric Atmosphere!',
    content: 'MI vs CSK is always special! The energy at Wankhede was incredible. Witnessed a last-ball finish. Cricket at its best!',
    photos: ['https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=300&fit=crop'],
    date: '2025-10-28',
    verified: true,
    helpful: 312,
    notHelpful: 15
  },
  {
    id: 'review-9',
    eventId: 'sport-1',
    userId: 'user-9',
    userName: 'Aditya Kapoor',
    userAvatar: 'https://i.pravatar.cc/150?u=user9',
    rating: 4,
    title: 'Great match, long queues',
    content: 'The match was thrilling but the entry queues were too long. Food stalls were understaffed. Otherwise, a great experience!',
    date: '2025-10-28',
    verified: true,
    helpful: 156,
    notHelpful: 23
  },

  // Reviews for Kapil Sharma (play-1)
  {
    id: 'review-10',
    eventId: 'play-1',
    userId: 'user-10',
    userName: 'Sneha Joshi',
    userAvatar: 'https://i.pravatar.cc/150?u=user10',
    rating: 5,
    title: 'Laughed Till My Stomach Hurt!',
    content: 'Kapil was hilarious! Two and a half hours of non-stop laughter. His timing is impeccable. Highly recommend!',
    date: '2025-10-31',
    verified: true,
    helpful: 278,
    notHelpful: 9
  },
  {
    id: 'review-11',
    eventId: 'play-1',
    userId: 'user-11',
    userName: 'Rahul Desai',
    userAvatar: 'https://i.pravatar.cc/150?u=user11',
    rating: 5,
    title: 'Comedy Gold!',
    content: 'Worth every penny! Kapil\'s energy is infectious. Great jokes, perfect delivery. A must-watch!',
    date: '2025-10-30',
    verified: false,
    helpful: 198,
    notHelpful: 7
  },

  // Reviews for Pathaan Returns (movie-4)
  {
    id: 'review-12',
    eventId: 'movie-4',
    userId: 'user-12',
    userName: 'Arjun Malhotra',
    userAvatar: 'https://i.pravatar.cc/150?u=user12',
    rating: 5,
    title: 'SRK is Back with a Bang!',
    content: 'Shah Rukh Khan proves age is just a number! The action sequences are world-class. A perfect masala entertainer!',
    photos: ['https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop'],
    date: '2025-10-23',
    verified: true,
    helpful: 445,
    notHelpful: 18
  },
  {
    id: 'review-13',
    eventId: 'movie-4',
    userId: 'user-13',
    userName: 'Meera Iyer',
    userAvatar: 'https://i.pravatar.cc/150?u=user13',
    rating: 4,
    title: 'Paisa Vasool!',
    content: 'High-octane action, great dialogues, and SRK\'s charisma. A complete package for the family!',
    date: '2025-10-22',
    verified: true,
    helpful: 334,
    notHelpful: 21
  }
]

// Helper function to get reviews for an event
export function getReviewsByEventId(eventId: string): Review[] {
  return reviews.filter(review => review.eventId === eventId)
}

// Helper function to calculate review summary
export function getReviewSummary(eventId: string): ReviewSummary {
  const eventReviews = getReviewsByEventId(eventId)
  
  if (eventReviews.length === 0) {
    return {
      eventId,
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    }
  }

  const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  let totalRating = 0

  eventReviews.forEach(review => {
    totalRating += review.rating
    ratingDistribution[review.rating as keyof typeof ratingDistribution]++
  })

  return {
    eventId,
    averageRating: parseFloat((totalRating / eventReviews.length).toFixed(1)),
    totalReviews: eventReviews.length,
    ratingDistribution
  }
}

// Helper function to sort reviews
export function sortReviews(reviews: Review[], sortBy: 'helpful' | 'recent' | 'rating'): Review[] {
  const sorted = [...reviews]
  
  switch (sortBy) {
    case 'helpful':
      return sorted.sort((a, b) => b.helpful - a.helpful)
    case 'recent':
      return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating)
    default:
      return sorted
  }
}

// Mock Coupons Data
export const coupons: Coupon[] = [
  {
    id: 'coupon-1',
    code: 'WELCOME100',
    title: 'Welcome Offer',
    description: 'Get ₹100 off on your first booking!',
    discountType: 'flat',
    discountValue: 100,
    minPurchase: 500,
    validFrom: '2025-01-01',
    validUntil: '2025-12-31',
    userType: 'new',
    usageLimit: 1,
    usedCount: 2845,
    active: true,
    featured: true,
    urgencyText: 'First booking only!'
  },
  {
    id: 'coupon-2',
    code: 'MOVIE200',
    title: '₹200 Off on Movies',
    description: 'Enjoy movies at discounted prices',
    discountType: 'flat',
    discountValue: 200,
    minPurchase: 1000,
    validFrom: '2025-10-01',
    validUntil: '2025-11-30',
    categories: ['movies'],
    userType: 'all',
    usedCount: 1567,
    active: true,
    featured: true,
    urgencyText: 'Limited time offer!'
  },
  {
    id: 'coupon-3',
    code: 'EARLYBIRD',
    title: 'Early Bird Special',
    description: 'Book early and save 20%!',
    discountType: 'percentage',
    discountValue: 20,
    minPurchase: 500,
    maxDiscount: 500,
    validFrom: '2025-10-01',
    validUntil: '2025-12-31',
    userType: 'all',
    usedCount: 3421,
    active: true,
    featured: true,
    urgencyText: 'Book 7 days in advance'
  },
  {
    id: 'coupon-4',
    code: 'WEEKEND50',
    title: 'Weekend Bonanza',
    description: 'Flat ₹50 off on weekend bookings',
    discountType: 'flat',
    discountValue: 50,
    minPurchase: 300,
    validFrom: '2025-10-01',
    validUntil: '2025-12-31',
    userType: 'all',
    usedCount: 987,
    active: true,
  },
  {
    id: 'coupon-5',
    code: 'CONCERT500',
    title: 'Concert Madness',
    description: 'Save ₹500 on concert tickets',
    discountType: 'flat',
    discountValue: 500,
    minPurchase: 3000,
    validFrom: '2025-10-01',
    validUntil: '2025-11-30',
    categories: ['events'],
    userType: 'all',
    usedCount: 543,
    active: true,
    featured: true,
    urgencyText: 'Only 100 uses left!'
  },
  {
    id: 'coupon-6',
    code: 'SPORTS15',
    title: 'Sports Special',
    description: '15% off on all sports events',
    discountType: 'percentage',
    discountValue: 15,
    minPurchase: 800,
    maxDiscount: 400,
    validFrom: '2025-10-01',
    validUntil: '2025-12-31',
    categories: ['sports'],
    userType: 'all',
    usedCount: 234,
    active: true
  },
  {
    id: 'coupon-7',
    code: 'LAUGH100',
    title: 'Comedy Night Deal',
    description: '₹100 off on comedy shows',
    discountType: 'flat',
    discountValue: 100,
    minPurchase: 500,
    validFrom: '2025-10-01',
    validUntil: '2025-11-30',
    categories: ['plays'],
    userType: 'all',
    usedCount: 456,
    active: true
  },
  {
    id: 'coupon-8',
    code: 'CASHBACK25',
    title: '25% Cashback',
    description: 'Get 25% cashback up to ₹250',
    discountType: 'cashback',
    discountValue: 25,
    minPurchase: 1000,
    maxDiscount: 250,
    validFrom: '2025-10-01',
    validUntil: '2025-10-31',
    userType: 'all',
    usedCount: 1876,
    active: true,
    featured: true,
    urgencyText: 'This month only!'
  },
  {
    id: 'coupon-9',
    code: 'FESTIVE300',
    title: 'Festive Mega Sale',
    description: 'Flat ₹300 off on bookings above ₹1500',
    discountType: 'flat',
    discountValue: 300,
    minPurchase: 1500,
    validFrom: '2025-10-15',
    validUntil: '2025-11-15',
    userType: 'all',
    usedCount: 2134,
    active: true,
    featured: true,
    urgencyText: 'Festive Special!'
  },
  {
    id: 'coupon-10',
    code: 'BOGO',
    title: 'Buy 1 Get 1',
    description: 'Book 2 tickets and get 50% off on total',
    discountType: 'percentage',
    discountValue: 50,
    minPurchase: 600,
    maxDiscount: 300,
    validFrom: '2025-10-01',
    validUntil: '2025-12-31',
    categories: ['movies'],
    userType: 'all',
    usedCount: 3456,
    active: true
  }
]

// Mock Bank Offers Data
export const bankOffers: BankOffer[] = [
  {
    id: 'bank-1',
    bank: 'HDFC Bank',
    cardType: 'credit',
    logo: '🏦',
    title: 'HDFC Credit Card Offer',
    description: 'Get 20% off up to ₹500 on HDFC Credit Cards',
    discountType: 'percentage',
    discountValue: 20,
    minPurchase: 1000,
    maxDiscount: 500,
    validUntil: '2025-12-31',
    active: true,
    featured: true
  },
  {
    id: 'bank-2',
    bank: 'ICICI Bank',
    cardType: 'both',
    logo: '💳',
    title: 'ICICI Bank Offer',
    description: 'Flat ₹200 off on ICICI Cards',
    discountType: 'flat',
    discountValue: 200,
    minPurchase: 800,
    validUntil: '2025-11-30',
    active: true,
    featured: true
  },
  {
    id: 'bank-3',
    bank: 'SBI',
    cardType: 'debit',
    logo: '🏛️',
    title: 'SBI Debit Card Offer',
    description: '15% cashback up to ₹300 on SBI Debit Cards',
    discountType: 'cashback',
    discountValue: 15,
    minPurchase: 1200,
    maxDiscount: 300,
    validUntil: '2025-12-31',
    active: true
  },
  {
    id: 'bank-4',
    bank: 'Axis Bank',
    cardType: 'credit',
    logo: '🏦',
    title: 'Axis Bank Exclusive',
    description: '₹150 instant discount on Axis Credit Cards',
    discountType: 'flat',
    discountValue: 150,
    minPurchase: 700,
    validUntil: '2025-11-30',
    categories: ['movies', 'events'],
    active: true
  },
  {
    id: 'bank-5',
    bank: 'Kotak Mahindra',
    cardType: 'both',
    logo: '💳',
    title: 'Kotak Bank Deal',
    description: '10% off up to ₹400 on Kotak Cards',
    discountType: 'percentage',
    discountValue: 10,
    minPurchase: 1500,
    maxDiscount: 400,
    validUntil: '2025-12-31',
    active: true
  },
  {
    id: 'bank-6',
    bank: 'Paytm',
    cardType: 'both',
    logo: '📱',
    title: 'Paytm Cashback',
    description: '20% cashback up to ₹200 on Paytm payments',
    discountType: 'cashback',
    discountValue: 20,
    minPurchase: 500,
    maxDiscount: 200,
    validUntil: '2025-10-31',
    active: true,
    featured: true
  }
]

// Helper function to get active coupons
export function getActiveCoupons(): Coupon[] {
  const now = new Date()
  return coupons.filter(coupon => {
    const validFrom = new Date(coupon.validFrom)
    const validUntil = new Date(coupon.validUntil)
    return coupon.active && now >= validFrom && now <= validUntil
  })
}

// Helper function to get featured coupons
export function getFeaturedCoupons(): Coupon[] {
  return getActiveCoupons().filter(coupon => coupon.featured)
}

// Helper function to validate and apply coupon
export function validateCoupon(code: string, amount: number, category?: string, isNewUser?: boolean): {
  valid: boolean
  coupon?: Coupon
  discount: number
  message: string
} {
  const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.active)
  
  if (!coupon) {
    return { valid: false, discount: 0, message: 'Invalid coupon code' }
  }

  const now = new Date()
  const validFrom = new Date(coupon.validFrom)
  const validUntil = new Date(coupon.validUntil)
  
  if (now < validFrom || now > validUntil) {
    return { valid: false, discount: 0, message: 'Coupon has expired' }
  }

  if (coupon.minPurchase > amount) {
    return { 
      valid: false, 
      discount: 0, 
      message: `Minimum purchase of ₹${coupon.minPurchase} required` 
    }
  }

  if (coupon.userType === 'new' && !isNewUser) {
    return { valid: false, discount: 0, message: 'This coupon is for new users only' }
  }

  if (coupon.categories && category && !coupon.categories.includes(category as any)) {
    return { 
      valid: false, 
      discount: 0, 
      message: `This coupon is not valid for ${category}` 
    }
  }

  let discount = 0
  if (coupon.discountType === 'flat') {
    discount = coupon.discountValue
  } else if (coupon.discountType === 'percentage' || coupon.discountType === 'cashback') {
    discount = (amount * coupon.discountValue) / 100
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount
    }
  }

  return {
    valid: true,
    coupon,
    discount: Math.round(discount),
    message: `Coupon applied! You saved ₹${Math.round(discount)}`
  }
}

// Helper function to get active bank offers
export function getActiveBankOffers(): BankOffer[] {
  const now = new Date()
  return bankOffers.filter(offer => {
    const validUntil = new Date(offer.validUntil)
    return offer.active && now <= validUntil
  })
}

// Helper function to get featured bank offers
export function getFeaturedBankOffers(): BankOffer[] {
  return getActiveBankOffers().filter(offer => offer.featured)
}

// Mock Notifications Data
export const notifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'booking',
    title: 'Booking Confirmed! 🎉',
    message: 'Your tickets for "Dune: Part Three" have been confirmed. Check your email for e-tickets.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    read: false,
    actionUrl: '/profile',
    actionText: 'View Tickets',
    imageUrl: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=300&fit=crop',
    bookingId: 'BK123456',
    priority: 'high'
  },
  {
    id: 'notif-2',
    type: 'reminder',
    title: 'Event Tomorrow! ⏰',
    message: 'Coldplay Music of the Spheres concert is tomorrow at 7:00 PM. DY Patil Stadium, Mumbai.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    read: false,
    actionUrl: '/event/event-1',
    actionText: 'View Details',
    imageUrl: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=300&fit=crop',
    eventId: 'event-1',
    priority: 'high'
  },
  {
    id: 'notif-3',
    type: 'price_drop',
    title: 'Price Drop Alert! 💰',
    message: 'IPL 2025: MI vs CSK tickets now start from ₹800 (was ₹1,200). Book now!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    read: false,
    actionUrl: '/event/sport-1',
    actionText: 'Book Now',
    imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=300&fit=crop',
    eventId: 'sport-1',
    priority: 'medium'
  },
  {
    id: 'notif-4',
    type: 'new_event',
    title: 'New Event in Mumbai! 🎬',
    message: 'Avatar 3 is now showing in Mumbai! Book your tickets for the biggest movie of the year.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
    read: true,
    actionUrl: '/event/movie-10',
    actionText: 'Explore',
    imageUrl: 'https://images.unsplash.com/photo-1574267432644-f610a2f1917b?w=400&h=300&fit=crop',
    eventId: 'movie-10',
    priority: 'medium'
  },
  {
    id: 'notif-5',
    type: 'offer',
    title: 'Exclusive Offer! 🎁',
    message: 'Use code MOVIE200 and get ₹200 off on your next movie booking. Valid till Oct 31.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    read: true,
    actionUrl: '/browse?category=movies',
    actionText: 'Browse Movies',
    priority: 'low'
  },
  {
    id: 'notif-6',
    type: 'reminder',
    title: 'Complete Your Booking ⏰',
    message: 'You have selected seats for "Kapil Sharma Live" but haven\'t completed payment. Seats reserved for 10 more minutes.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    read: true,
    actionUrl: '/checkout',
    actionText: 'Complete Payment',
    eventId: 'play-1',
    priority: 'high'
  },
  {
    id: 'notif-7',
    type: 'system',
    title: 'Welcome to ShowUp! 👋',
    message: 'Discover amazing events near you. Book your first ticket and get ₹100 off with code WELCOME100.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    read: true,
    actionUrl: '/browse',
    actionText: 'Explore Events',
    priority: 'low'
  },
  {
    id: 'notif-8',
    type: 'new_event',
    title: 'Sunburn Arena ft. Martin Garrix 🎵',
    message: 'The biggest EDM festival is coming to Mumbai! Early bird tickets available now.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    read: true,
    actionUrl: '/event/event-15',
    actionText: 'Get Tickets',
    priority: 'medium'
  }
]

// Default notification preferences
export const defaultNotificationPreferences: NotificationPreferences = {
  email: {
    bookingConfirmation: true,
    eventReminders: true,
    priceDrops: true,
    newEvents: true,
    offers: true,
    newsletter: false
  },
  sms: {
    bookingConfirmation: true,
    eventReminders: true,
    offers: false
  },
  push: {
    eventReminders: true,
    priceDrops: true,
    newEvents: true,
    offers: true
  },
  frequency: 'instant'
}

// Helper function to get unread notification count
export function getUnreadNotificationCount(): number {
  return notifications.filter(n => !n.read).length
}

// Helper function to get notifications sorted by timestamp
export function getNotificationsSorted(): Notification[] {
  return [...notifications].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
}

// Helper function to mark notification as read
export function markNotificationAsRead(notificationId: string): void {
  const notification = notifications.find(n => n.id === notificationId)
  if (notification) {
    notification.read = true
  }
}

// Helper function to mark all notifications as read
export function markAllNotificationsAsRead(): void {
  notifications.forEach(n => n.read = true)
}

// Helper function to get notifications by type
export function getNotificationsByType(type: Notification['type']): Notification[] {
  return notifications.filter(n => n.type === type)
}

// Wishlist Helper Functions (Client-side only - uses localStorage)

// Get all wishlist items
export function getWishlist(): WishlistItem[] {
  if (typeof window === 'undefined') return []
  const wishlist = localStorage.getItem('wishlist')
  return wishlist ? JSON.parse(wishlist) : []
}

// Check if event is in wishlist
export function isInWishlist(eventId: string): boolean {
  const wishlist = getWishlist()
  return wishlist.some(item => item.eventId === eventId)
}

// Add to wishlist
export function addToWishlist(eventId: string, notifyOnPriceDrop: boolean = true): void {
  if (typeof window === 'undefined') return
  
  const wishlist = getWishlist()
  
  // Don't add if already exists
  if (wishlist.some(item => item.eventId === eventId)) {
    return
  }
  
  const event = events.find(e => e.id === eventId)
  const newItem: WishlistItem = {
    eventId,
    addedAt: new Date().toISOString(),
    notifyOnPriceDrop,
    originalPrice: event?.price.min
  }
  
  wishlist.push(newItem)
  localStorage.setItem('wishlist', JSON.stringify(wishlist))
}

// Remove from wishlist
export function removeFromWishlist(eventId: string): void {
  if (typeof window === 'undefined') return
  
  const wishlist = getWishlist()
  const filtered = wishlist.filter(item => item.eventId !== eventId)
  localStorage.setItem('wishlist', JSON.stringify(filtered))
}

// Toggle wishlist status
export function toggleWishlist(eventId: string): boolean {
  const isWishlisted = isInWishlist(eventId)
  
  if (isWishlisted) {
    removeFromWishlist(eventId)
    return false
  } else {
    addToWishlist(eventId, true)
    return true
  }
}

// Get wishlist events with full details
export function getWishlistEvents(): Event[] {
  const wishlist = getWishlist()
  return wishlist
    .map(item => events.find(e => e.id === item.eventId))
    .filter((event): event is Event => event !== undefined)
}

// Get wishlist count
export function getWishlistCount(): number {
  return getWishlist().length
}

// Update price drop notification preference
export function updatePriceDropNotification(eventId: string, notify: boolean): void {
  if (typeof window === 'undefined') return
  
  const wishlist = getWishlist()
  const item = wishlist.find(i => i.eventId === eventId)
  
  if (item) {
    item.notifyOnPriceDrop = notify
    localStorage.setItem('wishlist', JSON.stringify(wishlist))
  }
}


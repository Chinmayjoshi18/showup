# 🎟️ ShowUp – Discover • Book • Experience

ShowUp is a modern, full-featured entertainment booking platform built with Next.js 14, TypeScript, and Tailwind CSS. From movies and concerts to sports events and workshops, ShowUp lets users discover what's happening around them and book their spot in seconds.

![ShowUp Banner](https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&h=400&fit=crop)

## ✨ Features

### For Users
- 🎬 **Browse Events** - Discover movies, concerts, sports, plays, and workshops
- 🔍 **Smart Filtering** - Filter by category, genre, language, and price
- 💺 **Interactive Seat Selection** - Visual seat map with real-time availability
- 💳 **Secure Checkout** - Multiple payment options (UPI, Cards, Net Banking)
- 🎫 **E-Tickets** - Instant ticket delivery with QR codes
- 👤 **User Profile** - Manage bookings and preferences
- ❤️ **Favorites** - Save events for later

### For Organizers
- 📊 **Dashboard** - Track sales, revenue, and analytics
- ➕ **Event Management** - Create and manage events easily
- 📈 **Analytics** - View performance metrics and insights
- 💰 **Revenue Tracking** - Monitor ticket sales and earnings

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Date Handling:** date-fns

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm, yarn, or pnpm package manager

### Installation

1. **Clone the repository**
   ```bash
   cd ShowUp
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
ShowUp/
├── app/                      # Next.js 14 App Router
│   ├── browse/              # Browse/Discovery page
│   ├── event/[id]/          # Event detail page
│   ├── book/[id]/           # Seat selection page
│   ├── checkout/            # Payment page
│   ├── profile/             # User profile & bookings
│   ├── organizer/           # Organizer dashboard
│   │   └── create/          # Create event page
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   └── globals.css          # Global styles
├── components/              # Reusable components
│   ├── Navbar.tsx           # Navigation bar
│   └── Footer.tsx           # Footer
├── lib/                     # Utilities and data
│   └── data.ts              # Mock event data
├── public/                  # Static assets
├── tailwind.config.ts       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies
```

## 🎨 Key Pages

### 1. Landing Page (`/`)
- Hero section with call-to-action
- Category cards (Movies, Events, Sports, etc.)
- Feature highlights
- Booking process overview

### 2. Browse Page (`/browse`)
- Filterable event grid
- Category tabs
- Sort options (Featured, Price, Rating)
- Genre and language filters

### 3. Event Detail (`/event/[id]`)
- Event information and description
- Venue details
- Rating and reviews
- Date and time selection
- Booking CTA

### 4. Booking Page (`/book/[id]`)
- Interactive seat map
- Real-time seat availability
- Multiple seat types (Premium, Gold, Silver)
- Booking summary
- Mobile-responsive design

### 5. Checkout (`/checkout`)
- Payment method selection
- Order summary
- Secure payment processing
- Success confirmation

### 6. User Profile (`/profile`)
- My Bookings with e-tickets
- Favorites
- Account settings
- Booking history

### 7. Organizer Dashboard (`/organizer`)
- Overview with analytics
- Event management
- Sales tracking
- Create new events

## 🎯 Features in Detail

### Interactive Seat Selection
- Visual seat map with row/seat numbers
- Color-coded seat types
- Real-time availability
- Mobile and desktop optimized
- Automatic pricing calculation

### Booking Flow
1. Browse events
2. Select event and date
3. Choose seats
4. Enter details
5. Make payment
6. Get instant confirmation

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interactions
- Adaptive layouts

## 🔒 Security Features

- ✅ Secure payment processing
- ✅ Encrypted transactions
- ✅ QR code verification
- ✅ Real-time ticket validation

## 📱 Mobile Experience

- Optimized mobile navigation
- Touch-friendly seat selection
- Mobile payment options
- Responsive layouts throughout

## 🚧 Demo Mode

Currently, the app runs in demo mode with:
- Mock event data
- LocalStorage for bookings
- Simulated payment processing
- Demo organizer features

## 🔮 Future Enhancements

- [ ] Backend API integration
- [ ] Real payment gateway
- [ ] User authentication
- [ ] Email/SMS notifications
- [ ] Advanced analytics
- [ ] Social sharing
- [ ] Reviews and ratings
- [ ] Recommendation engine
- [ ] Multi-language support
- [ ] PWA capabilities

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## 📄 License

This project is open source and available under the MIT License.

## 🎉 Acknowledgments

- Built with Next.js and React
- Styled with Tailwind CSS
- Icons by Lucide
- Images from Unsplash

---

**ShowUp** - Because every great story begins with showing up. 🎭

For questions or support, please open an issue on GitHub.


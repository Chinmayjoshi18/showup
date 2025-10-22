import { logEvent, setUserId, setUserProperties } from 'firebase/analytics'
import { analytics } from '@/firebase.config'

// Log page view
export function logPageView(pageName: string, pageTitle: string): void {
  if (!analytics) return
  
  logEvent(analytics, 'page_view', {
    page_name: pageName,
    page_title: pageTitle,
    page_location: window.location.href,
    page_path: window.location.pathname,
  })
}

// Log event view
export function logEventView(eventId: string, eventTitle: string, category: string): void {
  if (!analytics) return
  
  logEvent(analytics, 'view_item', {
    item_id: eventId,
    item_name: eventTitle,
    item_category: category,
  })
}

// Log search
export function logSearch(searchTerm: string, resultsCount: number): void {
  if (!analytics) return
  
  logEvent(analytics, 'search', {
    search_term: searchTerm,
    results_count: resultsCount,
  })
}

// Log booking initiation
export function logBeginCheckout(
  eventId: string,
  eventTitle: string,
  totalAmount: number,
  seatsCount: number
): void {
  if (!analytics) return
  
  logEvent(analytics, 'begin_checkout', {
    value: totalAmount,
    currency: 'INR',
    items: [
      {
        item_id: eventId,
        item_name: eventTitle,
        quantity: seatsCount,
        price: totalAmount / seatsCount,
      },
    ],
  })
}

// Log successful booking
export function logPurchase(
  transactionId: string,
  eventId: string,
  eventTitle: string,
  totalAmount: number,
  seatsCount: number
): void {
  if (!analytics) return
  
  logEvent(analytics, 'purchase', {
    transaction_id: transactionId,
    value: totalAmount,
    currency: 'INR',
    items: [
      {
        item_id: eventId,
        item_name: eventTitle,
        quantity: seatsCount,
        price: totalAmount / seatsCount,
      },
    ],
  })
}

// Log sign up
export function logSignUp(method: string): void {
  if (!analytics) return
  
  logEvent(analytics, 'sign_up', {
    method: method, // 'email', 'google', etc.
  })
}

// Log login
export function logLogin(method: string): void {
  if (!analytics) return
  
  logEvent(analytics, 'login', {
    method: method,
  })
}

// Log share
export function logShare(contentType: string, contentId: string, method: string): void {
  if (!analytics) return
  
  logEvent(analytics, 'share', {
    content_type: contentType,
    content_id: contentId,
    method: method,
  })
}

// Log add to wishlist
export function logAddToWishlist(eventId: string, eventTitle: string): void {
  if (!analytics) return
  
  logEvent(analytics, 'add_to_wishlist', {
    item_id: eventId,
    item_name: eventTitle,
  })
}

// Log remove from wishlist
export function logRemoveFromWishlist(eventId: string, eventTitle: string): void {
  if (!analytics) return
  
  logEvent(analytics, 'remove_from_wishlist', {
    item_id: eventId,
    item_name: eventTitle,
  })
}

// Log category view
export function logViewCategory(category: string, itemsCount: number): void {
  if (!analytics) return
  
  logEvent(analytics, 'view_item_list', {
    item_list_name: category,
    items_count: itemsCount,
  })
}

// Log offer view
export function logViewOffer(offerId: string, offerName: string, discountAmount: number): void {
  if (!analytics) return
  
  logEvent(analytics, 'view_promotion', {
    promotion_id: offerId,
    promotion_name: offerName,
    creative_slot: 'offer_banner',
    discount_amount: discountAmount,
  })
}

// Log filter application
export function logApplyFilter(filterType: string, filterValue: string): void {
  if (!analytics) return
  
  logEvent(analytics, 'filter_applied', {
    filter_type: filterType,
    filter_value: filterValue,
  })
}

// Set user ID
export function setAnalyticsUserId(userId: string): void {
  if (!analytics) return
  
  setUserId(analytics, userId)
}

// Set user properties
export function setAnalyticsUserProperties(properties: {
  city?: string
  subscription_type?: string
  preferred_category?: string
  [key: string]: any
}): void {
  if (!analytics) return
  
  setUserProperties(analytics, properties)
}

// Custom event
export function logCustomEvent(eventName: string, params?: { [key: string]: any }): void {
  if (!analytics) return
  
  logEvent(analytics, eventName, params)
}


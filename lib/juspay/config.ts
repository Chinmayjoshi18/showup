// Juspay Payment Gateway Configuration
// Based on https://juspay.io/integrations

export const juspayConfig = {
  merchantId: process.env.NEXT_PUBLIC_JUSPAY_MERCHANT_ID || 'your_merchant_id',
  apiKey: process.env.NEXT_PUBLIC_JUSPAY_API_KEY || 'your_api_key',
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
  baseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://api.juspay.in' 
    : 'https://sandbox.juspay.in',
  returnUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
}

export const PAYMENT_METHODS = {
  CARD: 'card',
  UPI: 'upi',
  NET_BANKING: 'nb',
  WALLET: 'wallet',
  EMI: 'emi',
  CARDLESS_EMI: 'cardless_emi',
  PAY_LATER: 'paylater',
} as const

export const WALLET_PROVIDERS = [
  { id: 'paytm', name: 'Paytm', icon: '💰' },
  { id: 'phonepe', name: 'PhonePe', icon: '☎️' },
  { id: 'googlepay', name: 'Google Pay', icon: 'G' },
  { id: 'amazonpay', name: 'Amazon Pay', icon: 'A' },
  { id: 'mobikwik', name: 'MobiKwik', icon: 'M' },
  { id: 'freecharge', name: 'FreeCharge', icon: 'F' },
] as const

export const BANK_PROVIDERS = [
  { id: 'hdfc', name: 'HDFC Bank', logo: '🏦' },
  { id: 'icici', name: 'ICICI Bank', logo: '🏦' },
  { id: 'sbi', name: 'State Bank of India', logo: '🏦' },
  { id: 'axis', name: 'Axis Bank', logo: '🏦' },
  { id: 'kotak', name: 'Kotak Mahindra', logo: '🏦' },
  { id: 'other', name: 'Other Banks', logo: '🏦' },
] as const

export const UPI_APPS = [
  { id: 'gpay', name: 'Google Pay', icon: 'G' },
  { id: 'phonepe', name: 'PhonePe', icon: '☎️' },
  { id: 'paytm', name: 'Paytm', icon: '💰' },
  { id: 'bhim', name: 'BHIM', icon: 'B' },
  { id: 'other', name: 'Other UPI Apps', icon: 'U' },
] as const

// Payment method features based on Juspay's offerings
export const PAYMENT_FEATURES = {
  instantConfirmation: true,
  recurringPayments: true,
  tokenisation: true,
  threeDSecure: true,
  autoCaptureEnabled: true,
  refundSupport: true,
  emiSupport: true,
  offersEngine: true,
}


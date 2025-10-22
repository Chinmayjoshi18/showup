import { fetchAndActivate, getValue, getBoolean, getString, getNumber } from 'firebase/remote-config'
import { remoteConfig } from '@/firebase.config'

// Initialize and fetch remote config
export async function initializeRemoteConfig(): Promise<void> {
  try {
    await fetchAndActivate(remoteConfig)
    console.log('Remote Config activated successfully')
  } catch (error) {
    console.error('Error fetching remote config:', error)
  }
}

// Get boolean config value
export function getConfigBoolean(key: string): boolean {
  try {
    return getBoolean(remoteConfig, key)
  } catch (error) {
    console.error(`Error getting config ${key}:`, error)
    return false
  }
}

// Get string config value
export function getConfigString(key: string): string {
  try {
    return getString(remoteConfig, key)
  } catch (error) {
    console.error(`Error getting config ${key}:`, error)
    return ''
  }
}

// Get number config value
export function getConfigNumber(key: string): number {
  try {
    return getNumber(remoteConfig, key)
  } catch (error) {
    console.error(`Error getting config ${key}:`, error)
    return 0
  }
}

// Specific config getters for ShowUp features

export function shouldShowOffersBanner(): boolean {
  return getConfigBoolean('show_offers_banner')
}

export function getMaxBookingSeats(): number {
  return getConfigNumber('max_booking_seats')
}

export function isReferralProgramEnabled(): boolean {
  return getConfigBoolean('enable_referral_program')
}

export function isMaintenanceMode(): boolean {
  return getConfigBoolean('maintenance_mode')
}

export function getFeaturedEventId(): string {
  return getConfigString('featured_event_id')
}

export function getMinimumAppVersion(): string {
  return getConfigString('minimum_app_version')
}

export function getWelcomeMessage(): string {
  return getConfigString('welcome_message')
}

export function getMaxDiscountPercentage(): number {
  return getConfigNumber('max_discount_percentage')
}

export function isFeatureEnabled(featureName: string): boolean {
  return getConfigBoolean(`feature_${featureName}_enabled`)
}

// Get all config as object
export function getAllConfig(): { [key: string]: any } {
  const keys = [
    'show_offers_banner',
    'max_booking_seats',
    'enable_referral_program',
    'maintenance_mode',
    'featured_event_id',
    'minimum_app_version',
    'welcome_message',
    'max_discount_percentage',
  ]
  
  const config: { [key: string]: any } = {}
  
  keys.forEach(key => {
    try {
      const value = getValue(remoteConfig, key)
      config[key] = value.asString()
    } catch (error) {
      console.error(`Error getting config ${key}:`, error)
    }
  })
  
  return config
}


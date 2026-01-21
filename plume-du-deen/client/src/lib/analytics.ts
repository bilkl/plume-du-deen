// Simple analytics system for tracking user interactions
interface AnalyticsEvent {
  event: string
  category: string
  label?: string
  value?: number
  timestamp: number
  url: string
  userAgent: string
}

class Analytics {
  private events: AnalyticsEvent[] = []
  private readonly maxEvents = 100

  // Track page views
  pageView(page: string) {
    this.track('page_view', 'navigation', page)
  }

  // Track product interactions
  productView(productId: number, productName: string) {
    this.track('product_view', 'ecommerce', productName, productId)
  }

  // Track cart actions
  cartAdd(productId: number, productName: string, quantity: number) {
    this.track('cart_add', 'ecommerce', productName, quantity)
  }

  cartRemove(productId: number, productName: string) {
    this.track('cart_remove', 'ecommerce', productName)
  }

  // Track search
  search(query: string, resultsCount: number) {
    this.track('search', 'engagement', query, resultsCount)
  }

  // Track button clicks
  buttonClick(buttonName: string, location: string) {
    this.track('button_click', 'interaction', `${location}:${buttonName}`)
  }

  // Generic tracking method
  private track(event: string, category: string, label?: string, value?: number) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      category,
      label,
      value,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    }

    this.events.push(analyticsEvent)

    // Keep only the last maxEvents
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents)
    }

    // Store in localStorage for persistence
    try {
      localStorage.setItem('plume-analytics', JSON.stringify(this.events))
    } catch (error) {
      console.warn('Analytics storage failed:', error)
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      console.log('Analytics:', analyticsEvent)
    }
  }

  // Get all stored events
  getEvents(): AnalyticsEvent[] {
    return [...this.events]
  }

  // Clear all events
  clearEvents() {
    this.events = []
    localStorage.removeItem('plume-analytics')
  }

  // Export events for external analysis
  exportEvents(): string {
    return JSON.stringify(this.events, null, 2)
  }
}

// Create singleton instance
export const analytics = new Analytics()

// Load stored events on initialization
try {
  const stored = localStorage.getItem('plume-analytics')
  if (stored) {
    const parsedEvents = JSON.parse(stored)
    if (Array.isArray(parsedEvents)) {
      analytics['events'] = parsedEvents
    }
  }
} catch (error) {
  console.warn('Failed to load analytics data:', error)
}
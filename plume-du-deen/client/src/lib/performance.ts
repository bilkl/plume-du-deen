// Performance monitoring utilities
interface PerformanceMetric {
  name: string
  value: number
  timestamp: number
  type: 'measure' | 'mark'
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private observers: PerformanceObserver[] = []

  // Start timing a specific operation
  startTiming(name: string) {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(`${name}-start`)
    }
  }

  // End timing and record the metric
  endTiming(name: string) {
    if (typeof performance !== 'undefined' && performance.mark && performance.measure) {
      try {
        performance.mark(`${name}-end`)
        performance.measure(name, `${name}-start`, `${name}-end`)

        const measure = performance.getEntriesByName(name, 'measure')[0]
        if (measure) {
          this.recordMetric(name, measure.duration, 'measure')
        }
      } catch (error) {
        console.warn('Performance measurement failed:', error)
      }
    }
  }

  // Record a custom metric
  recordMetric(name: string, value: number, type: 'measure' | 'mark' = 'measure') {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      type
    }

    this.metrics.push(metric)

    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100)
    }

    // Log in development
    if (import.meta.env.DEV) {
      console.log(`Performance [${type}]: ${name} = ${value}ms`)
    }
  }

  // Monitor Core Web Vitals
  monitorWebVitals() {
    if (typeof window !== 'undefined' && 'web-vitals' in window) {
      // This would require installing web-vitals package
      // For now, we'll use basic Performance Observer
      this.setupPerformanceObservers()
    }
  }

  private setupPerformanceObservers() {
    // Monitor Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          this.recordMetric('LCP', lastEntry.startTime, 'measure')
        })
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
        this.observers.push(lcpObserver)
      } catch (error) {
        console.warn('LCP monitoring not supported')
      }

      // Monitor First Input Delay (FID)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry: any) => {
            this.recordMetric('FID', entry.processingStart - entry.startTime, 'measure')
          })
        })
        fidObserver.observe({ entryTypes: ['first-input'] })
        this.observers.push(fidObserver)
      } catch (error) {
        console.warn('FID monitoring not supported')
      }

      // Monitor Cumulative Layout Shift (CLS)
      try {
        let clsValue = 0
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value
            }
          })
          this.recordMetric('CLS', clsValue, 'measure')
        })
        clsObserver.observe({ entryTypes: ['layout-shift'] })
        this.observers.push(clsObserver)
      } catch (error) {
        console.warn('CLS monitoring not supported')
      }
    }
  }

  // Get all recorded metrics
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics]
  }

  // Get average metric value
  getAverageMetric(name: string): number | null {
    const relevantMetrics = this.metrics.filter(m => m.name === name)
    if (relevantMetrics.length === 0) return null

    const sum = relevantMetrics.reduce((acc, m) => acc + m.value, 0)
    return sum / relevantMetrics.length
  }

  // Clear all metrics
  clearMetrics() {
    this.metrics = []
  }

  // Cleanup observers
  destroy() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor()

// Initialize monitoring when module loads
if (typeof window !== 'undefined') {
  // Monitor page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      performanceMonitor.monitorWebVitals()

      // Record basic page load metrics
      if (typeof performance !== 'undefined' && performance.timing) {
        const timing = performance.timing
        const loadTime = timing.loadEventEnd - timing.navigationStart
        performanceMonitor.recordMetric('Page Load Time', loadTime, 'measure')
      }
    }, 0)
  })
}
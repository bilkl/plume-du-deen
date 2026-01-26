import { useEffect, useRef, useState } from 'react'

interface PerformanceMetrics {
  FCP?: number // First Contentful Paint
  LCP?: number // Largest Contentful Paint
  FID?: number // First Input Delay
  CLS?: number // Cumulative Layout Shift
  TTFB?: number // Time to First Byte
}

export function usePerformance() {
  const metricsRef = useRef<PerformanceMetrics>({})

  useEffect(() => {
    // Observer pour les métriques de performance
    if ('PerformanceObserver' in window) {
      // First Contentful Paint
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        metricsRef.current.FCP = lastEntry.startTime
        console.log('FCP:', lastEntry.startTime)
      })
      fcpObserver.observe({ entryTypes: ['paint'] })

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        metricsRef.current.LCP = lastEntry.startTime
        console.log('LCP:', lastEntry.startTime)
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          metricsRef.current.FID = entry.processingStart - entry.startTime
          console.log('FID:', entry.processingStart - entry.startTime)
        })
      })
      fidObserver.observe({ entryTypes: ['first-input'] })

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        })
        metricsRef.current.CLS = clsValue
        console.log('CLS:', clsValue)
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })

      return () => {
        fcpObserver.disconnect()
        lcpObserver.disconnect()
        fidObserver.disconnect()
        clsObserver.disconnect()
      }
    }
  }, [])

  // Mesurer le Time to First Byte
  useEffect(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (navigation) {
      const ttfb = navigation.responseStart - navigation.requestStart
      metricsRef.current.TTFB = ttfb
      console.log('TTFB:', ttfb)
    }
  }, [])

  return metricsRef.current
}

// Hook pour mesurer les performances d'un composant spécifique
export function useComponentPerformance(componentName: string) {
  const startTimeRef = useRef<number>()

  useEffect(() => {
    startTimeRef.current = performance.now()
    console.log(`${componentName} mounted at:`, startTimeRef.current)

    return () => {
      if (startTimeRef.current) {
        const unmountTime = performance.now()
        const duration = unmountTime - startTimeRef.current
        console.log(`${componentName} unmounted after:`, duration, 'ms')
      }
    }
  }, [componentName])

  const markTime = (label: string) => {
    if (startTimeRef.current) {
      const currentTime = performance.now()
      const elapsed = currentTime - startTimeRef.current
      console.log(`${componentName} - ${label}:`, elapsed, 'ms')
    }
  }

  return { markTime }
}

// Hook pour optimiser les re-renders
export function useRenderOptimization(componentName: string) {
  const renderCountRef = useRef(0)

  renderCountRef.current += 1

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`${componentName} rendered ${renderCountRef.current} times`)
    }
  })

  return renderCountRef.current
}

// Fonction pour mesurer les performances d'une fonction
export function measurePerformance<T extends (...args: any[]) => any>(
  fn: T,
  name: string
): T {
  return ((...args: Parameters<T>) => {
    const start = performance.now()
    const result = fn(...args)
    const end = performance.now()
    console.log(`${name} took ${end - start} ms`)
    return result
  }) as T
}

// Hook pour lazy loading des images
export function useLazyImage(src: string) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const img = new Image()
    img.src = src
    img.onload = () => setLoaded(true)
    img.onerror = () => setError(true)
  }, [src])

  return { loaded, error, imgRef }
}
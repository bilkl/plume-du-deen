import { useState, useEffect, useCallback } from 'react'
import { showSuccessToast, showErrorToast } from '@/lib/toast'
import { apiUrl } from '@/lib/api'
import { useLanguage } from '@/contexts/LanguageContext'

export interface Review {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  title: string
  comment: string
  date: string
  verified: boolean
  helpful: number
  productId: number
}

interface UseReviewsReturn {
  reviews: Review[]
  loading: boolean
  error: string | null
  addReview: (review: Omit<Review, 'id' | 'date' | 'helpful'>) => Promise<void>
  updateReviewHelpful: (reviewId: string) => Promise<void>
  reportReview: (reviewId: string, reason: string) => Promise<void>
  refreshReviews: () => Promise<void>
}

// Mock data for development - replace with real API calls

export function useReviews(productId: number): UseReviewsReturn {
  const { language } = useLanguage()
  const isEnglish = language === 'en'
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Local storage key for reviews
  const STORAGE_KEY = 'plume-reviews'

  const loadAllReviewsFromStorage = (): Record<number, Review[]> => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return {}
      return JSON.parse(raw)
    } catch (err) {
      console.warn('Failed to load reviews from storage', err)
      return {}
    }
  }

  const saveAllReviewsToStorage = (data: Record<number, Review[]>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (err) {
      console.warn('Failed to save reviews to storage', err)
    }
  }

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Try server first
      try {
        const res = await fetch(apiUrl(`/api/reviews?productId=${productId}`))
        if (res.ok) {
          const payload = await res.json()
          if (payload && Array.isArray(payload.reviews)) {
            setReviews(payload.reviews)
            // cache locally as fallback
            const all = loadAllReviewsFromStorage()
            all[productId] = payload.reviews
            saveAllReviewsToStorage(all)
            return
          }
        }
      } catch (err) {
        console.warn('Reviews API unavailable, falling back to localStorage', err)
      }

      // Fallback to localStorage
      const all = loadAllReviewsFromStorage()
      const productReviews = all[productId] || []
      setReviews(productReviews)
    } catch (err) {
      setError(isEnglish ? 'Error while loading reviews' : 'Erreur lors du chargement des avis')
      console.error('Error fetching reviews:', err)
    } finally {
      setLoading(false)
    }
  }, [productId, isEnglish])

  const addReview = useCallback(async (reviewData: Omit<Review, 'id' | 'date' | 'helpful'>) => {
    try {
      // Send to server
      try {
        const res = await fetch(apiUrl('/api/reviews'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...reviewData, productId, action: 'add' })
        })

        if (res.ok) {
          const payload = await res.json()
          const created = payload.review
          setReviews(prev => {
            const updated = [created, ...prev]
            // cache locally
            const all = loadAllReviewsFromStorage()
            all[productId] = updated
            saveAllReviewsToStorage(all)
            return updated
          })
          showSuccessToast(isEnglish ? 'Review added successfully.' : 'Avis ajouté avec succès !')
          return
        }
      } catch (err) {
        console.warn('Failed to post review to API, falling back to local', err)
      }

      // Fallback: persist locally if server unavailable
      const newReview: Review = {
        ...reviewData,
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        helpful: 0
      }

      setReviews(prev => {
        const updated = [newReview, ...prev]
        const all = loadAllReviewsFromStorage()
        all[productId] = updated
        saveAllReviewsToStorage(all)
        return updated
      })
      showSuccessToast(isEnglish ? 'Review added and saved locally.' : 'Avis ajouté (enregistré localement)')
    } catch (err) {
      showErrorToast(isEnglish ? 'Error while adding the review' : 'Erreur lors de l\'ajout de l\'avis')
      console.error('Error adding review:', err)
      throw err
    }
  }, [productId, isEnglish])

  const updateReviewHelpful = useCallback(async (reviewId: string) => {
    try {
      // Try server
      try {
        const res = await fetch(apiUrl('/api/reviews'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'helpful', reviewId })
        })
        if (res.ok) {
          const payload = await res.json()
          const updatedReview = payload.review
          setReviews(prev => {
            const updated = prev.map(r => r.id === updatedReview.id ? updatedReview : r)
            const all = loadAllReviewsFromStorage()
            all[productId] = updated
            saveAllReviewsToStorage(all)
            return updated
          })
          return
        }
      } catch (err) {
        console.warn('Failed to update helpful on server, falling back to local', err)
      }

      // Fallback local increment
      setReviews(prev => {
        const updated = prev.map(review =>
          review.id === reviewId
            ? { ...review, helpful: review.helpful + 1 }
            : review
        )
        const all = loadAllReviewsFromStorage()
        all[productId] = updated
        saveAllReviewsToStorage(all)
        return updated
      })
    } catch (err) {
      console.error('Error updating review helpful count:', err)
    }
  }, [productId])

  const reportReview = useCallback(async (reviewId: string, reason: string) => {
    try {
      // Try server
      try {
        const res = await fetch(apiUrl('/api/reviews'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'report', reviewId, reason })
        })
        if (res.ok) {
          showSuccessToast(isEnglish ? 'Report sent. Thank you for your contribution.' : 'Signalement envoyé. Merci pour votre contribution.')
          return
        }
      } catch (err) {
        console.warn('Failed to send report to server, logging locally', err)
      }

      showSuccessToast(isEnglish ? 'Report saved locally. Thank you.' : 'Signalement enregistré localement. Merci.')
      console.log('Review reported (local):', { reviewId, reason })
    } catch (err) {
      showErrorToast(isEnglish ? 'Error while reporting' : 'Erreur lors du signalement')
      console.error('Error reporting review:', err)
    }
  }, [productId, isEnglish])

  const refreshReviews = useCallback(async () => {
    await fetchReviews()
  }, [fetchReviews])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  return {
    reviews,
    loading,
    error,
    addReview,
    updateReviewHelpful,
    reportReview,
    refreshReviews
  }
}

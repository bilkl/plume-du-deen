import { useState, useEffect, useCallback } from 'react'
import { showSuccessToast, showErrorToast } from '@/lib/toast'

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

      // Simulate small delay
      await new Promise(resolve => setTimeout(resolve, 250))

      const all = loadAllReviewsFromStorage()
      const productReviews = all[productId] || []
      setReviews(productReviews)
    } catch (err) {
      setError('Erreur lors du chargement des avis')
      console.error('Error fetching reviews:', err)
    } finally {
      setLoading(false)
    }
  }, [productId])

  const addReview = useCallback(async (reviewData: Omit<Review, 'id' | 'date' | 'helpful'>) => {
    try {
      // Simulate API call / processing delay
      await new Promise(resolve => setTimeout(resolve, 500))

      const newReview: Review = {
        ...reviewData,
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        helpful: 0
      }

      setReviews(prev => {
        const updated = [newReview, ...prev]
        // persist
        const all = loadAllReviewsFromStorage()
        all[productId] = updated
        saveAllReviewsToStorage(all)
        return updated
      })
      showSuccessToast('Avis ajouté avec succès !')
    } catch (err) {
      showErrorToast('Erreur lors de l\'ajout de l\'avis')
      console.error('Error adding review:', err)
      throw err
    }
  }, [productId])

  const updateReviewHelpful = useCallback(async (reviewId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300))

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300))

      showSuccessToast('Signalement envoyé. Merci pour votre contribution.')
      console.log('Review reported:', { reviewId, reason })
    } catch (err) {
      showErrorToast('Erreur lors du signalement')
      console.error('Error reporting review:', err)
    }
  }, [productId])

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
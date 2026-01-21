import { useMemo } from 'react'
import { Review } from '@/hooks/useReviews'

interface ReviewStats {
  averageRating: number
  totalReviews: number
  ratingDistribution: Array<{
    rating: number
    count: number
    percentage: number
  }>
  verifiedReviews: number
}

export function useReviewStats(reviews: Review[]): ReviewStats {
  return useMemo(() => {
    const totalReviews = reviews.length
    const averageRating = totalReviews > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0

    const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
      rating,
      count: reviews.filter(r => r.rating === rating).length,
      percentage: totalReviews > 0 ? (reviews.filter(r => r.rating === rating).length / totalReviews) * 100 : 0
    }))

    const verifiedReviews = reviews.filter(review => review.verified).length

    return {
      averageRating,
      totalReviews,
      ratingDistribution,
      verifiedReviews
    }
  }, [reviews])
}
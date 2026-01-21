import { useState } from 'react'
import { Star, ThumbsUp, Flag, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { showSuccessToast, showErrorToast } from '@/lib/toast'
import { useReviewStats } from '@/hooks/useReviewStats'

interface Review {
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

interface ProductReviewsProps {
  productId: number
  reviews: Review[]
  onAddReview?: (review: Omit<Review, 'id' | 'date' | 'helpful'>) => void
  className?: string
}

export default function ProductReviews({
  productId,
  reviews,
  onAddReview,
  className
}: ProductReviewsProps) {
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: ''
  })
  const [sortBy, setSortBy] = useState<'recent' | 'rating' | 'helpful'>('recent')
  const { averageRating, totalReviews, ratingDistribution } = useReviewStats(reviews)

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating
      case 'helpful':
        return b.helpful - a.helpful
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime()
    }
  })

  const handleSubmitReview = () => {
    if (!newReview.title.trim() || !newReview.comment.trim()) {
      showErrorToast('Veuillez remplir tous les champs')
      return
    }

    const review: Omit<Review, 'id' | 'date' | 'helpful'> = {
      userId: 'current-user', // In real app, get from auth context
      userName: 'Utilisateur Anonyme', // In real app, get from auth context
      rating: newReview.rating,
      title: newReview.title,
      comment: newReview.comment,
      verified: false, // Would be true if user purchased the product
      productId
    }

    onAddReview?.(review)

    setNewReview({ rating: 5, title: '', comment: '' })
    setShowReviewForm(false)
    showSuccessToast('Avis ajouté avec succès !')
  }

  const StarRating = ({ rating, interactive = false, onChange }: {
    rating: number
    interactive?: boolean
    onChange?: (rating: number) => void
  }) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onChange?.(star)}
          className={`w-5 h-5 ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
        >
          <Star
            className={`w-full h-full ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  )

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header with stats */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Avis clients ({reviews.length})
          </h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <StarRating rating={Math.round(averageRating)} />
                <span className="font-medium">{averageRating.toFixed(1)}</span>
              </div>
              <span className="text-muted-foreground">
                {reviews.length} avis
              </span>
            </div>
          )}
        </div>

        <Button
          onClick={() => setShowReviewForm(!showReviewForm)}
          variant="outline"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Écrire un avis
        </Button>
      </div>

      {/* Rating distribution */}
      {reviews.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-3">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-12">
                    <span className="text-sm">{rating}</span>
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1 bg-secondary rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8 text-right">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review form */}
      {showReviewForm && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Écrire un avis</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Note</label>
              <StarRating
                rating={newReview.rating}
                interactive
                onChange={(rating) => setNewReview(prev => ({ ...prev, rating }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Titre</label>
              <input
                type="text"
                value={newReview.title}
                onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Résumez votre avis..."
                maxLength={100}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Commentaire</label>
              <Textarea
                value={newReview.comment}
                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Partagez votre expérience avec ce produit..."
                rows={4}
                maxLength={1000}
              />
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSubmitReview}>
                Publier l'avis
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowReviewForm(false)}
              >
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews list */}
      {reviews.length > 0 && (
        <div className="space-y-6">
          {/* Sort options */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Trier par :</span>
            <div className="flex gap-2">
              {[
                { value: 'recent', label: 'Plus récent' },
                { value: 'rating', label: 'Note' },
                { value: 'helpful', label: 'Utile' }
              ].map(({ value, label }) => (
                <Button
                  key={value}
                  variant={sortBy === value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy(value as any)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="space-y-6">
            {sortedReviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium">
                        {review.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{review.userName}</span>
                          {review.verified && (
                            <Badge variant="secondary" className="text-xs">
                              Achat vérifié
                            </Badge>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.date).toLocaleDateString('fr-FR')}
                        </span>
                      </div>

                      <StarRating rating={review.rating} />

                      <div>
                        <h4 className="font-medium mb-2">{review.title}</h4>
                        <p className="text-muted-foreground leading-relaxed">
                          {review.comment}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 pt-2">
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          Utile ({review.helpful})
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                          <Flag className="w-4 h-4 mr-1" />
                          Signaler
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {reviews.length === 0 && !showReviewForm && (
        <div className="text-center py-12">
          <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            Aucun avis pour le moment
          </h3>
          <p className="text-muted-foreground mb-4">
            Soyez le premier à donner votre avis sur ce produit !
          </p>
          <Button onClick={() => setShowReviewForm(true)}>
            Écrire le premier avis
          </Button>
        </div>
      )}
    </div>
  )
}
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ReviewSummaryProps {
  productId: number
  averageRating: number
  totalReviews: number
  className?: string
  showStars?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function ReviewSummary({
  productId,
  averageRating,
  totalReviews,
  className,
  showStars = true,
  size = 'md'
}: ReviewSummaryProps) {
  const sizeClasses = {
    sm: {
      star: 'w-3 h-3',
      text: 'text-xs',
      gap: 'gap-1'
    },
    md: {
      star: 'w-4 h-4',
      text: 'text-sm',
      gap: 'gap-1.5'
    },
    lg: {
      star: 'w-5 h-5',
      text: 'text-base',
      gap: 'gap-2'
    }
  }

  const classes = sizeClasses[size]

  if (totalReviews === 0) {
    return (
      <div className={cn("flex items-center", classes.gap, className)}>
        {showStars && (
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(classes.star, "text-muted-foreground")}
              />
            ))}
          </div>
        )}
        <span className={cn(classes.text, "text-muted-foreground")}>
          Aucun avis
        </span>
      </div>
    )
  }

  return (
    <div className={cn("flex items-center", classes.gap, className)}>
      {showStars && (
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={cn(
                classes.star,
                star <= Math.round(averageRating)
                  ? "text-yellow-400 fill-current"
                  : "text-muted-foreground"
              )}
            />
          ))}
        </div>
      )}
      <span className={cn(classes.text, "font-medium text-foreground")}>
        {averageRating.toFixed(1)}
      </span>
      <span className={cn(classes.text, "text-muted-foreground")}>
        ({totalReviews} avis)
      </span>
    </div>
  )
}
import { useState } from 'react'
import { ShoppingCart, Heart, Share2, Star } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useFavorites } from '@/hooks/useFavorites'
import { analytics } from '@/lib/analytics'
import { showSuccessToast } from '@/lib/toast'
import ProductReviews from './ProductReviews'
import { useReviews } from '@/hooks/useReviews'
import { cn } from '@/lib/utils'

interface ProductDetailsProps {
  product: {
    id: number
    name: string
    subtitle?: string
    description: string
    longDescription?: string
    image: string
    price: number
    features?: string[]
    testimonials?: Array<{
      name: string
      text: string
      rating: number
    }>
  }
  className?: string
}

export default function ProductDetails({ product, className }: ProductDetailsProps) {
  const { dispatch } = useCart()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { reviews, addReview } = useReviews(product.id)

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: `${product.name} - Version numérique`,
      price: product.price,
      image: product.image,
      description: product.description,
      format: 'digital' as const
    }

    dispatch({ type: 'ADD_ITEM', payload: cartItem })
    analytics.cartAdd(product.id, product.name, 1)
  }

  const handleToggleFavorite = () => {
    toggleFavorite({
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price
    })

    if (!isFavorite(product.id)) {
      showSuccessToast(`${product.name} ajouté aux favoris`)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      showSuccessToast('Lien copié dans le presse-papiers')
    }
  }

  return (
    <div className={cn("space-y-8", className)}>
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-4xl md:text-5xl text-foreground mb-2">
            {product.name}
          </h1>
          {product.subtitle && (
            <p className="text-lg text-muted-foreground">
              {product.subtitle}
            </p>
          )}
        </div>

        <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">
          {product.description}
        </p>
      </div>

      {/* Price Display */}
      <div className="bg-secondary/50 border border-border rounded-lg p-6 text-center">
        <div className="text-3xl font-bold text-primary mb-2">
          {product.price === 0 ? 'Offert' : `${product.price.toFixed(2)} CHF`}
        </div>
        <p className="text-sm text-muted-foreground">
          Version numérique - PDF
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleAddToCart}
          className="flex-1 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center justify-center gap-3 text-lg"
        >
          <ShoppingCart className="w-5 h-5" />
          Ajouter au panier
        </button>

        <div className="flex gap-3">
          <button
            onClick={handleToggleFavorite}
            className={cn(
              "p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-center",
              isFavorite(product.id)
                ? "border-red-500 bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400"
                : "border-border hover:border-red-300 text-muted-foreground hover:text-red-500"
            )}
          >
            <Heart className={cn("w-5 h-5", isFavorite(product.id) && "fill-current")} />
          </button>

          <button
            onClick={handleShare}
            className="p-4 rounded-lg border-2 border-border hover:border-primary text-muted-foreground hover:text-primary transition-all duration-200 flex items-center justify-center"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Long Description */}
      {product.longDescription && (
        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Description détaillée
          </h2>
          <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {product.longDescription}
          </div>
        </div>
      )}

      {/* Features */}
      {product.features && product.features.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Caractéristiques
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {product.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-3 text-muted-foreground">
                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Reviews */}
      <ProductReviews
        productId={product.id}
        reviews={reviews}
        onAddReview={addReview}
      />
    </div>
  )
}
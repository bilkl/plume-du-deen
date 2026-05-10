import { FileText, MessageCircle, PackageCheck, ShoppingCart, Share2 } from 'lucide-react'
import { Link } from 'wouter'
import { useCart } from '@/contexts/CartContext'
import { useCurrency } from '@/contexts/CurrencyContext'
import { useLanguage } from '@/contexts/LanguageContext'
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
    price: number | null
    priceNote?: string
    availabilityNote?: string
    paperLimited?: boolean
    category?: string
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
  const { formatPrice } = useCurrency()
  const { t, language } = useLanguage()
  const isEnglish = language === 'en'
  const { reviews, addReview, updateReviewHelpful, reportReview } = useReviews(product.id)

  const handleAddToCart = () => {
    if (product.price === null) {
      return
    }

    const cartItem = {
      id: product.id,
      name: `${product.name} - ${product.paperLimited ? t('product.paperVersion', 'Papier très limité') : t('product.digitalVersion', 'Version numérique')}`,
      price: product.price,
      image: product.image,
      description: product.description,
      format: product.paperLimited ? 'paper' as const : 'digital' as const
    }

    dispatch({ type: 'ADD_ITEM', payload: cartItem })
    analytics.cartAdd(product.id, product.name, 1)
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
      showSuccessToast(isEnglish ? 'Link copied to clipboard' : 'Lien copié dans le presse-papiers')
    }
  }

  return (
    <div className={cn("space-y-9", className)}>
      {/* Header */}
      <div className="space-y-4">
        <div>
          {product.category && (
            <p className="font-poppins text-xs uppercase tracking-[0.16em] text-primary mb-3">
              {product.category}
            </p>
          )}
          <h1 className="text-4xl md:text-5xl text-foreground mb-2 leading-tight">
            {product.name}
          </h1>
          {product.subtitle && (
            <p className="text-lg text-primary/80">
              {product.subtitle}
            </p>
          )}
        </div>

        <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
          {product.description}
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          <span className="inline-flex items-center gap-2 rounded-sm border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground">
            <FileText className="w-4 h-4 text-primary" />
            {t('common.pdf', 'PDF')}
          </span>
          {product.paperLimited && (
            <span className="inline-flex items-center gap-2 rounded-sm border border-accent/40 bg-accent/10 px-3 py-2 text-sm font-semibold text-primary">
              <PackageCheck className="w-4 h-4" />
              {t('common.paperLimited', 'Papier très limité')}
            </span>
          )}
        </div>
      </div>

      {/* Price Display */}
      <div className="bg-secondary/45 border border-border rounded-lg p-6 text-center shadow-sm">
        <div className="text-3xl font-bold text-primary mb-2">
          {product.price === null
            ? product.priceNote || t('common.priceToConfirm', 'Prix à confirmer')
            : product.price === 0
              ? t('common.free', 'Offert')
              : formatPrice(product.price)}
        </div>
        <p className="text-sm text-muted-foreground">
          {product.availabilityNote || t('product.availabilityDefault', 'Version numérique - PDF')}
        </p>
        {product.paperLimited && (
          <p className="text-sm text-primary font-semibold mt-2">
            {t('common.paperLimited', 'Version papier en quantité très limitée')}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        {product.price === null ? (
          <Link href="/contact" className="flex-1">
            <button className="w-full px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex items-center justify-center gap-3 text-lg">
              <MessageCircle className="w-5 h-5" />
              {t('common.askAvailability', 'Demander la disponibilité')}
            </button>
          </Link>
        ) : (
          <button
            onClick={handleAddToCart}
            className="flex-1 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex items-center justify-center gap-3 text-lg"
          >
            <ShoppingCart className="w-5 h-5" />
            {t('common.addToCart', 'Ajouter au panier')}
          </button>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleShare}
            aria-label={isEnglish ? 'Share this product page' : 'Partager cette fiche produit'}
            className="p-4 rounded-full border border-border/80 hover:border-primary text-muted-foreground hover:text-primary transition-all duration-200 flex items-center justify-center"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Long Description */}
      {product.longDescription && (
        <div className="prose prose-lg max-w-none border-t border-border pt-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            {t('product.descriptionTitle', 'Description détaillée')}
          </h2>
          <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {product.longDescription}
          </div>
        </div>
      )}

      {/* Features */}
      {product.features && product.features.length > 0 && (
        <div className="border-t border-border pt-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            {t('product.featuresTitle', 'Caractéristiques')}
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3 text-muted-foreground leading-relaxed">
                <div className="w-2 h-2 mt-2 bg-primary rounded-full flex-shrink-0" />
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
        onHelpful={updateReviewHelpful}
        onReport={reportReview}
      />
    </div>
  )
}

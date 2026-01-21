import { useMemo } from 'react'
import { Star, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Link } from 'wouter'

interface Product {
  id: number
  title: string
  subtitle: string
  description: string
  image: string
  digitalPrice: number
  paperPrice: number
  category: string
  tags: string[]
  rating?: number
  reviewsCount?: number
}

interface ProductRecommendationsProps {
  currentProduct: Product
  allProducts: Product[]
  maxRecommendations?: number
  className?: string
}

export default function ProductRecommendations({
  currentProduct,
  allProducts,
  maxRecommendations = 3,
  className
}: ProductRecommendationsProps) {
  const recommendations = useMemo(() => {
    // Filter out current product
    const otherProducts = allProducts.filter(p => p.id !== currentProduct.id)

    // Score products based on similarity
    const scoredProducts = otherProducts.map(product => {
      let score = 0

      // Same category gets high score
      if (product.category === currentProduct.category) {
        score += 10
      }

      // Shared tags get points
      const sharedTags = product.tags.filter(tag => currentProduct.tags.includes(tag))
      score += sharedTags.length * 3

      // Price similarity (closer prices get higher scores)
      const currentPrice = currentProduct.digitalPrice
      const productPrice = product.digitalPrice
      const priceDiff = Math.abs(currentPrice - productPrice)
      const priceScore = Math.max(0, 5 - (priceDiff / 5)) // Max 5 points for very close prices
      score += priceScore

      // Rating bonus
      if (product.rating && product.rating >= 4.5) {
        score += 2
      }

      return { ...product, score }
    })

    // Sort by score and return top recommendations
    return scoredProducts
      .sort((a, b) => b.score - a.score)
      .slice(0, maxRecommendations)
  }, [currentProduct, allProducts, maxRecommendations])

  if (recommendations.length === 0) {
    return null
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h2 className="text-2xl font-semibold text-foreground">
          Vous pourriez aussi aimer
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendations.map((product) => (
          <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-200">
            <div className="relative overflow-hidden rounded-t-lg">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <div className="absolute top-3 left-3">
                <Badge variant="secondary" className="text-xs">
                  {product.subtitle}
                </Badge>
              </div>
              {product.rating && (
                <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium">{product.rating}</span>
                </div>
              )}
            </div>

            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                {product.title}
              </h3>

              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {product.description}
              </p>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-primary">
                    {product.digitalPrice}€
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    {product.paperPrice}€
                  </span>
                </div>
                {product.reviewsCount && (
                  <span className="text-xs text-muted-foreground">
                    {product.reviewsCount} avis
                  </span>
                )}
              </div>

              <Link href={
                product.id === 1 ? "/invocations" :
                product.id === 2 ? "/planner" :
                "/99noms"
              }>
                <button className="w-full px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors">
                  Voir le produit
                </button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
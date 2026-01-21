# Système d'Avis Clients - Plume du Deen

## Vue d'ensemble

Le système d'avis clients permet aux utilisateurs de consulter et ajouter des avis sur les produits. Il inclut des fonctionnalités avancées comme les notes, commentaires, modération et statistiques.

## Composants

### ProductReviews
Le composant principal qui affiche tous les avis d'un produit.

**Fonctionnalités :**
- Affichage des avis avec pagination et tri
- Formulaire d'ajout d'avis
- Système de notation 5 étoiles
- Distribution des notes
- Boutons "Utile" et "Signaler"
- Badge "Achat vérifié"

**Props :**
```typescript
interface ProductReviewsProps {
  productId: number
  reviews: Review[]
  onAddReview?: (review: Omit<Review, 'id' | 'date' | 'helpful'>) => void
  className?: string
}
```

### ReviewSummary
Composant compact pour afficher un résumé des avis.

**Props :**
```typescript
interface ReviewSummaryProps {
  productId: number
  averageRating: number
  totalReviews: number
  className?: string
  showStars?: boolean
  size?: 'sm' | 'md' | 'lg'
}
```

## Hooks

### useReviews
Hook pour gérer les avis d'un produit.

**Retour :**
```typescript
interface UseReviewsReturn {
  reviews: Review[]
  loading: boolean
  error: string | null
  addReview: (review: Omit<Review, 'id' | 'date' | 'helpful'>) => Promise<void>
  updateReviewHelpful: (reviewId: string) => Promise<void>
  reportReview: (reviewId: string, reason: string) => Promise<void>
  refreshReviews: () => Promise<void>
}
```

### useReviewStats
Hook pour calculer les statistiques des avis.

**Retour :**
```typescript
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
```

## Interface Review

```typescript
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
```

## Utilisation

### Dans ProductDetails

```tsx
import ProductReviews from '@/components/ProductReviews'
import { useReviews } from '@/hooks/useReviews'

function ProductDetails({ product }) {
  const { reviews, addReview } = useReviews(product.id)

  return (
    <div>
      {/* Autres détails du produit */}
      <ProductReviews
        productId={product.id}
        reviews={reviews}
        onAddReview={addReview}
      />
    </div>
  )
}
```

### Dans une liste de produits

```tsx
import ReviewSummary from '@/components/ReviewSummary'

function ProductCard({ product }) {
  // Calculer les stats des avis ici ou utiliser un hook

  return (
    <div>
      <h3>{product.name}</h3>
      <ReviewSummary
        productId={product.id}
        averageRating={4.2}
        totalReviews={15}
        size="sm"
      />
    </div>
  )
}
```

## Fonctionnalités futures

- **Modération d'avis** : Interface admin pour approuver/rejeter les avis
- **Réponses aux avis** : Permettre aux vendeurs de répondre
- **Photos dans les avis** : Upload d'images
- **Filtres avancés** : Filtrer par note, date, achat vérifié
- **Notifications** : Alertes pour nouveaux avis
- **API Backend** : Remplacer les mocks par une vraie API

## Sécurité

- Validation côté client et serveur
- Protection contre les avis dupliqués
- Limite de fréquence pour éviter le spam
- Modération des contenus inappropriés

## Performance

- Pagination des avis
- Cache des statistiques
- Lazy loading des images
- Optimisation des requêtes API
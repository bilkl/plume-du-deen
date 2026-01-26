import { useEffect } from 'react'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  structuredData?: object
}

export function useSEO({
  title = 'Plume du Deen - Produits Spirituels Islamiques',
  description = 'Découvrez notre collection de produits spirituels islamiques : Livres coraniques, Planners Ramadan, et plus encore. Qualité, authenticité et spiritualité.',
  keywords = ['islam', 'coran', 'spirituel', 'ramadan', 'livres religieux', 'planner', 'musulman'],
  image = '/logo.png',
  url,
  type = 'website',
  structuredData
}: SEOProps = {}) {
  useEffect(() => {
    // Mettre à jour le titre
    document.title = title

    // Meta description
    updateMetaTag('description', description)

    // Meta keywords
    updateMetaTag('keywords', keywords.join(', '))

    // Open Graph
    updateMetaTag('og:title', title, 'property')
    updateMetaTag('og:description', description, 'property')
    updateMetaTag('og:image', image.startsWith('http') ? image : `${window.location.origin}${image}`, 'property')
    updateMetaTag('og:url', url || window.location.href, 'property')
    updateMetaTag('og:type', type, 'property')
    updateMetaTag('og:site_name', 'Plume du Deen', 'property')

    // Twitter Card
    updateMetaTag('twitter:card', 'summary_large_image')
    updateMetaTag('twitter:title', title)
    updateMetaTag('twitter:description', description)
    updateMetaTag('twitter:image', image.startsWith('http') ? image : `${window.location.origin}${image}`)

    // Structured Data
    if (structuredData) {
      updateStructuredData(structuredData)
    }

    // Nettoyer lors du démontage
    return () => {
      // Optionnel: remettre les valeurs par défaut
    }
  }, [title, description, keywords, image, url, type, structuredData])
}

function updateMetaTag(name: string, content: string, attribute: string = 'name') {
  let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement

  if (element) {
    element.content = content
  } else {
    element = document.createElement('meta')
    element.setAttribute(attribute, name)
    element.content = content
    document.head.appendChild(element)
  }
}

function updateStructuredData(data: object) {
  // Supprimer l'ancien structured data
  const existingScript = document.querySelector('script[type="application/ld+json"]')
  if (existingScript) {
    existingScript.remove()
  }

  // Ajouter le nouveau
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(data)
  document.head.appendChild(script)
}

// Hook spécialisé pour les pages produit
export function useProductSEO(product: {
  id: string
  name: string
  description: string
  price: number
  currency: string
  image?: string
  category?: string
  availability?: 'InStock' | 'OutOfStock'
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image ? [product.image] : [],
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency,
      availability: `https://schema.org/${product.availability || 'InStock'}`,
      seller: {
        '@type': 'Organization',
        name: 'Plume du Deen'
      }
    },
    brand: {
      '@type': 'Brand',
      name: 'Plume du Deen'
    },
    category: product.category || 'Produits Spirituels'
  }

  useSEO({
    title: `${product.name} - Plume du Deen`,
    description: product.description,
    keywords: ['islam', 'coran', 'spirituel', product.name.toLowerCase()],
    image: product.image,
    type: 'product',
    structuredData
  })
}

// Hook spécialisé pour les articles/blog
export function useArticleSEO(article: {
  title: string
  description: string
  author: string
  publishedTime: string
  modifiedTime?: string
  image?: string
  tags?: string[]
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image ? [article.image] : [],
    author: {
      '@type': 'Person',
      name: article.author
    },
    publisher: {
      '@type': 'Organization',
      name: 'Plume du Deen',
      logo: {
        '@type': 'ImageObject',
        url: `${window.location.origin}/logo.png`
      }
    },
    datePublished: article.publishedTime,
    dateModified: article.modifiedTime || article.publishedTime,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': window.location.href
    }
  }

  useSEO({
    title: `${article.title} - Plume du Deen`,
    description: article.description,
    keywords: article.tags || ['islam', 'coran', 'spirituel'],
    image: article.image,
    type: 'article',
    structuredData
  })
}
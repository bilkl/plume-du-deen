import { useState, useEffect, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import { Link } from 'wouter'
import { STORE_PRODUCTS } from '@/data/products'
import { useLanguage } from '@/contexts/LanguageContext'

interface SearchResult {
  id: string
  title: string
  type: 'product' | 'page'
  url: string
  description: string
}

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const { t, localizeProduct, language } = useLanguage()

  const searchData: SearchResult[] = useMemo(() => [
    ...STORE_PRODUCTS.map(localizeProduct).map((product) => ({
      id: String(product.id),
      title: product.title,
      type: 'product' as const,
      url: product.href,
      description: product.description
    })),
    {
      id: 'page-about',
      title: language === 'en' ? 'About' : 'À propos',
      type: 'page',
      url: '/apropos',
      description: language === 'en' ? 'Discover our story and mission' : 'Découvrez notre histoire et notre mission'
    },
    {
      id: 'page-ramadan',
      title: 'Ramadan',
      type: 'page',
      url: '/ramadan',
      description: language === 'en' ? 'Special resources for the sacred month' : 'Ressources spéciales pour le mois sacré'
    }
  ], [language, localizeProduct])

  useEffect(() => {
    if (query.length > 0) {
      const filtered = searchData.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      )
      setResults(filtered)
    } else {
      setResults([])
    }
  }, [query, searchData])

  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const visibleResults = query.length > 0
    ? results
    : searchData.filter((item) => item.type === 'product').slice(0, 5)

  return (
    <div
      className="fixed inset-0 bg-black/55 z-50 flex items-start justify-center pt-20 px-4"
      role="presentation"
      onMouseDown={onClose}
    >
      <div
        className="bg-background rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden border border-border"
        role="dialog"
        aria-modal="true"
        aria-label={language === 'en' ? 'Search' : 'Recherche'}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="px-5 pt-5 pb-3">
          <p className="font-poppins text-xs uppercase tracking-[0.16em] text-primary">
            {t('header.search', 'Recherche')}
          </p>
          <h2 className="text-2xl text-foreground mt-1">
            {language === 'en' ? 'Find a creation' : 'Trouver une création'}
          </h2>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder={language === 'en' ? 'Search for a product or page...' : 'Rechercher un produit ou une page...'}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-secondary rounded-md border-0 focus:ring-2 focus:ring-primary"
              autoFocus
            />
            <button
              onClick={onClose}
              aria-label={language === 'en' ? 'Close search' : 'Fermer la recherche'}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {visibleResults.length > 0 ? (
            <div className="p-2">
              {query.length === 0 && (
                <p className="px-3 py-2 font-poppins text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {language === 'en' ? 'Suggestions' : 'Suggestions'}
                </p>
              )}
              {visibleResults.map((result) => (
                <Link key={result.id} href={result.url} onClick={onClose}>
                  <div className="p-3 hover:bg-secondary rounded-md cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        result.type === 'product' ? 'bg-primary' : 'bg-accent'
                      }`} />
                      <div>
                        <h3 className="font-medium text-foreground">{result.title}</h3>
                        <p className="text-sm text-muted-foreground">{result.description}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : query.length > 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              {language === 'en' ? `No results found for "${query}"` : `Aucun résultat trouvé pour "${query}"`}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              {language === 'en' ? 'Start typing to search...' : 'Commencez à taper pour rechercher...'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

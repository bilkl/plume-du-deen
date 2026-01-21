import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { Link } from 'wouter'

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

  const searchData: SearchResult[] = [
    {
      id: '1',
      title: 'Les Invocations du Coran',
      type: 'product',
      url: '/invocations',
      description: 'Dossier de 30 cartes avec les invocations du Coran'
    },
    {
      id: '2',
      title: 'Planner Ramadan ALIF',
      type: 'product',
      url: '/planner',
      description: 'Le rituel guidé de 30 jours pour Ramadan'
    },
    {
      id: '3',
      title: 'Les 99 Noms d\'Allah',
      type: 'product',
      url: '/99noms',
      description: 'Entrer en relation avec les Noms d\'Allah'
    },
    {
      id: '4',
      title: 'À propos',
      type: 'page',
      url: '/apropos',
      description: 'Découvrez notre histoire et notre mission'
    },
    {
      id: '5',
      title: 'Ramadan',
      type: 'page',
      url: '/ramadan',
      description: 'Ressources spéciales pour le mois sacré'
    }
  ]

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
  }, [query])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
      <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
        {/* Search Input */}
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher un produit ou une page..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-secondary rounded-md border-0 focus:ring-2 focus:ring-primary"
              autoFocus
            />
            <button
              onClick={onClose}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            <div className="p-2">
              {results.map((result) => (
                <Link key={result.id} href={result.url} onClick={onClose}>
                  <div className="p-3 hover:bg-secondary rounded-md cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
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
              Aucun résultat trouvé pour "{query}"
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              Commencez à taper pour rechercher...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
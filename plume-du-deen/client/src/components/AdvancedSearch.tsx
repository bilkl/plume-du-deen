import { useState, useMemo } from 'react'
import { Search, Filter, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'

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
}

interface AdvancedSearchProps {
  products: Product[]
  onResultsChange: (results: Product[]) => void
}

export default function AdvancedSearch({ products, onResultsChange }: AdvancedSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [priceRange, setPriceRange] = useState<string>('all')
  const [format, setFormat] = useState<string>('all')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<string>('relevance')
  const [showFilters, setShowFilters] = useState(false)

  // Get unique categories and tags
  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category))]
    return cats
  }, [products])

  const allTags = useMemo(() => {
    const tags = [...new Set(products.flatMap(p => p.tags))]
    return tags
  }, [products])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // Text search
      const matchesSearch = searchQuery === '' ||
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      // Category filter
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory

      // Price range filter
      let matchesPrice = true
      if (priceRange !== 'all') {
        const price = format === 'digital' ? product.digitalPrice : product.paperPrice
        switch (priceRange) {
          case '0-15':
            matchesPrice = price <= 15
            break
          case '15-25':
            matchesPrice = price > 15 && price <= 25
            break
          case '25+':
            matchesPrice = price > 25
            break
        }
      }

      // Format filter
      const matchesFormat = format === 'all' ||
        (format === 'digital' && product.digitalPrice > 0) ||
        (format === 'paper' && product.paperPrice > 0)

      // Tags filter
      const matchesTags = selectedTags.length === 0 ||
        selectedTags.some(tag => product.tags.includes(tag))

      return matchesSearch && matchesCategory && matchesPrice && matchesFormat && matchesTags
    })

    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          const priceA = format === 'digital' ? a.digitalPrice : a.paperPrice
          const priceB = format === 'digital' ? b.digitalPrice : b.paperPrice
          return priceA - priceB
        case 'price-high':
          const priceA2 = format === 'digital' ? a.digitalPrice : a.paperPrice
          const priceB2 = format === 'digital' ? b.digitalPrice : b.paperPrice
          return priceB2 - priceA2
        case 'name':
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    return filtered
  }, [products, searchQuery, selectedCategory, priceRange, format, selectedTags, sortBy])

  // Update results when filters change
  useMemo(() => {
    onResultsChange(filteredProducts)
  }, [filteredProducts, onResultsChange])

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('all')
    setPriceRange('all')
    setFormat('all')
    setSelectedTags([])
    setSortBy('relevance')
  }

  const activeFiltersCount = [
    searchQuery,
    selectedCategory !== 'all' ? selectedCategory : '',
    priceRange !== 'all' ? priceRange : '',
    format !== 'all' ? format : '',
    ...selectedTags
  ].filter(Boolean).length

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher des produits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="relative"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filtres
          {activeFiltersCount > 0 && (
            <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Category Filter */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Catégorie</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les catégories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range Filter */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Prix</Label>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les prix" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les prix</SelectItem>
                    <SelectItem value="0-15">0 - 15€</SelectItem>
                    <SelectItem value="15-25">15 - 25€</SelectItem>
                    <SelectItem value="25+">25€ et plus</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Format Filter */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Format</Label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les formats" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les formats</SelectItem>
                    <SelectItem value="digital">Numérique</SelectItem>
                    <SelectItem value="paper">Papier</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Filter */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Trier par</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Pertinence</SelectItem>
                    <SelectItem value="price-low">Prix croissant</SelectItem>
                    <SelectItem value="price-high">Prix décroissant</SelectItem>
                    <SelectItem value="name">Nom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tags Filter */}
            {allTags.length > 0 && (
              <div className="mt-6">
                <Label className="text-sm font-medium mb-3 block">Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <div key={tag} className="flex items-center space-x-2">
                      <Checkbox
                        id={tag}
                        checked={selectedTags.includes(tag)}
                        onCheckedChange={() => handleTagToggle(tag)}
                      />
                      <Label
                        htmlFor={tag}
                        className="text-sm cursor-pointer"
                      >
                        {tag}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <div className="mt-6 flex justify-end">
                <Button variant="outline" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-2" />
                  Effacer les filtres
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''} trouvé{filteredProducts.length !== 1 ? 's' : ''}
        </span>
        {activeFiltersCount > 0 && (
          <span>{activeFiltersCount} filtre{activeFiltersCount !== 1 ? 's' : ''} actif{activeFiltersCount !== 1 ? 's' : ''}</span>
        )}
      </div>
    </div>
  )
}
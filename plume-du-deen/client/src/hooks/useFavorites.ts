import { useState, useEffect } from 'react'

interface FavoriteItem {
  id: number
  name: string
  image: string
  price: number
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('plume-favorites')
      if (stored) {
        setFavorites(JSON.parse(stored))
      }
    } catch (error) {
      console.warn('Failed to load favorites:', error)
    }
  }, [])

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('plume-favorites', JSON.stringify(favorites))
    } catch (error) {
      console.warn('Failed to save favorites:', error)
    }
  }, [favorites])

  const addToFavorites = (item: FavoriteItem) => {
    setFavorites(prev => {
      // Check if item already exists
      if (prev.some(fav => fav.id === item.id)) {
        return prev // Already in favorites
      }
      return [...prev, item]
    })
  }

  const removeFromFavorites = (itemId: number) => {
    setFavorites(prev => prev.filter(item => item.id !== itemId))
  }

  const isFavorite = (itemId: number): boolean => {
    return favorites.some(item => item.id === itemId)
  }

  const toggleFavorite = (item: FavoriteItem) => {
    if (isFavorite(item.id)) {
      removeFromFavorites(item.id)
    } else {
      addToFavorites(item)
    }
  }

  const clearFavorites = () => {
    setFavorites([])
  }

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    clearFavorites,
    favoritesCount: favorites.length
  }
}
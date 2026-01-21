import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { showSuccessToast, showErrorToast } from '@/lib/toast'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  createdAt: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  updateProfile: (userData: Partial<User>) => Promise<void>
}

interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('plume-user')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.warn('Failed to load user data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save user to localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('plume-user', JSON.stringify(user))
    } else {
      localStorage.removeItem('plume-user')
    }
  }, [user])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock authentication - in real app, this would call your API
      if (email === 'demo@plume-du-deen.com' && password === 'demo123') {
        const mockUser: User = {
          id: '1',
          email,
          firstName: 'Demo',
          lastName: 'User',
          createdAt: new Date().toISOString()
        }
        setUser(mockUser)
        showSuccessToast('Connexion réussie !')
      } else {
        throw new Error('Email ou mot de passe incorrect')
      }
    } catch (error) {
      showErrorToast(error instanceof Error ? error.message : 'Erreur de connexion')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: RegisterData) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Mock registration - in real app, this would call your API
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        createdAt: new Date().toISOString()
      }

      setUser(newUser)
      showSuccessToast('Compte créé avec succès !')
    } catch (error) {
      showErrorToast('Erreur lors de la création du compte')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    showSuccessToast('Déconnexion réussie')
  }

  const updateProfile = async (userData: Partial<User>) => {
    if (!user) return

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      showSuccessToast('Profil mis à jour')
    } catch (error) {
      showErrorToast('Erreur lors de la mise à jour')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
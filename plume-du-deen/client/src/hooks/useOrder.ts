import { useState } from 'react'
import { showSuccessToast, showErrorToast } from '@/lib/toast'

interface OrderData {
  customer: any
  items: any[]
  total: number
  paymentIntentId: string
}

interface UseOrderReturn {
  saveOrder: (orderData: OrderData) => Promise<string | null>
  loading: boolean
  error: string | null
}

export function useOrder(): UseOrderReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const saveOrder = async (orderData: OrderData): Promise<string | null> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de l\'enregistrement de la commande')
      }

      const result = await response.json()
      showSuccessToast('Commande confirmée !')
      return result.orderId
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de l\'enregistrement de la commande'
      setError(errorMessage)
      showErrorToast(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    saveOrder,
    loading,
    error,
  }
}
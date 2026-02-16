import { useState } from 'react'
import { showSuccessToast, showErrorToast } from '@/lib/toast'

interface UseStripePaymentReturn {
  createPaymentIntent: (data: { amount: number; currency?: string; metadata?: any }) => Promise<any>
  confirmPayment: (clientSecret: string) => Promise<any>
  loading: boolean
  error: string | null
}

export function useStripePayment(): UseStripePaymentReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createPaymentIntent = async (data: {
    amount: number
    currency?: string
    metadata?: any
  }): Promise<any> => {
    setLoading(true)
    setError(null)

    try {
      // Use same-origin API by default so dev/prod work consistently.
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: data.amount,
          currency: data.currency || 'chf',
          metadata: data.metadata,
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la création du paiement')
      }

      const result = await response.json()
      return result
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de la création du paiement'
      setError(errorMessage)
      showErrorToast(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }

  const confirmPayment = async (clientSecret: string): Promise<any> => {
    // This will be handled by the StripePaymentForm component
    // This hook mainly manages the API calls
    return { clientSecret }
  }

  return {
    createPaymentIntent,
    confirmPayment,
    loading,
    error,
  }
}
import { useState } from 'react'
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import { showSuccessToast } from '@/lib/toast'
import { useTheme } from '@/contexts/ThemeContext'
import { apiUrl } from '@/lib/api'

interface PayPalPaymentFormProps {
  amount: number
  currency: string
  orderData: {
    customer: any
    items: any[]
    total: number
  }
  onSuccess: () => void
  onError: (error: string) => void
}

export default function PayPalPaymentForm({ amount, currency, orderData, onSuccess, onError }: PayPalPaymentFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { theme } = useTheme()

  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID
  const isDark = theme === 'dark'

  const createOrder = async () => {
    try {
      const response = await fetch(apiUrl('/api/paypal/create-order'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          items: orderData.items,
        }),
      })

      const order = await response.json()
      if (!response.ok) throw new Error(order.details || order.error || 'Erreur PayPal')

      return order.id
    } catch (error: any) {
      onError(error.message)
      throw error
    }
  }

  const onApprove = async (data: any) => {
    try {
      setIsLoading(true)
      const response = await fetch(apiUrl('/api/paypal/capture-order'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: data.orderID,
          customer: orderData.customer,
          items: orderData.items,
          total: orderData.total,
        }),
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.details || result.error || 'Erreur PayPal')

      showSuccessToast('Paiement PayPal effectué avec succès !')
      onSuccess()
    } catch (error: any) {
      onError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (!clientId || clientId === 'AZ...') {
    return (
      <div className="text-sm text-destructive">
        PayPal n'est pas configuré (VITE_PAYPAL_CLIENT_ID manquant).
      </div>
    )
  }

  return (
    <PayPalScriptProvider options={{
      clientId,
      currency,
      intent: 'capture',
    }}>
      <div className="space-y-4">
        <PayPalButtons
          createOrder={createOrder}
          onApprove={onApprove}
          onError={(error) => onError((error as any)?.message || 'Erreur PayPal')}
          disabled={isLoading}
          style={{
            layout: 'vertical',
            color: isDark ? 'gold' : 'blue',
            shape: 'rect',
            label: 'paypal'
          }}
        />
      </div>
    </PayPalScriptProvider>
  )
}
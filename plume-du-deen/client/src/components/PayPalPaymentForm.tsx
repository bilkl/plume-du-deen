import { useState } from 'react'
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import { showSuccessToast, showErrorToast } from '@/lib/toast'

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

  const createOrder = async () => {
    try {
      const response = await fetch('/api/paypal/create-order', {
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
      if (!response.ok) throw new Error(order.error)

      return order.id
    } catch (error: any) {
      onError(error.message)
      throw error
    }
  }

  const onApprove = async (data: any) => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/paypal/capture-order', {
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
      if (!response.ok) throw new Error(result.error)

      showSuccessToast('Paiement PayPal effectué avec succès !')
      onSuccess()
    } catch (error: any) {
      showErrorToast(`Erreur PayPal: ${error.message}`)
      onError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PayPalScriptProvider options={{
      clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || 'AZ...',
      currency: currency,
    }}>
      <div className="space-y-4">
        <PayPalButtons
          createOrder={createOrder}
          onApprove={onApprove}
          onError={(error) => onError('Erreur PayPal')}
          disabled={isLoading}
          style={{
            layout: 'vertical',
            color: 'blue',
            shape: 'rect',
            label: 'paypal'
          }}
        />
      </div>
    </PayPalScriptProvider>
  )
}
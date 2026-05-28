import { useState } from 'react'
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import { showSuccessToast } from '@/lib/toast'
import { useTheme } from '@/contexts/ThemeContext'
import { apiUrl } from '@/lib/api'
import type { CurrencyCode } from '@/contexts/CurrencyContext'
import { useLanguage } from '@/contexts/LanguageContext'

interface PayPalPaymentFormProps {
  amount: number
  currency: CurrencyCode
  orderData: {
    customer: any
    items: any[]
    subtotal?: number
    subtotalChf?: number
    shipping?: any
    total: number
    currency?: CurrencyCode
    totalChf?: number
  }
  onSuccess: () => void
  onError: (error: string) => void
}

export default function PayPalPaymentForm({ amount, currency, orderData, onSuccess, onError }: PayPalPaymentFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { theme } = useTheme()
  const { language } = useLanguage()
  const isEnglish = language === 'en'

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
          shipping: orderData.shipping,
        }),
      })

      const order = await response.json()
      if (!response.ok) throw new Error(order.details || order.error || (isEnglish ? 'PayPal error' : 'Erreur PayPal'))

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
          currency: orderData.currency,
          totalChf: orderData.totalChf,
          subtotal: orderData.subtotal,
          subtotalChf: orderData.subtotalChf,
          shipping: orderData.shipping,
        }),
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.details || result.error || (isEnglish ? 'PayPal error' : 'Erreur PayPal'))

      showSuccessToast(isEnglish ? 'PayPal payment completed successfully.' : 'Paiement PayPal effectué avec succès !')
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
        {isEnglish ? 'PayPal is not configured (missing VITE_PAYPAL_CLIENT_ID).' : "PayPal n'est pas configuré (VITE_PAYPAL_CLIENT_ID manquant)."}
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
          onError={(error) => onError((error as any)?.message || (isEnglish ? 'PayPal error' : 'Erreur PayPal'))}
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

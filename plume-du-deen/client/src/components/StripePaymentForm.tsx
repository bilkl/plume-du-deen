import React, { useState } from 'react'
import {
  PaymentElement,
  useStripe,
  useElements,
  AddressElement
} from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, CreditCard, Shield, Lock } from 'lucide-react'
import { showSuccessToast, showErrorToast } from '@/lib/toast'
import { useLocation } from 'wouter'
import { useOrder } from '@/hooks/useOrder'

interface StripePaymentFormProps {
  paymentIntent: { clientSecret: string; paymentIntentId: string }
  amount: number
  currency: string
  orderData?: {
    customer: any
    items: any[]
    total: number
  }
  onSuccess: (paymentIntent: any) => void
  onError: (error: any) => void
  disabled?: boolean
}

export default function StripePaymentForm({
  paymentIntent,
  amount,
  currency,
  orderData,
  onSuccess,
  onError,
  disabled = false
}: StripePaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [, setLocation] = useLocation()
  const { saveOrder } = useOrder()
  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState<string>('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setMessage('')

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/commande-confirmee`,
        },
        redirect: 'if_required',
      })

      if (error) {
        setMessage(error.message || 'Une erreur est survenue')
        showErrorToast(error.message || 'Erreur de paiement')
        onError(error)
        setLocation('/paiement-erreur')
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        setMessage('Paiement réussi !')
        showSuccessToast('Paiement traité avec succès !')

        // Save order if order data is provided
        if (orderData) {
          await saveOrder({
            ...orderData,
            paymentIntentId: paymentIntent.id,
          })
        }

        onSuccess(paymentIntent)
        setLocation('/paiement-succes')
      } else {
        setMessage('Paiement en cours de traitement...')
      }
    } catch (err: any) {
      setMessage('Une erreur inattendue est survenue')
      showErrorToast('Erreur inattendue lors du paiement')
      onError(err)
    }

    setIsProcessing(false)
  }

  const paymentElementOptions = {
    layout: 'tabs' as const,
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Paiement sécurisé
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Shield className="w-4 h-4" />
            SSL chiffré
          </div>
          <div className="flex items-center gap-1">
            <Lock className="w-4 h-4" />
            Paiement sécurisé
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Address Element */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Adresse de facturation
            </label>
            <AddressElement
              options={{
                mode: 'billing',
                allowedCountries: ['CH', 'FR', 'BE', 'LU', 'DE', 'IT', 'AT'],
                fields: {
                  phone: 'always',
                },
                validation: {
                  phone: 'required',
                },
              }}
            />
          </div>

          {/* Payment Element */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Informations de paiement
            </label>
            <PaymentElement
              options={paymentElementOptions}
              className="min-h-[200px]"
            />
          </div>

          {/* Order Summary */}
          <div className="bg-secondary/50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total à payer :</span>
              <span className="text-xl font-bold text-primary">
                {amount.toFixed(2)} {currency.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              TVA incluse • Paiement sécurisé par Stripe
            </p>
          </div>

          {/* Error Message */}
          {message && (
            <div className={`p-3 rounded-md text-sm ${
              message.includes('réussi')
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!stripe || !elements || isProcessing || disabled}
            className="w-full h-12 text-base font-semibold"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Traitement du paiement...
              </>
            ) : (
              <>
                <Lock className="w-5 h-5 mr-2" />
                Payer {amount.toFixed(2)} {currency.toUpperCase()}
              </>
            )}
          </Button>

          {/* Security Notice */}
          <div className="text-center text-xs text-muted-foreground">
            <p>
              🔒 Vos informations de paiement sont chiffrées et sécurisées.
              <br />
              Nous n'enregistrons pas vos données bancaires.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
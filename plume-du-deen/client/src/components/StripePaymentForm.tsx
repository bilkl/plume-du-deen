import React, { useState, useEffect } from 'react'
import {
  PaymentElement,
  useStripe,
  useElements,
  AddressElement,
  Elements
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, CreditCard, Shield, Lock, CheckCircle, AlertTriangle, Globe } from 'lucide-react'
import { showSuccessToast, showErrorToast } from '@/lib/toast'
import { useLocation } from 'wouter'
import { useOrder } from '@/hooks/useOrder'

// Initialize Stripe
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
const stripePromise = STRIPE_PUBLISHABLE_KEY ? loadStripe(STRIPE_PUBLISHABLE_KEY) : null

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

function StripePaymentFormInner({
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
          return_url: `${window.location.origin}/paiement-succes`,
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
    <Card className="w-full border-2 border-border/50 shadow-lg bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-primary/10 rounded-full">
            <CreditCard className="w-6 h-6 text-primary" />
          </div>
          Paiement sécurisé
        </CardTitle>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Shield className="w-3 h-3" />
            SSL chiffré
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Lock className="w-3 h-3" />
            PCI DSS
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Globe className="w-3 h-3" />
            Stripe protégé
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Address Element */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-foreground flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Adresse de facturation
            </label>
            <div className="border border-border rounded-lg p-1 bg-background dark:bg-card min-h-[120px]">
              <AddressElement
                options={{
                  mode: 'billing',
                  allowedCountries: ['CH', 'FR', 'BE', 'LU', 'DE', 'IT', 'AT'],
                  fields: {
                    phone: 'always',
                  },
                  validation: {
                    phone: { required: 'always' },
                  },
                }}
              />
            </div>
          </div>

          {/* Payment Element */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-foreground flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" />
              Informations de paiement
            </label>
            <div className="border border-border rounded-lg p-1 bg-background dark:bg-card min-h-[220px]">
              <PaymentElement
                options={paymentElementOptions}
                className="min-h-[200px]"
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-secondary/30 dark:bg-secondary/20 border border-border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-foreground">Total à payer :</span>
              <span className="text-2xl font-bold text-primary">
                {amount.toFixed(2)} {currency.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <CheckCircle className="w-3 h-3 text-green-500" />
              TVA incluse • Paiement sécurisé par Stripe
            </div>
          </div>

          {/* Error Message */}
          {message && (
            <div className={`p-4 rounded-lg border flex items-start gap-3 ${
              message.includes('réussi')
                ? 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
            }`}>
              {message.includes('réussi') ? (
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              )}
              <div className="text-sm font-medium">{message}</div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!stripe || !elements || isProcessing || disabled}
            className="w-full h-14 text-base font-semibold bg-primary hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                Traitement du paiement en cours...
              </>
            ) : (
              <>
                <Lock className="w-5 h-5 mr-3" />
                Payer {amount.toFixed(2)} {currency.toUpperCase()}
              </>
            )}
          </Button>

          {/* Security Notice */}
          <div className="bg-muted/30 dark:bg-muted/10 border border-border rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-sm text-muted-foreground space-y-2">
                <p className="font-medium text-foreground">Vos données sont protégées</p>
                <ul className="space-y-1 text-xs">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    Chiffrement SSL 256-bit
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    Conformité PCI DSS
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    Données non stockées sur nos serveurs
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default function StripePaymentForm(props: StripePaymentFormProps) {
  if (!STRIPE_PUBLISHABLE_KEY) {
    return (
      <Card className="w-full border-2 border-destructive/20 bg-destructive/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            Paiement par carte indisponible
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <p className="text-muted-foreground">
              Le formulaire Stripe ne peut pas s’afficher car la clé Stripe publishable n’est pas configurée.
            </p>
            <p className="text-muted-foreground">
              Vous pouvez choisir PayPal ou nous contacter pour Orange Money.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Détecter le mode sombre avec un état qui force le re-render
  const [themeKey, setThemeKey] = useState(0)

  useEffect(() => {
    const checkTheme = () => {
      // Forcer un re-render en changeant la clé
      setThemeKey(prev => prev + 1)
    }

    // Vérifier le thème initial
    checkTheme()

    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => observer.disconnect()
  }, [])

  const isDark = document.documentElement.classList.contains('dark')

  // Obtenir les valeurs des variables CSS
  const getCSSVariable = (variable: string) => {
    return getComputedStyle(document.documentElement).getPropertyValue(variable).trim()
  }

  const options = {
    clientSecret: props.paymentIntent.clientSecret,
    fonts: [
      {
        cssSrc: 'https://fonts.googleapis.com/css?family=Inter:400,500,600',
      },
    ],
    appearance: {
      theme: isDark ? 'night' as const : 'stripe' as const,
      variables: {
        colorPrimary: isDark ? getCSSVariable('--primary') || '#d4af6a' : getCSSVariable('--primary') || '#1a4d3e',
        colorBackground: getCSSVariable('--background') || (isDark ? '#0a0a0a' : '#ffffff'),
        colorText: getCSSVariable('--foreground') || (isDark ? '#e8e4de' : '#1f2937'),
        colorDanger: getCSSVariable('--destructive') || '#dc2626',
        fontFamily: 'Inter, system-ui, sans-serif',
        spacingUnit: '3px',
        borderRadius: '8px',
        boxShadow: isDark
          ? '0 2px 8px rgba(0, 0, 0, 0.3)'
          : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      },
      rules: {
        '.Input': {
          boxShadow: isDark
            ? '0 1px 2px rgba(0, 0, 0, 0.2)'
            : '0 1px 2px rgba(0, 0, 0, 0.05)',
          border: `1px solid ${getCSSVariable('--border') || (isDark ? '#3a3a3a' : '#d1d5db')}`,
          backgroundColor: getCSSVariable('--background') || (isDark ? '#1a1a1a' : '#ffffff'),
          color: getCSSVariable('--foreground') || (isDark ? '#e8e4de' : '#1f2937'),
        },
        '.Input:focus': {
          borderColor: getCSSVariable('--primary') || (isDark ? '#d4af6a' : '#1a4d3e'),
          boxShadow: `0 0 0 2px ${isDark
            ? 'rgba(212, 175, 106, 0.2)'
            : 'rgba(26, 77, 62, 0.2)'}`,
        },
        '.Label': {
          color: getCSSVariable('--foreground') || (isDark ? '#e8e4de' : '#374151'),
          fontWeight: '500',
        },
        '.Tab': {
          backgroundColor: getCSSVariable('--muted') || (isDark ? '#2a2a2a' : '#f9fafb'),
          border: `1px solid ${getCSSVariable('--border') || (isDark ? '#3a3a3a' : '#d1d5db')}`,
          color: getCSSVariable('--foreground') || (isDark ? '#e8e4de' : '#374151'),
        },
        '.Tab--selected': {
          backgroundColor: getCSSVariable('--background') || (isDark ? '#3a3a3a' : '#ffffff'),
          borderColor: getCSSVariable('--primary') || (isDark ? '#d4af6a' : '#1a4d3e'),
          color: getCSSVariable('--primary') || (isDark ? '#d4af6a' : '#1a4d3e'),
        },
        '.Block': {
          backgroundColor: getCSSVariable('--background') || (isDark ? '#1a1a1a' : '#ffffff'),
          color: getCSSVariable('--foreground') || (isDark ? '#e8e4de' : '#1f2937'),
        },
        '.Text': {
          color: getCSSVariable('--foreground') || (isDark ? '#e8e4de' : '#374151'),
        },
        '.Text--secondary': {
          color: getCSSVariable('--muted-foreground') || (isDark ? '#a8a29e' : '#6b7280'),
        },
      },
    },
  }

  return (
    <Elements key={themeKey} stripe={stripePromise} options={options}>
      <StripePaymentFormInner {...props} />
    </Elements>
  )
}
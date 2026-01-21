import React from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder')

interface StripeProviderProps {
  children: React.ReactNode
}

export default function StripeProvider({ children }: StripeProviderProps) {
  const options = {
    // Stripe Elements options
    fonts: [
      {
        cssSrc: 'https://fonts.googleapis.com/css?family=Inter:400,500,600',
      },
    ],
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#1f2937', // gray-800
        colorBackground: '#ffffff',
        colorText: '#1f2937',
        colorDanger: '#dc2626', // red-600
        fontFamily: 'Inter, system-ui, sans-serif',
        spacingUnit: '2px',
        borderRadius: '6px',
      },
      rules: {
        '.Input': {
          boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        },
        '.Input:focus': {
          borderColor: '#1f2937',
          boxShadow: '0 0 0 1px #1f2937',
        },
      },
    },
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  )
}
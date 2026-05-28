import { Client } from '@paypal/paypal-server-sdk'
import { setSecurityHeaders } from '../security.js'

const environment = process.env.NODE_ENV === 'production'
  ? 'production'
  : 'sandbox'

const paypalClient = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.PAYPAL_CLIENT_ID || '',
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET || ''
  },
  environment
})

export default async function handler(req, res) {
  // Headers de sécurité + CORS
  setSecurityHeaders(req, res)

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      details: 'Seule la méthode POST est autorisée'
    });
  }

  try {
    const { amount, currency = 'CHF', items = [], shipping } = req.body

    // Validation des données avec fonctions utilitaires
    if (!amount || typeof amount !== 'number' || amount <= 0 || amount > 10000) {
      return res.status(400).json({
        error: 'Montant invalide',
        details: 'Le montant doit être un nombre positif entre 0.01 et 10,000 CHF'
      })
    }

    // Validation de la devise
    const allowedCurrencies = ['CHF', 'EUR', 'USD']
    if (!allowedCurrencies.includes(currency.toUpperCase())) {
      return res.status(400).json({
        error: 'Devise non supportée',
        details: `Les devises supportées sont: ${allowedCurrencies.join(', ')}`
      })
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: 'Articles invalides',
        details: 'La commande doit contenir au moins un article'
      })
    }

    for (const item of items) {
      if (!item.name || typeof item.name !== 'string' || item.name.length > 100) {
        return res.status(400).json({
          error: 'Nom de produit invalide',
          details: 'Chaque produit doit avoir un nom valide (max 100 caractères)'
        })
      }
      if (typeof item.price !== 'number' || item.price < 0) {
        return res.status(400).json({
          error: 'Prix invalide',
          details: 'Chaque produit doit avoir un prix positif ou nul'
        })
      }
    }

    const payableItems = items.filter(item => Number(item.price || 0) > 0)
    const itemTotal = payableItems.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0)
    const shippingAmount = shipping?.required ? Number(shipping.amount || 0) : 0
    const amountValue = (amount / 100).toFixed(2)
    const itemTotalValue = itemTotal.toFixed(2)
    const shippingValue = shippingAmount.toFixed(2)

    // Créer la commande PayPal
    const request = new paypalClient.orders.OrdersCreateRequest()
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: currency,
          value: amountValue, // Convertir de centimes à euros/francs
          breakdown: {
            item_total: {
              currency_code: currency,
              value: itemTotalValue
            },
            ...(shippingAmount > 0 ? {
              shipping: {
                currency_code: currency,
                value: shippingValue
              }
            } : {})
          }
        },
        items: payableItems.map(item => ({
          name: item.name.substring(0, 127), // Limite PayPal
          unit_amount: {
            currency_code: currency,
            value: item.price.toFixed(2)
          },
          quantity: item.quantity.toString(),
          description: item.name.length > 127 ? item.name.substring(0, 124) + '...' : item.name
        }))
      }],
      application_context: {
        brand_name: 'Plume du Deen',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW',
        return_url: `${(process.env.FRONTEND_URL || 'http://localhost:3000').split(',')[0].trim()}/paiement-succes`,
        cancel_url: `${(process.env.FRONTEND_URL || 'http://localhost:3000').split(',')[0].trim()}/panier`
      }
    })

    const order = await paypalClient.execute(request)

    res.json({
      id: order.result.id,
      status: order.result.status
    })

  } catch (error) {
    console.error('Erreur création commande PayPal:', error)

    // Gestion spécifique des erreurs PayPal
    if (error.name === 'INVALID_REQUEST') {
      return res.status(400).json({
        error: 'Requête invalide',
        details: error.details?.map(d => d.description).join(', ') || error.message
      })
    }

    res.status(500).json({
      error: 'Erreur lors de la création de la commande PayPal',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne'
    })
  }
}

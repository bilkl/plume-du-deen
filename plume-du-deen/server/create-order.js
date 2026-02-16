import { Client, Environment, OrdersController } from '@paypal/paypal-server-sdk'
import fs from 'node:fs'
import util from 'node:util'

const environment = process.env.PAYPAL_ENV === 'production'
  ? Environment.Production
  : Environment.Sandbox

function formatMoney(value) {
  // PayPal attend une string décimale avec 2 chiffres
  return Number(value).toFixed(2)
}

function extractPayPalErrorDetails(error) {
  const result = error?.result
  const details = result?.details

  if (Array.isArray(details) && details.length > 0) {
    return details
      .map((d) => d?.issue || d?.description || d?.message)
      .filter(Boolean)
      .join(', ')
  }

  return error?.message || 'Erreur inconnue'
}

export default async function handler(req, res) {
  // Enable CORS avec restrictions
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');

  // Headers de sécurité
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

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
    const { amount, currency = 'CHF', items } = req.body

    // NOTE: amount est en centimes (ex: 1000 = 10.00)
    const maxAmountCents = 1_000_000
    if (!amount || typeof amount !== 'number' || amount <= 0 || amount > maxAmountCents) {
      return res.status(400).json({
        error: 'Montant invalide',
        details: `Le montant doit être un nombre positif (en centimes) entre 1 et ${maxAmountCents}`
      })
    }

    const allowedCurrencies = ['CHF', 'EUR', 'USD']
    if (!allowedCurrencies.includes(currency.toUpperCase())) {
      return res.status(400).json({
        error: 'Devise non supportée',
        details: `Les devises supportées sont: ${allowedCurrencies.join(', ')}`
      })
    }

    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
      return res.status(500).json({
        error: 'Configuration PayPal manquante',
        details: 'PAYPAL_CLIENT_ID et/ou PAYPAL_CLIENT_SECRET non définis'
      })
    }

    const paypalClient = new Client({
      clientCredentialsAuthCredentials: {
        oAuthClientId: process.env.PAYPAL_CLIENT_ID,
        oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET
      },
      environment
    })

    const ordersController = new OrdersController(paypalClient);

    const currencyCode = currency.toUpperCase()
    const totalValue = formatMoney(amount / 100)

    const body = {
      intent: 'CAPTURE',
      purchaseUnits: [{
        amount: {
          currencyCode,
          value: totalValue
        }
      }]
    }

    // Optionnel: items. IMPORTANT: si on envoie des items, PayPal valide souvent
    // la cohérence avec amount.breakdown.itemTotal.
    // - Si items invalides: on les ignore.
    // - Si le total items ne correspond pas au total: on les ignore (pour éviter un INVALID_REQUEST).
    if (Array.isArray(items) && items.length > 0) {
      const normalizedItems = items
        .filter((i) => i && typeof i.name === 'string' && typeof i.price === 'number' && Number.isFinite(i.price) && i.quantity)
        .map((i) => {
          const quantity = Number(i.quantity)
          return {
            name: String(i.name).substring(0, 127),
            unitAmount: {
              currencyCode,
              value: formatMoney(i.price)
            },
            quantity: String(Number.isFinite(quantity) ? Math.max(1, Math.floor(quantity)) : 1)
          }
        })

      if (normalizedItems.length > 0) {
        const itemTotalNumber = normalizedItems.reduce((sum, i) => sum + (Number(i.unitAmount.value) * Number(i.quantity)), 0)
        const itemTotalValue = formatMoney(itemTotalNumber)

        // Comparaison “safe” sur 2 décimales
        if (itemTotalValue === totalValue) {
          body.purchaseUnits[0].items = normalizedItems
          body.purchaseUnits[0].amount.breakdown = {
            itemTotal: {
              currencyCode,
              value: itemTotalValue
            }
          }
        }
      }
    }

    const { result } = await ordersController.createOrder({ body })

    res.json({
      id: result.id,
      status: result.status
    })

  } catch (error) {
    console.error('Erreur création commande PayPal:', error)

    try {
      const shouldLog = process.env.NODE_ENV !== 'production' || process.env.PAYPAL_DEBUG === '1'
      if (shouldLog) {
        fs.writeFileSync(
          '/tmp/paypal-create-error.log',
          util.inspect(error, { depth: 10, colors: false })
        )
      }
    } catch {
      // ignore logging failures
    }

    // Gestion spécifique des erreurs PayPal
    if (error.name === 'INVALID_REQUEST') {
      return res.status(400).json({
        error: 'Requête invalide',
        details: extractPayPalErrorDetails(error)
      })
    }

    res.status(500).json({
      error: 'Erreur lors de la création de la commande PayPal',
      details: process.env.NODE_ENV === 'development'
        ? extractPayPalErrorDetails(error)
        : 'Erreur interne'
    })
  }
}
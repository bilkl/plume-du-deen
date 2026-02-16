import { Client, Environment, OrdersController } from '@paypal/paypal-server-sdk'
import { saveOrder } from './database.js'

const environment = process.env.PAYPAL_ENV === 'production'
  ? Environment.Production
  : Environment.Sandbox

export default async function handler(req, res) {
  // Enable CORS avec restrictions
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:3000')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Max-Age', '86400')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { orderId, customer, items, total } = req.body

    // Validation des données
    if (!orderId) {
      return res.status(400).json({
        error: 'ID de commande manquant',
        details: 'L\'ID de la commande PayPal est requis'
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

    const ordersController = new OrdersController(paypalClient)
    const { result } = await ordersController.captureOrder({ id: orderId, body: {} })

    // Vérifier que la capture a réussi
    if (result.status !== 'COMPLETED') {
      return res.status(400).json({
        error: 'Paiement non complété',
        details: `Statut PayPal: ${result.status}`
      })
    }

    // Enregistrer la commande si les infos sont fournies (même shape que /api/orders)
    let savedOrderId
    if (customer && Array.isArray(items) && typeof total === 'number') {
      try {
        const order = {
          id: `ORD-${Date.now()}`,
          customer,
          items,
          total,
          paymentIntentId: `paypal_${orderId}`,
          status: 'confirmed'
        }

        saveOrder(order)
        savedOrderId = order.id
      } catch (orderError) {
        console.error('Erreur lors de l\'enregistrement de la commande:', orderError)
      }
    }

    res.json({
      success: true,
      orderId: result.id,
      status: result.status,
      captureId: result.purchaseUnits?.[0]?.payments?.captures?.[0]?.id,
      savedOrderId
    })

  } catch (error) {
    console.error('Erreur capture commande PayPal:', error)

    // Gestion spécifique des erreurs PayPal
    if (error.name === 'INVALID_REQUEST') {
      return res.status(400).json({
        error: 'Requête invalide',
        details: error.details?.map(d => d.description).join(', ') || error.message
      })
    }

    if (error.name === 'RESOURCE_NOT_FOUND') {
      return res.status(404).json({
        error: 'Commande non trouvée',
        details: 'La commande PayPal n\'existe pas ou a expiré'
      })
    }

    if (process.env.PAYPAL_ENV !== 'production') {
      try {
        const { inspect } = await import('node:util')
        const fs = await import('node:fs')
        fs.writeFileSync('/tmp/paypal-capture-error.log', inspect(error, { depth: 8 }))
      } catch {
        // ignore debug logging errors
      }
    }

    const sandboxDetails =
      error?.result?.details?.map?.(d => d.issue || d.description).filter(Boolean).join(', ') ||
      error?.details?.map?.(d => d.issue || d.description).filter(Boolean).join(', ') ||
      error?.result?.message ||
      error?.message ||
      error?.name ||
      'Erreur PayPal'

    res.status(500).json({
      error: 'Erreur lors de la capture du paiement PayPal',
      details: process.env.PAYPAL_ENV !== 'production' ? sandboxDetails : 'Erreur interne'
    })
  }
}
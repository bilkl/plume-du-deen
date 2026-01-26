import { client } from '@paypal/paypal-server-sdk'

const environment = process.env.NODE_ENV === 'production'
  ? 'production'
  : 'sandbox'

const paypalClient = client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.PAYPAL_CLIENT_ID || '',
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET || ''
  },
  environment
})

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { orderId, orderData } = req.body

    // Validation des données
    if (!orderId) {
      return res.status(400).json({
        error: 'ID de commande manquant',
        details: 'L\'ID de la commande PayPal est requis'
      })
    }

    // Capturer la commande PayPal
    const request = new paypalClient.orders.OrdersCaptureRequest(orderId)
    request.requestBody({})

    const capture = await paypalClient.execute(request)

    // Vérifier que la capture a réussi
    if (capture.result.status !== 'COMPLETED') {
      return res.status(400).json({
        error: 'Paiement non complété',
        details: `Statut PayPal: ${capture.result.status}`
      })
    }

    // Créer la commande dans notre base de données si orderData est fourni
    if (orderData) {
      try {
        const orderResponse = await fetch(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/api/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customer: orderData.customer,
            items: orderData.items,
            total: orderData.total,
            paymentIntentId: `paypal_${orderId}`,
            paymentMethod: 'paypal'
          })
        })

        if (!orderResponse.ok) {
          console.error('Erreur lors de la création de la commande:', await orderResponse.text())
        }
      } catch (orderError) {
        console.error('Erreur lors de la création de la commande:', orderError)
        // Ne pas échouer la capture PayPal si la création de commande échoue
      }
    }

    res.json({
      success: true,
      orderId: capture.result.id,
      status: capture.result.status,
      captureId: capture.result.purchase_units[0].payments.captures[0].id
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

    res.status(500).json({
      error: 'Erreur lors de la capture du paiement PayPal',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne'
    })
  }
}
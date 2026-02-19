import Stripe from 'stripe';
import { setSecurityHeaders, isValidAmount, isValidEmail, sanitizeString } from './security.js';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  console.warn('STRIPE_SECRET_KEY not set. Stripe payment intents cannot be created.')
}

const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

export default async function handler(req, res) {
  // Headers de sécurité + CORS
  setSecurityHeaders(req, res);

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
    if (!stripe) {
      return res.status(500).json({
        error: 'Erreur de configuration',
        details: 'STRIPE_SECRET_KEY manquante'
      });
    }

    const { amount, currency = 'chf', metadata } = req.body;

    // Validation et sanitisation des données d'entrée
    if (!isValidAmount(amount)) {
      return res.status(400).json({
        error: 'Montant invalide',
        details: 'Le montant doit être un nombre positif entre 0.01 et 10,000 CHF'
      });
    }

    // Vérifier que le montant n'est pas trop élevé (protection contre les fraudes)
    if (amount > 10000) { // 10,000 CHF maximum
      return res.status(400).json({
        error: 'Montant trop élevé',
        details: 'Le montant maximum autorisé est de 10,000 CHF'
      });
    }

    // Validation de la devise
    const allowedCurrencies = ['chf', 'eur', 'usd'];
    const sanitizedCurrency = currency.toLowerCase();
    if (!allowedCurrencies.includes(sanitizedCurrency)) {
      return res.status(400).json({
        error: 'Devise non supportée',
        details: `Les devises supportées sont: ${allowedCurrencies.join(', ')}`
      });
    }

    // Validation et sanitisation des métadonnées
    let sanitizedMetadata = {};
    if (metadata && typeof metadata === 'object') {
      sanitizedMetadata = {
        customerEmail: metadata.customerEmail && isValidEmail(metadata.customerEmail) ? sanitizeString(metadata.customerEmail) : undefined,
        orderId: metadata.orderId ? sanitizeString(metadata.orderId) : undefined,
        productName: metadata.productName ? sanitizeString(metadata.productName) : undefined
      };
    }

    // Validation des métadonnées
    if (metadata) {
      // Vérifier la taille des métadonnées (limite Stripe)
      const metadataString = JSON.stringify(metadata);
      if (metadataString.length > 50000) { // Limite approximative de Stripe
        return res.status(400).json({
          error: 'Métadonnées trop volumineuses',
          details: 'Les métadonnées ne doivent pas dépasser 50KB'
        });
      }

      // Validation des champs de métadonnées critiques
      if (metadata.customer_email && !isValidEmail(metadata.customer_email)) {
        return res.status(400).json({
          error: 'Email invalide',
          details: 'L\'adresse email du client n\'est pas valide'
        });
      }
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // S'assurer que c'est un entier
      currency: currency.toLowerCase(),
      metadata: {
        ...metadata,
        created_at: new Date().toISOString(),
        source: 'plume-du-deen-website',
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);

    // Gestion spécifique des erreurs Stripe
    if (error.type === 'StripeCardError') {
      return res.status(400).json({
        error: 'Erreur de carte bancaire',
        details: error.message
      });
    }

    if (error.type === 'StripeRateLimitError') {
      return res.status(429).json({
        error: 'Trop de requêtes',
        details: 'Veuillez réessayer dans quelques instants'
      });
    }

    if (error.type === 'StripeInvalidRequestError') {
      return res.status(400).json({
        error: 'Requête invalide',
        details: error.message
      });
    }

    if (error.type === 'StripeAPIError') {
      return res.status(502).json({
        error: 'Erreur du service de paiement',
        details: 'Problème temporaire, veuillez réessayer'
      });
    }

    if (error.type === 'StripeConnectionError') {
      return res.status(503).json({
        error: 'Erreur de connexion',
        details: 'Impossible de contacter le service de paiement'
      });
    }

    if (error.type === 'StripeAuthenticationError') {
      console.error('Stripe authentication error - check API keys');
      return res.status(500).json({
        error: 'Erreur de configuration',
        details: 'Problème de configuration du service de paiement'
      });
    }

    res.status(500).json({
      error: 'Erreur lors de la création du paiement',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne du serveur'
    });
  }
}
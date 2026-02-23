import Stripe from 'stripe';
import { setSecurityHeaders, SECURITY_CONFIG, isValidEmail, sanitizeString } from './security.js';

// Trim to avoid hidden CR/LF or whitespace (common when envs come from CRLF .env files)
// which can break the Authorization header and surface as StripeConnectionError.
const stripeSecretKey = typeof process.env.STRIPE_SECRET_KEY === 'string'
  ? process.env.STRIPE_SECRET_KEY.trim()
  : '';
if (!stripeSecretKey) {
  console.warn('STRIPE_SECRET_KEY not set. Stripe payment intents cannot be created.')
}

const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

function isValidAmountInCents(amount) {
  const min = Math.round(SECURITY_CONFIG.MIN_AMOUNT * 100);
  const max = Math.round(SECURITY_CONFIG.MAX_AMOUNT * 100);
  return typeof amount === 'number' &&
    Number.isFinite(amount) &&
    Number.isInteger(amount) &&
    amount >= min &&
    amount <= max;
}

async function parseJsonBody(req) {
  const tryParse = (value) => {
    if (!value) return undefined;

    if (Buffer.isBuffer(value)) {
      try {
        return JSON.parse(value.toString('utf8'));
      } catch {
        return undefined;
      }
    }

    if (value instanceof Uint8Array) {
      try {
        return JSON.parse(Buffer.from(value).toString('utf8'));
      } catch {
        return undefined;
      }
    }

    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return undefined;
      }
    }

    if (typeof value === 'object') {
      try {
        return Object.keys(value).length > 0 ? value : undefined;
      } catch {
        return undefined;
      }
    }

    return undefined;
  };

  const candidates = [
    req.body,
    req.rawBody,
    req.bodyRaw,
    req._body,
    req._rawBody
  ];

  for (const candidate of candidates) {
    const parsed = tryParse(candidate);
    if (parsed) return parsed;
  }

  const chunks = [];
  let totalSize = 0;
  const maxSizeBytes = 1_000_000;

  await new Promise((resolve, reject) => {
    req.on('data', (chunk) => {
      totalSize += chunk.length;
      if (totalSize > maxSizeBytes) {
        reject(new Error('Payload trop volumineux'));
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', resolve);
    req.on('error', reject);
  });

  if (chunks.length === 0) return {};
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return {};

  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

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
      // In production we must have the key. In development, return a mock intent
      if (process.env.NODE_ENV === 'production') {
        return res.status(500).json({
          error: 'Erreur de configuration',
          details: 'STRIPE_SECRET_KEY manquante'
        });
      }

      console.info('Stripe not configured - returning development mock payment intent')
      return res.status(200).json({
        clientSecret: 'pi_mock_client_secret',
        paymentIntentId: `pi_mock_${Date.now()}`,
        mock: true
      });
    }

    const body = await parseJsonBody(req);
    const { amount, currency = 'chf', metadata } = body;

    // NOTE: `amount` is expected to be in cents (minor units).
    // The client sends `Math.round(total * 100)`.
    if (!isValidAmountInCents(amount)) {
      return res.status(400).json({
        error: 'Montant invalide',
        details: `Le montant doit être un entier en centimes entre ${Math.round(SECURITY_CONFIG.MIN_AMOUNT * 100)} et ${Math.round(SECURITY_CONFIG.MAX_AMOUNT * 100)}`
      });
    }

    // Validation de la devise
    const allowedCurrencies = ['chf', 'eur', 'usd'];
    const sanitizedCurrency = String(currency || 'chf').toLowerCase();
    if (!allowedCurrencies.includes(sanitizedCurrency)) {
      return res.status(400).json({
        error: 'Devise non supportée',
        details: `Les devises supportées sont: ${allowedCurrencies.join(', ')}`
      });
    }

    // Validation et sanitisation des métadonnées
    let sanitizedMetadata = {};
    if (metadata && typeof metadata === 'object') {
      const raw = metadata;
      sanitizedMetadata = {
        customer_email: raw.customer_email && isValidEmail(raw.customer_email)
          ? sanitizeString(raw.customer_email)
          : undefined,
        customer_name: raw.customer_name ? sanitizeString(raw.customer_name) : undefined,
        order_items: raw.order_items ? sanitizeString(String(raw.order_items), 2000) : undefined,
        orderId: raw.orderId ? sanitizeString(raw.orderId) : undefined,
        productName: raw.productName ? sanitizeString(raw.productName) : undefined
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
      amount, // cents
      currency: sanitizedCurrency,
      metadata: {
        ...Object.fromEntries(Object.entries(sanitizedMetadata).filter(([, v]) => typeof v === 'string' && v.length > 0)),
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
      details: process.env.NODE_ENV === 'development' ? (error?.message || String(error)) : 'Erreur interne du serveur'
    });
  }
}
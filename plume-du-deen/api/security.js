// Configuration de sécurité centralisée
export const SECURITY_CONFIG = {
  // CORS
  CORS_ORIGIN: process.env.FRONTEND_URL || 'https://plume-du-deen.com,http://localhost:3000',

  // Limites de validation
  MAX_AMOUNT: 10000, // CHF
  MIN_AMOUNT: 0.01,  // CHF
  MAX_STRING_LENGTH: 255,
  MAX_EMAIL_LENGTH: 100,
  MAX_NAME_LENGTH: 50,
  MAX_ADDRESS_LENGTH: 100,
  MAX_PHONE_LENGTH: 20,

  // Rate limiting (requêtes par minute)
  RATE_LIMITS: {
    CREATE_PAYMENT: 10,
    CREATE_ORDER: 5,
    GENERAL_API: 100
  },

  // Headers de sécurité
  SECURITY_HEADERS: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Access-Control-Max-Age': '86400'
  }
};

function parseAllowedOrigins(value) {
  if (!value || typeof value !== 'string') return [];
  return value
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
}

// Fonctions utilitaires de validation
export function isValidEmail(email) {
  if (!email || typeof email !== 'string' || email.length > SECURITY_CONFIG.MAX_EMAIL_LENGTH) {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function sanitizeString(str, maxLength = SECURITY_CONFIG.MAX_STRING_LENGTH) {
  if (typeof str !== 'string') return '';
  return str.trim().substring(0, maxLength).replace(/[<>]/g, '');
}

export function isValidAmount(amount) {
  return typeof amount === 'number' &&
         amount >= SECURITY_CONFIG.MIN_AMOUNT &&
         amount <= SECURITY_CONFIG.MAX_AMOUNT &&
         Number.isFinite(amount);
}

export function validateCustomerData(customer) {
  if (!customer || typeof customer !== 'object') {
    throw new Error('Données client manquantes');
  }

  const sanitized = {
    firstName: sanitizeString(customer.firstName, SECURITY_CONFIG.MAX_NAME_LENGTH),
    lastName: sanitizeString(customer.lastName, SECURITY_CONFIG.MAX_NAME_LENGTH),
    email: customer.email && isValidEmail(customer.email) ? customer.email.toLowerCase() : null,
    phone: sanitizeString(customer.phone, SECURITY_CONFIG.MAX_PHONE_LENGTH),
    address: sanitizeString(customer.address, SECURITY_CONFIG.MAX_ADDRESS_LENGTH),
    city: sanitizeString(customer.city, SECURITY_CONFIG.MAX_NAME_LENGTH),
    postalCode: sanitizeString(customer.postalCode, 10),
    country: sanitizeString(customer.country, SECURITY_CONFIG.MAX_NAME_LENGTH),
    countryOther: sanitizeString(customer.countryOther, SECURITY_CONFIG.MAX_NAME_LENGTH),
    shippingCountryCode: sanitizeString(customer.shippingCountryCode, 10),
    orderNotes: sanitizeString(customer.orderNotes, 400)
  };

  if (!sanitized.firstName || !sanitized.lastName || !sanitized.email) {
    throw new Error('Informations client incomplètes ou invalides');
  }

  return sanitized;
}

export function validateContactData(contact) {
  const errors = [];

  if (!contact || typeof contact !== 'object') {
    return { isValid: false, errors: ['Données manquantes'] };
  }

  const { name, email, subject, message } = contact;

  if (!name || typeof name !== 'string' || name.trim().length === 0 || name.length > SECURITY_CONFIG.MAX_NAME_LENGTH) {
    errors.push('Nom invalide');
  }

  if (!email || !isValidEmail(email)) {
    errors.push('Email invalide');
  }

  if (!subject || typeof subject !== 'string' || subject.trim().length === 0 || subject.length > SECURITY_CONFIG.MAX_STRING_LENGTH) {
    errors.push('Sujet invalide');
  }

  if (!message || typeof message !== 'string' || message.trim().length === 0 || message.length > 1000) { // Limit message to 1000 chars
    errors.push('Message invalide');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function setSecurityHeaders(arg1, arg2) {
  // Backward compatible signature:
  // - setSecurityHeaders(res)
  // - setSecurityHeaders(req, res)
  const req = arg2 ? arg1 : undefined;
  const res = arg2 ? arg2 : arg1;

  Object.entries(SECURITY_CONFIG.SECURITY_HEADERS).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // CORS headers
  const allowedOrigins = parseAllowedOrigins(SECURITY_CONFIG.CORS_ORIGIN);
  const requestOrigin = req?.headers?.origin;
  const corsOrigin = requestOrigin && allowedOrigins.includes(requestOrigin)
    ? requestOrigin
    : (allowedOrigins[0] || 'http://localhost:3000');

  res.setHeader('Access-Control-Allow-Origin', corsOrigin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

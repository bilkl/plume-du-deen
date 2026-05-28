import path from 'path';
import fs from 'fs';
import { sendOrderConfirmationEmail, sendAdminOrderNotification } from './emailService.js';
import { getEbooksForOrder } from './ebookConfig.js';
import { validateCustomerData, isValidAmount, setSecurityHeaders, SECURITY_CONFIG, sanitizeString } from './security.js';

// NOTE: Cette route tourne en serverless sur Vercel.
// SQLite (better-sqlite3) est une dépendance native qui peut casser l'installation
// selon la version Node côté Vercel. Pour garantir l'envoi des ebooks et le flow
// checkout, on stocke les commandes dans un petit store JSON (mémoire + /tmp).
const ORDER_STORE_PATH = process.env.VERCEL
  ? path.join('/tmp', 'orders.json')
  : path.join(process.cwd(), 'orders.json');

function loadOrdersFromStore() {
  try {
    if (!fs.existsSync(ORDER_STORE_PATH)) return [];
    const raw = fs.readFileSync(ORDER_STORE_PATH, 'utf8');
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function saveOrdersToStore(orders) {
  try {
    fs.writeFileSync(ORDER_STORE_PATH, JSON.stringify(orders, null, 2), 'utf8');
  } catch (error) {
    console.error('Unable to persist orders store:', error);
  }
}

function isValidZeroOrPositiveAmount(amount) {
  return typeof amount === 'number' &&
    Number.isFinite(amount) &&
    amount >= 0 &&
    amount <= SECURITY_CONFIG.MAX_AMOUNT;
}

function orderHasPhysicalItems(items) {
  return Array.isArray(items) && items.some(item => item?.format === 'paper');
}

function normalizeShippingData(shipping, hasPhysicalItems) {
  const raw = shipping && typeof shipping === 'object' ? shipping : {};
  const allowedZones = ['CH', 'EUROPE', 'WORLD'];
  const zone = allowedZones.includes(raw.zone) ? raw.zone : 'CH';
  const amount = Number(raw.amount || 0);
  const amountChf = Number(raw.amountChf || 0);

  return {
    required: Boolean(hasPhysicalItems),
    originCountry: 'CH',
    originLabel: 'Suisse',
    countryCode: sanitizeString(raw.countryCode || 'CH', 10),
    countryLabel: sanitizeString(raw.countryLabel || raw.countryCode || 'Suisse', SECURITY_CONFIG.MAX_NAME_LENGTH),
    zone,
    method: 'manual_from_switzerland',
    amount: Number.isFinite(amount) && amount >= 0 ? amount : 0,
    amountChf: Number.isFinite(amountChf) && amountChf >= 0 ? amountChf : 0,
    preparation: sanitizeString(raw.preparation || '3 à 5 jours ouvrés', 80),
    estimate: sanitizeString(raw.estimate || '', 180),
    label: sanitizeString(raw.label || 'Expédition manuelle depuis la Suisse', 100)
  };
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
  const maxSizeBytes = 1_000_000; // 1MB

  await new Promise((resolve, reject) => {
    req.on('data', chunk => {
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
  // Appliquer les headers de sécurité
  setSecurityHeaders(req, res);

  res.setHeader('X-Plume-Commit', process.env.VERCEL_GIT_COMMIT_SHA || 'unknown');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'POST') {
      // Créer une nouvelle commande
      const body = await parseJsonBody(req);
      const {
        customer,
        items,
        subtotal,
        subtotalChf,
        shipping,
        total,
        currency = 'CHF',
        totalChf,
        paymentIntentId,
        paymentMethod
      } = body;
      const normalizedCurrency = String(currency || 'CHF').toUpperCase();
      const allowedCurrencies = ['CHF', 'EUR', 'USD'];

      // Validation des données d'entrée
      if (!customer || !items || total === undefined || total === null || !paymentIntentId) {
        return res.status(400).json({
          error: 'Données manquantes',
          details: 'Customer, items, total et paymentIntentId sont requis'
        });
      }

      if (typeof paymentIntentId !== 'string' || paymentIntentId.trim().length === 0) {
        return res.status(400).json({
          error: 'paymentIntentId invalide',
          details: 'Le paymentIntentId doit être une chaîne non vide'
        });
      }

      if (typeof total !== 'number' || !Number.isFinite(total)) {
        return res.status(400).json({
          error: 'Total invalide',
          details: 'Le total doit être un nombre'
        });
      }

      if (!allowedCurrencies.includes(normalizedCurrency)) {
        return res.status(400).json({
          error: 'Devise invalide',
          details: 'Les devises acceptées sont CHF, EUR et USD'
        });
      }

      const isFreeOrder = total === 0;

      if (isFreeOrder) {
        if (paymentIntentId !== 'FREE') {
          return res.status(400).json({
            error: 'Total invalide',
            details: 'Les commandes offertes doivent utiliser paymentIntentId=FREE'
          });
        }

        if (!isValidZeroOrPositiveAmount(total)) {
          return res.status(400).json({
            error: 'Total invalide',
            details: `Le total doit être un nombre entre 0 et ${SECURITY_CONFIG.MAX_AMOUNT} CHF`
          });
        }
      } else {
        if (paymentIntentId === 'FREE') {
          return res.status(400).json({
            error: 'paymentIntentId invalide',
            details: 'paymentIntentId=FREE est réservé aux commandes offertes'
          });
        }

        // Validation du montant (paiements)
        if (!isValidAmount(total)) {
          return res.status(400).json({
            error: 'Total invalide',
            details: 'Le total doit être un nombre positif entre 0.01 et 10,000 CHF'
          });
        }
      }

      // Validation des données client
      let validatedCustomer;
      try {
        validatedCustomer = validateCustomerData(customer);
      } catch (error) {
        return res.status(400).json({
          error: 'Données client invalides',
          details: error.message
        });
      }

      // Validation des items
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          error: 'Articles invalides',
          details: 'La commande doit contenir au moins un article'
        });
      }

      // Validation de chaque item
      for (const item of items) {
        if (!item.id || !item.name || typeof item.price !== 'number' || !Number.isFinite(item.price) || item.price < 0) {
          return res.status(400).json({
            error: 'Article invalide',
            details: 'Chaque article doit avoir un ID, un nom et un prix >= 0'
          });
        }

        if (isFreeOrder && item.price !== 0) {
          return res.status(400).json({
            error: 'Article invalide',
            details: 'Une commande offerte ne peut contenir que des articles à 0 CHF'
          });
        }

        if (item.name.length > 100) {
          return res.status(400).json({
            error: 'Nom d\'article trop long',
            details: 'Le nom d\'un article ne peut pas dépasser 100 caractères'
          });
        }

        const quantity = Number(item.quantity || 1);
        if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
          return res.status(400).json({
            error: 'Quantité invalide',
            details: 'Chaque article doit avoir une quantité entre 1 et 99'
          });
        }

        if (item.format && !['digital', 'paper'].includes(item.format)) {
          return res.status(400).json({
            error: 'Format invalide',
            details: 'Le format doit être digital ou paper'
          });
        }
      }

      const hasPhysicalItems = orderHasPhysicalItems(items);
      const hasDigitalItems = items.some(item => item?.format !== 'paper');
      const normalizedShipping = normalizeShippingData(shipping, hasPhysicalItems);

      if (hasPhysicalItems && (!validatedCustomer.address || !validatedCustomer.city || !validatedCustomer.postalCode || !validatedCustomer.country)) {
        return res.status(400).json({
          error: 'Adresse de livraison requise',
          details: 'Les commandes papier nécessitent une adresse, une ville, un code postal et un pays de livraison'
        });
      }

      // Générer un ID de commande unique
      const orderId = `PLUME-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Enregistrer la commande dans un store léger (serverless-friendly)
      const orderRecord = {
        orderId,
        customer: {
          firstName: validatedCustomer.firstName,
          lastName: validatedCustomer.lastName,
          email: validatedCustomer.email,
          phone: validatedCustomer.phone || null,
          address: validatedCustomer.address || null,
          city: validatedCustomer.city || null,
          postalCode: validatedCustomer.postalCode || null,
          country: validatedCustomer.country || null,
          shippingCountryCode: validatedCustomer.shippingCountryCode || null,
          orderNotes: validatedCustomer.orderNotes || null
        },
        items,
        subtotal: typeof subtotal === 'number' && Number.isFinite(subtotal) ? subtotal : null,
        subtotalChf: typeof subtotalChf === 'number' && Number.isFinite(subtotalChf) ? subtotalChf : null,
        shipping: normalizedShipping,
        total,
        currency: normalizedCurrency,
        totalChf: typeof totalChf === 'number' && Number.isFinite(totalChf) ? totalChf : null,
        paymentIntentId,
        paymentMethod: paymentMethod || null,
        status: 'completed',
        fulfillmentStatus: hasPhysicalItems ? 'paid-awaiting-preparation' : 'completed',
        createdAt: new Date().toISOString()
      };

      const existingOrders = loadOrdersFromStore();
      existingOrders.push(orderRecord);
      saveOrdersToStore(existingOrders);

      // Préparer les données pour l'email de confirmation
      const orderEmailData = {
        orderId,
        customerName: `${validatedCustomer.firstName} ${validatedCustomer.lastName}`,
        customerEmail: validatedCustomer.email,
        items,
        total,
        currency: normalizedCurrency,
        subtotal: orderRecord.subtotal,
        subtotalChf: orderRecord.subtotalChf,
        shipping: normalizedShipping,
        totalChf: orderRecord.totalChf,
        createdAt: orderRecord.createdAt,
        hasPhysicalItems,
        hasDigitalItems,
        fulfillmentStatus: orderRecord.fulfillmentStatus,
        customerPhone: validatedCustomer.phone,
        customerAddress: validatedCustomer.address,
        customerCity: validatedCustomer.city,
        customerPostalCode: validatedCustomer.postalCode,
        customerCountry: validatedCustomer.country,
        customerOrderNotes: validatedCustomer.orderNotes
      };

      // Récupérer les ebooks pour cette commande
      let attachments = [];
      try {
        const ebooks = getEbooksForOrder(items);
        if (ebooks.length > 0) {
          attachments = ebooks.map(ebookPath => {
            const fileContent = fs.readFileSync(ebookPath);
            const fileName = path.basename(ebookPath);
            return {
              filename: fileName,
              content: fileContent.toString('base64'),
              contentType: 'application/pdf'
            };
          });
          console.log(`${attachments.length} ebook(s) préparé(s) pour la commande ${orderId}`);
        }
      } catch (ebookError) {
        console.error(`Erreur lors de la récupération des ebooks pour ${orderId}:`, ebookError);
        // Continuer sans les ebooks si erreur
      }

      // Envoyer l'email de confirmation au client (en arrière-plan)
      try {
        orderEmailData.digitalAttachmentsCount = attachments.length;
        await sendOrderConfirmationEmail(orderEmailData, attachments);
        console.log(`Email de confirmation envoyé pour la commande ${orderId}`);
      } catch (emailError) {
        console.error(`Erreur lors de l'envoi de l'email de confirmation pour ${orderId}:`, emailError);
        // Ne pas échouer la commande si l'email échoue
      }

      // Envoyer une notification à l'admin (en arrière-plan)
      try {
        await sendAdminOrderNotification(orderEmailData);
        console.log(`Notification admin envoyée pour la commande ${orderId}`);
      } catch (emailError) {
        console.error(`Erreur lors de l'envoi de la notification admin pour ${orderId}:`, emailError);
        // Ne pas échouer la commande si l'email échoue
      }

      res.status(201).json({
        success: true,
        orderId,
        message: 'Commande enregistrée avec succès'
      });

    } else if (req.method === 'GET') {
      // Récupérer les commandes d'un utilisateur
      const { email } = req.query;

      if (!email) {
        return res.status(400).json({
          error: 'Email requis',
          details: 'L\'email du client est requis pour récupérer les commandes'
        });
      }

      // Validation basique de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: 'Email invalide'
        });
      }

      const orders = loadOrdersFromStore();
      const filtered = orders
        .filter(order => order?.customer?.email === email)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 50);

      const formattedOrders = filtered.map(order => ({
        orderId: order.orderId,
        customerName: `${order.customer.firstName} ${order.customer.lastName}`,
        customerEmail: order.customer.email,
        items: Array.isArray(order.items) ? order.items : [],
        subtotal: order.subtotal ?? null,
        shipping: order.shipping || null,
        total: order.total,
        currency: order.currency || 'CHF',
        status: order.status || 'completed',
        fulfillmentStatus: order.fulfillmentStatus || order.status || 'completed',
        createdAt: new Date(order.createdAt).toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        paymentIntentId: order.paymentIntentId
      }));

      res.json({
        success: true,
        orders: formattedOrders,
        count: formattedOrders.length
      });

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Order API error:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne'
    });
  }
}

import path from 'path';
import fs from 'fs';
import { sendOrderConfirmationEmail, sendAdminOrderNotification } from './emailService.js';
import { getEbooksForOrder } from './ebookConfig.js';
import { validateCustomerData, isValidAmount, setSecurityHeaders } from './security.js';

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

export default async function handler(req, res) {
  // Appliquer les headers de sécurité
  setSecurityHeaders(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'POST') {
      // Créer une nouvelle commande
      const {
        customer,
        items,
        total,
        paymentIntentId
      } = req.body;

      // Validation des données d'entrée
      if (!customer || !items || !total || !paymentIntentId) {
        return res.status(400).json({
          error: 'Données manquantes',
          details: 'Customer, items, total et paymentIntentId sont requis'
        });
      }

      // Validation du montant
      if (!isValidAmount(total)) {
        return res.status(400).json({
          error: 'Total invalide',
          details: 'Le total doit être un nombre positif entre 0.01 et 10,000 CHF'
        });
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
        if (!item.id || !item.name || typeof item.price !== 'number' || item.price <= 0) {
          return res.status(400).json({
            error: 'Article invalide',
            details: 'Chaque article doit avoir un ID, un nom et un prix positif'
          });
        }
        if (item.name.length > 100) {
          return res.status(400).json({
            error: 'Nom d\'article trop long',
            details: 'Le nom d\'un article ne peut pas dépasser 100 caractères'
          });
        }
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
          country: validatedCustomer.country || null
        },
        items,
        total,
        paymentIntentId,
        status: 'completed',
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
        createdAt: orderRecord.createdAt,
        customerAddress: validatedCustomer.address,
        customerCity: validatedCustomer.city,
        customerPostalCode: validatedCustomer.postalCode,
        customerCountry: validatedCustomer.country
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
        total: order.total,
        status: order.status || 'completed',
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
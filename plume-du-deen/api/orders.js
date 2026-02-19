import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { sendOrderConfirmationEmail, sendAdminOrderNotification } from './emailService.js';
import { getEbooksForOrder } from './ebookConfig.js';
import { validateCustomerData, isValidAmount, setSecurityHeaders } from './security.js';

const dbPath = path.join(process.cwd(), 'database.sqlite');
const db = new Database(dbPath);

// Créer la table des commandes si elle n'existe pas
db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id TEXT UNIQUE NOT NULL,
    customer_email TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT,
    customer_address TEXT,
    customer_city TEXT,
    customer_postal_code TEXT,
    customer_country TEXT,
    items TEXT NOT NULL, -- JSON string
    total REAL NOT NULL,
    payment_intent_id TEXT NOT NULL,
    status TEXT DEFAULT 'completed',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Créer un index pour les recherches par email
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email)
`);

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC)
`);

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

      // Insérer la commande
      const stmt = db.prepare(`
        INSERT INTO orders (
          order_id, customer_email, customer_name, customer_phone,
          customer_address, customer_city, customer_postal_code, customer_country,
          items, total, payment_intent_id, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        orderId,
        validatedCustomer.email,
        `${validatedCustomer.firstName} ${validatedCustomer.lastName}`,
        validatedCustomer.phone,
        validatedCustomer.address,
        validatedCustomer.city,
        validatedCustomer.postalCode,
        validatedCustomer.country,
        JSON.stringify(items),
        total,
        paymentIntentId,
        'completed'
      );

      // Préparer les données pour l'email de confirmation
      const orderEmailData = {
        orderId,
        customerName: `${validatedCustomer.firstName} ${validatedCustomer.lastName}`,
        customerEmail: validatedCustomer.email,
        items,
        total,
        createdAt: new Date().toISOString(),
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

      const stmt = db.prepare(`
        SELECT
          order_id as orderId,
          customer_name as customerName,
          customer_email as customerEmail,
          items,
          total,
          status,
          created_at as createdAt,
          payment_intent_id as paymentIntentId
        FROM orders
        WHERE customer_email = ?
        ORDER BY created_at DESC
        LIMIT 50
      `);

      const orders = stmt.all(email);

      // Parser les items JSON
      const formattedOrders = orders.map(order => ({
        ...order,
        items: JSON.parse(order.items),
        createdAt: new Date(order.createdAt).toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
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
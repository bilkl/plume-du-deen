import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import Stripe from 'stripe';
import cors from 'cors';
import { paypalServerSdk } from '@paypal/paypal-server-sdk';
import db, { saveOrder, updateOrderStatus } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2024-12-18.acacia',
});

// Initialize PayPal
const paypalClient = new paypalServerSdk.core.PayPalHttpClient(
  new paypalServerSdk.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID || 'AZ...',
    process.env.PAYPAL_CLIENT_SECRET || 'EP...'
  )
);

// Temporary in-memory storage for orders (will be replaced with database)
const orders: any[] = [];

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Stripe API Routes
  app.post('/api/create-payment-intent', async (req, res) => {
    try {
      const { amount, currency = 'chf', metadata } = req.body;

      // Validate required fields
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Montant invalide' });
      }

      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        metadata: {
          ...metadata,
          created_at: new Date().toISOString(),
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      });
    } catch (error: any) {
      console.error('Error creating payment intent:', error);
      res.status(500).json({
        error: 'Erreur lors de la création du paiement',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });

  // Save order after successful payment
  app.post('/api/orders', async (req, res) => {
    try {
      const { customer, items, total, paymentIntentId } = req.body;

      const order = {
        id: `ORD-${Date.now()}`,
        customer,
        items,
        total,
        paymentIntentId,
        status: 'confirmed',
      };

      // Save to database
      saveOrder(order);

      // Also keep in memory for backward compatibility
      orders.push({
        ...order,
        createdAt: new Date().toISOString(),
      });

      console.log('Order saved:', order);

      res.json({
        success: true,
        orderId: order.id,
        message: 'Commande enregistrée avec succès'
      });
    } catch (error: any) {
      console.error('Error saving order:', error);
      res.status(500).json({
        error: 'Erreur lors de l\'enregistrement de la commande',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });

  // Get products
  app.get('/api/products', (req, res) => {
    try {
      const products = db.prepare('SELECT * FROM products WHERE is_active = 1 ORDER BY name').all();
      res.json(products);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      res.status(500).json({
        error: 'Erreur lors de la récupération des produits',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });

  // Get orders (for admin or order tracking)
  app.get('/api/orders', (req, res) => {
    // In production, add authentication and filtering
    res.json({
      orders,
      total: orders.length,
    });
  });

  app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig!, endpointSecret!);
    } catch (err: any) {
      console.log(`Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('PaymentIntent was successful!', paymentIntent.id);
        updateOrderStatus(paymentIntent.id, 'paid');
        break;
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('PaymentIntent failed!', failedPayment.id);
        updateOrderStatus(failedPayment.id, 'failed');
        break;
      case 'payment_intent.canceled':
        const canceledPayment = event.data.object;
        console.log('PaymentIntent canceled!', canceledPayment.id);
        updateOrderStatus(canceledPayment.id, 'canceled');
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  });

  // PayPal API Routes
  app.post('/api/paypal/create-order', async (req, res) => {
    try {
      const { amount, currency = 'CHF', items } = req.body;

      const request = new paypalServerSdk.orders.OrdersCreateRequest();
      request.prefer("return=representation");
      request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: currency,
            value: (amount / 100).toFixed(2), // PayPal expects amount in units, not cents
            breakdown: {
              item_total: {
                currency_code: currency,
                value: (amount / 100).toFixed(2)
              }
            }
          },
          items: items.map((item: any) => ({
            name: item.name,
            quantity: item.quantity || 1,
            unit_amount: {
              currency_code: currency,
              value: (item.price / 100).toFixed(2)
            }
          }))
        }]
      });

      const order = await paypalClient.execute(request);
      res.json({ id: order.result.id });
    } catch (error: any) {
      console.error('Error creating PayPal order:', error);
      res.status(500).json({
        error: 'Erreur lors de la création de la commande PayPal',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });

  app.post('/api/paypal/capture-order', async (req, res) => {
    try {
      const { orderId, customer, items, total } = req.body;

      const request = new paypalServerSdk.orders.OrdersCaptureRequest(orderId);
      request.requestBody({});

      const capture = await paypalClient.execute(request);

      if (capture.result.status === 'COMPLETED') {
        // Save order
        const order = {
          id: `ORD-${Date.now()}`,
          customer,
          items,
          total,
          paypalOrderId: orderId,
          status: 'paid',
        };

        saveOrder(order);

        res.json({
          success: true,
          orderId: order.id,
          capture: capture.result
        });
      } else {
        res.status(400).json({ error: 'Paiement PayPal non complété' });
      }
    } catch (error: any) {
      console.error('Error capturing PayPal order:', error);
      res.status(500).json({
        error: 'Erreur lors de la capture du paiement PayPal',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3001;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
    console.log(`Stripe integration: ${process.env.STRIPE_SECRET_KEY ? 'Enabled' : 'Disabled (using test keys)'}`);
  });
}

startServer().catch(console.error);

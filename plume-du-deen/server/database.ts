import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize database
const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    customer_first_name TEXT NOT NULL,
    customer_last_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    customer_address TEXT,
    customer_city TEXT,
    customer_postal_code TEXT,
    customer_country TEXT,
    items TEXT NOT NULL, -- JSON string
    total REAL NOT NULL,
    payment_intent_id TEXT NOT NULL,
    status TEXT DEFAULT 'confirmed',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    image_url TEXT,
    category TEXT,
    stock_quantity INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    first_name TEXT,
    last_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Prepared statements for orders
export const orderStatements = {
  insert: db.prepare(`
    INSERT INTO orders (
      id, customer_first_name, customer_last_name, customer_email,
      customer_phone, customer_address, customer_city, customer_postal_code,
      customer_country, items, total, payment_intent_id, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),

  getById: db.prepare('SELECT * FROM orders WHERE id = ?'),

  getByEmail: db.prepare('SELECT * FROM orders WHERE customer_email = ? ORDER BY created_at DESC'),

  updateStatus: db.prepare('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'),

  getAll: db.prepare('SELECT * FROM orders ORDER BY created_at DESC'),

  getRecent: db.prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT ?'),
};

// Prepared statements for products
export const productStatements = {
  insert: db.prepare(`
    INSERT INTO products (id, name, description, price, image_url, category, stock_quantity)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `),

  getAll: db.prepare('SELECT * FROM products WHERE is_active = 1 ORDER BY name'),

  getById: db.prepare('SELECT * FROM products WHERE id = ? AND is_active = 1'),

  getByCategory: db.prepare('SELECT * FROM products WHERE category = ? AND is_active = 1 ORDER BY name'),

  update: db.prepare(`
    UPDATE products SET
      name = ?, description = ?, price = ?, image_url = ?,
      category = ?, stock_quantity = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `),

  delete: db.prepare('UPDATE products SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?'),
};

// Prepared statements for users
export const userStatements = {
  insert: db.prepare(`
    INSERT INTO users (id, email, password_hash, first_name, last_name)
    VALUES (?, ?, ?, ?, ?)
  `),

  getByEmail: db.prepare('SELECT * FROM users WHERE email = ?'),

  getById: db.prepare('SELECT * FROM users WHERE id = ?'),

  update: db.prepare(`
    UPDATE users SET
      first_name = ?, last_name = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `),
};

// Helper functions
export function saveOrder(orderData: any) {
  const { id, customer, items, total, paymentIntentId, status = 'confirmed' } = orderData;

  return orderStatements.insert.run(
    id,
    customer.firstName,
    customer.lastName,
    customer.email,
    customer.phone || null,
    customer.address || null,
    customer.city || null,
    customer.postalCode || null,
    customer.country || null,
    JSON.stringify(items),
    total,
    paymentIntentId,
    status
  );
}

export function getOrderById(orderId: string) {
  return orderStatements.getById.get(orderId);
}

export function getOrdersByEmail(email: string) {
  return orderStatements.getByEmail.all(email);
}

export function updateOrderStatus(orderId: string, status: string) {
  return orderStatements.updateStatus.run(status, orderId);
}

export function getAllOrders(limit?: number) {
  if (limit) {
    return orderStatements.getRecent.all(limit);
  }
  return orderStatements.getAll.all();
}

// Seed initial products if database is empty
const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };

if (productCount.count === 0) {
  console.log('Seeding initial products...');

  const initialProducts = [
    {
      id: 'invocations-coran',
      name: 'Les Invocations du Coran',
      description: 'Collection complète des invocations tirées du Saint Coran',
      price: 15.00,
      image_url: '/images/invocations.png',
      category: 'spiritual',
      stock_quantity: 50
    },
    {
      id: 'planner-ramadan',
      name: 'Planner Ramadan ALIF',
      description: 'Planificateur spirituel pour le mois sacré du Ramadan',
      price: 25.00,
      image_url: '/images/planner.png',
      category: 'planner',
      stock_quantity: 30
    },
    {
      id: '99-noms-allah',
      name: 'Les 99 Noms d\'Allah',
      description: 'Carte illustrée des 99 beaux noms d\'Allah',
      price: 20.00,
      image_url: '/images/99noms.png',
      category: 'spiritual',
      stock_quantity: 40
    }
  ];

  for (const product of initialProducts) {
    productStatements.insert.run(
      product.id,
      product.name,
      product.description,
      product.price,
      product.image_url,
      product.category,
      product.stock_quantity
    );
  }

  console.log('Initial products seeded successfully');
}

export default db;
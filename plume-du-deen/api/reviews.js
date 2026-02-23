import path from 'path';
import fs from 'fs';
import { setSecurityHeaders } from './security.js';

const REVIEWS_STORE_PATH = process.env.VERCEL
  ? path.join('/tmp', 'reviews.json')
  : path.join(process.cwd(), 'reviews.json');

function loadReviewsFromStore() {
  try {
    if (!fs.existsSync(REVIEWS_STORE_PATH)) return [];
    const raw = fs.readFileSync(REVIEWS_STORE_PATH, 'utf8');
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('Failed to load reviews store:', err);
    return [];
  }
}

function saveReviewsToStore(reviews) {
  try {
    fs.writeFileSync(REVIEWS_STORE_PATH, JSON.stringify(reviews, null, 2), 'utf8');
  } catch (err) {
    console.error('Unable to persist reviews store:', err);
  }
}

async function parseJsonBody(req) {
  const tryParse = (value) => {
    if (!value) return undefined;
    try {
      if (Buffer.isBuffer(value)) return JSON.parse(value.toString('utf8'));
      if (value instanceof Uint8Array) return JSON.parse(Buffer.from(value).toString('utf8'));
      if (typeof value === 'string') return JSON.parse(value);
      if (typeof value === 'object') return Object.keys(value).length > 0 ? value : undefined;
    } catch (e) {
      return undefined;
    }
    return undefined;
  };

  const candidates = [req.body, req.rawBody, req.bodyRaw, req._body, req._rawBody];
  for (const c of candidates) {
    const parsed = tryParse(c);
    if (parsed) return parsed;
  }

  const chunks = [];
  let totalSize = 0;
  const maxSizeBytes = 500_000;

  await new Promise((resolve, reject) => {
    req.on('data', (chunk) => {
      totalSize += chunk.length;
      if (totalSize > maxSizeBytes) return reject(new Error('Payload too large'));
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
  } catch (e) {
    return {};
  }
}

export default async function handler(req, res) {
  setSecurityHeaders(req, res);
  res.setHeader('X-Plume-Commit', process.env.VERCEL_GIT_COMMIT_SHA || 'unknown');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const productId = req.query?.productId || (req.url && new URL(req.url, 'http://localhost').searchParams.get('productId'));
      if (!productId) return res.status(400).json({ error: 'productId requis' });

      const all = loadReviewsFromStore();
      const pid = Number(productId);
      const filtered = all.filter(r => Number(r.productId) === pid)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 200);

      return res.json({ success: true, reviews: filtered });
    }

    if (req.method === 'POST') {
      const body = await parseJsonBody(req);
      const action = body.action || 'add';

      if (action === 'add') {
        const { userId, userName, rating, title, comment, productId, verified } = body;
        if (!productId || !userName || typeof rating !== 'number' || !comment) {
          return res.status(400).json({ error: 'Données de review manquantes' });
        }

        const newReview = {
          id: `R-${Date.now()}-${Math.random().toString(36).slice(2,9)}`,
          userId: userId || null,
          userName: userName || 'Anonyme',
          userAvatar: body.userAvatar || null,
          rating: Number(rating),
          title: title || '',
          comment: comment || '',
          date: new Date().toISOString(),
          verified: !!verified,
          helpful: 0,
          productId: Number(productId)
        };

        const all = loadReviewsFromStore();
        all.push(newReview);
        saveReviewsToStore(all);

        return res.status(201).json({ success: true, review: newReview });
      }

      if (action === 'helpful') {
        const { reviewId } = body;
        if (!reviewId) return res.status(400).json({ error: 'reviewId requis' });
        const all = loadReviewsFromStore();
        const idx = all.findIndex(r => r.id === reviewId);
        if (idx === -1) return res.status(404).json({ error: 'Review introuvable' });
        all[idx].helpful = (all[idx].helpful || 0) + 1;
        saveReviewsToStore(all);
        return res.json({ success: true, review: all[idx] });
      }

      if (action === 'report') {
        const { reviewId, reason } = body;
        if (!reviewId || !reason) return res.status(400).json({ error: 'reviewId et reason requis' });
        // For now, we log reports and return success. Admin can process stored reports later.
        console.log('Review report received', { reviewId, reason });
        return res.json({ success: true, message: 'Signalement reçu' });
      }

      return res.status(400).json({ error: 'Action inconnue' });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Reviews API error:', err);
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
}

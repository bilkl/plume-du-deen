#!/bin/bash

echo "🚀 Démarrage de Plume du Deen - Système de paiement"
echo "=================================================="
echo ""

# Vérifier si les clés Stripe sont configurées
if grep -q "placeholder" .env; then
    echo "⚠️  ATTENTION: Les clés Stripe ne sont pas configurées !"
    echo "   Modifiez le fichier .env avec vos vraies clés Stripe"
    echo "   Obtenez-les sur: https://dashboard.stripe.com/test/apikeys"
    echo ""
    echo "   Format attendu dans .env:"
    echo "   STRIPE_SECRET_KEY=sk_test_..."
    echo "   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_..."
    echo ""
fi

echo "📦 Démarrage du frontend (port 3000)..."
npm run dev &
FRONTEND_PID=$!

echo "🖥️  Démarrage du backend (port 3001)..."
cd server && npx tsx index.ts &
BACKEND_PID=$!

echo ""
echo "✅ Serveurs démarrés !"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"
echo ""
echo "🧪 Tests API:"
echo "   curl http://localhost:3001/api/products"
echo "   curl http://localhost:3001/api/orders"
echo ""
echo "🛑 Pour arrêter: Ctrl+C ou kill $FRONTEND_PID $BACKEND_PID"

# Attendre l'arrêt
trap "echo ''; echo 'Arrêt des serveurs...'; kill $FRONTEND_PID $BACKEND_PID 2>/dev/null; exit" INT
wait
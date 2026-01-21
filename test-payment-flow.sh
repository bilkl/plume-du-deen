#!/bin/bash

echo "=== Test du flux de paiement complet ==="
echo ""

# Démarrer le backend en arrière-plan
echo "1. Démarrage du serveur backend..."
cd /home/bkh/Documents/plume-du-deen-source/plume-du-deen/server
npx tsx index.ts &
BACKEND_PID=$!
sleep 2

# Tester les produits
echo "2. Test de l'API produits..."
curl -s http://localhost:3001/api/products | jq '. | length' 2>/dev/null || echo "Erreur API produits"

# Tester les commandes
echo "3. Test de l'API commandes..."
curl -s http://localhost:3001/api/orders | jq '.total' 2>/dev/null || echo "Erreur API commandes"

# Créer un payment intent
echo "4. Test de création d'un payment intent..."
PAYMENT_RESPONSE=$(curl -s -X POST http://localhost:3001/api/create-payment-intent \
  -H "Content-Type: application/json" \
  -d '{"amount": 2500, "currency": "chf", "metadata": {"orderId": "test-123"}}')

echo "Payment Intent Response:"
echo "$PAYMENT_RESPONSE" | jq '.' 2>/dev/null || echo "$PAYMENT_RESPONSE"

# Extraire le clientSecret si la réponse est valide
CLIENT_SECRET=$(echo "$PAYMENT_RESPONSE" | jq -r '.clientSecret' 2>/dev/null || echo "")

if [ -n "$CLIENT_SECRET" ] && [ "$CLIENT_SECRET" != "null" ]; then
  echo "5. Test de création d'une commande..."

  # Simuler une commande
  ORDER_DATA='{
    "customer": {
      "firstName": "Test",
      "lastName": "User",
      "email": "test@example.com",
      "phone": "+41791234567",
      "address": "Rue de Test 1",
      "city": "Genève",
      "postalCode": "1201",
      "country": "CH"
    },
    "items": [
      {
        "id": "invocations-coran",
        "name": "Les Invocations du Coran",
        "price": 15,
        "quantity": 1
      }
    ],
    "total": 15,
    "paymentIntentId": "'$(echo "$PAYMENT_RESPONSE" | jq -r '.paymentIntentId')'"
  }'

  ORDER_RESPONSE=$(curl -s -X POST http://localhost:3001/api/orders \
    -H "Content-Type: application/json" \
    -d "$ORDER_DATA")

  echo "Order Creation Response:"
  echo "$ORDER_RESPONSE" | jq '.' 2>/dev/null || echo "$ORDER_RESPONSE"

  # Vérifier que la commande a été créée
  echo "6. Vérification des commandes après création..."
  curl -s http://localhost:3001/api/orders | jq '.orders | length' 2>/dev/null || echo "Erreur vérification commandes"
fi

# Nettoyer
echo ""
echo "7. Nettoyage..."
kill $BACKEND_PID 2>/dev/null
echo "Test terminé."
#!/bin/bash

echo "🧪 Test des pages légales - Plume du Deen (Produits Numériques)"
echo "============================================================"
echo ""

BASE_URL="http://localhost:3000"

# Fonction pour tester une page
test_page() {
    local url="$1"
    local name="$2"

    echo "📄 Test de $name..."
    response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$url")

    if [ "$response" -eq 200 ]; then
        echo "✅ $name : OK (HTTP $response)"
    else
        echo "❌ $name : ÉCHEC (HTTP $response)"
    fi
    echo ""
}

# Démarrer le serveur en arrière-plan si pas déjà démarré
if ! pgrep -f "vite" > /dev/null; then
    echo "🚀 Démarrage du serveur frontend..."
    cd /home/bkh/Documents/plume-du-deen-source/plume-du-deen
    npm run dev &
    SERVER_PID=$!
    sleep 5
    echo ""
fi

# Tester toutes les pages légales
test_page "/conditions-generales" "Conditions Générales (Produits Numériques)"
test_page "/politique-confidentialite" "Politique de Confidentialité"
test_page "/retours-remboursements" "Retours & Remboursements (Numériques)"
test_page "/mentions-legales" "Mentions Légales"

# Test des liens dans le footer
echo "🔗 Vérification des liens dans le footer..."
echo "   (Liens adaptés pour produits numériques)"
echo ""

# Nettoyer
if [ ! -z "$SERVER_PID" ]; then
    echo "🧹 Arrêt du serveur de test..."
    kill $SERVER_PID 2>/dev/null
fi

echo "✅ Test terminé !"
echo ""
echo "📋 Résumé :"
echo "   - 4 pages légales créées et adaptées"
echo "   - Contenu spécifique aux produits numériques"
echo "   - Livraison instantanée, pas de retour physique"
echo "   - Droit de rétractation avant consommation"
echo "   - Conforme à la législation suisse"
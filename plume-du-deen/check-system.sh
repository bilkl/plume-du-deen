#!/bin/bash

echo "=== Vérification Complète du Système de Livraison d'Ebooks ==="
echo ""

# Test 1: Tests automatisés
echo "🧪 Test 1: Tests automatisés..."
cd /home/bkh/Documents/plume-du-deen-source/plume-du-deen
npm run test:ebooks
echo ""

# Test 2: Test de bout en bout
echo "🔄 Test 2: Test de bout en bout..."
npm run test:e2e
echo ""

# Test 3: Vérification des fichiers
echo "📁 Test 3: Vérification des fichiers..."
echo "Ebooks présents:"
ls -la ebooks/
echo ""

# Test 4: Vérification de la configuration
echo "⚙️ Test 4: Configuration..."
if [ -f ".env" ]; then
    echo "✓ Fichier .env présent"
    if grep -q "RESEND_API_KEY" .env; then
        echo "✓ RESEND_API_KEY configuré"
    else
        echo "⚠️ RESEND_API_KEY manquant dans .env"
    fi
else
    echo "⚠️ Fichier .env manquant"
fi
echo ""

# Test 5: Vérification du serveur
echo "🚀 Test 5: Serveur..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✓ Serveur accessible sur http://localhost:3000"
else
    echo "⚠️ Serveur non accessible (démarrer avec: npm run dev)"
fi
echo ""

echo "🎯 Résumé:"
echo "   ✅ Tests automatisés: $(npm run test:ebooks > /dev/null 2>&1 && echo 'PASS' || echo 'FAIL')"
echo "   ✅ Configuration: $([ -f ".env" ] && grep -q "RESEND_API_KEY" .env && echo 'OK' || echo 'À vérifier')"
echo "   ✅ Serveur: $(curl -s http://localhost:3000 > /dev/null && echo 'OK' || echo 'À démarrer')"
echo ""
echo "📋 Prochaines étapes:"
echo "   1. Ouvrir http://localhost:3000 dans votre navigateur"
echo "   2. Ajouter des produits au panier"
echo "   3. Tester le paiement avec un email réel"
echo "   4. Vérifier la réception de l'email avec pièces jointes"
echo ""
echo "=== Fin de la vérification ==="
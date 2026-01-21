# Plume du Deen - Système E-commerce

Système complet de e-commerce avec paiement Stripe intégré pour la boutique Plume du Deen.

## 🚀 Démarrage rapide

### 1. Configuration des clés Stripe

1. Créez un compte sur [Stripe](https://stripe.com)
2. Allez dans le [Dashboard Stripe](https://dashboard.stripe.com/test/apikeys)
3. Copiez vos clés de test :
   - **Clé publique** (commence par `pk_test_`)
   - **Clé secrète** (commence par `sk_test_`)

4. Modifiez le fichier `.env` :
```bash
STRIPE_SECRET_KEY=sk_test_votre_clé_secrète
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_votre_clé_publique
```

### 2. Installation et démarrage

```bash
# Installation des dépendances
npm install

# Démarrage automatique des deux serveurs
./start.sh
```

Ou manuellement :
```bash
# Terminal 1 - Frontend (port 3000)
npm run dev

# Terminal 2 - Backend (port 3001)
npx tsx server/index.ts
```

### 3. Accès à l'application

- **Site web** : http://localhost:3000
- **API Backend** : http://localhost:3001

## 📄 Pages légales

Le site inclut toutes les pages légales requises, adaptées aux produits numériques :

- **Conditions Générales de Vente** (`/conditions-generales`)
  - Produits numériques avec livraison instantanée
  - Paiement sécurisé, droit de rétractation adapté
- **Politique de Confidentialité** (`/politique-confidentialite`)
  - Collecte et utilisation des données
  - Cookies et suivi
  - Droits des utilisateurs (RGPD)
- **Politique de Retour & Remboursement** (`/retours-remboursements`)
  - Droit de rétractation pour produits numériques
  - Remboursement avant consommation du contenu
  - Pas de retour physique requis
- **Mentions Légales** (`/mentions-legales`)
  - Éditeur du site et hébergement
  - Propriété intellectuelle
  - Responsabilités et droits

Ces pages sont accessibles via le footer du site et sont conformes à la législation suisse pour le commerce électronique de produits numériques.

## 🧪 Tests API

```bash
# Tester les produits
curl http://localhost:3001/api/products

# Tester les commandes
curl http://localhost:3001/api/orders

# Créer un payment intent (nécessite clés Stripe)
curl -X POST http://localhost:3001/api/create-payment-intent \
  -H "Content-Type: application/json" \
  -d '{"amount": 2500, "currency": "chf"}'
```

## 📁 Structure du projet

```
plume-du-deen/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Composants UI
│   │   ├── pages/         # Pages de l'application
│   │   ├── contexts/      # Contextes React
│   │   └── hooks/         # Hooks personnalisés
├── server/                 # Backend Express
│   ├── index.ts           # Serveur principal
│   └── database.ts        # Base de données SQLite
├── .env                   # Configuration (clés Stripe)
└── start.sh              # Script de démarrage
```

## 💳 Fonctionnalités

### ✅ Implémenté
- Interface utilisateur complète
- Catalogue produits numériques (e-books, guides spirituels)
- Livraison instantanée après paiement
- Panier d'achat avec gestion d'état
- Formulaire de paiement Stripe sécurisé
- Persistance des commandes en base de données
- Base de données SQLite optimisée
- API REST complète pour produits et commandes
- Pages légales complètes adaptées aux produits numériques

### 🔧 Technologies
- **Frontend** : React 19, TypeScript, Vite, Tailwind CSS
- **Backend** : Express.js, TypeScript, SQLite
- **Paiement** : Stripe Elements
- **UI** : Radix UI, Lucide Icons

## 🔐 Sécurité

- Clés API Stripe stockées dans des variables d'environnement
- Validation des données côté client et serveur
- Protection CSRF avec SameSite cookies
- Sanitisation des entrées utilisateur

## 🚀 Déploiement

### Variables d'environnement de production
```bash
STRIPE_SECRET_KEY=sk_live_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
NODE_ENV=production
PORT=3001
```

### Build de production
```bash
npm run build
npm start
```

## 📞 Support

Pour toute question concernant Stripe :
- [Documentation Stripe](https://stripe.com/docs)
- [Dashboard Stripe](https://dashboard.stripe.com)
- [Support Stripe](https://support.stripe.com)

---

**🎉 Votre boutique Plume du Deen est prête !**
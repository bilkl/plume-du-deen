# Plume du Deen - Site E-commerce Spirituel

Site web e-commerce pour produits spirituels islamiques avec panier d'achat, mode sombre et pages produits détaillées.

## Fonctionnalités

- 🛒 Panier d'achat complet avec gestion des quantités
- 🌙 Mode sombre/clair automatique
- � **Paiements multiples** : Stripe (cartes) + PayPal
- 📧 **Système d'email automatique** - Confirmations de commande instantanées depuis `commandes@plume-du-deen.com`
- 📱 Design responsive et moderne
- 🏪 Pages produits individuelles détaillées
- ⚡ Déploiement automatique via GitHub Actions

## Configuration des Emails

Le site inclut un système d'email automatique pour les confirmations de commande.

### Configuration Requise

1. **Créer un compte Resend** : [resend.com](https://resend.com)
2. **Obtenir une clé API** dans le dashboard Resend
3. **Configurer les variables d'environnement** dans `.env` :
   ```env
   RESEND_API_KEY=re_votre_clé_api_ici
   ADMIN_EMAIL=votre-email@exemple.com
   ```

### Tester les Emails

```bash
# Tester le système d'email
npm run test:email
```

### Fonctionnalités Email

- ✅ **Email de confirmation client** - Envoyé automatiquement après chaque achat depuis `commandes@plume-du-deen.com`
- ✅ **Notification admin** - Alerte instantanée pour nouvelles commandes depuis `noreply@plume-du-deen.com`
- ✅ **Templates responsives** - Design professionnel et mobile-friendly
- ✅ **Domaine personnalisé** - Emails authentiques depuis plume-du-deen.com

### Configuration PayPal

Le site supporte les paiements PayPal en plus des cartes bancaires.

#### Configuration Requise

1. **Créer un compte PayPal Business** : [paypal.com/business](https://www.paypal.com/business)
2. **Créer une app développeur** : [developer.paypal.com](https://developer.paypal.com/)
3. **Obtenir les clés API** (Client ID et Client Secret)
4. **Configurer dans `.env`** :
   ```env
   PAYPAL_CLIENT_ID=votre_client_id
   PAYPAL_CLIENT_SECRET=votre_client_secret
   ```

#### Test des paiements PayPal

- **Sandbox** : Pour les tests (utilise des comptes fictifs)
- **Live** : Pour les vrais paiements (nécessite vérification)

📖 **Documentation complète** : Voir `PAYPAL_SETUP.md` pour les instructions détaillées.

📖 **Documentation complète** : Voir `EMAIL_SETUP.md` pour les instructions détaillées.

## Livraison Automatique d'Ebooks

Le site inclut un système de livraison automatique d'ebooks par email après paiement réussi.

### Fonctionnalités

- 📚 **Livraison instantanée** - Les ebooks sont envoyés automatiquement après paiement
- 📎 **Pièces jointes PDF** - Livraison directe par email, pas de téléchargement séparé
- 🔄 **Intégration transparente** - Fonctionne avec Stripe et PayPal
- 📧 **Email professionnel** - Confirmation avec détails de commande + ebooks attachés

### Produits avec Ebooks

- 📖 **Les Invocations du Coran** (ID: 1) → `invocations-du-coran.pdf`
- 📅 **Planner Ramadan ALIF** (ID: 2) → `planner-ramadan-alif.pdf`
- 🕌 **Les 99 Noms d'Allah** (ID: 3) → `99-noms-dallah.pdf`

### Configuration

1. **Placer les fichiers PDF** dans le dossier `ebooks/` :
   ```
   ebooks/
   ├── invocations-du-coran.pdf
   ├── planner-ramadan-alif.pdf
   └── 99-noms-dallah.pdf
   ```

2. **Configuration automatique** - Le système détecte automatiquement quels ebooks envoyer selon les produits commandés

### Test de la Livraison

```bash
# Tester le système de livraison d'ebooks
cd api && node test-integration-ebook-delivery.js
```

### Flux de Livraison

1. **Client passe commande** → Produits ajoutés au panier
2. **Paiement réussi** → Stripe/PayPal confirme le paiement
3. **Commande enregistrée** → Base de données mise à jour
4. **Ebooks récupérés** → Selon les produits commandés
5. **Email envoyé** → Confirmation + ebooks en pièces jointes

## Produits Disponibles

- 📖 **Les Invocations du Coran** - 15€
- 📅 **Planner Ramadan ALIF** - 25€
- 🕌 **Les 99 Noms d'Allah** - 20€

## URL du Site

🔗 **https://biIeI.github.io/plumes-du-deen**

⚠️ **Note** : Si vous voyez une redirection 301, c'est parce qu'un domaine personnalisé est configuré sur un autre repo. Utilisez l'URL ci-dessus pour accéder au site.

## Développement Local

```bash
# Installation
pnpm install

# Développement
pnpm run dev

# Build
pnpm run build
```

## Déploiement

Le frontend se déploie automatiquement sur GitHub Pages à chaque push sur la branche `main` via GitHub Actions.

### GitHub Pages + API Vercel

Si le frontend est sur GitHub Pages et l'API sur Vercel, configurez :

- **Côté frontend (build GitHub Pages)** : définissez `VITE_API_BASE_URL` vers votre backend Vercel.
   - Exemple : `VITE_API_BASE_URL=https://plume-du-deen.vercel.app`
   - En local, laissez vide pour utiliser le proxy Vite (`/api` → `http://localhost:3001`).

- **Côté Vercel (backend)** : définissez `FRONTEND_URL` à l'origine GitHub Pages (sans chemin).
   - Exemple : `https://<user>.github.io`
   - Plusieurs origines possibles via une liste séparée par des virgules.
# Guide de déploiement des paiements

## 🚀 Déploiement de l'API Backend

Pour que les paiements fonctionnent, vous devez déployer l'API backend sur Vercel.

### Étape 1 : Créer un compte Vercel
1. Allez sur [vercel.com](https://vercel.com)
2. Créez un compte gratuit

### Étape 2 : Installer Vercel CLI
```bash
npm install -g vercel
```

### Étape 3 : Se connecter à Vercel
```bash
vercel login
```

### Étape 4 : Déployer l'API
```bash
cd /chemin/vers/votre/projet/plume-du-deen
vercel --prod
```

### Étape 5 : Configurer les variables d'environnement
Dans le dashboard Vercel :
1. Allez dans votre projet
2. Settings → Environment Variables
3. Ajoutez :
   - `STRIPE_SECRET_KEY` : votre clé secrète Stripe (`sk_live_...`)
   - `PAYPAL_CLIENT_ID` : votre clé PayPal (optionnel)
   - `PAYPAL_CLIENT_SECRET` : votre secret PayPal (optionnel)
   - `RESEND_API_KEY` : votre clé Resend (`re_...`)
   - `ADMIN_EMAIL` : email qui reçoit les messages de contact (ex: `contact@plume-du-deen.com`)
   - `FROM_EMAIL` : expéditeur (ex: `Plume du Deen <contact@plume-du-deen.com>`)
   - `FRONTEND_URL` : origine GitHub Pages (ex: `https://<user>.github.io`) — peut être une liste séparée par des virgules

### Étape 6 : Redéployer
```bash
vercel --prod
```

### Étape 7 : Mettre à jour l'URL de l'API
Pour un frontend hébergé sur GitHub Pages, configurez l'URL de l'API via une variable Vite :

1. Définissez `VITE_API_BASE_URL` lors du build du frontend (GitHub Actions / variables de repo) :
   - Exemple : `VITE_API_BASE_URL=https://votre-projet.vercel.app`

2. Le frontend utilisera automatiquement cette base pour tous les appels `/api/...`.

## 🧪 Tester les paiements

Une fois déployé :
1. Allez sur https://plume-du-deen.bilelka.com/
2. Ajoutez un produit au panier
3. Allez au paiement
4. Utilisez une vraie carte de crédit pour les paiements en production

⚠️ **Attention** : Les clés sont maintenant en PRODUCTION. Tout paiement sera réel !

## 📧 Clés API Stripe

- **Publishable Key** : `pk_live_51SsJv4GfdpOmitJuOQD2ZvlcHL24bsV7mVjlLx7RNKbAY5OHgQKj8wixXxH7DcuVJB4lED7A4Cz7EW3UFDC6P34U00lX0uMjMU`
- **Secret Key** : `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`

⚠️ **Important** : Ces clés sont pour la production. Pour les tests, utilisez des clés test depuis votre dashboard Stripe.
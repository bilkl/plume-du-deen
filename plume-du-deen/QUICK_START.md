# 🚀 Guide de Démarrage Rapide - Plume du Deen

## En 5 minutes chrono !

### 1. Prérequis
- ✅ Node.js installé
- ✅ Git configuré
- ✅ Navigateur web

### 2. Installation
```bash
git clone <votre-repo>
cd plume-du-deen
npm install --legacy-peer-deps
```

### 3. Configuration des Paiements

#### Stripe (Cartes bancaires)
```bash
# Obtenir les clés sur https://dashboard.stripe.com/
# Ajouter dans .env :
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

#### PayPal (Optionnel)
```bash
# Créer compte sur https://developer.paypal.com/
# Ajouter dans .env :
PAYPAL_CLIENT_ID=votre_client_id
PAYPAL_CLIENT_SECRET=votre_client_secret
```

### 4. Configuration des Emails
```bash
# Créer compte sur https://resend.com/
# Ajouter dans .env :
RESEND_API_KEY=re_votre_clé_api
ADMIN_EMAIL=votre-email@exemple.com

# Vérifier domaine (optionnel pour production)
# Ajouter plume-du-deen.com dans Resend
```

### 5. Lancement
```bash
# Développement
npm run dev

# Test des emails
npm run test:email

# Build production
npm run build
```

### 6. Test Complet
1. **Ajouter un produit au panier**
2. **Aller au checkout**
3. **Tester paiement Stripe** (avec carte test : 4242 4242 4242 4242)
4. **Tester paiement PayPal** (avec compte sandbox)
5. **Vérifier réception email**

---

## 📋 Checklist de Validation

- [ ] Site accessible sur http://localhost:3000
- [ ] Produits s'affichent correctement
- [ ] Panier fonctionne (ajout/suppression)
- [ ] Formulaire checkout complet
- [ ] Paiement Stripe réussi
- [ ] Email de confirmation reçu
- [ ] Page succès affichée

---

## 🎯 Prochaines Étapes

### Phase 3 : Production
- [ ] Déploiement Vercel/Netlify
- [ ] Configuration domaine
- [ ] Migration base de données

### Phase 4 : Fonctionnalités Avancées
- [ ] Système d'avis clients
- [ ] Google Analytics
- [ ] Optimisations SEO

---

## 🆘 Support

**Problèmes courants :**

### Emails non reçus
```bash
npm run test:email  # Vérifier configuration
```

### Paiements échouent
- Vérifier clés API dans `.env`
- Utiliser cartes de test Stripe
- Utiliser comptes sandbox PayPal

### Erreur de build
```bash
rm -rf node_modules && npm install --legacy-peer-deps
```

---

## 📚 Documentation Complète

- `EMAIL_SETUP.md` - Configuration emails détaillée
- `PAYPAL_SETUP.md` - Configuration PayPal détaillée
- `DEPLOYMENT-GUIDE.md` - Guide de déploiement
- `README.md` - Documentation générale

---

**🎉 Prêt à vendre ! Votre boutique en ligne est opérationnelle.**
# Configuration PayPal - Plume du Deen

## Vue d'ensemble

Le système PayPal permet aux clients de payer via leur compte PayPal ou avec leur carte bancaire via PayPal. L'intégration utilise le dernier SDK PayPal officiel.

## Configuration Requise

### 1. Créer un compte PayPal Business
1. Allez sur [paypal.com](https://www.paypal.com/business)
2. Créez un compte Business gratuit
3. Vérifiez votre compte (nécessaire pour recevoir des paiements)

### 2. Créer une application PayPal
1. Allez dans [developer.paypal.com](https://developer.paypal.com/)
2. Connectez-vous avec votre compte Business
3. Allez dans "My Apps & Credentials"
4. Cliquez sur "Create App"
5. Donnez un nom à votre app (ex: "Plume du Deen E-commerce")
6. Sélectionnez "Merchant" comme type d'app

### 3. Obtenir les clés API
Après création de l'app, vous obtiendrez :
- **Client ID** : Commence par `AZ...`
- **Client Secret** : Commence par `EP...`

### 4. Configurer les variables d'environnement
Dans votre fichier `.env`, remplacez :

```env
# PayPal Configuration (Sandbox pour développement)
PAYPAL_CLIENT_ID=votre_client_id_sandbox
PAYPAL_CLIENT_SECRET=votre_client_secret_sandbox

# Pour la production, utilisez :
# PAYPAL_CLIENT_ID=votre_client_id_live
# PAYPAL_CLIENT_SECRET=votre_client_secret_live
```

## Modes de fonctionnement

### Sandbox (Développement/Test)
- URL : `https://api-m.sandbox.paypal.com`
- Utilise des comptes de test
- Paiements fictifs
- Parfait pour les tests

### Live (Production)
- URL : `https://api-m.paypal.com`
- Paiements réels
- Nécessite vérification du compte Business

## Flux de paiement PayPal

1. **Création de commande** : `/api/paypal/create-order`
   - Crée une commande PayPal avec les détails
   - Redirige vers PayPal pour paiement

2. **Capture du paiement** : `/api/paypal/capture-order`
   - Capture le paiement après approbation
   - Crée la commande dans la base de données
   - Envoie l'email de confirmation

3. **Confirmation** : Redirection vers `/paiement-succes`

## Configuration Frontend

Le composant `PayPalPaymentForm` gère automatiquement :
- Affichage des boutons PayPal
- Gestion des erreurs
- Redirections success/error

## Frais PayPal

### Pour les comptes Business suisses :
- **Paiements européens** : 2.9% + 0.35 CHF
- **Paiements internationaux** : 3.9% + 0.45 CHF
- **Pas de frais fixes mensuels**

### Pour les comptes français :
- **Paiements européens** : 2.9% + 0.35 €
- **Paiements internationaux** : 3.9% + 0.45 €

## Test du système

### 1. Comptes de test Sandbox
Créez des comptes de test dans le PayPal Developer Dashboard :
- **Buyer account** : Pour simuler les achats
- **Merchant account** : Pour recevoir les paiements

### 2. Tester les paiements
```bash
# Le système est intégré dans le checkout
# Sélectionnez "PayPal" comme méthode de paiement
# Utilisez les comptes sandbox pour tester
```

### 3. Vérifier les transactions
- Dashboard PayPal : Voir les transactions
- Base de données : Vérifier la création des commandes
- Emails : Vérifier l'envoi des confirmations

## Passage en Production

### 1. Changer les clés API
Remplacez les clés sandbox par les clés live dans `.env`

### 2. Mettre à jour l'environnement
```env
NODE_ENV=production
```

### 3. Tester avec de petits montants
Effectuez des tests avec de vrais comptes PayPal avant de lancer complètement

## Dépannage

### Erreur "INVALID_CLIENT"
- Vérifiez que les clés API sont correctes
- Assurez-vous d'utiliser les bonnes clés (sandbox/live)

### Erreur "DUPLICATE_INVOICE_ID"
- Chaque commande doit avoir un ID unique
- Le système génère automatiquement des IDs uniques

### Problème de devise
- PayPal supporte CHF, EUR, USD
- Vérifiez que la devise est supportée

### Emails non reçus
- Vérifiez la configuration Resend
- Les emails sont envoyés après la capture PayPal

## Support PayPal

- **Documentation** : [developer.paypal.com/docs](https://developer.paypal.com/docs/)
- **Support développeur** : [developer.paypal.com/support](https://developer.paypal.com/support/)
- **Communauté** : Forums PayPal

---

**Note** : PayPal offre une excellente protection contre la fraude et les chargebacks, ce qui en fait un choix sûr pour votre e-commerce.
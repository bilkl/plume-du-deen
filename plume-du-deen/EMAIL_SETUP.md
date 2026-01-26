# Configuration des Emails - Plume du Deen

## Configuration de Resend pour les emails de confirmation

### 1. Créer un compte Resend
1. Allez sur [resend.com](https://resend.com)
2. Créez un compte gratuit
3. Vérifiez votre email

### 2. Obtenir votre clé API
1. Dans votre dashboard Resend, allez dans "API Keys"
2. Cliquez sur "Create API Key"
3. Donnez un nom à votre clé (ex: "Plume du Deen Production")
4. Copiez la clé API générée

### 3. Configurer les variables d'environnement
Dans votre fichier `.env`, ajoutez :

```env
# Email Configuration (Resend)
RESEND_API_KEY=re_your_actual_resend_api_key_here
ADMIN_EMAIL=votre-email-admin@exemple.com
```

### 4. Configuration pour la production

#### ✅ Domaine vérifié
Le domaine `plume-du-deen.com` est maintenant configuré et vérifié dans Resend.

#### Configuration des adresses email
Les emails sont maintenant envoyés depuis :
- **Commandes client** : `commandes@plume-du-deen.com`
- **Notifications admin** : `noreply@plume-du-deen.com`

#### Test de validation
```bash
npm run test:email
# ✅ Résultat attendu : Emails envoyés avec succès
```

## Fonctionnalités d'email implémentées

### Email de confirmation client
- Envoyé automatiquement après chaque commande réussie
- Contient tous les détails de la commande
- Design responsive et professionnel
- Inclut les informations de livraison

### Email de notification admin
- Envoyé automatiquement à l'admin pour chaque nouvelle commande
- Contient un résumé de la commande
- Permet de traiter rapidement les nouvelles commandes

## Dépannage

### Erreur "Invalid API key"
- Vérifiez que votre clé API Resend est correcte dans le fichier `.env`
- Assurez-vous qu'elle commence par `re_`

### Erreur "Domain not verified"
- Utilisez d'abord le domaine par défaut de Resend
- Ajoutez votre domaine personnalisé plus tard si nécessaire

### Les emails n'arrivent pas
- Vérifiez les spams
- Testez avec différents fournisseurs d'email
- Vérifiez les logs du serveur pour les erreurs

## Coûts Resend
- 3,000 emails gratuits par mois
- CHF 0.0005 par email supplémentaire
- Parfait pour un petit e-commerce comme Plume du Deen
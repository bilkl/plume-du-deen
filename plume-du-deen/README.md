# Plume du Deen - Site E-commerce Spirituel

Site web e-commerce pour produits spirituels islamiques avec panier d'achat, mode sombre et pages produits détaillées.

## Fonctionnalités

- 🛒 Panier d'achat complet avec gestion des quantités
- 🌙 Mode sombre/clair automatique
- 📱 Design responsive et moderne
- 🏪 Pages produits individuelles détaillées
- ⚡ Déploiement automatique via GitHub Actions

## Technologies Utilisées

- **Frontend** : React + TypeScript + Vite
- **Styling** : Tailwind CSS avec composants shadcn/ui
- **Routing** : Wouter (client-side routing)
- **State Management** : React Context pour le panier
- **Build & Deploy** : GitHub Actions + GitHub Pages

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

Le site se déploie automatiquement sur GitHub Pages à chaque push sur la branche `main` via GitHub Actions.
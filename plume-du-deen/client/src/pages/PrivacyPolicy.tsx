import React from 'react'
import { Link } from 'wouter'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="mb-8">
            <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
              ← Retour à l'accueil
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Politique de Confidentialité
            </h1>
            <p className="text-gray-600">Dernière mise à jour : 30 janvier 2026</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                Plume du Deen s'engage à protéger la confidentialité et les données personnelles de ses utilisateurs. Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Données collectées</h2>
              <p className="text-gray-700 mb-4">
                Nous collectons les données suivantes :
              </p>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Données fournies directement :</h3>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Nom et prénom</li>
                <li>Adresse email</li>
                <li>Adresse de livraison et de facturation</li>
                <li>Numéro de téléphone</li>
                <li>Informations de paiement (traitées par Stripe)</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 mb-2">Données collectées automatiquement :</h3>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Adresse IP</li>
                <li>Type de navigateur et version</li>
                <li>Pages visitées et durée de visite</li>
                <li>Source de trafic</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Utilisation des données</h2>
              <p className="text-gray-700 mb-4">
                Vos données sont utilisées pour :
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Traiter vos commandes et gérer les livraisons</li>
                <li>Communiquer avec vous concernant vos achats</li>
                <li>Améliorer nos services et notre site web</li>
                <li>Prévenir la fraude et assurer la sécurité</li>
                <li>Respecter nos obligations légales</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Partage des données</h2>
              <p className="text-gray-700 mb-4">
                Nous ne vendons, n'échangeons ni ne louons vos données personnelles à des tiers. Nous pouvons partager vos informations uniquement dans les cas suivants :
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Avec nos prestataires de services (transporteurs, services de paiement)</li>
                <li>Lorsque la loi l'exige</li>
                <li>Pour protéger nos droits et ceux de nos utilisateurs</li>
                <li>Avec votre consentement explicite</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Sécurité des données</h2>
              <p className="text-gray-700 mb-4">
                Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données personnelles contre tout accès non autorisé, modification, divulgation ou destruction :
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Chiffrement SSL/TLS pour toutes les transmissions</li>
                <li>Stockage sécurisé des données</li>
                <li>Accès limité aux données personnelles</li>
                <li>Surveillance régulière des systèmes</li>
                <li>Sauvegardes régulières</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cookies</h2>
              <p className="text-gray-700 mb-4">
                Notre site utilise des cookies pour améliorer votre expérience :
              </p>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Cookies essentiels :</h3>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Gestion du panier d'achat</li>
                <li>Authentification utilisateur</li>
                <li>Sécurité du site</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 mb-2">Cookies analytiques :</h3>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Google Analytics (anonymisé)</li>
                <li>Amélioration de l'expérience utilisateur</li>
              </ul>

              <p className="text-gray-700 mb-4">
                Vous pouvez gérer vos préférences de cookies via les paramètres de votre navigateur.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Durée de conservation</h2>
              <p className="text-gray-700 mb-4">
                Nous conservons vos données personnelles uniquement le temps nécessaire :
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Données de commande : 10 ans (obligations légales)</li>
                <li>Données de compte : jusqu'à suppression du compte</li>
                <li>Données analytiques : 26 mois maximum</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Vos droits</h2>
              <p className="text-gray-700 mb-4">
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li><strong>Droit d'accès</strong> : connaître les données que nous détenons sur vous</li>
                <li><strong>Droit de rectification</strong> : corriger des données inexactes</li>
                <li><strong>Droit à l'effacement</strong> : supprimer vos données personnelles</li>
                <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré</li>
                <li><strong>Droit d'opposition</strong> : refuser certains traitements</li>
                <li><strong>Droit à la limitation</strong> : restreindre l'utilisation de vos données</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact</h2>
              <p className="text-gray-700 mb-4">
                Pour exercer vos droits ou poser des questions sur notre politique de confidentialité :
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">Email : plumedudeen@gmail.com</p>
              </div>
              <p className="text-gray-700 mt-4">
                Nous nous engageons à répondre à votre demande dans un délai de 30 jours maximum.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Modifications</h2>
              <p className="text-gray-700 mb-4">
                Cette politique de confidentialité peut être modifiée à tout moment. Les utilisateurs seront informés des changements importants par email ou via une notification sur le site.
              </p>
              <p className="text-gray-700 mb-4">
                La version applicable est celle en vigueur au moment de votre utilisation du service.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
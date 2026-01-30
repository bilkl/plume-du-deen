import React from 'react'
import { Link } from 'wouter'

export default function LegalNotice() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="mb-8">
            <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
              ← Retour à l'accueil
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Mentions Légales
            </h1>
            <p className="text-gray-600">Dernière mise à jour : 30 janvier 2026</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Éditeur du site</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-2"><strong>Plume du Deen</strong></p>
                <p className="text-gray-700 mb-2">Email : plumedudeen@gmail.com</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Directeur de la publication</h2>
              <p className="text-gray-700 mb-4">
                [Nom du directeur ou représentant légal]
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Hébergement</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-2"><strong>GitHub Pages</strong></p>
                <p className="text-gray-700 mb-2">GitHub, Inc.</p>
                <p className="text-gray-700 mb-2">Site web : https://pages.github.com</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Développement et conception</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-2"><strong>Plume du Deen</strong></p>
                <p className="text-gray-700 mb-2">Développement technique et design</p>
                <p className="text-gray-700 mb-2">Technologies utilisées :</p>
                <ul className="list-disc list-inside text-gray-700 mb-2 ml-4">
                  <li>React.js / TypeScript</li>
                  <li>Node.js / Express</li>
                  <li>SQLite / Base de données</li>
                  <li>Stripe / Paiement</li>
                  <li>Tailwind CSS / Interface</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Propriété intellectuelle</h2>
              <p className="text-gray-700 mb-4">
                L'ensemble du contenu de ce site (textes, images, graphismes, logos, icônes, sons, logiciels) est la propriété exclusive de Plume du Deen ou de ses partenaires.
              </p>
              <p className="text-gray-700 mb-4">
                Toute reproduction, distribution, modification ou exploitation commerciale, même partielle, est strictement interdite sans autorisation préalable écrite.
              </p>
              <p className="text-gray-700 mb-4">
                Les marques, logos et signes distinctifs présents sur le site sont déposés et protégés par le droit suisse et international de la propriété intellectuelle.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Protection des données personnelles</h2>
              <p className="text-gray-700 mb-4">
                Plume du Deen s'engage à respecter la confidentialité des données personnelles de ses utilisateurs et à les traiter conformément à la législation suisse sur la protection des données (nLPD) et au RGPD européen.
              </p>
              <p className="text-gray-700 mb-4">
                Pour plus d'informations, consultez notre <Link href="/politique-confidentialite" className="text-blue-600 hover:text-blue-800">Politique de Confidentialité</Link>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Cookies</h2>
              <p className="text-gray-700 mb-4">
                Le site utilise des cookies pour améliorer l'expérience utilisateur. Ces cookies sont nécessaires au fonctionnement du site et ne collectent pas de données personnelles sans consentement.
              </p>
              <p className="text-gray-700 mb-4">
                Vous pouvez gérer vos préférences de cookies via les paramètres de votre navigateur.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Conditions générales d'utilisation</h2>
              <p className="text-gray-700 mb-4">
                L'utilisation de ce site implique l'acceptation pleine et entière des conditions générales d'utilisation décrites ci-dessous.
              </p>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Accès au site</h3>
              <p className="text-gray-700 mb-4">
                L'accès au site est gratuit et ouvert à tous. L'utilisateur s'engage à utiliser le site de manière loyale et dans le respect des lois en vigueur.
              </p>

              <h3 className="text-xl font-medium text-gray-900 mb-2">Responsabilité</h3>
              <p className="text-gray-700 mb-4">
                Plume du Deen met tout en œuvre pour assurer la fiabilité des informations diffusées sur le site, mais ne peut garantir l'exactitude, la complétude ou l'actualité des informations.
              </p>
              <p className="text-gray-700 mb-4">
                L'utilisateur utilise le site sous sa seule responsabilité. Plume du Deen ne saurait être tenu responsable des dommages directs ou indirects résultant de l'utilisation du site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Conditions générales de vente</h2>
              <p className="text-gray-700 mb-4">
                Les ventes de produits sur ce site sont soumises aux <Link href="/conditions-generales" className="text-blue-600 hover:text-blue-800">Conditions Générales de Vente</Link> disponibles sur le site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Droit applicable et juridiction</h2>
              <p className="text-gray-700 mb-4">
                Les présentes mentions légales sont soumises au droit suisse. Tout litige relatif à l'utilisation du site sera de la compétence exclusive des tribunaux de Genève, Suisse.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact</h2>
              <p className="text-gray-700 mb-4">
                Pour toute question concernant ces mentions légales ou l'utilisation du site :
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">Email : plumedudeen@gmail.com</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Mise à jour</h2>
              <p className="text-gray-700 mb-4">
                Ces mentions légales peuvent être modifiées à tout moment. Les utilisateurs seront informés des changements importants. La version applicable est celle publiée sur le site à la date de consultation.
              </p>
              <p className="text-gray-700 mb-4">
                Dernière mise à jour : 30 janvier 2026
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
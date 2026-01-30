import React from 'react'
import { Link } from 'wouter'

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="mb-8">
            <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
              ← Retour à l'accueil
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Conditions Générales de Vente
            </h1>
            <p className="text-gray-600">Dernière mise à jour : 30 janvier 2026</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Objet</h2>
              <p className="text-gray-700 mb-4">
                Les présentes conditions générales de vente régissent les relations contractuelles entre Plume du Deen et ses clients dans le cadre de la vente en ligne de produits numériques (e-books et ressources téléchargeables).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Produits numériques</h2>
              <p className="text-gray-700 mb-4">
                Plume du Deen propose exclusivement des produits numériques (e-books, guides spirituels, ressources pédagogiques) accessibles immédiatement après paiement réussi.
              </p>
              <p className="text-gray-700 mb-4">
                Les produits sont livrés instantanément par email sous forme de lien de téléchargement sécurisé ou d'accès direct à la plateforme.
              </p>
              <p className="text-gray-700 mb-4">
                Les formats de livraison peuvent inclure PDF, EPUB, ou tout autre format numérique approprié indiqué sur la fiche produit.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Prix</h2>
              <p className="text-gray-700 mb-4">
                Les prix sont indiqués en francs suisses (CHF) toutes taxes comprises (TTC). Aucun frais de port n'est appliqué pour les produits numériques.
              </p>
              <p className="text-gray-700 mb-4">
                Plume du Deen se réserve le droit de modifier ses prix à tout moment, mais les produits seront facturés sur la base des tarifs en vigueur au moment de l'enregistrement de la commande.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Commande</h2>
              <p className="text-gray-700 mb-4">
                Toute commande implique l'acceptation pleine et entière des présentes conditions générales de vente.
              </p>
              <p className="text-gray-700 mb-4">
                Le processus de commande comprend :
              </p>
              <ol className="list-decimal list-inside text-gray-700 mb-4 ml-4">
                <li>Sélection des produits et ajout au panier</li>
                <li>Vérification du contenu du panier</li>
                <li>Saisie des informations nécessaires à la commande (notamment email)</li>
                <li>Paiement sécurisé via Stripe ou PayPal, ou autre moyen sur demande</li>
                <li>Confirmation de commande par email</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Paiement</h2>
              <p className="text-gray-700 mb-4">
                Le paiement s'effectue en ligne via des prestataires sécurisés (Stripe pour les paiements par carte, PayPal pour les paiements via PayPal). D'autres moyens de paiement peuvent être proposés sur demande (ex : virement), via contact préalable.
              </p>
              <p className="text-gray-700 mb-4">
                Le débit de la carte n'est effectué qu'après confirmation de la commande et vérification des informations de paiement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Livraison numérique</h2>
              <p className="text-gray-700 mb-4">
                La livraison des produits numériques s'effectue instantanément après confirmation du paiement :
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Email de confirmation avec lien de téléchargement</li>
                <li>Accès immédiat à la plateforme si applicable</li>
                <li>Format PDF, EPUB ou autre format numérique approprié</li>
              </ul>
              <p className="text-gray-700 mb-4">
                En cas de problème technique empêchant l'accès au produit, Plume du Deen s'engage à fournir une solution alternative dans les 24 heures.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Droit de rétractation pour produits numériques</h2>
              <p className="text-gray-700 mb-4">
                Conformément à la législation suisse, vous disposez d'un délai de 14 jours calendaires pour exercer votre droit de rétractation à compter de la réception du produit numérique.
              </p>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      <strong>Important :</strong> Pour les produits numériques, le droit de rétractation s'éteint lorsque vous commencez à télécharger ou à consommer le contenu numérique. Vous serez informé de cette extinction du droit avant la conclusion du contrat.
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Si vous exercez votre droit de rétractation avant la consommation du produit, vous serez intégralement remboursé selon les mêmes modalités que le paiement initial.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Support et accès</h2>
              <p className="text-gray-700 mb-4">
                En cas de problème technique empêchant l'accès au produit (lien non reçu, lien invalide, format incompatible), l'acheteur doit nous contacter dans les plus brefs délais afin que nous puissions fournir une solution.
              </p>
              <p className="text-gray-700 mb-4">
                Notre priorité est de rétablir l'accès au contenu numérique dans les meilleurs délais.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Responsabilité</h2>
              <p className="text-gray-700 mb-4">
                Plume du Deen ne saurait être tenu responsable des dommages indirects, pertes d'exploitation ou de données résultant de l'utilisation de ses produits.
              </p>
              <p className="text-gray-700 mb-4">
                Notre responsabilité est limitée au montant de la commande en cas de faute prouvée.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Protection des données</h2>
              <p className="text-gray-700 mb-4">
                Les données personnelles collectées lors de la commande sont nécessaires à son traitement et sont conservées de manière sécurisée. Elles ne sont en aucun cas transmises à des tiers sans consentement préalable.
              </p>
              <p className="text-gray-700 mb-4">
                Conformément au RGPD, l'acheteur dispose d'un droit d'accès, de rectification et de suppression de ses données.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Droit applicable</h2>
              <p className="text-gray-700 mb-4">
                Les présentes conditions sont soumises au droit suisse. Tout litige sera porté devant les tribunaux compétents de Genève.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact</h2>
              <p className="text-gray-700 mb-4">
                Pour toute question concernant ces conditions générales, vous pouvez nous contacter :
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">Email : plumedudeen@gmail.com</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
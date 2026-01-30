import React from 'react'
import { Link } from 'wouter'

export default function ReturnsAndRefunds() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="mb-8">
            <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
              ← Retour à l'accueil
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Politique de Retour et Remboursement
            </h1>
            <p className="text-gray-600">Dernière mise à jour : 30 janvier 2026</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Produits numériques et droit de rétractation</h2>
              <p className="text-gray-700 mb-4">
                Plume du Deen commercialise exclusivement des produits numériques (e-books, guides spirituels, ressources pédagogiques). Ces produits sont accessibles immédiatement après paiement.
              </p>
              <p className="text-gray-700 mb-4">
                Conformément à la législation suisse sur les contrats à distance, vous disposez d'un délai de 14 jours calendaires pour exercer votre droit de rétractation à compter de la réception du produit numérique.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      <strong>Exception importante :</strong> Le droit de rétractation s'éteint dès que vous commencez à télécharger ou à accéder au contenu numérique. Vous serez clairement informé de cette condition avant l'achat.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Modalités d'exercice du droit de rétractation</h2>
              <p className="text-gray-700 mb-4">
                Pour exercer votre droit de rétractation avant la consommation du produit numérique, vous devez nous notifier votre décision par :
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Un email à : plumedudeen@gmail.com</li>
              </ul>
              <p className="text-gray-700 mb-4">
                Votre notification doit être claire et non équivoque. Pour faciliter le traitement, merci d'indiquer le nom du produit, votre email de commande et, si possible, le numéro de commande.
              </p>
              <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-green-700">
                      <strong>Avantage produits numériques :</strong> Aucun frais de retour n'est appliqué. Le processus de rétractation s'effectue entièrement en ligne.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Remboursement</h2>
              <p className="text-gray-700 mb-4">
                Le remboursement sera effectué dans un délai maximum de 14 jours à compter de la réception de votre demande de rétractation, sous réserve que le produit n'ait pas été consommé/téléchargé.
              </p>
              <p className="text-gray-700 mb-4">
                Le remboursement inclut :
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Le prix intégral du produit commandé</li>
                <li>Aucun frais supplémentaire n'est déduit</li>
              </ul>
              <p className="text-gray-700 mb-4">
                Le remboursement sera effectué selon le même moyen de paiement que celui utilisé lors de la commande :
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Carte bancaire : remboursement sur la carte utilisée</li>
                <li>Virement bancaire si nécessaire</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Exceptions au droit de rétractation</h2>
              <p className="text-gray-700 mb-4">
                Le droit de rétractation ne s'applique plus dans les cas suivants :
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Le contenu numérique a été téléchargé ou consommé</li>
                <li>Le produit a été utilisé ou accédé de quelque manière que ce soit</li>
                <li>Vous avez explicitement consenti à la livraison immédiate du contenu numérique</li>
              </ul>
              <p className="text-gray-700 mb-4">
                Vous serez toujours informé clairement avant l'achat que le droit de rétractation s'éteindra une fois le produit numérique consommé.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Produits défectueux ou problèmes d'accès</h2>
              <p className="text-gray-700 mb-4">
                Si vous rencontrez un problème d'accès à votre produit numérique (lien de téléchargement non fonctionnel, format incompatible, etc.), nous nous engageons à :
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Fournir un nouveau lien de téléchargement fonctionnel</li>
                <li>Convertir le fichier dans un format compatible</li>
                <li>Procéder au remboursement intégral si le problème persiste</li>
              </ul>
              <p className="text-gray-700 mb-4">
                Vous devez nous contacter dans les 48 heures suivant la réception du produit pour signaler tout problème technique ou d'accès.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Garantie légale</h2>
              <p className="text-gray-700 mb-4">
                Tous nos produits bénéficient de la garantie légale suisse contre les vices cachés, applicable pendant 2 ans à compter de la livraison.
              </p>
              <p className="text-gray-700 mb-4">
                En cas de vice caché, vous pouvez demander :
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>La réparation du produit</li>
                <li>Le remplacement du produit</li>
                <li>Le remboursement partiel ou total</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact service client</h2>
              <p className="text-gray-700 mb-4">
                Pour toute demande de retour ou remboursement :
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-gray-700">Email : plumedudeen@gmail.com</p>
              </div>
              <p className="text-gray-700 mb-4">
                Notre équipe vous accompagnera tout au long du processus de retour.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Modèle de message de rétractation</h2>
              <p className="text-gray-700 mb-4">
                Vous pouvez utiliser le modèle ci-dessous (copier-coller par email) pour exercer votre droit de rétractation avant tout accès/téléchargement du contenu :
              </p>
              <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Rétractation - Produits numériques</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <p>Objet : Rétractation commande</p>
                  <p>Bonjour,</p>
                  <p>
                    Je vous notifie par la présente ma rétractation du contrat portant sur la vente du (des) produit(s) numérique(s) suivant(s) :
                  </p>
                  <p>- Produit(s) :</p>
                  <p>- Numéro de commande (si disponible) :</p>
                  <p>- Email utilisé lors de la commande :</p>
                  <p>
                    Je confirme n'avoir ni téléchargé, ni accédé, ni consommé le contenu numérique commandé.
                  </p>
                  <p>Merci,</p>
                  <p>[Votre nom]</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
// Configuration des ebooks par produit
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const PRODUCT_EBOOKS = {
  1: { // Les Invocations du Coran
    filename: 'invocations-du-coran.pdf',
    displayName: 'Les Invocations du Coran - Version PDF',
    description: 'Votre guide complet des invocations coraniques'
  },
  2: { // Planner Ramadan ALIF
    filename: 'planner-ramadan-alif.pdf',
    displayName: 'Planner Ramadan ALIF - Version PDF',
    description: 'Votre compagnon spirituel pour le Ramadan'
  },
  3: { // Les 99 Noms d'Allah
    filename: '99-noms-dallah.pdf',
    displayName: 'Les 99 Noms d\'Allah - Version PDF',
    description: 'Découvrez les 99 noms divins d\'Allah'
  }
}

/**
 * Récupère les ebooks pour une liste d'articles
 * @param {Array} items - Liste des articles de la commande
 * @returns {Array} Liste des chemins de fichiers ebooks à envoyer
 */
export function getEbooksForOrder(items) {
  const ebooks = []

  items.forEach(item => {
    // Extraire l'ID du produit depuis l'ID de l'article
    // Les articles ont des IDs comme "1", "2", "3" etc.
    const productId = parseInt(item.id)

    if (PRODUCT_EBOOKS[productId]) {
      ebooks.push(path.join(__dirname, '..', 'ebooks', PRODUCT_EBOOKS[productId].filename))
    }
  })

  return ebooks
}
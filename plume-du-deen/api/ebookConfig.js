// Configuration des ebooks par produit
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const PRODUCT_EBOOKS = {
  1: { // Invocations (PDF)
    filename: 'Les rabbana invocations.pdf',
    displayName: 'Les Rabbana Invocations - Version PDF',
    description: 'Vos invocations Rabbana prêtes à l\'emploi'
  },
  2: { // Planner Ramadan ALIF
    filename: 'Ramadan planner.pdf',
    displayName: 'Ramadan Planner - Version PDF',
    description: 'Votre compagnon spirituel pour le Ramadan'
  },
  3: { // Les 99 Noms d'Allah
    filename: 'Les 99 noms d\'Allah Azzawajel.pdf',
    displayName: 'Les 99 Noms d\'Allah - Version PDF',
    description: 'Découvrez les 99 noms divins d\'Allah'
  },
  4: { // Invocations des Prophètes
    filename: 'invocations-des-prophetes.pdf',
    displayName: 'Invocations des Prophètes - Version PDF',
    description: 'Votre compagnon quotidien de rappel et d\'invocations prophétiques'
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
    if (item.format === 'paper') {
      return
    }

    // Extraire l'ID du produit depuis l'ID de l'article
    // Les articles ont des IDs comme "1", "2", "3" etc.
    const productId = parseInt(item.id)

    if (PRODUCT_EBOOKS[productId]) {
      ebooks.push(path.join(__dirname, '..', 'ebooks', PRODUCT_EBOOKS[productId].filename))
    }
  })

  return ebooks
}

import { config } from 'dotenv'
import { sendOrderConfirmationEmail, sendAdminOrderNotification } from './emailService.js'

// Charger les variables d'environnement
config({ path: '../.env' })

console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'Définie' : 'Non définie')

// Script de test pour vérifier le système d'email
async function testEmailSystem() {
  console.log('🧪 Test du système d\'email de confirmation...')

  // Données de test pour une commande
  const testOrderData = {
    orderId: 'TEST-PLUME-001',
    customerName: 'Client Test',
    customerEmail: 'test@resend.dev', // Utiliser le domaine de test Resend
    items: [
      {
        id: '1',
        name: 'Livre Coran Deluxe',
        price: 45.00,
        quantity: 1,
        image: 'https://example.com/image.jpg'
      },
      {
        id: '2',
        name: 'Planner Ramadan 2026',
        price: 25.00,
        quantity: 2,
        image: 'https://example.com/planner.jpg'
      }
    ],
    total: 95.00,
    createdAt: new Date().toISOString(),
    customerAddress: '123 Rue de Test',
    customerCity: 'Genève',
    customerPostalCode: '1200',
    customerCountry: 'Suisse'
  }

  try {
    console.log('📧 Envoi de l\'email de confirmation au client...')
    const clientResult = await sendOrderConfirmationEmail(testOrderData)
    console.log('✅ Email client envoyé avec succès:', clientResult)

    console.log('📧 Envoi de la notification admin...')
    await sendAdminOrderNotification(testOrderData)
    console.log('✅ Notification admin envoyée avec succès')

    console.log('🎉 Test terminé avec succès !')
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message)
    console.log('💡 Assurez-vous que :')
    console.log('   - RESEND_API_KEY est configurée dans .env')
    console.log('   - L\'email de test est valide')
    console.log('   - Votre compte Resend est actif')
  }
}

// Exécuter le test si le script est appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  testEmailSystem()
}

export { testEmailSystem }
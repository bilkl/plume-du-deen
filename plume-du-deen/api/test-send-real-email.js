import { sendOrderConfirmationEmail } from './emailService.js';
import { getEbooksForOrder } from './ebookConfig.js';
import fs from 'fs';

// Simulation d'envoi d'email avec ebooks
console.log('=== Simulation d\'envoi d\'email avec ebooks ===\n');

// Données de test
const testOrderData = {
  orderId: 'TEST-PLUME-123456',
  customerName: 'Test Client',
  customerEmail: 'bilel@mail.com', // Votre email réel
  items: [
    { id: '1', name: 'Les Invocations du Coran', price: 15.00, quantity: 1 },
    { id: '2', name: 'Planner Ramadan ALIF', price: 12.00, quantity: 1 },
    { id: '3', name: 'Les 99 Noms d\'Allah', price: 12.00, quantity: 1 }
  ],
  total: 39.00,
  createdAt: new Date().toISOString()
};

console.log('📧 Simulation d\'envoi d\'email à:', testOrderData.customerEmail);
console.log('📦 Produits commandés:', testOrderData.items.length);
console.log('');

try {
  // Récupérer les ebooks
  const ebookPaths = getEbooksForOrder(testOrderData.items);
  console.log('📚 Ebooks trouvés:', ebookPaths.length);

  // Préparer les pièces jointes
  const attachments = ebookPaths.map(ebookPath => {
    const fileContent = fs.readFileSync(ebookPath);
    const fileName = ebookPath.split('/').pop();
    return {
      filename: fileName,
      content: fileContent.toString('base64'),
      contentType: 'application/pdf'
    };
  });

  console.log('📎 Pièces jointes préparées:');
  attachments.forEach((att, index) => {
    console.log(`   ${index + 1}. ${att.filename} (${att.content.length} caractères base64)`);
  });
  console.log('');

  // ⚠️ ATTENTION: Ne pas envoyer réellement pour éviter les spams
  console.log('⚠️ ATTENTION: Envoi réel désactivé pour éviter les spams');
  console.log('');
  console.log('📧 Email qui serait envoyé:');
  console.log('   De: Plume du Deen <commandes@plume-du-deen.com>');
  console.log(`   À: ${testOrderData.customerEmail}`);
  console.log(`   Sujet: Confirmation de commande - ${testOrderData.orderId}`);
  console.log(`   Pièces jointes: ${attachments.length} PDF(s)`);
  console.log('');

  console.log('🧪 Pour tester réellement:');
  console.log('   1. Remplacez l\'email dans ce fichier par votre email réel');
  console.log('   2. Décommentez la ligne d\'envoi ci-dessous');
  console.log('   3. Exécutez: node api/test-send-real-email.js');
  console.log('');

  // LIGNE À DÉCOMMENTER POUR ENVOI RÉEL (ATTENTION AUX SPAMS!)
  const result = await sendOrderConfirmationEmail(testOrderData, attachments);
  console.log('✅ Email envoyé:', result);

} catch (error) {
  console.error('❌ Erreur lors de la simulation:', error);
}

console.log('=== Fin de la simulation ===');
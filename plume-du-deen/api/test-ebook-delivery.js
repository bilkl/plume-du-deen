import { getEbooksForOrder } from './ebookConfig.js';
import { sendOrderConfirmationEmail } from './emailService.js';
import fs from 'fs';
import path from 'path';

// Test de récupération des ebooks
console.log('=== Test récupération ebooks ===');

const testItems = [
  { id: '1', name: 'Les Invocations du Coran', price: 15.00, quantity: 1 },
  { id: '2', name: 'Planner Ramadan ALIF', price: 12.00, quantity: 1 },
  { id: '3', name: 'Les 99 Noms d\'Allah', price: 10.00, quantity: 1 }
];

try {
  const ebooks = getEbooksForOrder(testItems);
  console.log(`Ebooks trouvés: ${ebooks.length}`);
  ebooks.forEach(ebook => {
    console.log(`- ${path.basename(ebook)}`);
    if (fs.existsSync(ebook)) {
      console.log(`  ✓ Fichier existe (${fs.statSync(ebook).size} bytes)`);
    } else {
      console.log(`  ✗ Fichier n'existe pas`);
    }
  });
} catch (error) {
  console.error('Erreur lors de la récupération des ebooks:', error);
}

// Test d'envoi d'email avec pièces jointes (simulation)
console.log('\n=== Test envoi email avec pièces jointes ===');

const testOrderData = {
  orderId: 'TEST-123456',
  customerName: 'Client Test',
  customerEmail: 'test@example.com',
  items: testItems,
  total: 37.00,
  createdAt: new Date().toISOString()
};

try {
  // Préparer les pièces jointes
  const ebooks = getEbooksForOrder(testItems);
  const attachments = ebooks.map(ebookPath => {
    const fileContent = fs.readFileSync(ebookPath);
    const fileName = path.basename(ebookPath);
    return {
      filename: fileName,
      content: fileContent.toString('base64'),
      contentType: 'application/pdf'
    };
  });

  console.log(`Pièces jointes préparées: ${attachments.length}`);
  attachments.forEach(att => {
    console.log(`- ${att.filename} (${att.content.length} caractères base64)`);
  });

  // Note: On ne teste pas réellement l'envoi pour éviter d'envoyer des emails de test
  console.log('✓ Test réussi - pièces jointes préparées correctement');
  console.log('Note: L\'envoi réel d\'email n\'est pas testé pour éviter les spams');

} catch (error) {
  console.error('Erreur lors du test des pièces jointes:', error);
}

console.log('\n=== Test terminé ===');
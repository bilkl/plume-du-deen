import { config } from 'dotenv'
import { Resend } from 'resend'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

// Charger les variables d'environnement
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
config({ path: path.join(__dirname, '../.env') })

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Envoie un email de confirmation de commande au client
 * @param {Object} orderData - Données de la commande
 * @param {Array} [attachments] - Liste des pièces jointes
 */
export async function sendOrderConfirmationEmail(orderData, attachments = []) {
  try {
    const { orderId, customerName, customerEmail, items, total, createdAt } = orderData

    // Créer le contenu HTML de l'email
    const htmlContent = createOrderConfirmationHTML(orderData, attachments.length > 0, attachments)

    const { data, error } = await resend.emails.send({
      from: 'Plume du Deen <commandes@plume-du-deen.com>',
      to: [customerEmail],
      subject: `Confirmation de commande - ${orderId}`,
      html: htmlContent,
      attachments: attachments,
    })

    if (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error)
      throw new Error('Erreur lors de l\'envoi de l\'email de confirmation')
    }

    console.log('Email de confirmation envoyé avec succès:', data)
    return { success: true, emailId: data?.id }
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de confirmation:', error)
    throw error
  }
}

function createOrderConfirmationHTML(orderData, hasAttachments = false, attachments = []) {
  const { orderId, customerName, items, total, createdAt } = orderData

  const itemsHTML = items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <div style="display: flex; align-items: center;">
          ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px; border-radius: 4px;">` : ''}
          <div>
            <strong>${item.name}</strong>
            <br>
            <span style="color: #666; font-size: 14px;">Quantité: ${item.quantity}</span>
          </div>
        </div>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        CHF ${(item.price * item.quantity).toFixed(2)}
      </td>
    </tr>
  `).join('')

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmation de commande - ${orderId}</title>
    </head>
    <body style="font-family: 'Lora', serif; margin: 0; padding: 0; background-color: #f9f9f9;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%); padding: 40px 30px; text-align: center;">
          <img src="https://plume-du-deen.com/images/logo.png" alt="Plume du Deen" style="max-width: 150px; height: auto; margin-bottom: 15px; border-radius: 8px;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Plume du Deen</h1>
          <p style="color: #FFE4B5; margin: 10px 0 0 0; font-size: 16px;">Produits Spirituels Islamiques</p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
          <h2 style="color: #8B4513; margin-bottom: 20px;">Confirmation de commande</h2>

          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            Cher(e) ${customerName},<br><br>
            Merci pour votre commande ! Nous avons bien reçu votre paiement.
            ${hasAttachments ? '<br><br><strong>🎉 Vos ebooks sont disponibles immédiatement et joints à cet email !</strong><br>Vous pouvez commencer votre lecture dès maintenant.' : 'Votre commande est confirmée et sera traitée dans les plus brefs délais.'}
          </p>

          <!-- Order Details -->
          <div style="background-color: #f8f8f8; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h3 style="color: #8B4513; margin-top: 0; margin-bottom: 15px;">Détails de la commande</h3>
            <p style="margin: 5px 0;"><strong>Numéro de commande:</strong> ${orderId}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(createdAt).toLocaleDateString('fr-FR')}</p>
            <p style="margin: 5px 0;"><strong>Statut:</strong> <span style="color: #28a745; font-weight: bold;">Confirmée</span></p>
          </div>

          <!-- Items Table -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            <thead>
              <tr style="background-color: #f8f8f8;">
                <th style="padding: 15px; text-align: left; border-bottom: 2px solid #8B4513; color: #8B4513;">Produit</th>
                <th style="padding: 15px; text-align: right; border-bottom: 2px solid #8B4513; color: #8B4513;">Prix</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
              <tr style="background-color: #f8f8f8; font-weight: bold;">
                <td style="padding: 15px; text-align: right; border-top: 2px solid #8B4513;">Total</td>
                <td style="padding: 15px; text-align: right; border-top: 2px solid #8B4513; color: #8B4513; font-size: 18px;">
                  CHF ${total.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Delivery Info -->
          <div style="background-color: #e8f4fd; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h4 style="color: #2c5aa0; margin-top: 0; margin-bottom: 10px;">📚 Livraison numérique instantanée</h4>
            <p style="margin: 5px 0; color: #555;">
              ${hasAttachments ? 'Vos ebooks sont joints à cet email et disponibles immédiatement.' : 'Vos produits physiques seront expédiés dans les plus brefs délais.'}
              ${hasAttachments ? '' : 'Vous recevrez un email de suivi dès que votre colis sera envoyé.'}
            </p>
          </div>

          ${hasAttachments ? `
          <!-- Ebooks Section -->
          <div style="background-color: #f0f8e8; padding: 20px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #28a745;">
            <h4 style="color: #28a745; margin-top: 0; margin-bottom: 10px;">📚 Vos Ebooks sont joints à cet email</h4>
            <p style="margin: 5px 0; color: #555;">
              Téléchargez et commencez votre lecture immédiatement :
            </p>
            <ul style="margin: 10px 0; padding-left: 20px; color: #333;">
              ${attachments.map(att => `<li style="margin: 5px 0;"><strong>${att.filename}</strong></li>`).join('')}
            </ul>
            <p style="margin: 10px 0 0 0; font-size: 14px; color: #666;">
              <em>Si vous ne voyez pas les pièces jointes, vérifiez votre dossier "Spam" ou "Courrier indésirable".</em>
            </p>
          </div>
          ` : ''}

          <!-- Contact Info -->
          <div style="text-align: center; padding: 20px; background-color: #f8f8f8; border-radius: 8px;">
            <h4 style="color: #8B4513; margin-bottom: 15px;">Besoin d'aide ?</h4>
            <p style="margin: 5px 0;">
              Contactez-nous à <a href="mailto:contact@plume-du-deen.com" style="color: #8B4513;">contact@plume-du-deen.com</a>
            </p>
            <p style="margin: 5px 0;">
              Ou visitez notre site <a href="https://plume-du-deen.com" style="color: #8B4513;">plume-du-deen.com</a>
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #333; color: white; padding: 20px 30px; text-align: center;">
          <p style="margin: 0; font-size: 14px;">
            © 2024 Plume du Deen. Tous droits réservés.
          </p>
          <p style="margin: 10px 0 0 0; font-size: 12px; color: #ccc;">
            Cet email a été envoyé automatiquement. Merci de ne pas y répondre directement.
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

/**
 * Envoie une notification de nouvelle commande à l'admin
 * @param {Object} orderData - Données de la commande
 */
export async function sendAdminOrderNotification(orderData) {
  try {
    const { orderId, customerName, customerEmail, items, total } = orderData

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@plume-du-deen.com'

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Nouvelle commande - ${orderId}</title>
      </head>
      <body style="font-family: Arial, sans-serif;">
        <h2>Nouvelle commande reçue</h2>
        <p><strong>Commande:</strong> ${orderId}</p>
        <p><strong>Client:</strong> ${customerName} (${customerEmail})</p>
        <p><strong>Total:</strong> CHF ${total.toFixed(2)}</p>
        <p><strong>Articles:</strong> ${items.length}</p>

        <h3>Détails des articles:</h3>
        <ul>
          ${items.map(item => `<li>${item.name} (x${item.quantity}) - CHF ${(item.price * item.quantity).toFixed(2)}</li>`).join('')}
        </ul>

        <p>Vérifiez le panneau d'administration pour traiter cette commande.</p>
      </body>
      </html>
    `

    const { data, error } = await resend.emails.send({
      from: 'Plume du Deen <noreply@plume-du-deen.com>',
      to: [adminEmail],
      subject: `Nouvelle commande - ${orderId}`,
      html: htmlContent,
    })

    if (error) {
      console.error('Erreur lors de l\'envoi de la notification admin:', error)
    } else {
      console.log('Notification admin envoyée:', data)
    }
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification admin:', error)
  }
}
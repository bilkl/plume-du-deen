import { Resend } from 'resend'
import fs from 'fs'

function normalizeOrigin(origin) {
  if (!origin || typeof origin !== 'string') return ''
  return origin.trim().replace(/\/+$/, '')
}

function pickPublicOrigin(frontendUrlEnv) {
  const candidates = String(frontendUrlEnv || '')
    .split(',')
    .map(normalizeOrigin)
    .filter(Boolean)

  // Prefer the custom domain if present anywhere in the list.
  const preferred = candidates.find((u) => u === 'https://plume-du-deen.com' || u === 'http://plume-du-deen.com')
  if (preferred) return preferred.replace(/^http:\/\//, 'https://')

  return candidates[0] || 'https://plume-du-deen.com'
}

const FRONTEND_ORIGIN = pickPublicOrigin(process.env.FRONTEND_URL)

function toPublicAbsoluteUrl(maybeUrl) {
  if (!maybeUrl || typeof maybeUrl !== 'string') return ''

  const raw = maybeUrl.trim()
  if (!raw) return ''

  // Already absolute
  if (raw.startsWith('https://')) return raw
  if (raw.startsWith('http://')) {
    // Some email clients block http images; upgrade our own domain to https.
    if (raw.startsWith('http://plume-du-deen.com/')) return raw.replace('http://plume-du-deen.com/', 'https://plume-du-deen.com/')
    if (raw.startsWith('http://www.plume-du-deen.com/')) return raw.replace('http://www.plume-du-deen.com/', 'https://www.plume-du-deen.com/')
    return raw
  }

  // Protocol-relative
  if (raw.startsWith('//')) return `https:${raw}`

  // Root-relative or relative path
  if (raw.startsWith('/')) return `${FRONTEND_ORIGIN}${raw}`
  return `${FRONTEND_ORIGIN}/${raw}`
}

function formatOrderMoney(amount, currency = 'CHF') {
  const normalizedCurrency = ['CHF', 'EUR', 'USD'].includes(String(currency).toUpperCase())
    ? String(currency).toUpperCase()
    : 'CHF'

  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: normalizedCurrency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount || 0))
}

function isPaperItem(item) {
  return item?.format === 'paper' || /papier|paper/i.test(String(item?.name || ''))
}

function itemFormatLabel(item) {
  return isPaperItem(item) ? 'Version papier' : 'PDF'
}

function hasPhysicalItems(orderData) {
  return Boolean(orderData?.hasPhysicalItems) || (orderData?.items || []).some(isPaperItem)
}

function createAddressHTML(orderData) {
  const {
    customerAddress,
    customerCity,
    customerPostalCode,
    customerCountry,
    customerPhone,
    customerOrderNotes
  } = orderData

  if (!customerAddress && !customerCity && !customerPostalCode && !customerCountry && !customerPhone && !customerOrderNotes) {
    return ''
  }

  return `
    ${customerAddress ? `${customerAddress}<br />` : ''}
    ${(customerPostalCode || '').toString()} ${(customerCity || '').toString()}<br />
    ${customerCountry || ''}
    ${customerPhone ? `<br />Tel: ${customerPhone}` : ''}
    ${customerOrderNotes ? `<br /><em>Note: ${customerOrderNotes}</em>` : ''}
  `
}

const RESEND_API_KEY = process.env.RESEND_API_KEY
if (!RESEND_API_KEY) {
  console.warn('RESEND_API_KEY not set. Email sending is disabled. Add RESEND_API_KEY to .env or to your environment variables for production.')
}

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null

/**
 * Envoie un email de confirmation de commande au client
 * @param {Object} orderData - Données de la commande
 * @param {Array} [attachments] - Liste des pièces jointes
 */
export async function sendOrderConfirmationEmail(orderData, attachments = []) {
  try {
    if (!resend) {
      throw new Error('RESEND_API_KEY not configured. Set RESEND_API_KEY to enable email sending.')
    }
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

function createAdminOrderNotificationHTML(orderData) {
  const {
    orderId,
    customerName,
    customerEmail,
    items = [],
    subtotal,
    shipping,
    total,
    createdAt,
    customerAddress,
    customerCity,
    customerPostalCode,
    customerCountry,
    customerPhone,
    customerOrderNotes,
    fulfillmentStatus,
    currency = 'CHF'
  } = orderData
  const physicalOrder = hasPhysicalItems(orderData)
  const digitalManualAction = Boolean(orderData?.hasDigitalItems) && Number(orderData?.digitalAttachmentsCount || 0) === 0

  const itemsHTML = items
    .map(item => {
      const qty = Number(item.quantity || 1)
      const price = Number(item.price || 0)
      return `<li><strong>${item.name}</strong> <span style="color:#666;">(${itemFormatLabel(item)})</span> — Qté: ${qty} — ${formatOrderMoney(price * qty, currency)}</li>`
    })
    .join('')

  const addressHTML = createAddressHTML({
    customerAddress,
    customerCity,
    customerPostalCode,
    customerCountry,
    customerPhone,
    customerOrderNotes
  })

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Nouvelle commande - ${orderId}</title>
    </head>
    <body style="font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; margin: 0; padding: 20px; background-color: #f9f9f9;">
      <div style="max-width: 720px; margin: 0 auto; background: #fff; padding: 24px; border-radius: 10px;">
        <h2 style="margin-top: 0;">Nouvelle commande reçue</h2>
        ${physicalOrder ? `
        <div style="background:#fff7e6; border:1px solid #e7c46a; padding:14px 16px; border-radius:8px; margin-bottom:18px;">
          <strong>Action requise:</strong> préparer et expédier la commande papier depuis la Suisse.
        </div>
        ` : ''}
        ${digitalManualAction ? `
        <div style="background:#eef6ff; border:1px solid #8bbce8; padding:14px 16px; border-radius:8px; margin-bottom:18px;">
          <strong>Action PDF:</strong> vérifier si un fichier numérique doit être envoyé manuellement au client.
        </div>
        ` : ''}
        <p style="margin: 6px 0;"><strong>Commande:</strong> ${orderId}</p>
        <p style="margin: 6px 0;"><strong>Date:</strong> ${createdAt ? new Date(createdAt).toLocaleString('fr-FR') : ''}</p>
        <p style="margin: 6px 0;"><strong>Client:</strong> ${customerName} — <a href="mailto:${customerEmail}">${customerEmail}</a></p>
        ${customerPhone ? `<p style="margin: 6px 0;"><strong>Téléphone:</strong> ${customerPhone}</p>` : ''}
        <p style="margin: 6px 0;"><strong>Traitement:</strong> ${fulfillmentStatus === 'paid-awaiting-preparation' ? 'Payée - à préparer' : 'Complétée'}</p>

        <h3>Articles</h3>
        <ul>
          ${itemsHTML}
        </ul>

        ${subtotal !== null && subtotal !== undefined ? `<p style="margin: 6px 0;"><strong>Sous-total:</strong> ${formatOrderMoney(subtotal, currency)}</p>` : ''}
        ${shipping?.required ? `<p style="margin: 6px 0;"><strong>Livraison:</strong> ${formatOrderMoney(shipping.amount, currency)} — ${shipping.countryLabel || customerCountry || ''} — ${shipping.label || 'Expédition depuis la Suisse'}</p>` : ''}
        <p style="margin: 6px 0;"><strong>Total:</strong> ${formatOrderMoney(total, currency)}</p>

        ${addressHTML
          ? `
        <h3>Adresse de livraison</h3>
        <p style="margin: 6px 0;">
          ${addressHTML}
        </p>
        `
          : ''}
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
    if (!resend) {
      throw new Error('RESEND_API_KEY not configured. Set RESEND_API_KEY to enable email sending.')
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'contact@plume-du-deen.com'
    const { orderId } = orderData

    const htmlContent = createAdminOrderNotificationHTML(orderData)

    const { data, error } = await resend.emails.send({
      from: 'Plume du Deen <commandes@plume-du-deen.com>',
      to: [adminEmail],
      subject: `Nouvelle commande - ${orderId}`,
      html: htmlContent,
    })

    if (error) {
      console.error("Erreur lors de l'envoi de la notification admin:", error)
      throw new Error("Erreur lors de l'envoi de la notification admin")
    }

    console.log('Notification admin envoyée avec succès:', data)
    return { success: true, emailId: data?.id }
  } catch (error) {
    console.error("Erreur lors de l'envoi de la notification admin:", error)
    throw error
  }
}

function createOrderConfirmationHTML(orderData, hasAttachments = false, attachments = []) {
  const { orderId, customerName, items = [], subtotal, shipping, total, createdAt, currency = 'CHF' } = orderData
  const physicalOrder = hasPhysicalItems(orderData)
  const hasDigitalDelivery = hasAttachments || items.some(item => !isPaperItem(item))
  const introMessage = physicalOrder && hasDigitalDelivery
    ? '<br><br><strong>Vos PDF sont joints si disponibles. La version papier sera préparée puis expédiée manuellement depuis la Suisse.</strong>'
    : physicalOrder
      ? '<br><br><strong>Votre commande papier sera préparée puis expédiée manuellement depuis la Suisse.</strong>'
      : hasAttachments
        ? '<br><br><strong>Vos ebooks sont disponibles immédiatement et joints à cet email.</strong><br>Vous pouvez commencer votre lecture dès maintenant.'
        : 'Votre commande est confirmée et sera traitée dans les plus brefs délais.'

  const itemsHTML = items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <div style="display: flex; align-items: center;">
          ${item.image ? `<img src="${toPublicAbsoluteUrl(item.image)}" alt="${item.name}" width="50" height="50" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px; border-radius: 4px;">` : ''}
          <div>
            <strong>${item.name}</strong>
            <br>
            <span style="color: #666; font-size: 14px;">${itemFormatLabel(item)} · Quantité: ${item.quantity}</span>
          </div>
        </div>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        ${formatOrderMoney(item.price * item.quantity, currency)}
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
            ${introMessage}
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
              ${subtotal !== null && subtotal !== undefined ? `
              <tr>
                <td style="padding: 12px 15px; text-align: right; border-top: 1px solid #eee;">Sous-total</td>
                <td style="padding: 12px 15px; text-align: right; border-top: 1px solid #eee;">
                  ${formatOrderMoney(subtotal, currency)}
                </td>
              </tr>
              ` : ''}
              ${shipping?.required ? `
              <tr>
                <td style="padding: 12px 15px; text-align: right; border-top: 1px solid #eee;">Livraison depuis la Suisse</td>
                <td style="padding: 12px 15px; text-align: right; border-top: 1px solid #eee;">
                  ${formatOrderMoney(shipping.amount, currency)}
                </td>
              </tr>
              ` : ''}
              <tr style="background-color: #f8f8f8; font-weight: bold;">
                <td style="padding: 15px; text-align: right; border-top: 2px solid #8B4513;">Total</td>
                <td style="padding: 15px; text-align: right; border-top: 2px solid #8B4513; color: #8B4513; font-size: 18px;">
                  ${formatOrderMoney(total, currency)}
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Delivery Info -->
          <div style="background-color: #e8f4fd; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h4 style="color: #2c5aa0; margin-top: 0; margin-bottom: 10px;">${physicalOrder ? 'Expédition papier depuis la Suisse' : 'Livraison numérique instantanée'}</h4>
            <p style="margin: 5px 0; color: #555;">
              ${physicalOrder ? `${shipping?.estimate || 'Votre commande sera préparée puis expédiée depuis la Suisse.'} Un numéro de suivi sera transmis s'il est disponible.` : (hasAttachments ? 'Vos ebooks sont joints à cet email et disponibles immédiatement.' : 'Votre fichier PDF sera envoyé séparément par email si aucune pièce jointe n’apparaît dans ce message.')}
              ${physicalOrder && hasDigitalDelivery ? '<br>Les éléments numériques disponibles sont livrés par email.' : ''}
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
            © 2026 Plume du Deen. Tous droits réservés.
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
 * Envoie un email de contact au support
 * @param {Object} contactData - Données du formulaire de contact
 */
export async function sendContactEmail(contactData) {
  try {
    if (!resend) {
      throw new Error('RESEND_API_KEY not configured. Set RESEND_API_KEY to enable email sending.')
    }

    const { name, email, subject, message } = contactData

    const adminEmail = process.env.ADMIN_EMAIL || 'contact@plume-du-deen.com'

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nouveau message de contact - ${subject}</title>
      </head>
      <body style="font-family: 'Lora', serif; margin: 0; padding: 0; background-color: #f9f9f9;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%); padding: 40px 30px; text-align: center;">
            <img src="https://plume-du-deen.com/images/logo.png" alt="Plume du Deen" style="max-width: 150px; height: auto; margin-bottom: 15px; border-radius: 8px;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Plume du Deen</h1>
            <p style="color: #FFE4B5; margin: 10px 0 0 0; font-size: 16px;">Nouveau message de contact</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #8B4513; margin-bottom: 20px;">Message de ${name}</h2>

            <div style="background-color: #f8f8f8; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
              <p style="margin: 5px 0;"><strong>Nom:</strong> ${name}</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #8B4513;">${email}</a></p>
              <p style="margin: 5px 0;"><strong>Sujet:</strong> ${subject}</p>
            </div>

            <div style="background-color: #f0f8e8; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745;">
              <h3 style="color: #28a745; margin-top: 0; margin-bottom: 10px;">Message:</h3>
              <p style="margin: 0; white-space: pre-wrap; color: #333;">${message}</p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #333; color: white; padding: 20px 30px; text-align: center;">
            <p style="margin: 0; font-size: 14px;">
              © 2026 Plume du Deen. Tous droits réservés.
            </p>
          </div>
        </div>
      </body>
      </html>
    `

    const { data, error } = await resend.emails.send({
      from: 'Plume du Deen <contact@plume-du-deen.com>',
      to: [adminEmail],
      subject: `Nouveau message de contact: ${subject}`,
      html: htmlContent,
    })

    if (error) {
      console.error('Erreur lors de l\'envoi de l\'email de contact:', error)
      throw new Error('Erreur lors de l\'envoi de l\'email de contact')
    }

    console.log('Email de contact envoyé avec succès:', data)
    return { success: true, emailId: data?.id }
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de contact:', error)
    throw error
  }
}

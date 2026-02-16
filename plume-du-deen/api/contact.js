import { sendContactEmail } from './emailService.js';
import { validateContactData, setSecurityHeaders } from './security.js';

export default async function handler(req, res) {
  // Appliquer les headers de sécurité
  setSecurityHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'POST') {
      const { name, email, subject, message } = req.body;

      // Validation des données
      const validation = validateContactData({ name, email, subject, message });
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          error: 'Données invalides',
          details: validation.errors
        });
      }

      // Envoyer l'email
      await sendContactEmail({ name, email, subject, message });

      return res.status(200).json({
        success: true,
        message: 'Message envoyé avec succès'
      });
    } else {
      return res.status(405).json({
        success: false,
        error: 'Méthode non autorisée'
      });
    }
  } catch (error) {
    console.error('Erreur lors du traitement du contact:', error);
    return res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
}
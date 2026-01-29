import { z } from 'zod'

// Validation schemas for forms
export const contactSchema = z.object({
  name: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  email: z.string()
    .email('Adresse email invalide')
    .min(1, 'L\'email est requis'),
  message: z.string()
    .min(10, 'Le message doit contenir au moins 10 caractères')
    .max(1000, 'Le message ne peut pas dépasser 1000 caractères'),
})

export const orderSchema = z.object({
  firstName: z.string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères'),
  lastName: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  email: z.string()
    .email('Adresse email invalide'),
  phone: z.string()
    .regex(/^(\+33|0)[1-9](\d{2}){4}$/, 'Numéro de téléphone invalide (format: 06 12 34 56 78)'),
  address: z.string()
    .min(5, 'L\'adresse doit contenir au moins 5 caractères'),
  city: z.string()
    .min(2, 'La ville doit contenir au moins 2 caractères'),
  postalCode: z.string()
    .regex(/^\d{5}$/, 'Code postal invalide (5 chiffres)'),
  country: z.string()
    .min(2, 'Le pays est requis'),
  paymentMethod: z.enum(['card', 'paypal', 'bank-transfer', 'contact'])
    .describe('Méthode de paiement invalide'),
  acceptTerms: z.boolean()
    .refine(val => val === true, 'Vous devez accepter les conditions générales'),
  acceptPrivacy: z.boolean()
    .refine(val => val === true, 'Vous devez accepter la politique de confidentialité'),
})

export type ContactFormData = z.infer<typeof contactSchema>
export type OrderFormData = z.infer<typeof orderSchema>

// Validation helper functions
export const validateForm = <T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: Record<string, string> } => {
  try {
    const validData = schema.parse(data)
    return { success: true, data: validData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {}
      error.errors.forEach((err) => {
        if (err.path.length > 0) {
          errors[err.path[0] as string] = err.message
        }
      })
      return { success: false, errors }
    }
    return { success: false, errors: { general: 'Erreur de validation' } }
  }
}
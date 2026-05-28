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
    .regex(/^[+0-9\s().-]{7,20}$/, 'Numéro de téléphone invalide')
    .optional()
    .or(z.literal('')),
  address: z.string()
    .max(100, 'L\'adresse ne peut pas dépasser 100 caractères')
    .optional()
    .or(z.literal('')),
  city: z.string()
    .max(50, 'La ville ne peut pas dépasser 50 caractères')
    .optional()
    .or(z.literal('')),
  postalCode: z.string()
    .max(12, 'Code postal invalide')
    .optional()
    .or(z.literal('')),
  country: z.string()
    .max(50, 'Le pays ne peut pas dépasser 50 caractères')
    .optional()
    .or(z.literal('')),
  countryOther: z.string()
    .max(50, 'Le pays ne peut pas dépasser 50 caractères')
    .optional()
    .or(z.literal('')),
  orderNotes: z.string()
    .max(400, 'La note ne peut pas dépasser 400 caractères')
    .optional()
    .or(z.literal('')),
  paymentMethod: z.enum(['card', 'paypal', 'bank-transfer', 'contact'])
    .describe('Méthode de paiement invalide'),
  acceptTerms: z.boolean()
    .optional(),
  acceptPrivacy: z.boolean()
    .optional(),
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
      error.issues.forEach((issue: z.ZodIssue) => {
        if (issue.path.length > 0) {
          errors[issue.path[0] as string] = issue.message
        }
      })
      return { success: false, errors }
    }
    return { success: false, errors: { general: 'Erreur de validation' } }
  }
}

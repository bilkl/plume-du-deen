import { toast } from 'sonner'

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    duration: 3000,
    style: {
      background: 'hsl(var(--primary))',
      color: 'hsl(var(--primary-foreground))',
      border: '1px solid hsl(var(--border))'
    }
  })
}

export const showErrorToast = (message: string) => {
  toast.error(message, {
    duration: 4000,
    style: {
      background: 'hsl(var(--destructive))',
      color: 'hsl(var(--destructive-foreground))',
      border: '1px solid hsl(var(--border))'
    }
  })
}

export const showInfoToast = (message: string) => {
  toast.info(message, {
    duration: 3000,
    style: {
      background: 'hsl(var(--secondary))',
      color: 'hsl(var(--secondary-foreground))',
      border: '1px solid hsl(var(--border))'
    }
  })
}

// Usage examples:
// import { showSuccessToast, showErrorToast } from '@/lib/toast'
//
// showSuccessToast('Produit ajouté au panier !')
// showErrorToast('Erreur lors de l\'ajout au panier')
// showInfoToast('Commande en cours de traitement...')
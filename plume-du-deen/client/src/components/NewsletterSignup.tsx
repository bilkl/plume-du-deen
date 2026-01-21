import { useState } from 'react'
import { Mail, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { showSuccessToast, showErrorToast } from '@/lib/toast'

interface NewsletterSignupProps {
  variant?: 'inline' | 'card' | 'footer'
  className?: string
}

export default function NewsletterSignup({ variant = 'card', className }: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes('@')) {
      showErrorToast('Veuillez entrer une adresse email valide')
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      // In real app, this would call your newsletter API
      console.log('Newsletter subscription:', email)

      setIsSubscribed(true)
      setEmail('')
      showSuccessToast('Inscription à la newsletter réussie !')

    } catch (error) {
      showErrorToast('Erreur lors de l\'inscription')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (variant === 'inline') {
    return (
      <div className={`flex gap-2 ${className}`}>
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="email"
            placeholder="Votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            disabled={isSubmitting || isSubscribed}
          />
        </div>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || isSubscribed || !email}
          size="sm"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isSubscribed ? (
            <Check className="w-4 h-4" />
          ) : (
            'S\'inscrire'
          )}
        </Button>
      </div>
    )
  }

  if (variant === 'footer') {
    return (
      <div className={`space-y-4 ${className}`}>
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Restez informé
          </h3>
          <p className="text-sm text-muted-foreground">
            Recevez nos dernières actualités et ressources spirituelles
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="email"
            placeholder="Votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
            disabled={isSubmitting || isSubscribed}
          />
          <Button
            type="submit"
            disabled={isSubmitting || isSubscribed || !email}
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isSubscribed ? (
              <Check className="w-4 h-4" />
            ) : (
              'S\'inscrire'
            )}
          </Button>
        </form>

        {isSubscribed && (
          <p className="text-sm text-green-600 dark:text-green-400">
            ✅ Merci pour votre inscription !
          </p>
        )}
      </div>
    )
  }

  // Default card variant
  return (
    <Card className={className}>
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Mail className="w-5 h-5" />
          Newsletter
        </CardTitle>
        <CardDescription>
          Recevez nos dernières ressources spirituelles et actualités
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSubscribed ? (
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                Inscription réussie !
              </h3>
              <p className="text-sm text-muted-foreground">
                Merci de vous être abonné à notre newsletter.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="newsletter-email">Adresse email</Label>
              <Input
                id="newsletter-email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !email}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Inscription en cours...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  M'inscrire à la newsletter
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              En vous inscrivant, vous acceptez de recevoir nos communications.
              Vous pouvez vous désinscrire à tout moment.
            </p>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
import { useState } from 'react'
import { useLocation } from 'wouter'
import { Button } from '@/components/ui/button'
import { CheckCircle, Home, ShoppingBag } from 'lucide-react'
import { PageShell, PremiumCard } from '@/components/PageLayout'
import { useLanguage } from '@/contexts/LanguageContext'

export default function PaymentSuccess() {
  const [, setLocation] = useLocation()
  const { language } = useLanguage()
  const isEnglish = language === 'en'
  const [orderNumber] = useState(() => `CMD-${Date.now()}`)

  return (
    <PageShell>
      <section className="container flex min-h-[calc(100vh-5rem)] items-center justify-center py-16">
        <PremiumCard className="w-full max-w-md p-6 md:p-8 text-center">
          <div className="mx-auto mb-5 w-16 h-16 bg-accent/12 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl text-foreground">
            {isEnglish ? 'Payment successful' : 'Paiement réussi !'}
          </h1>
        <div className="mt-6 space-y-6">
          <div>
            <p className="text-muted-foreground mb-2">
              {isEnglish ? 'Your order has been confirmed' : 'Votre commande a été confirmée'}
            </p>
            <p className="font-mono text-sm bg-secondary/70 px-3 py-2 rounded-md border border-border/70">
              {orderNumber}
            </p>
          </div>

          <div className="text-sm text-muted-foreground space-y-2">
            <p>{isEnglish ? 'A confirmation email has been sent to you.' : 'Un email de confirmation vous a été envoyé.'}</p>
            <p>{isEnglish ? 'Your digital products are delivered by email.' : 'Vos produits numériques sont livrés par email.'}</p>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Button
              onClick={() => setLocation('/collection')}
              className="w-full"
              size="lg"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              {isEnglish ? 'Continue shopping' : 'Continuer mes achats'}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setLocation('/')}
              className="w-full"
            >
              <Home className="w-4 h-4 mr-2" />
              {isEnglish ? 'Back to home' : "Retour à l'accueil"}
            </Button>
          </div>
        </div>
        </PremiumCard>
      </section>
    </PageShell>
  )
}

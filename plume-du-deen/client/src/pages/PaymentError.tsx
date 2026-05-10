import { useState } from 'react'
import { useLocation } from 'wouter'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Home, RefreshCw, ShoppingBag } from 'lucide-react'
import { PageShell, PremiumCard } from '@/components/PageLayout'
import { useLanguage } from '@/contexts/LanguageContext'

export default function PaymentError() {
  const [, setLocation] = useLocation()
  const { language } = useLanguage()
  const isEnglish = language === 'en'
  const [retrying, setRetrying] = useState(false)

  const handleRetry = () => {
    setRetrying(true)
    // Rediriger vers le checkout après un court délai
    setTimeout(() => {
      setLocation('/checkout')
    }, 1000)
  }

  return (
    <PageShell>
      <section className="container flex min-h-[calc(100vh-5rem)] items-center justify-center py-16">
        <PremiumCard className="w-full max-w-md p-6 md:p-8 text-center">
          <div className="mx-auto mb-5 w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-2xl md:text-3xl text-foreground">
            {isEnglish ? 'Payment failed' : 'Paiement échoué'}
          </h1>
        <div className="mt-6 space-y-6">
          <div>
            <p className="text-muted-foreground mb-4">
              {isEnglish ? 'An error occurred while processing your payment.' : "Une erreur s'est produite lors du traitement de votre paiement."}
            </p>
            <div className="text-sm text-muted-foreground space-y-2 bg-secondary/50 p-4 rounded-lg border border-border/70">
              <p><strong>{isEnglish ? 'Possible reasons:' : 'Raisons possibles :'}</strong></p>
              <ul className="text-left space-y-1 ml-4">
                <li>{isEnglish ? 'Insufficient funds' : 'Fonds insuffisants'}</li>
                <li>{isEnglish ? 'Expired card' : 'Carte expirée'}</li>
                <li>{isEnglish ? 'Incorrect information' : 'Informations incorrectes'}</li>
                <li>{isEnglish ? 'Temporary technical issue' : 'Problème technique temporaire'}</li>
              </ul>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>{isEnglish ? 'Your payment information has not been charged.' : "Vos informations de paiement n'ont pas été débitées."}</p>
            <p>{isEnglish ? 'Contact us if the issue persists.' : 'Contactez-nous si le problème persiste.'}</p>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Button
              onClick={handleRetry}
              disabled={retrying}
              className="w-full"
              size="lg"
            >
              {retrying ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  {isEnglish ? 'Redirecting...' : 'Redirection...'}
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {isEnglish ? 'Try payment again' : 'Réessayer le paiement'}
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setLocation('/panier')}
              className="w-full"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              {isEnglish ? 'Back to cart' : 'Retour au panier'}
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

import { useState } from 'react'
import { useLocation } from 'wouter'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Home, RefreshCw, ShoppingBag } from 'lucide-react'

export default function PaymentError() {
  const [, setLocation] = useLocation()
  const [retrying, setRetrying] = useState(false)

  const handleRetry = () => {
    setRetrying(true)
    // Rediriger vers le checkout après un court délai
    setTimeout(() => {
      setLocation('/checkout')
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-700">
            Paiement échoué
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-muted-foreground mb-4">
              Une erreur s'est produite lors du traitement de votre paiement.
            </p>
            <div className="text-sm text-muted-foreground space-y-2 bg-secondary/50 p-4 rounded-lg">
              <p>🔍 <strong>Raisons possibles :</strong></p>
              <ul className="text-left space-y-1 ml-4">
                <li>• Fonds insuffisants</li>
                <li>• Carte expirée</li>
                <li>• Informations incorrectes</li>
                <li>• Problème technique temporaire</li>
              </ul>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>💳 Vos informations de paiement n'ont pas été débitées</p>
            <p>📞 Contactez-nous si le problème persiste</p>
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
                  Redirection...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Réessayer le paiement
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setLocation('/panier')}
              className="w-full"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Retour au panier
            </Button>
            <Button
              variant="ghost"
              onClick={() => setLocation('/')}
              className="w-full"
            >
              <Home className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
import { useState } from 'react'
import { useLocation } from 'wouter'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Home, ShoppingBag } from 'lucide-react'

export default function PaymentSuccess() {
  const [, setLocation] = useLocation()
  const [orderNumber] = useState(() => `CMD-${Date.now()}`)

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-700">
            Paiement réussi !
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-muted-foreground mb-2">
              Votre commande a été confirmée
            </p>
            <p className="font-mono text-sm bg-secondary px-3 py-2 rounded">
              {orderNumber}
            </p>
          </div>

          <div className="text-sm text-muted-foreground space-y-2">
            <p>📧 Un email de confirmation vous a été envoyé</p>
            <p>📦 Préparation de votre commande en cours</p>
            <p>🚚 Livraison estimée : 3-5 jours ouvrés</p>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Button
              onClick={() => setLocation('/collection')}
              className="w-full"
              size="lg"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Continuer mes achats
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
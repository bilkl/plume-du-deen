import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Loader2, Package, Calendar, CreditCard, MapPin, Phone, Mail } from 'lucide-react'
import { showErrorToast } from '@/lib/toast'
import { useAuth } from '@/contexts/AuthContext'
import { useSEO } from '@/hooks/useSEO'

interface Order {
  orderId: string
  customerName: string
  customerEmail: string
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    image?: string
  }>
  total: number
  status: string
  createdAt: string
  paymentIntentId: string
}

export default function Orders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useSEO({
    title: 'Mes Commandes - Plume du Deen | Historique des Achats',
    description: 'Consultez l\'historique de vos commandes et suivez vos achats de produits spirituels islamiques. Livres coraniques, Planners Ramadan et articles religieux.',
    keywords: ['commandes', 'historique achats', 'suivi commande', 'produits islamiques', 'livres coraniques'],
    type: 'website'
  });

  useEffect(() => {
    if (user?.email) {
      fetchOrders()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/orders?email=${encodeURIComponent(user!.email)}`)

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des commandes')
      }

      const data = await response.json()
      setOrders(data.orders || [])
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors du chargement des commandes'
      setError(errorMessage)
      showErrorToast(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Confirmée</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">En attente</Badge>
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Annulée</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Connexion requise</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Vous devez être connecté pour voir vos commandes.
            </p>
            <Button asChild>
              <a href="/creer-compte">Se connecter</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement de vos commandes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-red-600">Erreur</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchOrders} variant="outline">
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Mes Commandes</h1>
            <p className="text-muted-foreground">
              Historique de vos achats sur Plume du Deen
            </p>
          </div>

          {orders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Aucune commande</h3>
                <p className="text-muted-foreground mb-6">
                  Vous n'avez pas encore passé de commande.
                </p>
                <Button asChild>
                  <a href="/collection">Commencer vos achats</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.orderId} className="overflow-hidden">
                  <CardHeader className="bg-secondary/30 dark:bg-secondary/20">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Package className="w-5 h-5" />
                          Commande {order.orderId}
                        </CardTitle>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {order.createdAt}
                          </div>
                          <div className="flex items-center gap-1">
                            <CreditCard className="w-4 h-4" />
                            {order.paymentIntentId.substring(0, 20)}...
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(order.status)}
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">
                            {order.total.toFixed(2)} CHF
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Articles */}
                      <div>
                        <h4 className="font-semibold mb-3">Articles commandés</h4>
                        <div className="space-y-3">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                                  <Package className="w-6 h-6 text-muted-foreground" />
                                </div>
                                <div>
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Quantité: {item.quantity} × {item.price.toFixed(2)} CHF
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">
                                  {(item.price * item.quantity).toFixed(2)} CHF
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      {/* Informations de livraison */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Informations de livraison
                        </h4>
                        <div className="bg-secondary/30 dark:bg-secondary/20 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="font-medium">{order.customerName}</p>
                              <p className="text-muted-foreground flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {order.customerEmail}
                              </p>
                            </div>
                            <div className="text-muted-foreground">
                              <p>Livraison à l'adresse indiquée lors de la commande</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button variant="outline" size="sm" className="flex-1">
                          Télécharger la facture
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          Contacter le support
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
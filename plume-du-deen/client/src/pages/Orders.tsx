import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Loader2, Package, Calendar, CreditCard, MapPin, Mail } from 'lucide-react'
import { showErrorToast } from '@/lib/toast'
import { useAuth } from '@/contexts/AuthContext'
import { useSEO } from '@/hooks/useSEO'
import { PageHero, PageShell, PremiumCard } from '@/components/PageLayout'
import { formatPaymentAmount, type CurrencyCode } from '@/contexts/CurrencyContext'
import { useLanguage } from '@/contexts/LanguageContext'

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
  currency?: CurrencyCode
  status: string
  createdAt: string
  paymentIntentId: string
}

export default function Orders() {
  const { user } = useAuth()
  const { language } = useLanguage()
  const isEnglish = language === 'en'
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useSEO({
    title: isEnglish ? 'My Orders - Plume du Deen | Purchase History' : 'Mes Commandes - Plume du Deen | Historique des Achats',
    description: isEnglish ? 'View your order history and follow your spiritual product purchases.' : 'Consultez l\'historique de vos commandes et suivez vos achats de produits spirituels islamiques. Livres coraniques, Planners Ramadan et articles religieux.',
    keywords: isEnglish ? ['orders', 'purchase history', 'order tracking', 'islamic products'] : ['commandes', 'historique achats', 'suivi commande', 'produits islamiques', 'livres coraniques'],
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
        throw new Error(isEnglish ? 'Error while loading orders' : 'Erreur lors du chargement des commandes')
      }

      const data = await response.json()
      setOrders(data.orders || [])
    } catch (err: any) {
      const errorMessage = err.message || (isEnglish ? 'Error while loading orders' : 'Erreur lors du chargement des commandes')
      setError(errorMessage)
      showErrorToast(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">{isEnglish ? 'Confirmed' : 'Confirmée'}</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">{isEnglish ? 'Pending' : 'En attente'}</Badge>
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">{isEnglish ? 'Cancelled' : 'Annulée'}</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }
  const formatOrderAmount = (amount: number, currency: CurrencyCode = 'CHF') => {
    return formatPaymentAmount(amount, currency)
  }

  if (!user) {
    return (
      <PageShell>
        <section className="container flex min-h-[calc(100vh-5rem)] items-center justify-center py-16">
          <PremiumCard className="w-full max-w-md p-6 md:p-8 text-center">
            <h1 className="text-2xl md:text-3xl text-foreground">{isEnglish ? 'Login required' : 'Connexion requise'}</h1>
            <p className="text-muted-foreground mb-4">
              {isEnglish ? 'You must be logged in to view your orders.' : 'Vous devez être connecté pour voir vos commandes.'}
            </p>
            <Button asChild>
              <a href="/creer-compte">{isEnglish ? 'Sign in' : 'Se connecter'}</a>
            </Button>
          </PremiumCard>
        </section>
      </PageShell>
    )
  }

  if (loading) {
    return (
      <PageShell>
        <section className="container flex min-h-[calc(100vh-5rem)] items-center justify-center py-16">
        <div className="text-center rounded-lg border border-border/70 bg-card/80 p-8 shadow-premium">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">{isEnglish ? 'Loading your orders...' : 'Chargement de vos commandes...'}</p>
        </div>
        </section>
      </PageShell>
    )
  }

  if (error) {
    return (
      <PageShell>
        <section className="container flex min-h-[calc(100vh-5rem)] items-center justify-center py-16">
          <PremiumCard className="w-full max-w-md p-6 md:p-8 text-center">
            <h1 className="text-2xl md:text-3xl text-destructive">{isEnglish ? 'Error' : 'Erreur'}</h1>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchOrders} variant="outline">
              {isEnglish ? 'Try again' : 'Réessayer'}
            </Button>
          </PremiumCard>
        </section>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <PageHero
        eyebrow={isEnglish ? 'Customer space' : 'Espace client'}
        title={isEnglish ? 'My orders' : 'Mes commandes'}
        description={isEnglish ? 'View your purchase history and find useful order information.' : "Consultez l'historique de vos achats et retrouvez les informations utiles."}
        className="pb-10 md:pb-14"
      />
      <section className="pb-16 md:pb-24">
      <div className="container">
        <div className="max-w-[22rem] sm:max-w-4xl mx-auto">
          {orders.length === 0 ? (
            <PremiumCard className="text-center p-8 md:p-12">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-accent/12 text-primary">
                  <Package className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{isEnglish ? 'No orders' : 'Aucune commande'}</h3>
                <p className="text-muted-foreground mb-6">
                  {isEnglish ? 'You have not placed any orders yet.' : "Vous n'avez pas encore passé de commande."}
                </p>
                <Button asChild>
                  <a href="/collection">{isEnglish ? 'Start shopping' : 'Commencer vos achats'}</a>
                </Button>
            </PremiumCard>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.orderId} className="overflow-hidden border-border/70 bg-card/88 shadow-premium">
                  <CardHeader className="bg-secondary/45 dark:bg-secondary/20">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Package className="w-5 h-5" />
                          {isEnglish ? 'Order' : 'Commande'} {order.orderId}
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
                            {formatOrderAmount(order.total, order.currency)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Articles */}
                      <div>
                        <h4 className="font-semibold mb-3">{isEnglish ? 'Ordered items' : 'Articles commandés'}</h4>
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
                                    {isEnglish ? 'Quantity' : 'Quantité'}: {item.quantity} × {formatOrderAmount(item.price, order.currency)}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">
                                  {formatOrderAmount(item.price * item.quantity, order.currency)}
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
                          {isEnglish ? 'Delivery information' : 'Informations de livraison'}
                        </h4>
                        <div className="bg-secondary/40 dark:bg-secondary/20 rounded-lg border border-border/70 p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="font-medium">{order.customerName}</p>
                              <p className="text-muted-foreground flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {order.customerEmail}
                              </p>
                            </div>
                            <div className="text-muted-foreground">
                              <p>{isEnglish ? 'Delivery to the address provided during checkout' : "Livraison à l'adresse indiquée lors de la commande"}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button variant="outline" size="sm" className="flex-1">
                          {isEnglish ? 'Download invoice' : 'Télécharger la facture'}
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          {isEnglish ? 'Contact support' : 'Contacter le support'}
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
      </section>
    </PageShell>
  )
}

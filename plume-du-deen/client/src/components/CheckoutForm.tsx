import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCart } from '@/contexts/CartContext'
import { showSuccessToast, showErrorToast } from '@/lib/toast'
import { validateForm, type OrderFormData } from '@/lib/validation'
import StripePaymentForm from './StripePaymentForm'
import { useStripePayment } from '@/hooks/useStripePayment'

export default function CheckoutForm() {
  const { state, dispatch } = useCart()
  const { createPaymentIntent, isLoading: paymentLoading } = useStripePayment()
  const [formData, setFormData] = useState<Partial<OrderFormData>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
    paymentMethod: 'card',
    acceptTerms: false,
    acceptPrivacy: false
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentIntent, setPaymentIntent] = useState<any>(null)

  const handleInputChange = (field: keyof OrderFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validation = validateForm(orderSchema, formData)
    if (!validation.success) {
      setErrors(validation.errors)
      showErrorToast('Veuillez corriger les erreurs dans le formulaire')
      return
    }

    setIsSubmitting(true)

    try {
      if (formData.paymentMethod === 'card') {
        // Create payment intent for Stripe
        const intent = await createPaymentIntent({
          amount: Math.round(state.total * 100), // Convert to cents
          currency: 'chf',
          metadata: {
            customer_email: validation.data.email,
            customer_name: `${validation.data.firstName} ${validation.data.lastName}`,
            order_items: JSON.stringify(state.items.map(item => ({
              id: item.id,
              name: item.name,
              quantity: item.quantity,
              price: item.price
            })))
          }
        })
        setPaymentIntent(intent)
        setIsSubmitting(false)
        return // Don't proceed to order creation yet
      }

      // For other payment methods, simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Create order object
      const order = {
        id: Date.now().toString(),
        customer: validation.data,
        items: state.items,
        total: state.total,
        status: 'pending',
        createdAt: new Date().toISOString()
      }

      console.log('Order created:', order)

      // Clear cart
      dispatch({ type: 'CLEAR_CART' })

      showSuccessToast('Commande créée avec succès !')

    } catch (error) {
      showErrorToast('Erreur lors de la création de la commande')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (state.items.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">Votre panier est vide</h2>
        <p className="text-muted-foreground mb-6">
          Ajoutez des produits à votre panier avant de procéder au paiement.
        </p>
        <Button asChild>
          <a href="/collection">Continuer mes achats</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Order Summary */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Récapitulatif de commande</CardTitle>
            <CardDescription>{state.items.length} article(s)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {state.items.map((item) => (
                <div key={`${item.id}-${item.format}`} className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Quantité: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{item.price * item.quantity}€</p>
                  </div>
                </div>
              ))}

              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total</span>
                  <span>{state.total}€</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Checkout Form */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Informations de livraison</CardTitle>
            <CardDescription>
              Remplissez vos coordonnées pour finaliser votre commande
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Prénom *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName || ''}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={errors.firstName ? 'border-destructive' : ''}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-destructive mt-1">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName">Nom *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName || ''}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={errors.lastName ? 'border-destructive' : ''}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-destructive mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Téléphone *</Label>
                <Input
                  id="phone"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="06 12 34 56 78"
                  className={errors.phone ? 'border-destructive' : ''}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <Label htmlFor="address">Adresse *</Label>
                <Textarea
                  id="address"
                  value={formData.address || ''}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className={errors.address ? 'border-destructive' : ''}
                />
                {errors.address && (
                  <p className="text-sm text-destructive mt-1">{errors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="postalCode">Code postal *</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode || ''}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    className={errors.postalCode ? 'border-destructive' : ''}
                  />
                  {errors.postalCode && (
                    <p className="text-sm text-destructive mt-1">{errors.postalCode}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="city">Ville *</Label>
                  <Input
                    id="city"
                    value={formData.city || ''}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className={errors.city ? 'border-destructive' : ''}
                  />
                  {errors.city && (
                    <p className="text-sm text-destructive mt-1">{errors.city}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="country">Pays *</Label>
                <Select
                  value={formData.country || 'France'}
                  onValueChange={(value) => handleInputChange('country', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="France">France</SelectItem>
                    <SelectItem value="Belgique">Belgique</SelectItem>
                    <SelectItem value="Suisse">Suisse</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Méthode de paiement *</Label>
                <Select
                  value={formData.paymentMethod || 'card'}
                  onValueChange={(value) => handleInputChange('paymentMethod', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Carte bancaire</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="bank-transfer">Virement bancaire</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    checked={formData.acceptTerms || false}
                    onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                    className="mt-1"
                  />
                  <Label htmlFor="acceptTerms" className="text-sm leading-relaxed">
                    J'accepte les <a href="#" className="text-primary underline">conditions générales de vente</a> *
                  </Label>
                </div>
                {errors.acceptTerms && (
                  <p className="text-sm text-destructive">{errors.acceptTerms}</p>
                )}

                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="acceptPrivacy"
                    checked={formData.acceptPrivacy || false}
                    onChange={(e) => handleInputChange('acceptPrivacy', e.target.checked)}
                    className="mt-1"
                  />
                  <Label htmlFor="acceptPrivacy" className="text-sm leading-relaxed">
                    J'accepte la <a href="#" className="text-primary underline">politique de confidentialité</a> *
                  </Label>
                </div>
                {errors.acceptPrivacy && (
                  <p className="text-sm text-destructive">{errors.acceptPrivacy}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isSubmitting || paymentLoading}
              >
                {isSubmitting || paymentLoading ? 'Traitement en cours...' : `Continuer vers le paiement ${state.total}€`}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Stripe Payment Form */}
        {paymentIntent && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Paiement sécurisé</CardTitle>
              <CardDescription>
                Vos informations de paiement sont chiffrées et sécurisées
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StripePaymentForm
                paymentIntent={paymentIntent}
                amount={state.total}
                currency="CHF"
                orderData={{
                  customer: validation.data,
                  items: state.items,
                  total: state.total,
                }}
                onSuccess={() => {
                  // Clear cart and show success
                  dispatch({ type: 'CLEAR_CART' })
                  showSuccessToast('Paiement effectué avec succès !')
                  setPaymentIntent(null)
                }}
                onError={(error) => {
                  showErrorToast(`Erreur de paiement: ${error}`)
                  setPaymentIntent(null)
                }}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
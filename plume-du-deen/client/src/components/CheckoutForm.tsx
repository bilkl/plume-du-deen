import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, AlertCircle, Mail, Phone, MapPin, CreditCard } from 'lucide-react'
import { Link, useLocation } from 'wouter'
import { useCart } from '@/contexts/CartContext'
import { showSuccessToast, showErrorToast } from '@/lib/toast'
import { validateForm, type OrderFormData, orderSchema } from '@/lib/validation'
import { apiUrl } from '@/lib/api'
import StripePaymentForm from './StripePaymentForm'
import PayPalPaymentForm from './PayPalPaymentForm'
import { useStripePayment } from '@/hooks/useStripePayment'

export default function CheckoutForm() {
  const { state, dispatch } = useCart()
  const { createPaymentIntent, loading: paymentLoading } = useStripePayment()
  const [, setLocation] = useLocation()
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
  const [showPayPal, setShowPayPal] = useState(false)
  const [showContactInfo, setShowContactInfo] = useState(false)

  const handleInputChange = (field: keyof OrderFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }

    // Handle payment method changes
    if (field === 'paymentMethod') {
      const paymentMethod = value as string
      if (paymentMethod === 'contact') {
        setShowContactInfo(true)
        setShowPayPal(false)
      } else if (paymentMethod === 'paypal') {
        setShowContactInfo(false)
        setShowPayPal(true)
      } else {
        // For card and other methods, hide contact and PayPal sections
        setShowContactInfo(false)
        setShowPayPal(false)
      }
    }
  }

  const validateField = (field: keyof OrderFormData) => {
    const value = formData[field]
    let error: string | undefined

    switch (field) {
      case 'firstName':
        if (!value || (value as string).length < 2) error = 'Le prénom doit contenir au moins 2 caractères'
        break
      case 'lastName':
        if (!value || (value as string).length < 2) error = 'Le nom doit contenir au moins 2 caractères'
        break
      case 'email':
        if (!value) error = 'L\'email est requis'
        else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value as string)) error = 'Adresse email invalide'
        break
      case 'phone':
        if (!value) error = 'Le numéro de téléphone est requis'
        else if (!/^(\+33|0)[1-9](\d{2}){4}$/.test(value as string)) error = 'Numéro de téléphone invalide (format: 06 12 34 56 78)'
        break
      case 'address':
        if (!value || (value as string).length < 5) error = 'L\'adresse doit contenir au moins 5 caractères'
        break
      case 'city':
        if (!value || (value as string).length < 2) error = 'La ville doit contenir au moins 2 caractères'
        break
      case 'postalCode':
        if (!value) error = 'Le code postal est requis'
        else if (!/^\d{5}$/.test(value as string)) error = 'Code postal invalide (5 chiffres)'
        break
      case 'country':
        if (!value || (value as string).length < 2) error = 'Le pays est requis'
        break
      case 'acceptTerms':
        if (!value) error = 'Vous devez accepter les conditions générales'
        break
      case 'acceptPrivacy':
        if (!value) error = 'Vous devez accepter la politique de confidentialité'
        break
    }

    setErrors(prev => {
      const newErrors = { ...prev }
      if (error) {
        newErrors[field] = error
      } else {
        delete newErrors[field]
      }
      return newErrors
    })
  }

  const validateAllFields = () => {
    const newErrors: Record<string, string> = {}
    
    const fieldsToValidate: (keyof OrderFormData)[] = [
      'firstName', 'lastName', 'email', 'phone', 'address', 'city', 'postalCode', 'country', 'acceptTerms', 'acceptPrivacy'
    ]
    
    fieldsToValidate.forEach(field => {
      const value = formData[field]
      let error: string | undefined

      console.log(`Validating ${field}:`, value, typeof value)

      switch (field) {
        case 'firstName':
          if (!value || (value as string).length < 2) error = 'Le prénom doit contenir au moins 2 caractères'
          break
        case 'lastName':
          if (!value || (value as string).length < 2) error = 'Le nom doit contenir au moins 2 caractères'
          break
        case 'email':
          if (!value) error = 'L\'email est requis'
          else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value as string)) error = 'Adresse email invalide'
          break
        case 'phone':
          if (!value) error = 'Le numéro de téléphone est requis'
          else if (!/^\+?[\d\s\-\(\)]{7,20}$/.test(value as string)) error = 'Numéro de téléphone invalide (format international accepté)'
          break
        case 'address':
          if (!value || (value as string).length < 5) error = 'L\'adresse doit contenir au moins 5 caractères'
          break
        case 'city':
          if (!value || (value as string).length < 2) error = 'La ville doit contenir au moins 2 caractères'
          break
        case 'postalCode':
          if (!value) error = 'Le code postal est requis'
          else if (!/^\d{5}$/.test(value as string)) error = 'Code postal invalide (5 chiffres)'
          break
        case 'country':
          if (!value || (value as string).length < 2) error = 'Le pays est requis'
          break
        case 'acceptTerms':
          if (value !== true) error = 'Vous devez accepter les conditions générales'
          break
        case 'acceptPrivacy':
          if (value !== true) error = 'Vous devez accepter la politique de confidentialité'
          break
      }

      if (error) {
        newErrors[field] = error
        console.log(`Error for ${field}:`, error)
      }
    })

    console.log('Final validation errors:', newErrors)
    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted with data:', formData)

    // Validate all fields
    const validationErrors = validateAllFields()
    console.log('Validation errors:', validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      showErrorToast('Veuillez corriger les erreurs dans le formulaire')
      
      // Scroll to first error field
      const firstErrorField = Object.keys(validationErrors)[0]
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
          element.focus()
        }
      }
      
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
            customer_email: formData.email,
            customer_name: `${formData.firstName} ${formData.lastName}`,
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
      } else if (formData.paymentMethod === 'paypal') {
        // Show PayPal form
        setShowPayPal(true)
        setIsSubmitting(false)
        return
      } else if (formData.paymentMethod === 'contact') {
        // Contact info is already shown, do nothing
        setIsSubmitting(false)
        return
      }

      // For bank-transfer, save order with pending status
      if (formData.paymentMethod === 'bank-transfer') {
        const response = await fetch(apiUrl('/api/orders'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customer: formData,
            items: state.items,
            total: state.total,
            paymentMethod: 'bank-transfer',
            status: 'pending'
          }),
        })

        if (!response.ok) throw new Error('Erreur lors de la création de la commande')

        const result = await response.json()
        dispatch({ type: 'CLEAR_CART' })
        showSuccessToast(`Commande créée ! ID: ${result.orderId}. Instructions de paiement envoyées par email.`)
        setIsSubmitting(false)
        return
      }

      // Create order object
      const order = {
        id: Date.now().toString(),
        customer: formData,
        items: state.items,
        total: state.total,
        status: 'pending',
        createdAt: new Date().toISOString()
      }

      console.log('Order created:', order)

      // Clear cart
      dispatch({ type: 'CLEAR_CART' })

      showSuccessToast('Commande créée avec succès !')

    } catch (error: any) {
      console.error('Checkout error:', error)
      showErrorToast(error.message || 'Erreur lors de la création de la commande')
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
            {Object.keys(errors).length > 0 && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <h3 className="text-sm font-semibold text-destructive mb-2">
                  Veuillez corriger les erreurs suivantes :
                </h3>
                <ul className="text-sm text-destructive space-y-1">
                  {Object.entries(errors).map(([field, message]) => (
                    <li key={field}>• {message}</li>
                  ))}
                </ul>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Prénom *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName || ''}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    onBlur={() => validateField('firstName')}
                    className={errors.firstName ? 'border-destructive' : ''}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName">Nom *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName || ''}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    onBlur={() => validateField('lastName')}
                    className={errors.lastName ? 'border-destructive' : ''}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.lastName}
                    </p>
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
                  onBlur={() => validateField('email')}
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Téléphone *</Label>
                <Input
                  id="phone"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  onBlur={() => validateField('phone')}
                  placeholder="06 12 34 56 78"
                  className={errors.phone ? 'border-destructive' : ''}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="address">Adresse *</Label>
                <Textarea
                  id="address"
                  value={formData.address || ''}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  onBlur={() => validateField('address')}
                  className={errors.address ? 'border-destructive' : ''}
                />
                {errors.address && (
                  <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.address}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="postalCode">Code postal *</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode || ''}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    onBlur={() => validateField('postalCode')}
                    className={errors.postalCode ? 'border-destructive' : ''}
                  />
                  {errors.postalCode && (
                    <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.postalCode}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="city">Ville *</Label>
                  <Input
                    id="city"
                    value={formData.city || ''}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    onBlur={() => validateField('city')}
                    className={errors.city ? 'border-destructive' : ''}
                  />
                  {errors.city && (
                    <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.city}
                    </p>
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
                    <SelectItem value="contact">Autre moyen de paiement (Orange Money, etc.)</SelectItem>
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
                    J'accepte les{' '}
                    <Link href="/conditions-generales" className="text-primary underline">
                      conditions générales de vente
                    </Link>{' '}
                    *
                  </Label>
                </div>
                {errors.acceptTerms && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.acceptTerms}
                  </p>
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
                    J'accepte la{' '}
                    <Link href="/politique-confidentialite" className="text-primary underline">
                      politique de confidentialité
                    </Link>{' '}
                    *
                  </Label>
                </div>
                {errors.acceptPrivacy && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.acceptPrivacy}
                  </p>
                )}
              </div>

              {!showContactInfo && (
                <Button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2"
                  size="lg"
                  disabled={isSubmitting || paymentLoading}
                >
                  {isSubmitting || paymentLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Traitement en cours...
                    </>
                  ) : (
                    `Continuer vers le paiement ${state.total}€`
                  )}
                </Button>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Payment Form */}
        {(paymentIntent || showPayPal) && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Paiement sécurisé</CardTitle>
              <CardDescription>
                {formData.paymentMethod === 'card' 
                  ? 'Vos informations de paiement sont chiffrées et sécurisées'
                  : 'Paiement via PayPal'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {formData.paymentMethod === 'card' && paymentIntent && (
                <StripePaymentForm
                  paymentIntent={paymentIntent}
                  amount={state.total}
                  currency="CHF"
                  orderData={{
                    customer: formData as OrderFormData,
                    items: state.items,
                    total: state.total,
                  }}
                  onSuccess={() => {
                    // Clear cart and redirect to success
                    dispatch({ type: 'CLEAR_CART' })
                    showSuccessToast('Paiement effectué avec succès !')
                    setPaymentIntent(null)
                    setLocation('/paiement-succes')
                  }}
                  onError={(error) => {
                    showErrorToast(`Erreur de paiement: ${error}`)
                    setPaymentIntent(null)
                  }}
                />
              )}
              {formData.paymentMethod === 'paypal' && showPayPal && (
                <PayPalPaymentForm
                  amount={Math.round(state.total * 100)}
                  currency="CHF"
                  orderData={{
                    customer: formData as OrderFormData,
                    items: state.items,
                    total: state.total,
                  }}
                  onSuccess={() => {
                    dispatch({ type: 'CLEAR_CART' })
                    setShowPayPal(false)
                    setLocation('/paiement-succes')
                  }}
                  onError={(error) => {
                    showErrorToast(`Erreur PayPal: ${error}`)
                  }}
                />
              )}
            </CardContent>
          </Card>
        )}

        {/* Contact Information for Unsupported Payment Methods */}
        {showContactInfo && (
          <Card className="mt-6 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl text-card-foreground">Contact pour paiement personnalisé</CardTitle>
              <CardDescription className="text-muted-foreground">
                Pour Orange Money, Wave, ou tout autre moyen de paiement non listé
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Contact Info Card */}
                  <div className="bg-card border border-border rounded-xl p-4 sm:p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-card-foreground mb-1">Email de contact</h3>
                        <p className="text-sm text-muted-foreground">
                          Envoyez-nous un email pour organiser votre paiement personnalisé.
                        </p>
                        <a
                          href="mailto:plumedudeen@gmail.com?subject=Demande%20de%20paiement%20-%20Moyen%20non%20supporté"
                          className="mt-3 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-primary hover:bg-primary/10 font-medium transition-colors"
                        >
                          <Mail className="w-4 h-4" />
                          <span className="break-all">plumedudeen@gmail.com</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="bg-muted/30 dark:bg-muted/10 border border-border rounded-xl p-4 sm:p-6">
                    <h4 className="font-semibold text-card-foreground mb-3 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-primary" />
                      À inclure dans votre email
                    </h4>
                    <div className="grid gap-3 text-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-muted-foreground">Votre nom complet</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-muted-foreground">Les produits souhaités</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-muted-foreground">Le moyen de paiement (Orange Money, Wave, etc.)</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-muted-foreground">Votre email (pour recevoir les e-books)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-1">
                        Traitement rapide garanti
                      </p>
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        Nous vous répondrons dans les plus brefs délais pour organiser votre paiement et procéder à l'envoi de vos ebooks.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => setShowContactInfo(false)}
                  variant="outline"
                  className="w-full border-border hover:bg-muted/50 dark:hover:bg-muted/20"
                >
                  ← Retour au formulaire de paiement
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
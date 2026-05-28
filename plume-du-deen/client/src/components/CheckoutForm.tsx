import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, AlertCircle, Mail, Phone, MapPin, CreditCard } from 'lucide-react'
import { Link, useLocation } from 'wouter'
import { getCartItemKey, useCart } from '@/contexts/CartContext'
import { formatPaymentAmount, useCurrency } from '@/contexts/CurrencyContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { showSuccessToast, showErrorToast } from '@/lib/toast'
import type { OrderFormData } from '@/lib/validation'
import { apiUrl } from '@/lib/api'
import StripePaymentForm from './StripePaymentForm'
import PayPalPaymentForm from './PayPalPaymentForm'
import { useStripePayment } from '@/hooks/useStripePayment'
import CurrencySwitcher from './CurrencySwitcher'
import { buildShippingSummary, cartRequiresShipping, SHIPPING_COUNTRIES } from '@/lib/shipping'

export default function CheckoutForm() {
  const { state, dispatch } = useCart()
  const { currency, convertPrice } = useCurrency()
  const { t, language } = useLanguage()
  const isEnglish = language === 'en'
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
    country: 'CH',
    countryOther: '',
    orderNotes: '',
    paymentMethod: 'card'
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentIntent, setPaymentIntent] = useState<any>(null)
  const [showPayPal, setShowPayPal] = useState(false)
  const [showContactInfo, setShowContactInfo] = useState(false)
  const requiresShipping = cartRequiresShipping(state.items)
  const shippingSummary = useMemo(() => buildShippingSummary({
    items: state.items,
    countryCode: formData.country || 'CH',
    countryOther: formData.countryOther || '',
    convertPrice,
    isEnglish,
  }), [convertPrice, formData.country, formData.countryOther, isEnglish, state.items])
  const paymentItems = useMemo(() => state.items.map((item) => ({
    ...item,
    price: convertPrice(item.price),
    priceChf: item.price,
  })), [state.items, convertPrice])
  const paymentSubtotal = useMemo(
    () => paymentItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [paymentItems]
  )
  const paymentTotal = useMemo(
    () => paymentSubtotal + shippingSummary.amount,
    [paymentSubtotal, shippingSummary.amount]
  )
  const paymentTotalChf = state.total + shippingSummary.amountChf
  const isFreeOrder = paymentTotal === 0
  const formattedPaymentTotal = formatPaymentAmount(paymentTotal, currency)

  useEffect(() => {
    setPaymentIntent(null)
    setShowPayPal(false)
  }, [currency, shippingSummary.amountChf, shippingSummary.countryLabel])

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
        if (!value || (value as string).length < 2) error = isEnglish ? 'First name must contain at least 2 characters' : 'Le prénom doit contenir au moins 2 caractères'
        break
      case 'lastName':
        if (!value || (value as string).length < 2) error = isEnglish ? 'Last name must contain at least 2 characters' : 'Le nom doit contenir au moins 2 caractères'
        break
      case 'email':
        if (!value) error = isEnglish ? 'Email is required' : 'L\'email est requis'
        else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value as string)) error = isEnglish ? 'Invalid email address' : 'Adresse email invalide'
        break
      case 'phone':
        if (value && !/^[+0-9\s().-]{7,20}$/.test(value as string)) error = isEnglish ? 'Invalid phone number' : 'Numéro de téléphone invalide'
        break
      case 'address':
        if (requiresShipping && (!value || (value as string).length < 5)) error = isEnglish ? 'Shipping address is required' : 'L\'adresse de livraison est requise'
        break
      case 'postalCode':
        if (requiresShipping && (!value || (value as string).length < 3)) error = isEnglish ? 'Postal code is required' : 'Le code postal est requis'
        break
      case 'city':
        if (requiresShipping && (!value || (value as string).length < 2)) error = isEnglish ? 'City is required' : 'La ville est requise'
        break
      case 'country':
        if (requiresShipping && !value) error = isEnglish ? 'Shipping country is required' : 'Le pays de livraison est requis'
        break
      case 'countryOther':
        if (requiresShipping && formData.country === 'OTHER' && (!value || (value as string).length < 2)) error = isEnglish ? 'Please specify the destination country' : 'Veuillez préciser le pays de livraison'
        break
      default:
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
      'firstName', 'lastName', 'email'
    ]

    if (requiresShipping) {
      fieldsToValidate.push('address', 'postalCode', 'city', 'country')
      if (formData.country === 'OTHER') {
        fieldsToValidate.push('countryOther')
      }
    }

    if (formData.phone) {
      fieldsToValidate.push('phone')
    }

    fieldsToValidate.forEach(field => {
      const value = formData[field]
      let error: string | undefined

      switch (field) {
        case 'firstName':
          if (!value || (value as string).length < 2) error = isEnglish ? 'First name must contain at least 2 characters' : 'Le prénom doit contenir au moins 2 caractères'
          break
        case 'lastName':
          if (!value || (value as string).length < 2) error = isEnglish ? 'Last name must contain at least 2 characters' : 'Le nom doit contenir au moins 2 caractères'
          break
        case 'email':
          if (!value) error = isEnglish ? 'Email is required' : 'L\'email est requis'
          else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value as string)) error = isEnglish ? 'Invalid email address' : 'Adresse email invalide'
          break
        case 'phone':
          if (value && !/^[+0-9\s().-]{7,20}$/.test(value as string)) error = isEnglish ? 'Invalid phone number' : 'Numéro de téléphone invalide'
          break
        case 'address':
          if (!value || (value as string).length < 5) error = isEnglish ? 'Shipping address is required' : 'L\'adresse de livraison est requise'
          break
        case 'postalCode':
          if (!value || (value as string).length < 3) error = isEnglish ? 'Postal code is required' : 'Le code postal est requis'
          break
        case 'city':
          if (!value || (value as string).length < 2) error = isEnglish ? 'City is required' : 'La ville est requise'
          break
        case 'country':
          if (!value) error = isEnglish ? 'Shipping country is required' : 'Le pays de livraison est requis'
          break
        case 'countryOther':
          if (formData.country === 'OTHER' && (!value || (value as string).length < 2)) error = isEnglish ? 'Please specify the destination country' : 'Veuillez préciser le pays de livraison'
          break
        default:
          break
      }

      if (error) {
        newErrors[field] = error
      }
    })

    return newErrors
  }

  const getCustomerForOrder = () => ({
    ...formData,
    country: requiresShipping ? shippingSummary.countryLabel : formData.country,
    shippingCountryCode: requiresShipping ? shippingSummary.countryCode : undefined,
  })

  const getOrderData = () => ({
    customer: getCustomerForOrder(),
    items: paymentItems,
    subtotal: paymentSubtotal,
    subtotalChf: state.total,
    shipping: shippingSummary,
    total: paymentTotal,
    currency,
    totalChf: paymentTotalChf,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields
    const validationErrors = validateAllFields()

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      showErrorToast(isEnglish ? 'Please correct the errors in the form' : 'Veuillez corriger les erreurs dans le formulaire')
      
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
      const orderData = getOrderData()

      // Free order: no payment needed (e.g., free Planner Ramadan)
      if (isFreeOrder) {
        const response = await fetch(apiUrl('/api/orders'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...orderData,
            paymentIntentId: 'FREE',
            status: 'completed'
          }),
        })

        if (!response.ok) {
          throw new Error(isEnglish ? 'Error while creating the free order' : 'Erreur lors de la création de la commande offerte')
        }

        const result = await response.json()
        dispatch({ type: 'CLEAR_CART' })
        showSuccessToast(isEnglish ? `Free order created. ID: ${result.orderId}` : `Commande offerte créée ! ID: ${result.orderId}`)
        setLocation('/paiement-succes')
        return
      }

      if (formData.paymentMethod === 'card') {
        // Create payment intent for Stripe
        const intent = await createPaymentIntent({
          amount: Math.round(paymentTotal * 100), // Convert to cents
          currency: currency.toLowerCase(),
          metadata: {
            currency,
            total_chf: paymentTotalChf.toFixed(2),
            subtotal_chf: state.total.toFixed(2),
            shipping_chf: shippingSummary.amountChf.toFixed(2),
            has_paper_items: requiresShipping ? 'true' : 'false',
            shipping_country: shippingSummary.countryLabel,
            customer_email: formData.email,
            customer_name: `${formData.firstName} ${formData.lastName}`,
            order_items: JSON.stringify(paymentItems.map(item => ({
              id: item.id,
              cartKey: item.cartKey,
              format: item.format,
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              price_chf: item.priceChf
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

      // 'Virement bancaire' removed — other payment flows handled above

      // Create order object
      const order = {
        id: Date.now().toString(),
        ...orderData,
        status: 'pending',
        createdAt: new Date().toISOString()
      }
      void order

      // Clear cart
      dispatch({ type: 'CLEAR_CART' })

      showSuccessToast(isEnglish ? 'Order created successfully.' : 'Commande créée avec succès !')

    } catch (error: any) {
      console.error('Checkout error:', error)
      showErrorToast(error.message || (isEnglish ? 'Error while creating the order' : 'Erreur lors de la création de la commande'))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (state.items.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">{t('checkout.emptyTitle', 'Votre panier est vide')}</h2>
        <p className="text-muted-foreground mb-6">
          {t('checkout.emptyDescription', 'Ajoutez des produits à votre panier avant de procéder au paiement.')}
        </p>
        <Button asChild>
          <a href="/collection">{t('cart.continue', 'Continuer mes achats')}</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Order Summary */}
      <div>
        <Card className="border-border/70 bg-card/88 shadow-premium">
          <CardHeader>
            <CardTitle>{t('checkout.summary', 'Récapitulatif de commande')}</CardTitle>
            <CardDescription>{state.items.length} {t('checkout.items', 'article(s)')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-5 flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-secondary/35 p-3">
              <span className="text-sm font-medium text-muted-foreground">{t('common.currency', 'Devise')}</span>
              <CurrencySwitcher />
            </div>
            <div className="space-y-4">
              {state.items.map((item) => (
                <div key={getCartItemKey(item)} className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md border border-border/70 bg-secondary/35"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t('common.quantity', 'Quantité')}: {item.quantity}
                    </p>
                    <Badge variant="secondary" className="mt-2 rounded-sm">
                      {item.format === 'paper' ? t('product.paperVersion', 'Version papier') : t('common.pdf', 'PDF')}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatPaymentAmount(convertPrice(item.price) * item.quantity, currency)}</p>
                  </div>
                </div>
              ))}

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{t('cart.subtotal', 'Sous-total')}</span>
                  <span>{formatPaymentAmount(paymentSubtotal, currency)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{t('cart.delivery', 'Livraison')}</span>
                  <span>
                    {shippingSummary.required
                      ? formatPaymentAmount(shippingSummary.amount, currency)
                      : t('cart.deliveryFree', 'Gratuite')}
                  </span>
                </div>
                {shippingSummary.required && (
                  <p className="rounded-lg border border-accent/30 bg-accent/10 p-3 text-sm text-muted-foreground">
                    {shippingSummary.label} · {shippingSummary.estimate}
                  </p>
                )}
                <div className="flex justify-between items-center text-lg font-semibold pt-2">
                  <span>{t('cart.total', 'Total')}</span>
                  <span>{formattedPaymentTotal}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Checkout Form */}
      <div>
        <Card className="border-border/70 bg-card/88 shadow-premium">
          <CardHeader>
            <CardTitle>{t('checkout.customerInfo', 'Informations de livraison')}</CardTitle>
            <CardDescription>
              {t('checkout.customerDescription', 'Remplissez vos coordonnées pour finaliser votre commande')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(errors).length > 0 && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <h3 className="text-sm font-semibold text-destructive mb-2">
                  {isEnglish ? 'Please correct the following errors:' : 'Veuillez corriger les erreurs suivantes :'}
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
                  <Label htmlFor="firstName">{t('checkout.firstName', 'Prénom')} *</Label>
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
                  <Label htmlFor="lastName">{t('checkout.lastName', 'Nom')} *</Label>
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
                <Label htmlFor="email">{t('checkout.email', 'Email')} *</Label>
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

              {requiresShipping && (
                <div className="rounded-lg border border-accent/30 bg-accent/10 p-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-accent/20 p-2 text-primary">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {isEnglish ? 'Paper delivery from Switzerland' : 'Livraison papier depuis la Suisse'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {isEnglish
                          ? 'The seller prepares and ships paper orders manually. Shipping is calculated from Switzerland according to the destination country.'
                          : 'Le vendeur prépare et expédie les commandes papier manuellement. Les frais sont calculés depuis la Suisse selon le pays de livraison.'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="country">{isEnglish ? 'Delivery country' : 'Pays de livraison'} *</Label>
                    <Select
                      value={formData.country || 'CH'}
                      onValueChange={(value) => handleInputChange('country', value)}
                    >
                      <SelectTrigger id="country" className={errors.country ? 'border-destructive' : ''}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SHIPPING_COUNTRIES.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {isEnglish ? country.labelEn : country.labelFr}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.country && (
                      <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.country}
                      </p>
                    )}
                  </div>

                  {formData.country === 'OTHER' && (
                    <div>
                      <Label htmlFor="countryOther">{isEnglish ? 'Specify country' : 'Précisez le pays'} *</Label>
                      <Input
                        id="countryOther"
                        value={formData.countryOther || ''}
                        onChange={(e) => handleInputChange('countryOther', e.target.value)}
                        onBlur={() => validateField('countryOther')}
                        className={errors.countryOther ? 'border-destructive' : ''}
                      />
                      {errors.countryOther && (
                        <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.countryOther}
                        </p>
                      )}
                    </div>
                  )}

                  <div>
                    <Label htmlFor="address">{isEnglish ? 'Shipping address' : 'Adresse de livraison'} *</Label>
                    <Input
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

                  <div className="grid grid-cols-1 sm:grid-cols-[0.85fr_1.15fr] gap-4">
                    <div>
                      <Label htmlFor="postalCode">{isEnglish ? 'Postal code' : 'Code postal'} *</Label>
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
                      <Label htmlFor="city">{isEnglish ? 'City' : 'Ville'} *</Label>
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
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {isEnglish ? 'Phone (optional)' : 'Téléphone (facultatif)'}
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      onBlur={() => validateField('phone')}
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
                    <Label htmlFor="orderNotes">{isEnglish ? 'Delivery note (optional)' : 'Note de livraison (facultatif)'}</Label>
                    <Textarea
                      id="orderNotes"
                      value={formData.orderNotes || ''}
                      onChange={(e) => handleInputChange('orderNotes', e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="rounded-md border border-border/70 bg-card/70 p-3 text-sm text-muted-foreground">
                    <strong className="text-foreground">
                      {formatPaymentAmount(shippingSummary.amount, currency)}
                    </strong>{' '}
                    {isEnglish ? 'shipping added to this order.' : 'de frais de livraison ajoutés à cette commande.'}
                  </div>
                </div>
              )}


              {!isFreeOrder ? (
                <div>
                  <Label>{t('checkout.paymentMethod', 'Méthode de paiement')} *</Label>
                  <Select
                    value={formData.paymentMethod || 'card'}
                    onValueChange={(value) => handleInputChange('paymentMethod', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card">{t('checkout.card', 'Carte bancaire')}</SelectItem>
                      <SelectItem value="paypal">{t('checkout.paypal', 'PayPal')}</SelectItem>
                      {/* Virement bancaire option removed */}
                      <SelectItem value="contact">{t('checkout.otherPayment', 'Autre moyen de paiement (Orange Money, etc.)')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="rounded-lg border border-border/70 bg-secondary/40 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-medium text-card-foreground">{t('checkout.freeOrder', 'Commande offerte')}</span>
                    <Badge variant="secondary">{t('checkout.noPayment', 'Aucun paiement requis')}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {t('checkout.freeNotice', 'Vous recevrez votre ebook par email après validation du formulaire.')}
                  </p>
                </div>
              )}

              

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
                      {isEnglish ? 'Processing...' : 'Traitement en cours...'}
                    </>
                  ) : (
                    isFreeOrder
                      ? t('checkout.submitFree', 'Valider la commande (offert)')
                      : `${t('checkout.continuePayment', 'Continuer vers le paiement')} ${formattedPaymentTotal}`
                  )}
                </Button>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Payment Form */}
        {!isFreeOrder && (paymentIntent || showPayPal) && (
          <Card className="mt-6 border-border/70 bg-card/88 shadow-premium">
            <CardHeader>
              <CardTitle>{t('checkout.securePayment', 'Paiement sécurisé')}</CardTitle>
              <CardDescription>
                {formData.paymentMethod === 'card' 
                  ? t('checkout.cardDescription', 'Vos informations de paiement sont chiffrées et sécurisées')
                  : t('checkout.paypalDescription', 'Paiement via PayPal')
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {formData.paymentMethod === 'card' && paymentIntent && (
                <StripePaymentForm
                  paymentIntent={paymentIntent}
                  amount={paymentTotal}
                  currency={currency}
                  orderData={{
                    customer: getCustomerForOrder() as OrderFormData,
                    items: paymentItems,
                    subtotal: paymentSubtotal,
                    subtotalChf: state.total,
                    shipping: shippingSummary,
                    total: paymentTotal,
                    currency,
                    totalChf: paymentTotalChf,
                  }}
                  onSuccess={() => {
                    // Clear cart and redirect to success
                    dispatch({ type: 'CLEAR_CART' })
                    showSuccessToast(isEnglish ? 'Payment completed successfully.' : 'Paiement effectué avec succès !')
                    setPaymentIntent(null)
                    setLocation('/paiement-succes')
                  }}
                  onError={(error) => {
                    showErrorToast(isEnglish ? `Payment error: ${error}` : `Erreur de paiement: ${error}`)
                    setPaymentIntent(null)
                  }}
                />
              )}
              {formData.paymentMethod === 'paypal' && showPayPal && (
                <PayPalPaymentForm
                  amount={Math.round(paymentTotal * 100)}
                  currency={currency}
                  orderData={{
                    customer: getCustomerForOrder() as OrderFormData,
                    items: paymentItems,
                    subtotal: paymentSubtotal,
                    subtotalChf: state.total,
                    shipping: shippingSummary,
                    total: paymentTotal,
                    currency,
                    totalChf: paymentTotalChf,
                  }}
                  onSuccess={() => {
                    dispatch({ type: 'CLEAR_CART' })
                    setShowPayPal(false)
                    setLocation('/paiement-succes')
                  }}
                  onError={(error) => {
                    showErrorToast(isEnglish ? `PayPal error: ${error}` : `Erreur PayPal: ${error}`)
                  }}
                />
              )}
            </CardContent>
          </Card>
        )}

        {/* Contact Information for Unsupported Payment Methods */}
        {showContactInfo && (
          <Card className="mt-6 border border-primary/20 bg-card/88 shadow-premium">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl text-card-foreground">{isEnglish ? 'Contact for custom payment' : 'Contact pour paiement personnalisé'}</CardTitle>
              <CardDescription className="text-muted-foreground">
                {isEnglish ? 'For Orange Money, Wave, or any payment method not listed' : 'Pour Orange Money, Wave, ou tout autre moyen de paiement non listé'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Contact Info Card */}
                  <div className="bg-card border border-border/70 rounded-lg p-4 sm:p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-card-foreground mb-1">{isEnglish ? 'Contact email' : 'Email de contact'}</h3>
                        <p className="text-sm text-muted-foreground">
                          {isEnglish ? 'Send us an email to organize your custom payment.' : 'Envoyez-nous un email pour organiser votre paiement personnalisé.'}
                        </p>
                        <a
                          href="mailto:contact@plume-du-deen.com?subject=Demande%20de%20paiement%20-%20Moyen%20non%20supporté"
                          className="mt-3 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-primary hover:bg-primary/10 font-medium transition-colors"
                        >
                          <Mail className="w-4 h-4" />
                          <span className="break-all">contact@plume-du-deen.com</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="bg-secondary/35 dark:bg-muted/10 border border-border/70 rounded-lg p-4 sm:p-6">
                    <h4 className="font-semibold text-card-foreground mb-3 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-primary" />
                      {isEnglish ? 'Include in your email' : 'À inclure dans votre email'}
                    </h4>
                    <div className="grid gap-3 text-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-muted-foreground">{isEnglish ? 'Your full name' : 'Votre nom complet'}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-muted-foreground">{isEnglish ? 'The products you want' : 'Les produits souhaités'}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-muted-foreground">{isEnglish ? 'The payment method (Orange Money, Wave, etc.)' : 'Le moyen de paiement (Orange Money, Wave, etc.)'}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-muted-foreground">{isEnglish ? 'Your email address for order confirmation' : 'Votre email pour la confirmation de commande'}</span>
                      </div>
                      {requiresShipping && (
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{isEnglish ? 'Your full shipping address for the paper version' : 'Votre adresse complète pour la version papier'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-accent/10 border border-accent/25 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-accent/15 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <AlertCircle className="w-3 h-3 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1">
                        {isEnglish ? 'Fast processing guaranteed' : 'Traitement rapide garanti'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {isEnglish ? 'We will reply as soon as possible to organize your payment and send your ebooks.' : "Nous vous répondrons dans les plus brefs délais pour organiser votre paiement et procéder à l'envoi de vos ebooks."}
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => setShowContactInfo(false)}
                  variant="outline"
                  className="w-full border-border hover:bg-muted/50 dark:hover:bg-muted/20"
                >
                  {isEnglish ? 'Back to payment form' : '← Retour au formulaire de paiement'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

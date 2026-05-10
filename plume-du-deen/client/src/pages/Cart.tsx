import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Link } from 'wouter';
import { useCart } from '@/contexts/CartContext';
import { formatPaymentAmount, useCurrency } from '@/contexts/CurrencyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import CurrencySwitcher from '@/components/CurrencySwitcher';
import { PageHero, PageShell, PremiumCard } from '@/components/PageLayout';

export default function Cart() {
  const { state, dispatch } = useCart();
  const { currency, convertPrice, formatPrice } = useCurrency();
  const { t } = useLanguage();

  const convertedTotal = state.items.reduce(
    (sum, item) => sum + convertPrice(item.price) * item.quantity,
    0
  );
  const formatTotal = (total: number) => formatPaymentAmount(total, currency);

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const removeItem = (id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  if (state.items.length === 0) {
    return (
      <PageShell>
          <div className="container py-16 md:py-24">
            <PremiumCard className="mx-auto max-w-[22rem] sm:max-w-xl p-8 md:p-12 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent/12 text-primary">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h1 className="text-3xl md:text-4xl text-foreground">
                {t('cart.emptyTitle', 'Votre panier est vide')}
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-md mx-auto">
                {t('cart.emptyDescription', 'Découvrez nos produits spirituels et ajoutez-les à votre panier.')}
              </p>
              <Link href="/collection">
                <button className="mt-8 px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-md transition-all duration-300 hover:shadow-gold hover:-translate-y-0.5">
                  {t('cart.viewCollection', 'Voir la collection')}
                </button>
              </Link>
            </PremiumCard>
          </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
        <PageHero
          eyebrow={t('cart.title', 'Panier')}
          title={t('cart.title', 'Votre panier')}
          description={t('cart.description', 'Vérifiez vos créations sélectionnées avant de finaliser votre commande.')}
          className="pb-12 md:pb-16"
        />
        <section className="pb-16 md:pb-24">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {state.items.map((item) => (
                  <PremiumCard key={item.id} className="p-5 md:p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg border border-border/70 bg-secondary/40"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 space-y-2">
                        <h3 className="text-xl font-semibold text-card-foreground">
                          {item.name}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {item.description}
                        </p>
                        <div className="text-lg font-bold text-primary">
                          {formatPrice(item.price)}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-end gap-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-destructive hover:text-destructive/80 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </PremiumCard>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <PremiumCard className="p-6 sticky top-24">
                  <h2 className="text-xl font-semibold text-card-foreground mb-6">
                    {t('cart.summary', 'Récapitulatif')}
                  </h2>
                  <div className="mb-6 flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-secondary/35 p-3">
                    <span className="text-sm font-medium text-muted-foreground">{t('common.currency', 'Devise')}</span>
                    <CurrencySwitcher />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between text-muted-foreground">
                      <span>{t('cart.subtotal', 'Sous-total')}</span>
                      <span>{formatTotal(convertedTotal)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>{t('cart.delivery', 'Livraison')}</span>
                      <span>{t('cart.deliveryFree', 'Gratuite')}</span>
                    </div>
                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between text-xl font-bold text-card-foreground">
                        <span>{t('cart.total', 'Total')}</span>
                        <span>{formatTotal(convertedTotal)}</span>
                      </div>
                    </div>
                  </div>

                  <Link href="/checkout">
                    <button className="w-full mt-8 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-md transition-all duration-300 hover:shadow-gold hover:-translate-y-0.5">
                      {t('cart.checkout', 'Procéder au paiement')}
                    </button>
                  </Link>

                  <Link href="/collection">
                    <button className="w-full mt-4 px-6 py-3 bg-transparent border border-primary/50 text-primary font-semibold rounded-md transition-all duration-300 hover:bg-primary hover:text-primary-foreground">
                      {t('cart.continue', 'Continuer mes achats')}
                    </button>
                  </Link>
                </PremiumCard>
              </div>
            </div>
          </div>
        </section>
    </PageShell>
  );
}

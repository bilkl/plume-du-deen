import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Link } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';

export default function Cart() {
  const { state, dispatch } = useCart();

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const removeItem = (id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 pt-20">
          <div className="container py-20 md:py-32">
            <div className="text-center space-y-6">
              <ShoppingBag className="w-24 h-24 mx-auto text-muted-foreground" />
              <h1 className="text-3xl md:text-4xl text-foreground">
                Votre panier est vide
              </h1>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                Découvrez nos produits spirituels et ajoutez-les à votre panier.
              </p>
              <Link href="/collection">
                <button className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-sm transition-all duration-300 hover:shadow-lg hover:scale-105">
                  Voir la collection
                </button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-20">
        <section className="py-20 md:py-32">
          <div className="container">
            <h1 className="text-4xl md:text-5xl text-foreground mb-12 text-center">
              Votre Panier
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {state.items.map((item) => (
                  <div key={item.id} className="bg-card border border-border rounded-lg p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg"
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
                          {item.price}€
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-end gap-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 bg-muted hover:bg-muted/80 rounded transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 bg-muted hover:bg-muted/80 rounded transition-colors"
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
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card border border-border rounded-lg p-6 shadow-sm sticky top-24">
                  <h2 className="text-xl font-semibold text-card-foreground mb-6">
                    Récapitulatif
                  </h2>

                  <div className="space-y-4">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Sous-total</span>
                      <span>{state.total.toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Livraison</span>
                      <span>Gratuite</span>
                    </div>
                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between text-xl font-bold text-card-foreground">
                        <span>Total</span>
                        <span>{state.total.toFixed(2)}€</span>
                      </div>
                    </div>
                  </div>

                  <Link href="/checkout">
                    <button className="w-full mt-8 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-sm transition-all duration-300 hover:shadow-lg hover:scale-105">
                      Procéder au paiement
                    </button>
                  </Link>

                  <Link href="/collection">
                    <button className="w-full mt-4 px-6 py-3 bg-transparent border border-primary text-primary font-semibold rounded-sm transition-all duration-300 hover:bg-primary hover:text-primary-foreground">
                      Continuer mes achats
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
import { useMemo, useState } from 'react';
import { CheckCircle2, ShoppingCart, Sparkles } from 'lucide-react';
import { Link } from 'wouter';
import { useCart } from '@/contexts/CartContext';
import { STORE_PRODUCTS, StoreProduct } from '@/data/products';

export default function Products() {
  const { dispatch } = useCart();
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'Tous' },
    { id: 'new', label: 'Nouveautés' },
    { id: 'paper', label: 'Papier limité' },
    { id: 'paid', label: 'PDF payants' },
    { id: 'free', label: 'Offerts' },
  ];

  const filteredProducts = useMemo(() => {
    switch (activeFilter) {
      case 'new':
        return STORE_PRODUCTS.filter((product) => product.isNew);
      case 'paper':
        return STORE_PRODUCTS.filter((product) => product.paperLimited);
      case 'paid':
        return STORE_PRODUCTS.filter((product) => product.price !== null && product.price > 0);
      case 'free':
        return STORE_PRODUCTS.filter((product) => product.price === 0);
      default:
        return STORE_PRODUCTS;
    }
  }, [activeFilter]);

  const addToCart = (product: StoreProduct) => {
    if (product.price === null) {
      return;
    }

    dispatch({ type: 'ADD_ITEM', payload: {
      id: product.id,
      name: `${product.title} - PDF`,
      price: product.price,
      image: product.image,
      description: product.description,
      format: 'digital'
    }});
  };

  return (
    <section id="collection" className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background"></div>
      <div className="orb orb-2 w-[26rem] h-[26rem] bg-primary/10 -top-20 -left-32"></div>

      <div className="container relative">
        {/* Section Header */}
        <div className="text-center mb-14 md:mb-20 space-y-5 reveal-soft">
          <div className="ornament mx-auto">
            <span className="font-poppins text-sm md:text-base tracking-[0.28em] uppercase font-medium">Collection Plume du Deen</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-foreground">
            Pour votre <span className="text-gradient-gold italic">foi</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Des créations qui guident votre quotidien.
          </p>
        </div>

        {/* Availability Info */}
        <div className="relative border-gradient-gold rounded-3xl p-7 md:p-10 mb-14 reveal-soft shadow-premium overflow-hidden">
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-accent/10 blur-3xl pointer-events-none"></div>
          <div className="relative grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-5 md:gap-7 items-center text-center md:text-left">
            <div className="w-16 h-16 mx-auto md:mx-0 bg-gradient-to-br from-primary/15 to-primary/5 text-primary rounded-2xl flex items-center justify-center ring-1 ring-primary/15">
              <Sparkles className="w-7 h-7" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-2xl md:text-[1.65rem] font-semibold text-foreground font-playfair tracking-wide">
                Nouveautés disponibles
              </h3>
              <p className="text-base md:text-lg text-muted-foreground mt-2 leading-relaxed">
                Nos créations sont proposées en PDF. La version papier sera bientôt disponible.
              </p>
            </div>
            <div className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-accent/20 to-accent/10 ring-1 ring-accent/40 px-6 py-3 text-base font-semibold text-primary">
              <CheckCircle2 className="w-5 h-5" />
              Sadaqa jariya
            </div>
          </div>
          <p className="relative mt-6 text-center text-base text-muted-foreground pt-5 border-t border-border/40">
            <strong className="text-foreground">1 CHF</strong> sera versé dans des causes de <strong className="text-foreground">sadaqa jariya</strong> pour chaque vente.
          </p>
        </div>

        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="font-poppins text-base text-muted-foreground">
            <span className="text-foreground font-semibold">{filteredProducts.length}</span> création{filteredProducts.length > 1 ? 's' : ''} affichée{filteredProducts.length > 1 ? 's' : ''}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 p-1.5 rounded-full bg-card/60 border border-border/60 backdrop-blur-md shadow-premium" role="tablist" aria-label="Filtres de collection">
            {filters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                role="tab"
                aria-selected={activeFilter === filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`whitespace-nowrap rounded-full px-5 py-2.5 font-poppins text-base font-semibold transition-all duration-300 ${
                  activeFilter === filter.id
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-foreground/70 hover:text-primary hover:bg-secondary/60'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7 md:gap-9">
          {filteredProducts.map((product, index) => (
            <article
              key={product.id}
              className="group relative flex flex-col overflow-hidden rounded-3xl bg-card border border-border/60 hover-lift hover:shadow-premium-lg hover:border-accent/30 reveal-soft"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              {/* Image Container */}
              <div className="relative h-[24rem] min-h-80 overflow-hidden bg-gradient-to-br from-secondary/40 via-secondary/20 to-secondary/40">
                {/* subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[1] pointer-events-none"></div>
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-contain p-6 group-hover:scale-[1.06] transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                {/* Subtitle Badge */}
                <div className="absolute top-5 left-5 max-w-[70%] bg-primary/95 backdrop-blur-md text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-md tracking-wider z-[2]">
                  {product.subtitle}
                </div>
                {/* Format Badges */}
                <div className="absolute top-5 right-5 flex flex-col items-end gap-2 z-[2]">
                  <div className="bg-primary/90 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-sm font-semibold shadow-sm ring-1 ring-white/10">
                    PDF
                  </div>
                  {product.paperLimited && (
                    <div className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground px-3.5 py-1.5 rounded-full text-sm font-semibold shadow-gold ring-1 ring-white/20">
                      Papier limité
                    </div>
                  )}
                  {product.isNew && (
                    <div className="bg-card/90 backdrop-blur-md text-primary px-3.5 py-1.5 rounded-full text-sm font-semibold shadow-sm ring-1 ring-primary/20">
                      Nouveau
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-7 md:p-8 bg-card flex flex-col">
                <p className="font-poppins text-sm uppercase tracking-[0.2em] text-accent mb-3 font-semibold">
                  {product.category}
                </p>
                <h3 className="text-2xl md:text-[1.7rem] font-playfair tracking-wide text-foreground mb-3 group-hover:text-primary transition-colors leading-snug">
                  {product.title}
                </h3>
                <p className="text-base md:text-lg text-muted-foreground mb-6 flex-1 leading-relaxed">
                  {product.description}
                </p>

                <div className="mb-7 grid grid-cols-2 gap-4 border-t border-border/60 pt-5 text-base">
                  <div>
                    <span className="block text-muted-foreground/80 mb-1 text-sm uppercase tracking-wider">Format</span>
                    <span className="font-medium text-foreground">
                      {product.paperLimited ? 'PDF · Papier bientôt dispo' : 'PDF'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-muted-foreground/80 mb-1 text-sm uppercase tracking-wider">Prix</span>
                    <span className="font-semibold text-primary text-xl font-playfair">
                      {product.price === null
                        ? 'À confirmer'
                        : product.price === 0
                          ? 'Offert'
                          : `${product.price.toFixed(2)} CHF`}
                    </span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col gap-3">
                  <Link href={product.href}>
                    <button className="w-full px-5 py-4 bg-transparent border border-border text-foreground text-base font-medium rounded-full transition-all duration-300 hover:border-primary hover:text-primary hover:bg-secondary/40 flex items-center justify-center gap-2">
                      Découvrir
                    </button>
                  </Link>

                  {product.price === null ? (
                    <Link href="/contact">
                      <button className="w-full px-5 py-4 bg-primary text-primary-foreground text-base font-semibold rounded-full transition-all duration-300 hover:bg-primary/90 hover:shadow-premium hover:-translate-y-0.5 flex items-center justify-center gap-2">
                        Demander la disponibilité
                      </button>
                    </Link>
                  ) : (
                    <button
                      onClick={() => addToCart(product)}
                      className="group/btn relative w-full px-5 py-4 bg-primary text-primary-foreground text-base font-semibold rounded-full transition-all duration-300 hover:bg-primary/95 hover:shadow-premium hover:-translate-y-0.5 flex items-center justify-center gap-2 overflow-hidden"
                    >
                      <span className="absolute inset-0 shimmer-gold opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></span>
                      <ShoppingCart className="relative w-[1.1rem] h-[1.1rem]" />
                      <span className="relative">Ajouter au panier{product.price === 0 ? ' - Offert' : ` · ${product.price.toFixed(2)} CHF`}</span>
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

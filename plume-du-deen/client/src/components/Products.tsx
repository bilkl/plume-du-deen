import { ShoppingCart } from 'lucide-react';
import { Link } from 'wouter';
import { useCart } from '@/contexts/CartContext';

export default function Products() {
  const { dispatch } = useCart();

  const addToCart = (product: any) => {
    dispatch({ type: 'ADD_ITEM', payload: {
      id: product.id,
      name: `${product.title} - PDF`,
      price: product.price,
      image: product.image,
      description: product.description,
      format: 'digital'
    }});
  };

  const products = [
    {
      id: 1,
      title: 'Les Invocations du Coran',
      subtitle: 'Nouveau',
      description: 'Dossier de 30 cartes avec les invocations du Coran pour accompagner votre quotidien.',
      image: '/images/invocations.png',
      color: 'bg-blue-50 dark:bg-blue-900',
      price: 9.99,
    },
    {
      id: 2,
      title: 'Planner Ramadan ALIF',
      subtitle: 'Offert',
      description: 'Le rituel guidé de 30 jours pour transformer son Ramadan de l\'intérieur.',
      image: '/images/planner.png',
      color: 'bg-amber-50 dark:bg-amber-900',
      price: 0,
    },
    {
      id: 3,
      title: 'Les 99 Noms d\'Allah',
      subtitle: 'Idée cadeau',
      description: 'Entrer en relation avec les Noms d\'Allah à travers 99 cartes spirituelles.',
      image: '/images/99noms.png',
      color: 'bg-rose-50 dark:bg-rose-900',
      price: 12.99,
    },
  ];

  return (
    <section id="collection" className="py-20 md:py-32">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20 space-y-4 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl text-foreground">
            Pour votre foi
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Des créations qui guident votre quotidien.
          </p>
        </div>

        {/* Availability Info */}
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-12 text-center animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-green-800 dark:text-green-200">
              Livraison instantanée
            </h3>
          </div>
          <p className="text-green-700 dark:text-green-300 mb-3">
            Tous nos produits sont des <strong className="text-green-800 dark:text-green-100">PDFs</strong> et disponibles <strong className="text-green-800 dark:text-green-100">immédiatement</strong> après achat.
          </p>
          <p className="text-sm text-green-600 dark:text-green-400">
            💝 <strong>1 CHF</strong> sera versé dans des causes de <strong>sadaqa jariya</strong> pour chaque vente.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group flex flex-col overflow-hidden rounded-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-card border border-border animate-fade-in-up"
              style={{ animationDelay: `${(product.id - 1) * 0.2}s` }}
            >
              {/* Image Container */}
              <div className="relative h-80 overflow-hidden bg-cover bg-center" style={{ backgroundImage: 'url(/images/banner-background.png)' }}>
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Badge */}
                <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-4 py-2 rounded-sm text-sm font-semibold">
                  {product.subtitle}
                </div>
                {/* Digital Badge */}
                <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-sm text-xs font-semibold">
                  PDF
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-6 bg-card flex flex-col">
                <h3 className="text-xl md:text-2xl text-foreground mb-2">
                  {product.title}
                </h3>
                <p className="text-base text-muted-foreground mb-6 flex-1">
                  {product.description}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col gap-3">
                  <Link href={product.id === 1 ? "/invocations" : product.id === 2 ? "/planner" : "/99noms"}>
                    <button className="w-full px-4 py-3 bg-transparent border-2 border-primary text-primary font-semibold rounded-sm transition-all duration-300 hover:bg-primary hover:text-primary-foreground flex items-center justify-center gap-2">
                      Découvrir
                    </button>
                  </Link>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => addToCart({ ...product, price: product.price, format: 'digital' })}
                    className="w-full px-4 py-3 bg-primary text-primary-foreground font-semibold rounded-sm transition-all duration-300 hover:bg-primary/90 hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    Ajouter au panier - {product.price === 0 ? 'Offert' : `${product.price} CHF`}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

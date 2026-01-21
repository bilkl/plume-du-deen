import { ShoppingCart } from 'lucide-react';
import { Link } from 'wouter';
import { useCart } from '@/contexts/CartContext';

export default function Products() {
  const { dispatch } = useCart();

  const addToCart = (product: any) => {
    dispatch({ type: 'ADD_ITEM', payload: {
      id: product.id,
      name: `${product.title} - Version numérique`,
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
      subtitle: 'Spécial Ramadan',
      description: 'Le rituel guidé de 30 jours pour transformer son Ramadan de l\'intérieur.',
      image: '/images/planner.png',
      color: 'bg-amber-50 dark:bg-amber-900',
      price: 14.99,
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
        <div className="bg-secondary/50 border border-border rounded-lg p-6 mb-12 text-center animate-fade-in-up">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Produits numériques
          </h3>
          <p className="text-muted-foreground mb-3">
            Tous nos produits sont disponibles <strong className="text-foreground">immédiatement en version numérique</strong> au format PDF.
          </p>
          <p className="text-sm text-muted-foreground">
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
                    Ajouter au panier - {product.price} CHF
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

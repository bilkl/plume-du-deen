import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductDetails from '@/components/ProductDetails';

export default function NomsAllah() {
  const product = {
    id: 3,
    name: "Les 99 Noms d'Allah",
    subtitle: "Idée cadeau",
    description: "Entrer en relation avec les Noms d'Allah à travers 99 cartes spirituelles.",
    longDescription: `Entrer en relation avec les Noms d'Allah à travers 99 cartes spirituelles.

Chaque carte présente un des 99 Noms d'Allah avec :
• Sa signification profonde et originelle
• Une invocation associée pour l'invoquer
• Une réflexion spirituelle pour approfondir votre connexion divine
• Un design élégant et méditatif

Ces cartes sont conçues pour vous accompagner dans votre cheminement spirituel,
vous permettant de découvrir et d'approfondir votre relation avec le Créateur à travers
Ses Noms les plus beaux.

Parfait comme cadeau pour les occasions spéciales ou pour enrichir votre pratique
quotidienne, ce jeu de cartes devient un compagnon précieux dans votre quête spirituelle.`,
    image: "/images/99noms.png",
    price: 12.99,
    features: [
      "99 cartes avec les Noms d'Allah",
      "Significations détaillées",
      "Invocations associées",
      "Réflexions spirituelles",
      "Design méditatif et élégant",
      "Format pratique (7x10cm)"
    ],
    testimonials: [
      {
        name: "Sarah L.",
        text: "Ces cartes m'ont aidée à mieux comprendre et apprécier les Noms d'Allah. Un vrai trésor spirituel.",
        rating: 5
      },
      {
        name: "Omar T.",
        text: "Parfait pour méditer sur les attributs divins. La qualité des explications est remarquable.",
        rating: 5
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-20">
        <section className="py-20 md:py-32">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Image */}
              <div className="order-1">
                <img
                  src="/images/99noms.png"
                  alt="Les 99 Noms d'Allah"
                  className="w-full h-auto rounded-lg shadow-lg sticky top-24"
                />
              </div>

              {/* Content */}
              <div className="order-2">
                <ProductDetails product={product} />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
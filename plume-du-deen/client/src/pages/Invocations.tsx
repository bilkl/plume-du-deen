import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductDetails from '@/components/ProductDetails';

export default function Invocations() {
  const product = {
    id: 1,
    name: "Les Invocations du Coran",
    subtitle: "Nouveau",
    description: "Dossier de 30 cartes avec les invocations du Coran pour accompagner votre quotidien.",
    longDescription: `Dossier de 30 cartes avec les invocations du Coran pour accompagner votre quotidien.
Chaque carte contient une invocation précieuse tirée du Coran, accompagnée de sa traduction
et d'une réflexion spirituelle pour vous guider dans votre pratique quotidienne.

Ce recueil unique rassemble les invocations les plus puissantes et les plus utilisées du Coran,
présentées de manière élégante et accessible. Chaque carte est conçue pour être un rappel
constant de la présence divine dans votre vie.

Que vous soyez débutant ou pratiquant expérimenté, ces cartes vous accompagneront dans
vos moments de prière, de méditation ou de simple recueillement spirituel.`,
    image: "/images/invocations.png",
    price: 9.99,
    features: [
      "30 cartes d'invocations sélectionnées",
      "Traductions claires et accessibles",
      "Réflexions spirituelles guidées",
      "Design élégant et sobre",
      "Format pratique (10x15cm)",
      "Papier de qualité supérieure"
    ],
    testimonials: [
      {
        name: "Fatima K.",
        text: "Ces cartes m'accompagnent tous les jours. Elles me rappellent la beauté des invocations coraniques.",
        rating: 5
      },
      {
        name: "Ahmed M.",
        text: "Parfait pour approfondir ma pratique spirituelle. La qualité est exceptionnelle.",
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
                  src="/images/invocations.png"
                  alt="Les Invocations du Coran"
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
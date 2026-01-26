import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductDetails from '@/components/ProductDetails';

export default function Planner() {
  const product = {
    id: 2,
    name: "Planner Ramadan ALIF",
    subtitle: "Spécial Ramadan",
    description: "Le rituel guidé de 30 jours pour transformer son Ramadan de l'intérieur.",
    longDescription: `Le rituel guidé de 30 jours pour transformer son Ramadan de l'intérieur.

Ce planner unique vous accompagne jour après jour avec des réflexions spirituelles,
des invocations, des objectifs quotidiens et un suivi de vos progrès spirituels.

Chaque jour du Ramadan, découvrez :
• Une invocation coranique puissante
• Une réflexion spirituelle profonde
• Des objectifs quotidiens adaptés à votre niveau
• Un espace pour noter vos progrès et vos intentions
• Des rappels pour les prières et les lectures du Coran

Conçu pour les hommes et les femmes qui souhaitent vivre un Ramadan transformateur,
ce planner vous guide vers une expérience spirituelle enrichissante et mémorable.`,
    image: "/images/planner.png",
    price: 14.99,
    features: [
      "30 jours de guidance spirituelle",
      "Invocations coraniques quotidiennes",
      "Suivi des prières et lectures",
      "Espace de réflexion personnelle",
      "Objectifs quotidiens adaptés",
      "Design élégant et pratique"
    ],
    testimonials: [
      {
        name: "Amina S.",
        text: "Ce planner a complètement transformé mon Ramadan. Chaque jour était une nouvelle découverte spirituelle.",
        rating: 5
      },
      {
        name: "Youssef B.",
        text: "Parfait pour structurer ma pratique. Les réflexions sont profondes et inspirantes.",
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
                  src="/images/planner.png"
                  alt="Planner Ramadan ALIF"
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
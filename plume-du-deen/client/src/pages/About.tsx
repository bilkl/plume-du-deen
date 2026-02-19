import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-20">
        {/* Banner Section with Title */}
        <section className="py-20 md:py-32 relative overflow-hidden bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/images/aboutbanner.png)' }}>
          {/* Background overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60"></div>
          <div className="container relative z-10 flex items-center justify-center">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl text-white">
                À propos
              </h1>
              <p className="text-lg text-white max-w-2xl mx-auto">
                Découvrez l'intention derrière Plume du Deen et notre mission d'accompagner la foi avec douceur.
              </p>
            </div>
          </div>
        </section>

        {/* About Content Section */}
        <section className="py-20 md:py-32">
          <div className="container">
            <div className="text-center mb-16 md:mb-20 space-y-4">
              <div className="mb-8">
                <img
                  src="/images/logo.png"
                  alt="Plume du Deen Logo"
                  className="mx-auto max-w-xs h-auto"
                />
              </div>
              <div className="text-lg text-muted-foreground max-w-4xl mx-auto space-y-4">
                <p>
                  Plume du Deen est née d'une intention sincère : accompagner la foi avec douceur, sens et justesse.
                </p>
                <p>
                  Dans un monde en mouvement, nous créons des supports qui invitent à ralentir, à se recentrer et à nourrir la relation avec Allah.
                </p>
                <p>
                  Des pages pensées comme des instants de rappel, conçues pour s'intégrer naturellement au quotidien.
                </p>
                <p>
                  Chaque création repose sur trois piliers essentiels : l'intention, le rappel et la simplicité.
                </p>
                <p>
                  Des planners, cartes spirituelles, sobres et élégants et bien d'autres... pensés pour le cœur, l'âme et le cheminement intérieur.
                </p>
                <p className="font-semibold text-primary">
                  Plume du Deen — cheminer avec foi, intention et douceur.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
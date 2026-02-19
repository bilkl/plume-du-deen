import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from 'wouter';
import { Star, Heart, BookOpen, Calendar, Users, Award } from 'lucide-react';

export default function Ramadan() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="py-12 md:py-20 lg:py-32 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16 lg:mb-20 space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground font-bold leading-tight">
                Ramadan ALIF
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
                Le rituel guidé de 30 jours pour transformer son Ramadan de l'intérieur.
              </p>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
                Un accompagnement spirituel complet pour vivre un Ramadan conscient, intentionnel et transformateur.
              </p>
            </div>

            {/* Image principale */}
            <div className="mb-8 md:mb-12 flex justify-center px-4">
              <img
                src="/images/planner.png"
                alt="Planner Ramadan ALIF"
                className="max-w-full h-auto rounded-lg shadow-2xl w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl"
              />
            </div>

            <div className="text-center px-4">
              <Link href="/collection">
                <button className="px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground font-semibold rounded-lg text-base sm:text-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
                  Découvrir le Planner Ramadan
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Avantages Section */}
        <section className="py-12 md:py-16 lg:py-20 bg-background">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
                Pourquoi Ramadan ALIF ?
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
                Un outil conçu pour maximiser les bienfaits spirituels du mois sacré
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              <div className="text-center p-4 sm:p-6 rounded-lg border border-border hover:shadow-lg transition-shadow">
                <Calendar className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2">Rituel Quotidien</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Un programme structuré de 30 jours avec des pratiques spirituelles adaptées à chaque journée du Ramadan.
                </p>
              </div>

              <div className="text-center p-4 sm:p-6 rounded-lg border border-border hover:shadow-lg transition-shadow">
                <Heart className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2">Connexion Intérieure</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Des méditations, invocations et réflexions guidées pour approfondir votre relation avec Allah.
                </p>
              </div>

              <div className="text-center p-4 sm:p-6 rounded-lg border border-border hover:shadow-lg transition-shadow">
                <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2">Apprentissage Progressif</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Des enseignements quotidiens sur le Coran, la Sunna et la spiritualité islamique.
                </p>
              </div>

              <div className="text-center p-4 sm:p-6 rounded-lg border border-border hover:shadow-lg transition-shadow">
                <Users className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2">Communauté</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Rejoignez une communauté de personnes engagées dans le même cheminement spirituel.
                </p>
              </div>

              <div className="text-center p-4 sm:p-6 rounded-lg border border-border hover:shadow-lg transition-shadow">
                <Award className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2">Suivi Personnalisé</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Des objectifs personnalisables et un suivi de vos progrès spirituels tout au long du mois.
                </p>
              </div>

              <div className="text-center p-4 sm:p-6 rounded-lg border border-border hover:shadow-lg transition-shadow">
                <Star className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2">Transformation Durable</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Des habitudes spirituelles qui se prolongent bien après la fin du Ramadan.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contenu du Planner */}
        <section className="py-12 md:py-16 lg:py-20 bg-secondary/5">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
                Ce que contient Ramadan ALIF
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
                Un accompagnement complet pour 30 jours de transformation spirituelle
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xs sm:text-sm flex-shrink-0 mt-0.5">1</div>
                  <div>
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2">Préparation Spirituelle</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">Les 10 jours avant le Ramadan pour se préparer mentalement et spirituellement.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xs sm:text-sm flex-shrink-0 mt-0.5">2</div>
                  <div>
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2">Rituel Quotidien Guidé</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">Prières, méditations et invocations spécifiques pour chaque journée.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xs sm:text-sm flex-shrink-0 mt-0.5">3</div>
                  <div>
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2">Lectures Quotidiennes</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">Versets du Coran, hadiths et enseignements adaptés à chaque thème.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xs sm:text-sm flex-shrink-0 mt-0.5">4</div>
                  <div>
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2">Suivi des Progrès</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">Espace pour noter vos réflexions, objectifs atteints et leçons apprises.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xs sm:text-sm flex-shrink-0 mt-0.5">5</div>
                  <div>
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2">Communauté & Partage</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">Accès à un groupe privé pour partager et s'entraider spirituellement.</p>
                  </div>
                </div>
              </div>

              <div className="bg-card p-4 sm:p-6 lg:p-8 rounded-lg shadow-lg border border-border">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 text-center">Aperçu du Planner</h3>
                <div className="space-y-3 sm:space-y-4 text-sm">
                  <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-border">
                    <span className="font-medium mb-1 sm:mb-0">Format</span>
                    <span className="text-right sm:text-left">PDF numérique + Accès plateforme</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-border">
                    <span className="font-medium mb-1 sm:mb-0">Langue</span>
                    <span className="text-right sm:text-left">Français</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-border">
                    <span className="font-medium mb-1 sm:mb-0">Durée</span>
                    <span className="text-right sm:text-left">30 jours + préparation</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-border">
                    <span className="font-medium mb-1 sm:mb-0">Niveau</span>
                    <span className="text-right sm:text-left">Tous niveaux</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-border">
                    <span className="font-medium mb-1 sm:mb-0">Communauté</span>
                    <span className="text-right sm:text-left">Groupe privé inclus</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between py-2">
                    <span className="font-medium mb-1 sm:mb-0">Prix</span>
                    <span className="text-primary font-bold text-right sm:text-left">Offert</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-12 md:py-16 lg:py-20 bg-primary text-primary-foreground">
          <div className="container px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Prêt à transformer votre Ramadan ?
            </h2>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto px-4">
              Rejoignez des centaines de personnes qui ont déjà vécu cette expérience spirituelle unique.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-lg mx-auto">
              <Link href="/collection">
                <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-background text-foreground font-semibold rounded-lg hover:bg-secondary transition-colors text-sm sm:text-base">
                  Commander Ramadan ALIF
                </button>
              </Link>
              <Link href="/apropos">
                <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary transition-colors text-sm sm:text-base">
                  En savoir plus sur Plume du Deen
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
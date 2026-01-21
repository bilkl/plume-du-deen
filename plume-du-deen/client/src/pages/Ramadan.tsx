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
        <section className="py-20 md:py-32 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container">
            <div className="text-center mb-16 md:mb-20 space-y-4">
              <h1 className="text-4xl md:text-6xl text-foreground font-bold">
                Ramadan ALIF
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Le rituel guidé de 30 jours pour transformer son Ramadan de l'intérieur.
              </p>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Un accompagnement spirituel complet pour vivre un Ramadan conscient, intentionnel et transformateur.
              </p>
            </div>

            {/* Image principale */}
            <div className="mb-12 flex justify-center">
              <img
                src="/images/planner.png"
                alt="Planner Ramadan ALIF"
                className="max-w-lg h-auto rounded-lg shadow-2xl"
              />
            </div>

            <div className="text-center">
              <Link href="/collection">
                <button className="px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg text-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
                  Découvrir le Planner Ramadan
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Avantages Section */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Pourquoi Ramadan ALIF ?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Un outil conçu pour maximiser les bienfaits spirituels du mois sacré
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-lg border border-border hover:shadow-lg transition-shadow">
                <Calendar className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Rituel Quotidien</h3>
                <p className="text-muted-foreground">
                  Un programme structuré de 30 jours avec des pratiques spirituelles adaptées à chaque journée du Ramadan.
                </p>
              </div>

              <div className="text-center p-6 rounded-lg border border-border hover:shadow-lg transition-shadow">
                <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Connexion Intérieure</h3>
                <p className="text-muted-foreground">
                  Des méditations, invocations et réflexions guidées pour approfondir votre relation avec Allah.
                </p>
              </div>

              <div className="text-center p-6 rounded-lg border border-border hover:shadow-lg transition-shadow">
                <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Apprentissage Progressif</h3>
                <p className="text-muted-foreground">
                  Des enseignements quotidiens sur le Coran, la Sunna et la spiritualité islamique.
                </p>
              </div>

              <div className="text-center p-6 rounded-lg border border-border hover:shadow-lg transition-shadow">
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Communauté</h3>
                <p className="text-muted-foreground">
                  Rejoignez une communauté de personnes engagées dans le même cheminement spirituel.
                </p>
              </div>

              <div className="text-center p-6 rounded-lg border border-border hover:shadow-lg transition-shadow">
                <Award className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Suivi Personnalisé</h3>
                <p className="text-muted-foreground">
                  Des objectifs personnalisables et un suivi de vos progrès spirituels tout au long du mois.
                </p>
              </div>

              <div className="text-center p-6 rounded-lg border border-border hover:shadow-lg transition-shadow">
                <Star className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Transformation Durable</h3>
                <p className="text-muted-foreground">
                  Des habitudes spirituelles qui se prolongent bien après la fin du Ramadan.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contenu du Planner */}
        <section className="py-20 bg-secondary/5">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Ce que contient Ramadan ALIF
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Un accompagnement complet pour 30 jours de transformation spirituelle
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">1</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Préparation Spirituelle</h3>
                    <p className="text-muted-foreground">Les 10 jours avant le Ramadan pour se préparer mentalement et spirituellement.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">2</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Rituel Quotidien Guidé</h3>
                    <p className="text-muted-foreground">Prières, méditations et invocations spécifiques pour chaque journée.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">3</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Lectures Quotidiennes</h3>
                    <p className="text-muted-foreground">Versets du Coran, hadiths et enseignements adaptés à chaque thème.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">4</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Suivi des Progrès</h3>
                    <p className="text-muted-foreground">Espace pour noter vos réflexions, objectifs atteints et leçons apprises.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">5</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Communauté & Partage</h3>
                    <p className="text-muted-foreground">Accès à un groupe privé pour partager et s'entraider spirituellement.</p>
                  </div>
                </div>
              </div>

              <div className="bg-card p-8 rounded-lg shadow-lg border border-border">
                <h3 className="text-2xl font-bold mb-6 text-center">Aperçu du Planner</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="font-medium">Format</span>
                    <span>PDF numérique + Accès plateforme</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="font-medium">Langue</span>
                    <span>Français</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="font-medium">Durée</span>
                    <span>30 jours + préparation</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="font-medium">Niveau</span>
                    <span>Tous niveaux</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="font-medium">Communauté</span>
                    <span>Groupe privé inclus</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="font-medium">Prix</span>
                    <span className="text-primary font-bold">25.- CHF</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Prêt à transformer votre Ramadan ?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Rejoignez des centaines de personnes qui ont déjà vécu cette expérience spirituelle unique.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/collection">
                <button className="px-8 py-4 bg-background text-foreground font-semibold rounded-lg hover:bg-secondary transition-colors">
                  Commander Ramadan ALIF
                </button>
              </Link>
              <Link href="/apropos">
                <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary transition-colors">
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
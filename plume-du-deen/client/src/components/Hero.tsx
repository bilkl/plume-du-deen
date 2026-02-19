import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-32 relative overflow-hidden bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/images/banner-background.png)' }}>
      {/* Background overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60"></div>

      <div className="container relative z-10">
        <div className="grid grid-cols-1 gap-12 md:gap-20 items-center text-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl text-foreground leading-tight drop-shadow-lg">
                Cultiver sa foi, une page à la fois
              </h1>
              <p className="text-lg md:text-xl text-primary dark:text-foreground leading-relaxed drop-shadow-md">
                Des créations spirituelles en <strong className="text-amber-300">PDF</strong> pour nourrir la foi avec douceur.
              </p>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 inline-block">
                <p className="text-sm text-white/90">
                  📚 Livraison instantanée • Format PDF • Accès immédiat
                </p>
              </div>
            </div>

            {/* Separator */}
            <div className="w-16 h-px bg-gradient-to-r from-accent to-transparent mx-auto"></div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
              <Link href="/collection">
                <button className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-sm transition-all duration-300 hover:shadow-lg hover:scale-105 hover:bg-primary/90 flex items-center gap-2 w-full sm:w-auto justify-center ripple">
                  Découvrir la collection
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link href="/apropos">
                <button className="px-8 py-3 bg-transparent border-2 border-primary text-primary font-semibold rounded-sm transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:shadow-md w-full sm:w-auto ripple">
                  Notre intention
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative separator bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
    </section>
  );
}

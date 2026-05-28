import { Link } from 'wouter';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="w-full max-w-full pt-32 pb-24 md:pt-44 md:pb-32 relative overflow-hidden bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/images/banner-background.png)' }}>
      {/* Layered overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-black/80"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]"></div>

      {/* Animated decorative orbs */}
      <div className="orb orb-1 w-[28rem] h-[28rem] bg-accent/30 -top-20 -left-20"></div>
      <div className="orb orb-2 w-[22rem] h-[22rem] bg-primary/40 -bottom-24 -right-16"></div>

      {/* Subtle noise / grain (CSS only) */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'120\' height=\'120\'><filter id=\'n\'><feTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'2\'/></filter><rect width=\'100%\' height=\'100%\' filter=\'url(%23n)\' opacity=\'0.6\'/></svg>")',
        }}
      />

      <div className="container relative z-10">
        <div className="grid grid-cols-1 gap-12 md:gap-20 items-center text-center min-w-0">
          <div className="space-y-8 reveal-soft w-full max-w-[calc(100vw-2rem)] md:max-w-4xl min-w-0 mx-auto">
            {/* Eyebrow chip */}
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full glass-dark text-white/95 text-sm md:text-base uppercase tracking-[0.18em] font-poppins font-medium">
              <span className="w-2 h-2 rounded-full bg-accent pulse-dot"></span>
              Papeterie spirituelle &amp; rappels du quotidien
            </div>

            <div className="space-y-5">
              <h1 className="w-full max-w-[21rem] sm:max-w-[34rem] md:max-w-none mx-auto text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.05] drop-shadow-lg break-words">
                Cultiver sa foi,
                <span className="block mt-2 text-gradient-gold italic font-playfair">une page à la fois</span>
              </h1>

              <p className="text-xl md:text-2xl text-white/90 leading-relaxed drop-shadow-md max-w-[21rem] md:max-w-2xl mx-auto font-light">
                Des créations spirituelles en <strong className="text-accent font-semibold">PDF</strong> — et bientôt en version papier — pour nourrir la foi avec douceur.
              </p>

              <div className="glass-dark rounded-full px-6 py-3 inline-flex items-center gap-2.5 max-w-[21rem] md:max-w-full">
                <Sparkles className="w-4 h-4 text-accent" />
                <p className="text-sm md:text-base text-white/95 leading-relaxed">
                  PDF disponible · Version papier bientôt disponible · Sadaqa jariya à chaque vente
                </p>
              </div>
            </div>

            {/* Decorative ornament separator */}
            <div className="ornament mx-auto text-accent/85">
              <span className="text-base md:text-lg tracking-[0.4em] uppercase font-medium">بسم الله</span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2 justify-center">
              <Link href="/collection">
                <button className="group relative px-10 py-5 bg-accent text-accent-foreground text-base md:text-lg font-semibold rounded-full transition-all duration-500 shadow-gold hover:shadow-[0_16px_40px_-8px_rgba(212,163,89,0.55)] hover:-translate-y-1 flex items-center gap-2 w-full sm:w-auto justify-center overflow-hidden">
                  <span className="absolute inset-0 shimmer-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                  <span className="relative">Découvrir la collection</span>
                  <ArrowRight className="relative w-5 h-5 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </Link>
              <Link href="/apropos">
                <button className="px-10 py-5 glass-dark text-white text-base md:text-lg font-semibold rounded-full transition-all duration-500 hover:bg-white hover:text-primary hover:-translate-y-1 w-full sm:w-auto">
                  Notre intention
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
    </section>
  );
}

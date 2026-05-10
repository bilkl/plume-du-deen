import { Target, BookOpen, Flower2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Values() {
  const { t } = useLanguage();
  const values = [
    {
      icon: Target,
      title: t('values.intent.title', 'Produits conçus avec intention'),
      description: t('values.intent.description', 'Des supports pensés pour accompagner un geste réel, pas pour ajouter du bruit au quotidien.'),
    },
    {
      icon: BookOpen,
      title: t('values.ritual.title', 'Rituels simples pour le quotidien'),
      description: t('values.ritual.description', 'Des formats faciles à reprendre après la prière, pendant une lecture ou dans un moment calme.'),
    },
    {
      icon: Flower2,
      title: t('values.gift.title', 'Formats utiles & idées cadeaux'),
      description: t('values.gift.description', 'Des créations à garder près de soi, à offrir, ou à installer dans un espace de rappel.'),
    },
  ];

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background"></div>
      <div className="orb orb-1 w-[24rem] h-[24rem] bg-accent/10 top-10 -right-32"></div>

      <div className="container relative">
        {/* Section Header */}
        <div className="text-center mb-20 md:mb-24 space-y-5 reveal-soft">
          <div className="ornament mx-auto">
            <span className="font-poppins text-sm md:text-base tracking-[0.28em] uppercase font-medium">{t('values.eyebrow', 'Notre engagement')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-foreground">
            {t('values.title', 'Pensée avec sens')}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t('values.description', 'Chaque création est pensée avec conscience pour accompagner la foi au quotidien.')}
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={index}
                className="group relative flex flex-col items-center text-center p-8 md:p-10 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/60 hover-lift hover:shadow-premium-lg hover:border-accent/30 reveal-soft"
                style={{ animationDelay: `${index * 0.12}s` }}
              >
                {/* Top gold accent line */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 group-hover:w-24 transition-all duration-500"></div>

                {/* Icon */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative w-20 h-20 flex items-center justify-center bg-gradient-to-br from-accent/15 to-accent/5 rounded-2xl ring-1 ring-accent/20 group-hover:ring-accent/40 transition-all duration-500 group-hover:rotate-3">
                    <Icon className="w-9 h-9 text-accent transition-transform duration-500 group-hover:scale-110" strokeWidth={1.5} />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-2xl md:text-[1.65rem] text-foreground font-playfair leading-snug">
                    {value.title}
                  </h3>
                  <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

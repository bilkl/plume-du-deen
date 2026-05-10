import { Compass, Feather, Heart } from 'lucide-react';
import { PageHero, PageShell, PremiumCard, SectionHeader } from '@/components/PageLayout';
import { useLanguage } from '@/contexts/LanguageContext';

export default function About() {
  const { language } = useLanguage();
  const isEnglish = language === 'en';
  const pillars = [
    {
      icon: Heart,
      title: isEnglish ? 'Intention' : "L'intention",
      text: isEnglish ? 'Each creation begins with a simple aim: helping the heart return to Allah with gentleness.' : "Chaque support naît d'une volonté simple : aider le cœur à revenir vers Allah avec douceur."
    },
    {
      icon: Compass,
      title: isEnglish ? 'Remembrance' : "Le rappel",
      text: isEnglish ? 'Creations designed to remain visible, useful, and present in everyday moments.' : "Des créations pensées pour rester visibles, utiles et présentes dans les moments du quotidien."
    },
    {
      icon: Feather,
      title: isEnglish ? 'Simplicity' : "La simplicité",
      text: isEnglish ? 'A calm aesthetic, carefully chosen words, and an experience without overload.' : "Une esthétique apaisée, des mots choisis et une expérience sans surcharge."
    }
  ];

  return (
    <PageShell>
      <PageHero
        eyebrow={isEnglish ? 'Our intention' : 'Notre intention'}
        title={isEnglish ? 'About' : 'À propos'}
        image="/images/aboutbanner.png"
        description={isEnglish ? 'Discover the intention behind Plume du Deen and our mission to accompany faith with gentleness.' : "Découvrez l'intention derrière Plume du Deen et notre mission d'accompagner la foi avec douceur."}
      />

      <section className="py-16 md:py-24">
        <div className="container">
          <SectionHeader
            eyebrow="Plume du Deen"
            title={isEnglish ? 'Walking with faith, intention, and gentleness' : 'Cheminer avec foi, intention et douceur'}
            description={isEnglish ? 'We create sober and elegant spiritual tools that invite you to slow down, recentre, and nurture your relationship with Allah.' : 'Nous créons des supports spirituels sobres et élégants pour inviter à ralentir, se recentrer et nourrir la relation avec Allah.'}
            className="mb-12 md:mb-16"
          />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <PremiumCard className="p-8 md:p-10 text-center">
              <div className="mx-auto mb-8 flex h-36 w-36 items-center justify-center rounded-full border border-accent/25 bg-secondary/45 shadow-gold">
                <img
                  src="/images/logo.png"
                  alt="Plume du Deen"
                  className="h-28 w-auto"
                />
              </div>
              <p className="font-playfair text-2xl text-foreground">{isEnglish ? 'A house of remembrance' : 'Une maison de rappel'}</p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                {isEnglish ? 'Pages, cards, and objects designed as small refuges in the rhythm of everyday life.' : 'Des pages, des cartes et des objets pensés comme de petits refuges dans le rythme du quotidien.'}
              </p>
            </PremiumCard>

            <div className="space-y-5 text-base md:text-lg leading-relaxed text-muted-foreground">
              <p>
                {isEnglish ? 'Plume du Deen was born from a sincere intention: to accompany faith with gentleness, meaning, and care.' : "Plume du Deen est née d'une intention sincère : accompagner la foi avec douceur, sens et justesse."}
              </p>
              <p>
                {isEnglish ? 'In a fast-moving world, we create tools that invite you to slow down, recentre, and nurture your relationship with Allah.' : 'Dans un monde en mouvement, nous créons des supports qui invitent à ralentir, à se recentrer et à nourrir la relation avec Allah.'}
              </p>
              <p>
                {isEnglish ? 'Pages imagined as moments of remembrance, designed to fit naturally into daily life.' : "Des pages pensées comme des instants de rappel, conçues pour s'intégrer naturellement au quotidien."}
              </p>
              <p>
                {isEnglish ? 'Planners, spiritual cards, refined books, and delicate creations made for the heart, the soul, and the inner journey.' : "Des planners, cartes spirituelles, ouvrages sobres et créations délicates, pensés pour le cœur, l'âme et le cheminement intérieur."}
              </p>
              <p className="font-semibold text-primary">
                {isEnglish ? 'Plume du Deen — walking with faith, intention, and gentleness.' : 'Plume du Deen — cheminer avec foi, intention et douceur.'}
              </p>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
            {pillars.map(({ icon: Icon, title, text }) => (
              <PremiumCard key={title} className="p-6 md:p-7 hover-lift">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/12 text-accent">
                  <Icon className="h-6 w-6" strokeWidth={1.7} />
                </div>
                <h3 className="text-xl text-foreground">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </PremiumCard>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

import { Link } from 'wouter';
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock3,
  Download,
  Heart,
  PenLine,
  Sparkles,
  Target
} from 'lucide-react';
import { PageShell, PremiumCard, SectionHeader } from '@/components/PageLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSEO } from '@/hooks/useSEO';

export default function Ramadan() {
  const { language } = useLanguage();
  const isEnglish = language === 'en';

  useSEO({
    title: isEnglish ? 'Ramadan ALIF - Free Guided Planner | Plume du Deen' : 'Ramadan ALIF - Planner guidé offert | Plume du Deen',
    description: isEnglish
      ? 'Discover Ramadan ALIF, a free guided 30-day ritual to live Ramadan with intention, reflection, and spiritual consistency.'
      : "Découvrez Ramadan ALIF, un rituel guidé offert de 30 jours pour vivre Ramadan avec intention, réflexion et régularité spirituelle.",
    keywords: isEnglish
      ? ['ramadan planner', 'ramadan alif', 'spiritual planner', 'quran', 'dua', 'free pdf']
      : ['planner ramadan', 'ramadan alif', 'organisation spirituelle', 'coran', 'invocations', 'pdf offert'],
    type: 'website'
  });

  const benefits = [
    {
      icon: Calendar,
      title: isEnglish ? 'Daily rhythm' : 'Rythme quotidien',
      text: isEnglish ? 'A clear 30-day structure to return to what matters each day.' : 'Une structure claire sur 30 jours pour revenir chaque jour à l’essentiel.'
    },
    {
      icon: Heart,
      title: isEnglish ? 'Inner presence' : 'Présence intérieure',
      text: isEnglish ? 'Reflections and invocations to deepen your relationship with Allah.' : 'Des réflexions et invocations pour approfondir votre relation avec Allah.'
    },
    {
      icon: Target,
      title: isEnglish ? 'Intentional goals' : 'Objectifs intentionnels',
      text: isEnglish ? 'Simple spaces to set, follow, and refine your spiritual intentions.' : 'Des espaces simples pour poser, suivre et affiner vos intentions spirituelles.'
    },
    {
      icon: PenLine,
      title: isEnglish ? 'Reflection space' : 'Espace de réflexion',
      text: isEnglish ? 'Pages to write, slow down, and notice what Ramadan is teaching you.' : 'Des pages pour écrire, ralentir et observer ce que Ramadan vous enseigne.'
    }
  ];

  const steps = [
    {
      title: isEnglish ? 'Prepare the heart' : 'Préparer le cœur',
      text: isEnglish ? 'Begin before Ramadan by clarifying your intention and your priorities.' : 'Commencez avant Ramadan en clarifiant votre intention et vos priorités.'
    },
    {
      title: isEnglish ? 'Live each day consciously' : 'Vivre chaque jour consciemment',
      text: isEnglish ? 'Follow daily prompts for prayer, Quran reading, invocations, and reflection.' : 'Suivez des repères quotidiens pour la prière, le Coran, les invocations et la réflexion.'
    },
    {
      title: isEnglish ? 'Track what matters' : 'Suivre l’essentiel',
      text: isEnglish ? 'Keep a visible trace of your progress without pressure or overload.' : 'Gardez une trace visible de vos progrès, sans pression ni surcharge.'
    },
    {
      title: isEnglish ? 'Carry it beyond Ramadan' : 'Prolonger après Ramadan',
      text: isEnglish ? 'Turn the month into gentle habits that continue after Eid.' : 'Transformer le mois en habitudes douces qui continuent après l’Aïd.'
    }
  ];

  const plannerDetails = [
    { label: 'Format', value: isEnglish ? 'Digital PDF' : 'PDF numérique' },
    { label: isEnglish ? 'Duration' : 'Durée', value: isEnglish ? '30 days + preparation' : '30 jours + préparation' },
    { label: isEnglish ? 'Level' : 'Niveau', value: isEnglish ? 'All levels' : 'Tous niveaux' },
    { label: isEnglish ? 'Language' : 'Langue', value: isEnglish ? 'French' : 'Français' },
    { label: isEnglish ? 'Access' : 'Accès', value: isEnglish ? 'Instant download' : 'Téléchargement instantané' },
    { label: isEnglish ? 'Price' : 'Prix', value: isEnglish ? 'Free' : 'Offert', highlight: true },
  ];

  return (
    <PageShell mainClassName="pt-20">
      <section
        className="relative isolate overflow-hidden bg-cover bg-center bg-no-repeat pt-24 pb-20 md:pt-36 md:pb-28"
        style={{ backgroundImage: 'url(/images/planner.jpg)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/78 via-black/56 to-black/86" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.44)_100%)]" />
        <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none" style={{
          backgroundImage:
            'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'120\' height=\'120\'><filter id=\'n\'><feTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'2\'/></filter><rect width=\'100%\' height=\'100%\' filter=\'url(%23n)\' opacity=\'0.6\'/></svg>")',
        }} />

        <div className="container relative z-10">
          <div className="mx-auto max-w-[22rem] sm:max-w-4xl text-center space-y-8 reveal-soft">
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full glass-dark text-white/95 text-sm md:text-base uppercase tracking-[0.18em] font-poppins font-medium">
              <span className="w-2 h-2 rounded-full bg-accent pulse-dot" />
              {isEnglish ? 'Guided Ramadan ritual' : 'Rituel guidé Ramadan'}
            </div>

            <div className="space-y-5">
              <h1 className="mx-auto max-w-[21rem] sm:max-w-[44rem] text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.05] drop-shadow-lg">
                Ramadan ALIF
                <span className="block mt-2 text-gradient-gold italic font-playfair">
                  {isEnglish ? 'the return to essentials' : 'le retour à l’essentiel'}
                </span>
              </h1>
              <p className="mx-auto max-w-[21rem] md:max-w-2xl text-xl md:text-2xl text-white/90 leading-relaxed drop-shadow-md font-light">
                {isEnglish
                  ? 'A free 30-day planner to live Ramadan with intention, remembrance, and gentle consistency.'
                  : 'Un planner offert de 30 jours pour vivre Ramadan avec intention, rappel et régularité douce.'}
              </p>
            </div>

            <div className="glass-dark rounded-full px-5 py-3 inline-flex items-center gap-2.5 max-w-[21rem] sm:max-w-full">
              <Sparkles className="w-4 h-4 text-accent" />
              <p className="text-sm md:text-base text-white/95 leading-relaxed">
                {isEnglish ? 'PDF offered · 30 days · Quran · Invocations · Reflection' : 'PDF offert · 30 jours · Coran · Invocations · Réflexion'}
              </p>
            </div>

            <div className="ornament mx-auto text-accent/85">
              <span className="text-base md:text-lg tracking-[0.4em] uppercase font-medium">بسم الله</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2 justify-center">
              <Link href="/planner">
                <button className="group relative px-10 py-5 bg-accent text-accent-foreground text-base md:text-lg font-semibold rounded-full transition-all duration-500 shadow-gold hover:shadow-[0_16px_40px_-8px_rgba(212,163,89,0.55)] hover:-translate-y-1 flex items-center gap-2 w-full sm:w-auto justify-center overflow-hidden">
                  <span className="absolute inset-0 shimmer-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Download className="relative w-5 h-5" />
                  <span className="relative">{isEnglish ? 'Get the free planner' : 'Recevoir le planner offert'}</span>
                </button>
              </Link>
              <a href="#contenu">
                <button type="button" className="px-10 py-5 glass-dark text-white text-base md:text-lg font-semibold rounded-full transition-all duration-500 hover:bg-white hover:text-primary hover:-translate-y-1 w-full sm:w-auto">
                  {isEnglish ? 'See what is inside' : 'Voir le contenu'}
                </button>
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </section>

      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
        <div className="container relative">
          <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center xl:gap-14">
            <div className="relative mx-auto w-full max-w-[22rem] sm:max-w-md reveal-soft">
              <div className="absolute inset-x-8 bottom-2 h-10 rounded-full bg-primary/12 blur-2xl" />
              <div className="relative rounded-3xl border-gradient-gold bg-card/70 p-4 shadow-premium-lg">
                <img
                  src="/images/planner.png"
                  alt={isEnglish ? 'Ramadan ALIF Planner' : 'Planner Ramadan ALIF'}
                  className="block w-full rounded-2xl bg-secondary/30 object-contain"
                />
              </div>
            </div>

            <div className="space-y-8 reveal-soft">
              <SectionHeader
                align="left"
                eyebrow={isEnglish ? 'A companion for the sacred month' : 'Un compagnon pour le mois sacré'}
                title={isEnglish ? 'A planner designed for a calmer Ramadan' : 'Un planner pensé pour un Ramadan plus apaisé'}
                description={isEnglish
                  ? 'Ramadan ALIF guides your days without weighing them down: a simple rhythm, meaningful prompts, and space to return to Allah with sincerity.'
                  : 'Ramadan ALIF guide vos journées sans les alourdir : un rythme simple, des repères profonds, et de l’espace pour revenir vers Allah avec sincérité.'}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                {plannerDetails.map((detail) => (
                  <div key={detail.label} className="rounded-2xl border border-border/70 bg-card/82 p-5 shadow-premium backdrop-blur-sm">
                    <p className="font-poppins text-xs uppercase tracking-[0.18em] text-accent font-semibold">{detail.label}</p>
                    <p className={`mt-2 text-lg font-semibold ${detail.highlight ? 'text-primary' : 'text-foreground'}`}>{detail.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-secondary/35 py-20 md:py-28">
        <div className="container relative">
          <SectionHeader
            eyebrow={isEnglish ? 'Guidance' : 'Accompagnement'}
            title={isEnglish ? 'Why Ramadan ALIF?' : 'Pourquoi Ramadan ALIF ?'}
            description={isEnglish ? 'A quiet tool to support the spiritual benefits of the sacred month.' : 'Un support doux pour soutenir les bienfaits spirituels du mois sacré.'}
            className="mb-12"
          />

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {benefits.map(({ icon: Icon, title, text }, index) => (
              <article
                key={title}
                className="group relative overflow-hidden rounded-3xl border border-border/70 bg-card/88 p-6 shadow-premium transition-all duration-500 hover:-translate-y-1 hover:shadow-premium-lg"
                style={{ animationDelay: `${index * 0.06}s` }}
              >
                <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-accent/10 blur-3xl transition-opacity group-hover:opacity-100" />
                <div className="relative">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/12 text-primary">
                    <Icon className="h-6 w-6" strokeWidth={1.7} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contenu" className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/15 to-background" />
        <div className="container relative">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-start xl:gap-14">
            <div>
              <SectionHeader
                align="left"
                eyebrow={isEnglish ? 'Inside the planner' : 'Dans le planner'}
                title={isEnglish ? 'A complete path for 30 days' : 'Un chemin complet sur 30 jours'}
                description={isEnglish ? 'Each part is designed to help you move from intention to daily practice.' : 'Chaque partie est pensée pour vous aider à passer de l’intention à la pratique quotidienne.'}
                className="mb-10"
              />

              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={step.title} className="flex gap-4 rounded-3xl border border-border/70 bg-card/82 p-5 shadow-premium">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-poppins text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                      <p className="mt-2 text-sm md:text-base leading-relaxed text-muted-foreground">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <PremiumCard className="overflow-hidden p-0 lg:sticky lg:top-28">
              <div className="border-b border-border/70 bg-secondary/35 px-6 py-6 md:px-8">
                <p className="font-poppins text-xs uppercase tracking-[0.22em] text-accent font-semibold">
                  {isEnglish ? 'Preview' : 'Aperçu'}
                </p>
                <h2 className="mt-2 text-3xl md:text-4xl text-foreground">
                  {isEnglish ? 'What you receive' : 'Ce que vous recevez'}
                </h2>
              </div>
              <div className="space-y-4 p-6 md:p-8">
                {[
                  isEnglish ? '30 days of spiritual guidance' : '30 jours de guidance spirituelle',
                  isEnglish ? 'Daily Quranic invocations' : 'Invocations coraniques quotidiennes',
                  isEnglish ? 'Prayer and reading tracking' : 'Suivi des prières et lectures',
                  isEnglish ? 'Personal reflection spaces' : 'Espaces de réflexion personnelle',
                  isEnglish ? 'Simple goals for each day' : 'Objectifs simples pour chaque jour',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <p className="text-sm md:text-base text-muted-foreground">{item}</p>
                  </div>
                ))}

                <div className="mt-7 rounded-2xl border border-accent/35 bg-accent/10 p-5">
                  <div className="flex items-start gap-3">
                    <Clock3 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {isEnglish
                        ? 'Use it after prayer, before iftar, or during a quiet moment before sleep.'
                        : 'À utiliser après la prière, avant l’iftar, ou dans un moment calme avant de dormir.'}
                    </p>
                  </div>
                </div>
              </div>
            </PremiumCard>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-primary py-20 text-primary-foreground md:py-24">
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'url(/images/banner-background.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-black/30" />
        <div className="container relative text-center">
          <div className="mx-auto max-w-[22rem] sm:max-w-3xl space-y-6">
            <div className="ornament mx-auto text-accent/85">
              <span className="font-poppins text-xs uppercase tracking-[0.28em]">{isEnglish ? 'Free PDF' : 'PDF offert'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl text-white">
              {isEnglish ? 'Ready to welcome Ramadan differently?' : 'Prêt à accueillir Ramadan autrement ?'}
            </h2>
            <p className="mx-auto max-w-2xl text-base md:text-lg leading-relaxed text-white/82">
              {isEnglish
                ? 'Download Ramadan ALIF and begin a guided journey back to what truly matters.'
                : 'Téléchargez Ramadan ALIF et commencez un chemin guidé vers ce qui compte vraiment.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link href="/planner">
                <button className="group relative px-9 py-4 bg-accent text-accent-foreground text-base font-semibold rounded-full transition-all duration-500 shadow-gold hover:-translate-y-1 flex items-center justify-center gap-2 overflow-hidden">
                  <span className="absolute inset-0 shimmer-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative">{isEnglish ? 'Get Ramadan ALIF' : 'Recevoir Ramadan ALIF'}</span>
                  <ArrowRight className="relative h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
              <Link href="/contact">
                <button className="px-9 py-4 glass-dark text-white text-base font-semibold rounded-full transition-all duration-500 hover:bg-white hover:text-primary hover:-translate-y-1">
                  {isEnglish ? 'Ask a question' : 'Poser une question'}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

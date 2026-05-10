import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

type PageShellProps = {
  children: ReactNode;
  className?: string;
  mainClassName?: string;
};

export function PageShell({ children, className, mainClassName }: PageShellProps) {
  return (
    <div className={cn('min-h-screen flex flex-col bg-background text-foreground', className)}>
      <Header />
      <main className={cn('relative isolate flex-1 overflow-x-hidden pt-20', mainClassName)}>
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--secondary)_42%,transparent)_0%,transparent_24%,color-mix(in_srgb,var(--secondary)_28%,transparent)_100%)]" />
        {children}
      </main>
      <Footer />
    </div>
  );
}

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  image?: string;
  children?: ReactNode;
  className?: string;
  align?: 'center' | 'left';
};

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  children,
  className,
  align = 'center'
}: PageHeroProps) {
  const isCentered = align === 'center';

  return (
    <section className={cn('relative isolate overflow-hidden py-16 md:py-24', image && 'min-h-[340px] flex items-center', className)}>
      {image ? (
        <div className="absolute inset-0 -z-10">
          <img src={image} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(17,54,46,0.82),rgba(17,54,46,0.50)_48%,rgba(45,42,39,0.72))]" />
        </div>
      ) : (
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--secondary)_65%,transparent),transparent_48%,color-mix(in_srgb,var(--accent)_14%,transparent))]" />
      )}

      <div className="container relative">
        <div className={cn('max-w-[22rem] sm:max-w-3xl min-w-0 space-y-5', isCentered && 'mx-auto text-center')}>
          {eyebrow && (
            <p className="font-poppins text-xs md:text-sm font-semibold uppercase tracking-[0.28em] text-accent">
              {eyebrow}
            </p>
          )}
          <h1 className={cn('max-w-full break-words text-balance text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight', image ? 'text-white' : 'text-foreground')}>
            {title}
          </h1>
          {description && (
            <p className={cn('max-w-full break-words text-pretty text-base md:text-lg leading-relaxed', image ? 'text-white/86' : 'text-muted-foreground')}>
              {description}
            </p>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  className?: string;
  align?: 'center' | 'left';
};

export function SectionHeader({ eyebrow, title, description, className, align = 'center' }: SectionHeaderProps) {
  const isCentered = align === 'center';

  return (
    <div className={cn('max-w-[22rem] sm:max-w-3xl min-w-0 space-y-4', isCentered ? 'mx-auto text-center' : '', className)}>
      {eyebrow && (
        <p className="font-poppins text-xs md:text-sm font-semibold uppercase tracking-[0.24em] text-accent">
          {eyebrow}
        </p>
      )}
      <h2 className="max-w-full break-words text-balance text-3xl sm:text-4xl lg:text-5xl text-foreground">{title}</h2>
      {description && (
        <p className="max-w-full break-words text-pretty text-base md:text-lg leading-relaxed text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

export function PremiumCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-lg border border-border/70 bg-card/88 shadow-premium backdrop-blur-sm', className)}>
      {children}
    </div>
  );
}

type LegalDocumentProps = {
  title: string;
  updated: string;
  children: ReactNode;
};

export function LegalDocument({ title, updated, children }: LegalDocumentProps) {
  const { t } = useLanguage();

  return (
    <PageShell>
      <section className="py-12 md:py-20">
        <div className="container">
          <PremiumCard className="mx-auto w-full max-w-[22rem] sm:max-w-4xl p-5 sm:p-6 md:p-10">
            <Link
              href="/"
              className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-accent"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('common.backHome', "Retour à l'accueil")}
            </Link>
            <div className="space-y-3 border-b border-border/70 pb-8">
              <p className="font-poppins text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                {t('common.legalDocument', 'Document légal')}
              </p>
              <h1 className="max-w-full break-words text-balance text-3xl md:text-5xl text-foreground">{title}</h1>
              <p className="text-sm text-muted-foreground">{t('common.lastUpdated', 'Dernière mise à jour')} : {updated}</p>
            </div>
            <div className="legal-content mt-10">
              {children}
            </div>
          </PremiumCard>
        </div>
      </section>
    </PageShell>
  );
}

import CheckoutForm from '@/components/CheckoutForm';
import { PageHero, PageShell, PremiumCard } from '@/components/PageLayout';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Checkout() {
  const { language } = useLanguage();
  const isEnglish = language === 'en';

  return (
    <PageShell>
      <PageHero
        eyebrow={isEnglish ? 'Order' : 'Commande'}
        title={isEnglish ? 'Complete my order' : 'Finaliser ma commande'}
        description={isEnglish ? 'Enter your details to receive your confirmation and access.' : 'Renseignez vos informations pour recevoir votre confirmation et vos accès.'}
        className="pb-10 md:pb-14"
      />
      <section className="pb-16 md:pb-24">
        <div className="container">
          <div className="max-w-[22rem] sm:max-w-6xl mx-auto">
              <PremiumCard className="mb-8 p-4 md:p-5">
                <p className="text-sm text-foreground">
                  <strong>{isEnglish ? 'No account required.' : 'Pas de compte requis.'}</strong>{' '}
                  {isEnglish
                    ? 'You can order as a guest. We will only use your email to send your order confirmation.'
                    : "Vous pouvez commander en tant qu'invité. Nous utiliserons votre email uniquement pour vous envoyer la confirmation de commande."}
                </p>
              </PremiumCard>

            <CheckoutForm />
          </div>
        </div>
      </section>
    </PageShell>
  );
}

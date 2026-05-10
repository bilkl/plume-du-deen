import ProductDetails from '@/components/ProductDetails';
import { PageShell, PremiumCard } from '@/components/PageLayout';
import { getProductById } from '@/data/products';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Planner() {
  const { localizeProduct, language } = useLanguage();
  const isEnglish = language === 'en';
  const product = localizeProduct(getProductById(2)!);

  return (
    <PageShell>
        <section className="py-12 md:py-20">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Image */}
              <div className="order-1 min-w-0 lg:sticky lg:top-24">
                <PremiumCard className="p-3">
                <img
                  src="/images/planner.png"
                  alt={isEnglish ? 'Ramadan ALIF Planner' : 'Planner Ramadan ALIF'}
                  className="block w-full max-w-full h-auto rounded-md bg-secondary/35"
                />
                </PremiumCard>
              </div>

              {/* Content */}
              <div className="order-2">
                <ProductDetails product={product} />
              </div>
            </div>
          </div>
        </section>
    </PageShell>
  );
}

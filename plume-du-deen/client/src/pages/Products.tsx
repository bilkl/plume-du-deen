import Products from '@/components/Products';
import { useSEO } from '@/hooks/useSEO';
import { PageShell } from '@/components/PageLayout';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ProductsPage() {
  const { language } = useLanguage();
  const isEnglish = language === 'en';

  useSEO({
    title: isEnglish ? 'Collection - Plume du Deen | Spiritual Books & Reminders' : 'Nos Produits - Plume du Deen | Livres Coraniques & Articles Spirituels',
    description: isEnglish ? 'Explore our collection of Islamic spiritual creations: invocations, Ramadan planners, refined books, and gentle reminders for everyday faith.' : 'Explorez notre collection complète de produits spirituels islamiques. Livres coraniques, Planners Ramadan, ouvrages de spiritualité et articles religieux de qualité.',
    keywords: isEnglish ? ['islamic products', 'quranic books', 'ramadan planners', 'spiritual works', 'muslim', 'quran'] : ['produits islamiques', 'livres coraniques', 'planners ramadan', 'ouvrages spirituels', 'articles religieux', 'musulman', 'quran'],
    type: 'website'
  });

  return (
    <PageShell>
        <Products />
    </PageShell>
  );
}

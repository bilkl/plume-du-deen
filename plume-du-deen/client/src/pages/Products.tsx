import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Products from '@/components/Products';
import { useSEO } from '@/hooks/useSEO';

export default function ProductsPage() {
  useSEO({
    title: 'Nos Produits - Plume du Deen | Livres Coraniques & Articles Spirituels',
    description: 'Explorez notre collection complète de produits spirituels islamiques. Livres coraniques, Planners Ramadan, ouvrages de spiritualité et articles religieux de qualité.',
    keywords: ['produits islamiques', 'livres coraniques', 'planners ramadan', 'ouvrages spirituels', 'articles religieux', 'musulman', 'quran'],
    type: 'website'
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-20">
        <Products />
      </main>
      <Footer />
    </div>
  );
}
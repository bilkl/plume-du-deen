import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Values from '@/components/Values';
import Products from '@/components/Products';
import Footer from '@/components/Footer';
import { useSEO } from '@/hooks/useSEO';
import { usePerformance } from '@/hooks/usePerformance';

/**
 * Plume du Deen - Page d'accueil
 * Design: Minimalisme Spirituel Contemplatif
 * 
 * Palette: Blanc pur, Beige chaud, Or subtil, Vert forêt foncé
 * Typographie: Playfair Display (titres) + Lora (corps) + Poppins (labels)
 * Principes: Respiration maximale, asymétrie intentionnelle, absence de surcharge
 */
export default function Home() {
  useSEO({
    title: 'Plume du Deen - Produits Spirituels Islamiques | Livres Coraniques & Planners Ramadan',
    description: 'Découvrez notre collection authentique de produits spirituels islamiques. Livres coraniques, Planners Ramadan, ouvrages spirituels. Qualité, authenticité et spiritualité à votre service.',
    keywords: ['islam', 'coran', 'spirituel', 'ramadan', 'livres religieux', 'planner', 'musulman', 'quran', 'hadith', 'prière'],
    type: 'website'
  });
  // Mesurer les performances Core Web Vitals
  usePerformance();
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        <Values />
        <Products />
      </main>
      <Footer />
    </div>
  );
}

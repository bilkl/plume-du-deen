import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Values from '@/components/Values';
import Products from '@/components/Products';
import Footer from '@/components/Footer';
import { useSEO } from '@/hooks/useSEO';
import { usePerformance } from '@/hooks/usePerformance';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Plume du Deen - Page d'accueil
 * Design: Minimalisme Spirituel Contemplatif
 * 
 * Palette: Blanc pur, Beige chaud, Or subtil, Vert forêt foncé
 * Typographie: Playfair Display (titres) + Lora (corps) + Poppins (labels)
 * Principes: Respiration maximale, asymétrie intentionnelle, absence de surcharge
 */
export default function Home() {
  const { language } = useLanguage();
  const isEnglish = language === 'en';

  useSEO({
    title: isEnglish ? 'Plume du Deen - Islamic Spiritual Products | Quranic Books & Ramadan Planners' : 'Plume du Deen - Produits Spirituels Islamiques | Livres Coraniques & Planners Ramadan',
    description: isEnglish ? 'Discover our authentic collection of Islamic spiritual products. Quranic books, Ramadan planners, spiritual works, and gentle everyday reminders.' : 'Découvrez notre collection authentique de produits spirituels islamiques. Livres coraniques, Planners Ramadan, ouvrages spirituels. Qualité, authenticité et spiritualité à votre service.',
    keywords: isEnglish ? ['islam', 'quran', 'spiritual', 'ramadan', 'religious books', 'planner', 'muslim', 'dua', 'prayer'] : ['islam', 'coran', 'spirituel', 'ramadan', 'livres religieux', 'planner', 'musulman', 'quran', 'hadith', 'prière'],
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

import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Values from '@/components/Values';
import Products from '@/components/Products';
import Footer from '@/components/Footer';

/**
 * Plume du Deen - Page d'accueil
 * Design: Minimalisme Spirituel Contemplatif
 * 
 * Palette: Blanc pur, Beige chaud, Or subtil, Vert forêt foncé
 * Typographie: Playfair Display (titres) + Lora (corps) + Poppins (labels)
 * Principes: Respiration maximale, asymétrie intentionnelle, absence de surcharge
 */
export default function Home() {
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

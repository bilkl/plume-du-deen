import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Products from '@/components/Products';

export default function ProductsPage() {
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
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useRoute } from 'wouter';
import ProductDetails from '@/components/ProductDetails';
import { getProductBySlug } from '@/data/products';
import { useSEO } from '@/hooks/useSEO';
import { PageShell } from '@/components/PageLayout';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ProductPage() {
  const [, params] = useRoute<{ slug: string }>('/produit/:slug');
  const rawProduct = getProductBySlug(params?.slug);
  const { t, localizeProduct } = useLanguage();
  const product = rawProduct ? localizeProduct(rawProduct) : undefined;
  const [selectedImage, setSelectedImage] = useState(rawProduct?.image || '');

  useSEO({
    title: product
      ? `${product.name} - Plume du Deen`
      : 'Produit introuvable - Plume du Deen',
    description: product?.description || 'Découvrez les créations spirituelles de Plume du Deen.',
    keywords: product ? ['islam', 'spirituel', ...product.tags] : ['islam', 'spirituel'],
    image: product?.image,
    type: product ? 'product' : 'website'
  });

  useEffect(() => {
    if (rawProduct) {
      setSelectedImage(rawProduct.image);
    }
  }, [rawProduct]);

  if (!product) {
    return (
      <PageShell>
          <section className="py-20 md:py-32">
            <div className="container text-center space-y-6">
              <h1 className="text-4xl md:text-5xl text-foreground">
                {t('product.notFoundTitle', 'Produit introuvable')}
              </h1>
              <p className="text-lg text-muted-foreground">
                {t('product.notFoundDescription', "Cette fiche produit n'est plus disponible ou a été déplacée.")}
              </p>
              <Link href="/collection">
                <button className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-md transition-all duration-300 hover:shadow-gold hover:-translate-y-0.5">
                  {t('product.viewCollection', 'Voir la collection')}
                </button>
              </Link>
            </div>
          </section>
      </PageShell>
    );
  }

  const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];

  return (
    <PageShell>
        <section className="py-12 md:py-20 overflow-hidden">
          <div className="container">
            <Link
              href="/collection"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('common.backCollection', 'Retour à la collection')}
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div className="order-1 min-w-0 space-y-4 lg:sticky lg:top-24">
                <div className="rounded-lg border border-border/70 bg-card/88 p-3 shadow-premium">
                  <img
                    src={selectedImage || product.image}
                    alt={product.name}
                    className="block w-full max-w-full h-auto max-h-[720px] object-contain rounded-md bg-secondary/35"
                  />
                </div>

                {gallery.length > 1 && (
                  <div className="grid grid-cols-2 gap-4">
                    {gallery.map((image) => (
                      <button
                        key={image}
                        type="button"
                        onClick={() => setSelectedImage(image)}
                        className={`rounded-lg border bg-card p-2 transition-all hover:border-primary hover:shadow-md ${
                          selectedImage === image ? 'border-primary shadow-md' : 'border-border'
                        }`}
                        aria-label={`Afficher l'image ${gallery.indexOf(image) + 1}`}
                      >
                        <img
                          src={image}
                          alt=""
                          className="block w-full max-w-full aspect-[4/5] object-contain rounded-md bg-secondary/35"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="order-2 min-w-0">
                <ProductDetails product={product} />
              </div>
            </div>
          </div>
        </section>
    </PageShell>
  );
}

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CheckoutForm from '@/components/CheckoutForm';

export default function Checkout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-20 pb-12">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl text-foreground mb-4">
                Finaliser ma commande
              </h1>
              <p className="text-muted-foreground mb-4">
                Remplissez vos informations pour compléter votre achat
              </p>
              <div className="bg-muted/30 border border-border rounded-lg p-4 mb-6">
                <p className="text-sm text-foreground">
                  <strong>💡 Pas de compte requis !</strong> Vous pouvez commander en tant qu'invité.
                  Nous utiliserons votre email uniquement pour vous envoyer la confirmation de commande.
                </p>
              </div>
            </div>

            <CheckoutForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
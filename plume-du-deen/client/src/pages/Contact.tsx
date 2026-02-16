import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi');
      }

      toast.success('Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-primary">
          <div className="container">
            <div className="text-center mb-16 md:mb-20 space-y-4">
              <h1 className="text-4xl md:text-5xl text-foreground font-bold">
                Contactez-nous
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Nous sommes là pour vous accompagner dans votre cheminement spirituel.
                N'hésitez pas à nous contacter pour toute question ou suggestion.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-20">
          <div className="container">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-semibold text-foreground mb-4">
                  Contactez-nous
                </h2>
                <p className="text-muted-foreground">
                  Pour toute question ou suggestion, n'hésitez pas à nous contacter par email.
                </p>
                <div className="flex items-center justify-center gap-4 mt-6 p-4 rounded-lg bg-muted/30">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-foreground text-sm">Email</h3>
                    <p className="text-muted-foreground text-sm">contact@plume-du-deen.com</p>
                  </div>
                </div>
              </div>

              <Card className="shadow-lg">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl">Envoyez-nous un message</CardTitle>
                  <CardDescription className="text-base">
                    Remplissez le formulaire ci-dessous et nous vous répondrons dans les 24 heures.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="name" className="text-sm font-medium">Nom complet *</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="Votre nom complet"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="h-12 text-base"
                          required
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="votre.email@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="h-12 text-base"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="subject" className="text-sm font-medium">Sujet *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        placeholder="Objet de votre message"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="h-12 text-base"
                        required
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="message" className="text-sm font-medium">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Décrivez votre demande ou votre question en détail..."
                        rows={8}
                        value={formData.message}
                        onChange={handleInputChange}
                        className="text-base resize-none"
                        required
                      />
                    </div>

                    <div className="pt-4">
                      <Button
                        type="submit"
                        className="w-full h-12 text-base font-medium"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                            Envoi en cours...
                          </>
                        ) : (
                          'Envoyer le message'
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section - Plus compacte */}
        <section className="py-16 bg-muted">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold text-foreground mb-4">
                Questions fréquentes
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Trouvez rapidement des réponses à vos questions les plus courantes.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="space-y-4">
                <div className="bg-background rounded-lg p-6 shadow-sm border">
                  <h3 className="font-semibold text-foreground mb-3">Comment commander un produit ?</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Parcourez notre collection, ajoutez les articles à votre panier,
                    puis procédez au paiement. Vous recevrez un email de confirmation.
                  </p>
                </div>

                <div className="bg-background rounded-lg p-6 shadow-sm border">
                  <h3 className="font-semibold text-foreground mb-3">Quels sont les délais de livraison ?</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Les délais varient de 3 à 7 jours ouvrés en France métropolitaine,
                    et jusqu'à 10 jours pour les autres destinations.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-background rounded-lg p-6 shadow-sm border">
                  <h3 className="font-semibold text-foreground mb-3">Puis-je retourner un produit ?</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Oui, vous disposez de 14 jours pour retourner un produit.
                    Consultez notre politique de retours pour plus d'informations.
                  </p>
                </div>

                <div className="bg-background rounded-lg p-6 shadow-sm border">
                  <h3 className="font-semibold text-foreground mb-3">Comment suivre ma commande ?</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Un email de suivi vous sera envoyé dès l'expédition de votre commande,
                    avec un lien pour suivre l'acheminement en temps réel.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
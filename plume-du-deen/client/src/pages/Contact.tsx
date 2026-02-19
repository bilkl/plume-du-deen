import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, User, AtSign, MessageSquare, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { apiUrl } from '@/lib/api';

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
      const response = await fetch(apiUrl('/api/contact'), {
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
        <section className="py-20 md:py-32 relative overflow-hidden bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/images/contactbanner.jpeg)' }}>
          {/* Background overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60"></div>
          <div className="container relative z-10 flex items-center justify-center">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl text-foreground font-bold">
                Contactez-nous
              </h1>
              <p className="text-lg text-white max-w-2xl mx-auto">
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
                  <div className="text-left flex-1">
                    <h3 className="font-semibold text-foreground text-sm">Email</h3>
                    <div className="flex items-center gap-3">
                      <a href="mailto:contact@plume-du-deen.com?subject=Contact%20from%20website" className="text-primary hover:underline text-sm">
                        contact@plume-du-deen.com
                      </a>
                      <Button
                        type="button"
                        onClick={() => {
                          try {
                            navigator.clipboard?.writeText('contact@plume-du-deen.com');
                            toast.success('Adresse copiée');
                          } catch (err) {
                            console.error(err);
                            toast.error('Impossible de copier');
                          }
                        }}
                        aria-label="Copier l'adresse email"
                        className="h-8 px-2 rounded-md inline-flex items-center"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-muted-foreground text-xs mt-2">Réponse généralement sous 24 heures.</p>
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
                        <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                          <User className="w-4 h-4" /> Nom complet *
                        </Label>
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
                        <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                          <AtSign className="w-4 h-4" /> Email *
                        </Label>
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
                      <Label htmlFor="subject" className="text-sm font-medium flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" /> Sujet *
                      </Label>
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
                      <Label htmlFor="message" className="text-sm font-medium flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" /> Message *
                      </Label>
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
              <div className="flex flex-col space-y-4">
                <div className="bg-background rounded-lg p-6 shadow-sm border flex-1">
                  <h3 className="font-semibold text-foreground mb-3">Comment commander un produit ?</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Parcourez notre collection de produits numériques, ajoutez les articles à votre panier,
                    puis procédez au paiement. Vous recevrez un accès instantané par email après confirmation.
                  </p>
                </div>

                <div className="bg-background rounded-lg p-6 shadow-sm border flex-1">
                  <h3 className="font-semibold text-foreground mb-3">Comment accéder à mes achats ?</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Après paiement, vous recevrez un email avec un lien de téléchargement sécurisé
                    et vos identifiants d'accès aux ressources numériques.
                  </p>
                </div>
              </div>

              <div className="flex flex-col space-y-4">
                <div className="bg-background rounded-lg p-6 shadow-sm border flex-1">
                  <h3 className="font-semibold text-foreground mb-3">Quels formats sont disponibles ?</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Nos produits sont disponibles en PDF, ePub et formats audio,
                    compatibles avec la plupart des appareils et applications de lecture.
                  </p>
                </div>

                <div className="bg-background rounded-lg p-6 shadow-sm border flex-1">
                  <h3 className="font-semibold text-foreground mb-3">Puis-je partager mes achats ?</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Les produits numériques sont personnels. Pour partager avec d'autres,
                    nous recommandons l'achat individuel pour respecter les droits d'auteur.
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
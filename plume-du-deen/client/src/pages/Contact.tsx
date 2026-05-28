import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  AtSign,
  CheckCircle2,
  Clock3,
  Copy,
  HeartHandshake,
  Mail,
  MessageSquare,
  Send,
  Sparkles,
  User
} from 'lucide-react';
import { toast } from 'sonner';
import { apiUrl } from '@/lib/api';
import { PageShell, PremiumCard, SectionHeader } from '@/components/PageLayout';
import { useLanguage } from '@/contexts/LanguageContext';

const emailAddress = 'contact@plume-du-deen.com';

export default function Contact() {
  const { language } = useLanguage();
  const isEnglish = language === 'en';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactNotes = [
    {
      icon: Clock3,
      title: isEnglish ? 'Thoughtful reply' : 'Réponse attentionnée',
      text: isEnglish ? 'We usually reply within 24 hours.' : 'Réponse généralement sous 24 heures.'
    },
    {
      icon: HeartHandshake,
      title: isEnglish ? 'Orders & support' : 'Commandes & accompagnement',
      text: isEnglish ? 'For a product, payment, or delivery question.' : 'Pour une question produit, paiement ou réception.'
    },
    {
      icon: Sparkles,
      title: isEnglish ? 'Ideas & collaborations' : 'Idées & collaborations',
      text: isEnglish ? 'Share a suggestion or a custom request.' : 'Partagez une suggestion ou une demande particulière.'
    }
  ];

  const faqItems = [
    {
      title: isEnglish ? 'How do I order a product?' : 'Comment commander un produit ?',
      text: isEnglish
        ? 'Browse the collection, choose PDF or paper when available, add your items to the cart, then proceed to payment.'
        : 'Parcourez la collection, choisissez PDF ou papier quand le format est disponible, ajoutez vos articles au panier, puis procédez au paiement.'
    },
    {
      title: isEnglish ? 'How do I access my purchases?' : 'Comment accéder à mes achats ?',
      text: isEnglish
        ? 'Digital resources are sent by email. Paper orders are prepared manually and shipped from Switzerland to the address entered at checkout.'
        : "Les ressources numériques sont envoyées par email. Les commandes papier sont préparées manuellement et expédiées depuis la Suisse à l'adresse indiquée au paiement."
    },
    {
      title: isEnglish ? 'Which formats are available?' : 'Quels formats sont disponibles ?',
      text: isEnglish
        ? 'Products are available as PDFs, with selected new releases also offered in a very limited paper edition.'
        : 'Les produits sont disponibles en PDF, avec certaines nouveautés proposées en version papier très limitée.'
    },
    {
      title: isEnglish ? 'Can I share my purchases?' : 'Puis-je partager mes achats ?',
      text: isEnglish
        ? 'Digital products are personal. To share them, we recommend an individual purchase to respect copyright.'
        : "Les produits numériques sont personnels. Pour les partager, nous recommandons l’achat individuel afin de respecter les droits d’auteur."
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard?.writeText(emailAddress);
      toast.success(isEnglish ? 'Address copied' : 'Adresse copiée');
    } catch (err) {
      console.error(err);
      toast.error(isEnglish ? 'Unable to copy' : 'Impossible de copier');
    }
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
        throw new Error(data.error || (isEnglish ? 'Error while sending' : 'Erreur lors de l\'envoi'));
      }

      toast.success(isEnglish ? 'Message sent successfully. We will reply as soon as possible.' : 'Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(isEnglish ? 'An error occurred. Please try again.' : 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageShell mainClassName="pt-20">
      <section
        className="relative isolate overflow-hidden bg-cover bg-center bg-no-repeat pt-24 pb-20 md:pt-36 md:pb-28"
        style={{ backgroundImage: 'url(/images/contactbanner.jpeg)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/78 via-black/58 to-black/82" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.42)_100%)]" />
        <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none" style={{
          backgroundImage:
            'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'120\' height=\'120\'><filter id=\'n\'><feTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'2\'/></filter><rect width=\'100%\' height=\'100%\' filter=\'url(%23n)\' opacity=\'0.6\'/></svg>")',
        }} />

        <div className="container relative z-10">
          <div className="mx-auto max-w-[22rem] sm:max-w-3xl text-center space-y-8 reveal-soft">
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full glass-dark text-white/95 text-sm md:text-base uppercase tracking-[0.18em] font-poppins font-medium">
              <span className="w-2 h-2 rounded-full bg-accent pulse-dot" />
              Contact
            </div>
            <div className="space-y-5">
              <h1 className="mx-auto max-w-[21rem] sm:max-w-[40rem] text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.05] drop-shadow-lg">
                {isEnglish ? 'Write to us' : 'Écrivez-nous'}
                <span className="block mt-2 text-gradient-gold italic font-playfair">
                  {isEnglish ? 'with peace of mind' : 'avec douceur'}
                </span>
              </h1>
              <p className="mx-auto max-w-[21rem] md:max-w-2xl text-xl md:text-2xl text-white/90 leading-relaxed drop-shadow-md font-light">
                {isEnglish
                  ? 'A question, an order, or a special request: we are here to support you with care.'
                  : 'Une question, une commande ou une demande particulière, nous sommes là pour vous répondre avec attention.'}
              </p>
            </div>
            <div className="glass-dark rounded-full px-5 py-3 inline-flex items-center gap-2.5 max-w-[21rem] sm:max-w-full">
              <Sparkles className="w-4 h-4 text-accent" />
              <p className="text-sm md:text-base text-white/95 leading-relaxed">
                {isEnglish ? 'Response within 24 hours · Orders · Support · Suggestions' : 'Réponse sous 24h · Commandes · Support · Suggestions'}
              </p>
            </div>
            <div className="ornament mx-auto text-accent/85">
              <span className="text-base md:text-lg tracking-[0.4em] uppercase font-medium">بسم الله</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </section>

      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />

        <div className="container relative">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 xl:gap-12 items-start">
            <aside className="space-y-6 lg:sticky lg:top-28 reveal-soft">
              <SectionHeader
                align="left"
                eyebrow={isEnglish ? 'Direct contact' : 'Contact direct'}
                title={isEnglish ? 'A calm space to ask' : 'Un espace simple pour demander'}
                description={isEnglish
                  ? 'Send your message through the form or contact us directly by email. Every request is read with care.'
                  : 'Envoyez votre message via le formulaire ou contactez-nous directement par email. Chaque demande est lue avec soin.'}
              />

              <div className="relative overflow-hidden rounded-3xl border-gradient-gold p-6 md:p-7 shadow-premium">
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/10 blur-3xl" />
                <div className="relative flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary ring-1 ring-primary/15">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-poppins text-xs uppercase tracking-[0.2em] text-accent font-semibold">Email</p>
                    <a href={`mailto:${emailAddress}?subject=Contact%20Plume%20du%20Deen`} className="mt-2 block break-words text-base font-semibold text-foreground transition-colors hover:text-primary sm:text-lg">
                      {emailAddress}
                    </a>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {isEnglish ? 'Ideal for orders, product questions, and custom requests.' : 'Idéal pour les commandes, questions produits et demandes particulières.'}
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={copyEmail}
                    aria-label={isEnglish ? 'Copy email address' : "Copier l'adresse email"}
                    variant="outline"
                    className="h-10 w-10 flex-shrink-0 rounded-full p-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                {contactNotes.map((note) => {
                  const Icon = note.icon;
                  return (
                    <div key={note.title} className="rounded-2xl border border-border/70 bg-card/82 p-5 shadow-premium backdrop-blur-sm">
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/12 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">{note.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{note.text}</p>
                    </div>
                  );
                })}
              </div>
            </aside>

            <PremiumCard className="overflow-hidden p-0 reveal-soft">
              <div className="border-b border-border/70 bg-secondary/35 px-6 py-6 md:px-8">
                <p className="font-poppins text-xs uppercase tracking-[0.22em] text-accent font-semibold">
                  {isEnglish ? 'Message' : 'Message'}
                </p>
                <h2 className="mt-2 text-3xl md:text-4xl text-foreground">
                  {isEnglish ? 'Send us a message' : 'Envoyez-nous un message'}
                </h2>
                <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
                  {isEnglish ? 'Fill in the form below and we will reply as soon as possible.' : 'Remplissez le formulaire ci-dessous et nous vous répondrons dans les meilleurs délais.'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-7 p-6 md:p-8">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <User className="h-4 w-4 text-primary" /> {isEnglish ? 'Full name' : 'Nom complet'} *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder={isEnglish ? 'Your full name' : 'Votre nom complet'}
                      value={formData.name}
                      onChange={handleInputChange}
                      className="h-12 rounded-xl border-border/70 bg-secondary/35 text-base focus-visible:ring-primary/25"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <AtSign className="h-4 w-4 text-primary" /> Email *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder={isEnglish ? 'your.email@example.com' : 'votre.email@example.com'}
                      value={formData.email}
                      onChange={handleInputChange}
                      className="h-12 rounded-xl border-border/70 bg-secondary/35 text-base focus-visible:ring-primary/25"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="subject" className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <MessageSquare className="h-4 w-4 text-primary" /> {isEnglish ? 'Subject' : 'Sujet'} *
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder={isEnglish ? 'Message subject' : 'Objet de votre message'}
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="h-12 rounded-xl border-border/70 bg-secondary/35 text-base focus-visible:ring-primary/25"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="message" className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <MessageSquare className="h-4 w-4 text-primary" /> Message *
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder={isEnglish ? 'Describe your request or question in detail...' : 'Décrivez votre demande ou votre question en détail...'}
                    rows={8}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="min-h-40 resize-none rounded-xl border-border/70 bg-secondary/35 text-base focus-visible:ring-primary/25"
                    required
                  />
                </div>

                <div className="rounded-2xl border border-border/70 bg-secondary/30 p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {isEnglish
                        ? 'Your email is used only to answer your message and follow up on your request.'
                        : 'Votre email est utilisé uniquement pour répondre à votre message et assurer le suivi de votre demande.'}
                    </p>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="group relative h-14 w-full overflow-hidden rounded-full bg-accent text-base font-semibold text-accent-foreground shadow-gold transition-all duration-500 hover:bg-accent/95 hover:-translate-y-0.5"
                  disabled={isSubmitting}
                >
                  <span className="absolute inset-0 shimmer-gold opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  {isSubmitting ? (
                    <>
                      <span className="relative mr-3 h-5 w-5 animate-spin rounded-full border-b-2 border-accent-foreground" />
                      <span className="relative">{isEnglish ? 'Sending...' : 'Envoi en cours...'}</span>
                    </>
                  ) : (
                    <>
                      <Send className="relative mr-2 h-5 w-5" />
                      <span className="relative">{isEnglish ? 'Send message' : 'Envoyer le message'}</span>
                    </>
                  )}
                </Button>
              </form>
            </PremiumCard>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-secondary/35 py-20 md:py-28">
        <div className="container relative">
          <SectionHeader
            eyebrow="Support"
            title={isEnglish ? 'Frequently asked questions' : 'Questions fréquentes'}
            description={isEnglish ? 'Find quick answers before writing to us.' : 'Trouvez rapidement une réponse avant de nous écrire.'}
            className="mb-12"
          />

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {faqItems.map((item, index) => (
              <article
                key={item.title}
                className="group relative overflow-hidden rounded-3xl border border-border/70 bg-card/88 p-6 shadow-premium transition-all duration-500 hover:-translate-y-1 hover:shadow-premium-lg"
                style={{ animationDelay: `${index * 0.06}s` }}
              >
                <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-accent/10 blur-3xl transition-opacity group-hover:opacity-100" />
                <div className="relative">
                  <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

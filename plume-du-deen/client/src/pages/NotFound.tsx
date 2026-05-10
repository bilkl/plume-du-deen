import { Button } from "@/components/ui/button";
import { AlertCircle, Home } from "lucide-react";
import { useLocation } from "wouter";
import { PageShell, PremiumCard } from "@/components/PageLayout";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NotFound() {
  const [, setLocation] = useLocation();
  const { language } = useLanguage();
  const isEnglish = language === "en";

  const handleGoHome = () => {
    setLocation("/");
  };

  return (
    <PageShell>
      <section className="container flex min-h-[calc(100vh-5rem)] items-center justify-center py-16">
      <PremiumCard className="w-full max-w-lg p-8 md:p-10 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-accent/15 rounded-full animate-pulse" />
              <AlertCircle className="relative h-16 w-16 text-primary" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>

          <h2 className="text-xl font-semibold text-foreground mb-4">
            {isEnglish ? "Page not found" : "Page introuvable"}
          </h2>

          <p className="text-muted-foreground mb-8 leading-relaxed">
            {isEnglish ? "The page you are looking for does not exist or has been moved." : "La page que vous cherchez n'existe pas ou a été déplacée."}
            <br />
            {isEnglish ? "You can return home to continue your visit." : "Vous pouvez revenir à l'accueil pour poursuivre votre visite."}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={handleGoHome}
              className="px-6 py-2.5"
            >
              <Home className="w-4 h-4 mr-2" />
              {isEnglish ? "Back to home" : "Retour à l'accueil"}
            </Button>
          </div>
      </PremiumCard>
      </section>
    </PageShell>
  );
}

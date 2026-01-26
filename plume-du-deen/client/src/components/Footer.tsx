import { Mail, Instagram, Facebook } from 'lucide-react';
import { Link } from 'wouter';

// TikTok Icon Component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-16 md:py-20">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Plume du Deen</h3>
            <p className="text-sm text-secondary-foreground/80">
              Des pages pour le cœur et l’âme.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Liens rapides</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/collection" className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors">
                  Collection
                </Link>
              </li>
              <li>
                <Link href="/ramadan" className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors">
                  Ramadan
                </Link>
              </li>
              <li>
                <Link href="/apropos" className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors">
                  À propos
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Information</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/conditions-generales" className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors">
                  Conditions générales
                </Link>
              </li>
              <li>
                <Link href="/politique-confidentialite" className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/retours-remboursements" className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors">
                  Retours & Remboursements
                </Link>
              </li>
              <li>
                <Link href="/mentions-legales" className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors">
                  Mentions légales
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Nous contacter</h4>
            <div className="flex items-center gap-2 text-sm text-secondary-foreground/80 hover:text-secondary-foreground transition-colors cursor-pointer">
              <Mail className="w-4 h-4" />
              <a href="mailto:plumedudeen@gmail.com">plumedudeen@gmail.com</a>
            </div>
            <div className="flex gap-4 pt-4">
              <a href="https://www.instagram.com/plumedudeen.official" target="_blank" rel="noopener noreferrer" className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.tiktok.com/@fleurrose146" target="_blank" rel="noopener noreferrer" className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors">
                <TikTokIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-secondary-foreground/20 mb-8"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between text-sm text-secondary-foreground/70">
          <p>© 2026 Plume du Deen. Tous droits réservés.</p>
          <p>Créé avec intention et douceur</p>
        </div>
      </div>
    </footer>
  );
}

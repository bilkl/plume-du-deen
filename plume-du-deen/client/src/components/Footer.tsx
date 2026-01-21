import { Mail, Instagram, Facebook } from 'lucide-react';
import { Link } from 'wouter';

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
                <Link href="/boutique" className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors">
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
              <a href="mailto:contact@plumedudeen.fr">contact@plumedudeen.fr</a>
            </div>
            <div className="flex gap-4 pt-4">
              <a href="#" className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors">
                <Facebook className="w-5 h-5" />
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

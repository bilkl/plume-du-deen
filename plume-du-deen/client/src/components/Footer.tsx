import { Mail, Instagram } from 'lucide-react';
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
    <footer className="bg-primary text-primary-foreground pt-24 pb-12 px-4 md:px-0 relative overflow-hidden">
      {/* Decorative orbs */}
      <div className="orb orb-1 w-[28rem] h-[28rem] bg-accent/10 -top-32 -left-32"></div>
      <div className="orb orb-2 w-[24rem] h-[24rem] bg-accent/10 -bottom-24 -right-32"></div>

      <div className="container relative z-10 bg-primary/90 backdrop-blur-xl rounded-[2.5rem] p-10 md:p-16 border border-white/10 shadow-premium-lg -mt-6">
        {/* Top decorative gold line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-accent to-transparent"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
                <img src="/images/logo.png" alt="" className="h-12 w-auto drop-shadow-md brightness-0 invert" />
              </div>
              <h3 className="text-2xl font-playfair font-semibold tracking-wide">Plume du Deen</h3>
            </div>
            <p className="text-lg text-primary-foreground/75 leading-relaxed font-light italic font-playfair">
              Des pages pour le cœur et l'âme.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold tracking-wide font-playfair">Liens rapides</h4>
            <ul className="space-y-3.5 text-base">
              <li>
                <Link href="/collection" className="text-primary-foreground/75 hover:text-accent transition-colors flex items-center gap-2.5 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent/40 group-hover:bg-accent group-hover:w-3 transition-all"></span>
                  Collection
                </Link>
              </li>
              <li>
                <Link href="/ramadan" className="text-primary-foreground/75 hover:text-accent transition-colors flex items-center gap-2.5 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent/40 group-hover:bg-accent group-hover:w-3 transition-all"></span>
                  Ramadan
                </Link>
              </li>
              <li>
                <Link href="/apropos" className="text-primary-foreground/75 hover:text-accent transition-colors flex items-center gap-2.5 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent/40 group-hover:bg-accent group-hover:w-3 transition-all"></span>
                  À propos
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold tracking-wide font-playfair">Information</h4>
            <ul className="space-y-3.5 text-base">
              <li>
                <Link href="/conditions-generales" className="text-primary-foreground/75 hover:text-accent transition-colors flex items-center gap-2.5 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent/40 group-hover:bg-accent group-hover:w-3 transition-all"></span>
                  Conditions générales
                </Link>
              </li>
              <li>
                <Link href="/politique-confidentialite" className="text-primary-foreground/75 hover:text-accent transition-colors flex items-center gap-2.5 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent/40 group-hover:bg-accent group-hover:w-3 transition-all"></span>
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/retours-remboursements" className="text-primary-foreground/75 hover:text-accent transition-colors flex items-center gap-2.5 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent/40 group-hover:bg-accent group-hover:w-3 transition-all"></span>
                  Retours & Remboursements
                </Link>
              </li>
              <li>
                <Link href="/mentions-legales" className="text-primary-foreground/75 hover:text-accent transition-colors flex items-center gap-2.5 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent/40 group-hover:bg-accent group-hover:w-3 transition-all"></span>
                  Mentions légales
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold tracking-wide font-playfair">Nous contacter</h4>
            <div className="flex items-center gap-3 text-base text-primary-foreground/80 hover:text-accent transition-colors cursor-pointer p-3.5 bg-white/5 rounded-2xl border border-white/10 w-fit">
              <Mail className="w-5 h-5" />
              <a href="mailto:contact@plume-du-deen.com">contact@plume-du-deen.com</a>
            </div>
            <div className="flex gap-4 pt-2">
              <a href="https://www.instagram.com/plumedudeen.official" target="_blank" rel="noopener noreferrer" className="p-3.5 bg-white/5 rounded-full border border-white/10 text-primary-foreground/75 hover:text-primary hover:bg-accent hover:border-accent transition-all duration-300 hover:-translate-y-1" aria-label="Instagram">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="https://www.tiktok.com/@fleurrose146" target="_blank" rel="noopener noreferrer" className="p-3.5 bg-white/5 rounded-full border border-white/10 text-primary-foreground/75 hover:text-primary hover:bg-accent hover:border-accent transition-all duration-300 hover:-translate-y-1" aria-label="TikTok">
                <TikTokIcon className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between text-base text-primary-foreground/60 gap-4">
          <p>© 2026 Plume du Deen.</p>
          <div className="flex items-center gap-3">
            <span className="w-10 h-px bg-accent/60"></span>
            <p className="font-playfair italic text-base">Créé avec intention et douceur</p>
            <span className="w-10 h-px bg-accent/60"></span>
          </div>
        </div>
      </div>
    </footer>
  );
}

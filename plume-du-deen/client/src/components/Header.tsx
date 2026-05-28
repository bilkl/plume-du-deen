import { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart, Sun, Moon, Search } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useTheme } from '@/contexts/ThemeContext';
import { useCart } from '@/contexts/CartContext';
import SearchModal from './SearchModal';

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/collection', label: 'Collection' },
  { href: '/ramadan', label: 'Ramadan' },
  { href: '/contact', label: 'Contact' },
  { href: '/apropos', label: 'À propos' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { state } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const isActive = (href: string) => {
    if (href === '/') return location === '/';
    if (href === '/collection') return location === '/collection' || location.startsWith('/produit');
    return location.startsWith(href);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled
        ? 'bg-background/85 backdrop-blur-2xl border-b border-border/60 shadow-premium'
        : 'bg-background/40 backdrop-blur-md border-b border-transparent'
    }`}>
      <div className="container">
        {/* Desktop Layout */}
        <div className={`hidden lg:grid lg:grid-cols-[minmax(220px,1fr)_auto_minmax(160px,1fr)] lg:items-center transition-all duration-500 ${scrolled ? 'lg:h-20' : 'lg:h-24'}`}>
          {/* Logo */}
          <div className="flex justify-start">
            <Link href="/" className="group flex items-center gap-3 transition-opacity">
              <div className="relative">
                <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <img src="/images/logo.png" alt="Plume du Deen" className="relative h-14 w-auto drop-shadow-sm transition-transform duration-500 group-hover:scale-105" />
              </div>
              <span className="text-xl font-playfair font-semibold text-foreground whitespace-nowrap tracking-wide group-hover:text-primary transition-colors">Plume du Deen</span>
            </Link>
          </div>

          {/* Navigation Desktop */}
          <nav className="flex justify-center items-center gap-1 rounded-full border border-border/60 bg-card/60 backdrop-blur-xl px-1.5 py-1.5 shadow-premium transition-all hover:shadow-premium-lg" aria-label="Navigation principale">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative whitespace-nowrap rounded-full px-5 py-2.5 text-base font-medium transition-all duration-300 ${
                  isActive(link.href)
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-foreground/75 hover:text-primary hover:bg-secondary/60'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Icons Desktop */}
          <div className="flex justify-end items-center gap-3">
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Rechercher"
              className="p-2.5 border border-border/50 bg-card/50 hover:bg-secondary/80 hover:shadow-sm rounded-full transition-all"
            >
              <Search className="w-5 h-5 text-foreground/80" />
            </button>
            <button
              onClick={toggleTheme}
              aria-label={theme === 'light' ? 'Activer le mode sombre' : 'Activer le mode clair'}
              className="p-2.5 border border-border/50 bg-card/50 hover:bg-secondary/80 hover:shadow-sm rounded-full transition-all"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-foreground/80" />
              ) : (
                <Sun className="w-5 h-5 text-foreground/80" />
              )}
            </button>
            {/* favorites removed */}
            <Link href="/panier">
              <button className="relative p-2.5 border border-border/50 bg-card/50 hover:bg-secondary/80 hover:shadow-sm rounded-full transition-all" aria-label="Voir le panier">
                <ShoppingCart className="w-5 h-5 text-foreground/80" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-accent text-accent-foreground text-sm rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-sm animate-in zoom-in">
                    {totalItems}
                  </span>
                )}
              </button>
            </Link>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden flex h-20 w-full max-w-[24rem] items-center justify-between gap-2">
          {/* Logo */}
          <div className="flex min-w-0 flex-1 items-center">
            <Link href="/" className="flex min-w-0 items-center gap-2 hover:opacity-80 transition-opacity" onClick={() => setIsOpen(false)}>
              <img src="/images/logo.png" alt="Plume du Deen" className="h-10 w-auto flex-shrink-0 drop-shadow-sm" />
              <span className="truncate text-lg font-playfair font-semibold text-foreground tracking-wide">Plume du Deen</span>
            </Link>
          </div>

          {/* Mobile Icons */}
          <div className="flex flex-shrink-0 items-center gap-1">
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Rechercher"
              className="p-2 hover:bg-secondary/80 rounded-full transition-colors"
            >
              <Search className="w-5 h-5 text-foreground/80" />
            </button>
            <button
              onClick={toggleTheme}
              aria-label={theme === 'light' ? 'Activer le mode sombre' : 'Activer le mode clair'}
              className="p-2 hover:bg-secondary/80 rounded-full transition-colors"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-foreground/80" />
              ) : (
                <Sun className="w-5 h-5 text-foreground/80" />
            )}
            </button>
            <Link href="/panier">
              <button className="relative p-2 hover:bg-secondary/80 rounded-full transition-colors" aria-label="Voir le panier">
                <ShoppingCart className="w-5 h-5 text-foreground/80" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-accent text-accent-foreground text-[0.7rem] rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-sm">
                    {totalItems}
                  </span>
                )}
              </button>
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              className="p-2 hover:bg-secondary/80 rounded-full transition-colors"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-foreground/80" />
              ) : (
                <Menu className="w-6 h-6 text-foreground/80" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="lg:hidden pb-6 border-t border-border/60 reveal-soft" aria-label="Navigation mobile">
            <div className="flex flex-col gap-1 pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-xl text-base font-medium transition-all ${
                    isActive(link.href)
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-foreground/85 hover:bg-secondary/70 hover:text-primary'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
}

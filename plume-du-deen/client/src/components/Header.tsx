import { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart, Sun, Moon, Search } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useTheme } from '@/contexts/ThemeContext';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import SearchModal from './SearchModal';
import CurrencySwitcher from './CurrencySwitcher';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { state } = useCart();
  const { t, language } = useLanguage();
  const isEnglish = language === 'en';
  const navLinks = [
    { href: '/', label: t('nav.home', 'Accueil') },
    { href: '/collection', label: t('nav.collection', 'Collection') },
    { href: '/ramadan', label: t('nav.ramadan', 'Ramadan') },
    { href: '/contact', label: t('nav.contact', 'Contact') },
    { href: '/apropos', label: t('nav.about', 'À propos') },
  ];

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
        <div className={`hidden xl:grid xl:grid-cols-[minmax(220px,0.9fr)_auto_minmax(300px,1fr)] xl:items-center transition-all duration-500 ${scrolled ? 'xl:h-20' : 'xl:h-24'}`}>
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
          <nav className="flex justify-center items-center gap-1 rounded-full border border-border/60 bg-card/60 backdrop-blur-xl px-1.5 py-1.5 shadow-premium transition-all hover:shadow-premium-lg" aria-label={isEnglish ? 'Main navigation' : 'Navigation principale'}>
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
            <LanguageSwitcher compact />
            <CurrencySwitcher compact />
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label={t('header.search', 'Rechercher')}
              className="p-2.5 border border-border/50 bg-card/50 hover:bg-secondary/80 hover:shadow-sm rounded-full transition-all"
            >
              <Search className="w-5 h-5 text-foreground/80" />
            </button>
            <button
              onClick={toggleTheme}
              aria-label={theme === 'light' ? (isEnglish ? 'Enable dark mode' : 'Activer le mode sombre') : (isEnglish ? 'Enable light mode' : 'Activer le mode clair')}
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
              <button className="relative p-2.5 border border-border/50 bg-card/50 hover:bg-secondary/80 hover:shadow-sm rounded-full transition-all" aria-label={isEnglish ? 'View cart' : 'Voir le panier'}>
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
        <div className="xl:hidden flex h-20 w-full items-center justify-between gap-1">
          {/* Logo */}
          <div className="flex min-w-0 flex-1 items-center">
            <Link href="/" className="flex min-w-0 items-center gap-2 hover:opacity-80 transition-opacity" onClick={() => setIsOpen(false)}>
              <img src="/images/logo.png" alt="Plume du Deen" className="h-9 w-auto flex-shrink-0 drop-shadow-sm min-[360px]:h-10" />
              <span className="hidden truncate text-lg font-playfair font-semibold text-foreground tracking-wide sm:inline">Plume du Deen</span>
            </Link>
          </div>

          {/* Mobile Icons */}
          <div className="ml-auto flex flex-shrink-0 items-center gap-0.5 min-[360px]:gap-1">
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label={t('header.search', 'Rechercher')}
              className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-secondary/80 transition-colors min-[360px]:h-10 min-[360px]:w-10"
            >
              <Search className="w-5 h-5 text-foreground/80" />
            </button>
            <button
              onClick={toggleTheme}
              aria-label={theme === 'light' ? (isEnglish ? 'Enable dark mode' : 'Activer le mode sombre') : (isEnglish ? 'Enable light mode' : 'Activer le mode clair')}
              className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-secondary/80 transition-colors min-[360px]:h-10 min-[360px]:w-10"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-foreground/80" />
              ) : (
                <Sun className="w-5 h-5 text-foreground/80" />
              )}
            </button>
            <Link href="/panier">
              <button className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-secondary/80 transition-colors min-[360px]:h-10 min-[360px]:w-10" aria-label={isEnglish ? 'View cart' : 'Voir le panier'}>
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
              aria-label={isOpen ? t('header.closeMenu', 'Fermer le menu') : t('header.openMenu', 'Ouvrir le menu')}
              className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-secondary/80 transition-colors min-[360px]:h-10 min-[360px]:w-10"
            >
              {isOpen ? (
                <X className="w-5 h-5 text-foreground/80" />
              ) : (
                <Menu className="w-5 h-5 text-foreground/80" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="xl:hidden -mx-4 max-h-[calc(100vh-5rem)] overflow-y-auto border-t border-border/60 bg-background/95 px-4 pb-6 shadow-premium backdrop-blur-2xl reveal-soft" aria-label={isEnglish ? 'Mobile navigation' : 'Navigation mobile'}>
            <div className="flex flex-col gap-1 pt-4">
              <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-2 pb-3">
                <LanguageSwitcher className="w-full" />
                <CurrencySwitcher className="w-full" />
              </div>
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

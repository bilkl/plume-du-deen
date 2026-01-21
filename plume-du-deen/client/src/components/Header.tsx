import { useState } from 'react';
import { Menu, X, Heart, ShoppingCart, Sun, Moon } from 'lucide-react';
import { Link } from 'wouter';
import { useTheme } from '@/contexts/ThemeContext';
import { useCart } from '@/contexts/CartContext';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { state } = useCart();

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm z-50 border-b border-border">
      <div className="container">
        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-3 md:items-center md:h-20">
          {/* Logo */}
          <div className="flex justify-start">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img src="/images/logo.png" alt="Plume du Deen" className="h-12 w-auto" />
              <span className="text-xl font-semibold text-foreground">Plume du Deen</span>
            </Link>
          </div>

          {/* Navigation Desktop */}
          <nav className="flex justify-center gap-8">
            <Link href="/" className="text-foreground hover:text-accent transition-colors">
              Accueil
            </Link>
            <Link href="/collection" className="text-foreground hover:text-accent transition-colors">
              Collection
            </Link>
            <Link href="/ramadan" className="text-foreground hover:text-accent transition-colors">
              Ramadan
            </Link>
            <Link href="/apropos" className="text-foreground hover:text-accent transition-colors">
              À propos
            </Link>
          </nav>

          {/* Icons Desktop */}
          <div className="flex justify-end items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-secondary rounded-sm transition-colors"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-foreground" />
              ) : (
                <Sun className="w-5 h-5 text-foreground" />
              )}
            </button>
            <button className="p-2 hover:bg-secondary rounded-sm transition-colors">
              <Heart className="w-5 h-5 text-foreground" />
            </button>
            <Link href="/panier">
              <button className="relative p-2 hover:bg-secondary rounded-sm transition-colors">
                <ShoppingCart className="w-5 h-5 text-foreground" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {totalItems}
                  </span>
                )}
              </button>
            </Link>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img src="/images/logo.png" alt="Plume du Deen" className="h-10 w-auto" />
              <span className="text-lg font-semibold text-foreground">Plume du Deen</span>
            </Link>
          </div>

          {/* Mobile Icons */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-secondary rounded-sm transition-colors"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-foreground" />
              ) : (
                <Sun className="w-5 h-5 text-foreground" />
              )}
            </button>
            <Link href="/panier">
              <button className="relative p-2 hover:bg-secondary rounded-sm transition-colors">
                <ShoppingCart className="w-5 h-5 text-foreground" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {totalItems}
                  </span>
                )}
              </button>
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 hover:bg-secondary rounded-sm transition-colors"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden pb-4 border-t border-border">
            <div className="flex flex-col gap-4 pt-4">
              <Link href="/" className="text-foreground hover:text-accent transition-colors">
                Accueil
              </Link>
              <Link href="/collection" className="text-foreground hover:text-accent transition-colors">
                Collection
              </Link>
              <Link href="/ramadan" className="text-foreground hover:text-accent transition-colors">
                Ramadan
              </Link>
              <Link href="/apropos" className="text-foreground hover:text-accent transition-colors">
                À propos
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

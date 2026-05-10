import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? (scrolled / max) * 100 : 0;
      setProgress(p);
      setShowTop(scrolled > 600);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Gold scroll progress bar */}
      <div className="fixed top-0 left-0 right-0 h-[3px] z-[60] pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-accent via-[#e6c682] to-accent shadow-[0_0_12px_rgba(212,163,89,0.6)] transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Back to top button */}
      <button
        type="button"
        aria-label="Revenir en haut"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary text-primary-foreground shadow-premium-lg ring-1 ring-white/10 flex items-center justify-center transition-all duration-500 hover:bg-accent hover:text-accent-foreground hover:-translate-y-1 hover:shadow-gold ${
          showTop ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <ArrowUp className="w-5 h-5 md:w-6 md:h-6" />
      </button>
    </>
  );
}

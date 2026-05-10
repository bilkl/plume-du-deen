import { languageOptions, useLanguage, type LanguageCode } from '@/contexts/LanguageContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Languages } from 'lucide-react';

interface LanguageSwitcherProps {
  className?: string;
  compact?: boolean;
}

export default function LanguageSwitcher({ className, compact = false }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();
  const isEnglish = language === 'en';
  const currentLanguage = languageOptions.find((option) => option.code === language) || languageOptions[0];
  const languageLabel = {
    fr: isEnglish ? 'French' : 'Français',
    en: isEnglish ? 'English' : 'Anglais',
  } as const;

  return (
    <div className={cn('inline-flex min-w-0 items-center', className)}>
      <Select
        value={language}
        onValueChange={(value) => setLanguage(value as LanguageCode)}
      >
        <SelectTrigger
          aria-label={isEnglish ? 'Language' : 'Langue'}
          className={cn(
            'border-border/60 bg-card/75 text-foreground shadow-premium backdrop-blur-md transition-all hover:border-accent/50 hover:bg-secondary/65 focus-visible:ring-primary/30 data-[state=open]:border-accent/60',
            '[&_svg]:text-primary',
            compact
              ? '!h-11 min-w-[4.75rem] rounded-full px-3 text-xs font-semibold uppercase'
              : '!h-12 w-full min-w-0 rounded-2xl px-4 text-left'
          )}
        >
          <span className="flex min-w-0 items-center gap-2">
            <Languages className={compact ? 'h-4 w-4' : 'h-5 w-5'} strokeWidth={1.8} />
            <span className={cn('min-w-0', compact ? 'font-poppins tracking-[0.08em]' : 'flex flex-col leading-tight')}>
              {!compact && (
                <span className="font-poppins text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {isEnglish ? 'Language' : 'Langue'}
                </span>
              )}
              <span className={cn('truncate font-semibold', compact ? 'text-xs' : 'text-sm')}>
                {compact ? currentLanguage.label : languageLabel[currentLanguage.code]}
              </span>
            </span>
          </span>
        </SelectTrigger>
        <SelectContent
          align={compact ? 'end' : 'center'}
          className="min-w-[11rem] rounded-2xl border-border/70 bg-card/95 p-1.5 shadow-premium-lg backdrop-blur-xl"
        >
          {languageOptions.map((option) => (
            <SelectItem
              key={option.code}
              value={option.code}
              className="rounded-xl px-3 py-2.5 text-sm font-medium focus:bg-secondary/70"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-7 w-9 items-center justify-center rounded-full bg-secondary text-xs font-bold text-primary">
                  {option.label}
                </span>
                <span>{languageLabel[option.code]}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

import { currencyOptions, useCurrency, type CurrencyCode } from '@/contexts/CurrencyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { CircleDollarSign } from 'lucide-react';

interface CurrencySwitcherProps {
  className?: string;
  compact?: boolean;
}

export default function CurrencySwitcher({ className, compact = false }: CurrencySwitcherProps) {
  const { currency, setCurrency } = useCurrency();
  const { language } = useLanguage();
  const isEnglish = language === 'en';
  const currentCurrency = currencyOptions.find((option) => option.code === currency) || currencyOptions[0];
  const currencyLabel: Record<CurrencyCode, string> = {
    CHF: isEnglish ? 'Swiss franc' : 'Franc suisse',
    EUR: isEnglish ? 'Euro' : 'Euro',
    USD: isEnglish ? 'US dollar' : 'Dollar US',
  };
  const currencySymbol: Record<CurrencyCode, string> = {
    CHF: 'CHF',
    EUR: '€',
    USD: '$',
  };

  return (
    <div className={cn('inline-flex min-w-0 items-center', className)}>
      <Select
        value={currency}
        onValueChange={(value) => setCurrency(value as CurrencyCode)}
      >
        <SelectTrigger
          aria-label={isEnglish ? 'Currency' : 'Devise'}
          className={cn(
            'border-border/60 bg-card/75 text-foreground shadow-premium backdrop-blur-md transition-all hover:border-accent/50 hover:bg-secondary/65 focus-visible:ring-primary/30 data-[state=open]:border-accent/60',
            '[&_svg]:text-primary',
            compact
              ? '!h-11 min-w-[5.4rem] rounded-full px-3 text-xs font-semibold uppercase'
              : '!h-12 w-full min-w-0 rounded-2xl px-4 text-left'
          )}
        >
          <span className="flex min-w-0 items-center gap-2">
            <CircleDollarSign className={compact ? 'h-4 w-4' : 'h-5 w-5'} strokeWidth={1.8} />
            <span className={cn('min-w-0', compact ? 'font-poppins tracking-[0.08em]' : 'flex flex-col leading-tight')}>
              {!compact && (
                <span className="font-poppins text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {isEnglish ? 'Currency' : 'Devise'}
                </span>
              )}
              <span className={cn('truncate font-semibold', compact ? 'text-xs' : 'text-sm')}>
                {currentCurrency.code}
              </span>
            </span>
          </span>
        </SelectTrigger>
        <SelectContent
          align={compact ? 'end' : 'center'}
          className="min-w-[12rem] rounded-2xl border-border/70 bg-card/95 p-1.5 shadow-premium-lg backdrop-blur-xl"
        >
          {currencyOptions.map((option) => (
            <SelectItem
              key={option.code}
              value={option.code}
              className="rounded-xl px-3 py-2.5 text-sm font-medium focus:bg-secondary/70"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-7 w-10 items-center justify-center rounded-full bg-secondary text-xs font-bold text-primary">
                  {currencySymbol[option.code]}
                </span>
                <span className="flex min-w-0 flex-col leading-tight">
                  <span>{option.code}</span>
                  <span className="text-xs font-normal text-muted-foreground">{currencyLabel[option.code]}</span>
                </span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

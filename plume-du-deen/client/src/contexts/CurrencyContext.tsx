import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

export type CurrencyCode = 'CHF' | 'EUR' | 'USD';

export const currencyOptions: Array<{ code: CurrencyCode; label: string }> = [
  { code: 'CHF', label: 'CHF' },
  { code: 'EUR', label: 'EUR' },
  { code: 'USD', label: 'USD' },
];

const STORAGE_KEY = 'plume-du-deen-currency';

// Storefront conversion rates from CHF. Keep CHF as the source price.
const ratesFromChf: Record<CurrencyCode, number> = {
  CHF: 1,
  EUR: 1.05,
  USD: 1.15,
};

function normalizeCurrency(value: string | null): CurrencyCode {
  return value === 'EUR' || value === 'USD' || value === 'CHF' ? value : 'CHF';
}

function isEnglishLanguage() {
  return typeof window !== 'undefined' && localStorage.getItem('plume-du-deen-language') === 'en';
}

function formatCurrencyValue(amount: number, currency: CurrencyCode) {
  return new Intl.NumberFormat(isEnglishLanguage() ? 'en-US' : 'fr-FR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

interface CurrencyContextValue {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  convertPrice: (amountChf: number) => number;
  formatPrice: (amountChf: number | null | undefined, fallback?: string) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    if (typeof window === 'undefined') return 'CHF';
    return normalizeCurrency(localStorage.getItem(STORAGE_KEY));
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, currency);
  }, [currency]);

  const value = useMemo<CurrencyContextValue>(() => {
    const convertPrice = (amountChf: number) => {
      return Number((amountChf * ratesFromChf[currency]).toFixed(2));
    };

    return {
      currency,
      setCurrency: setCurrencyState,
      convertPrice,
      formatPrice: (amountChf, fallback = isEnglishLanguage() ? 'Price to confirm' : 'Prix à confirmer') => {
        if (amountChf === null || amountChf === undefined) return fallback;
        if (amountChf === 0) return isEnglishLanguage() ? 'Free' : 'Offert';
        return formatCurrencyValue(convertPrice(amountChf), currency);
      },
    };
  }, [currency]);

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}

export function formatPaymentAmount(amount: number, currency: CurrencyCode) {
  if (amount === 0) return isEnglishLanguage() ? 'Free' : 'Offert';
  return formatCurrencyValue(amount, currency);
}

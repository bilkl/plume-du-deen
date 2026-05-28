import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import type { StoreProduct } from '@/data/products';

export type LanguageCode = 'fr' | 'en';

export const languageOptions: Array<{ code: LanguageCode; label: string }> = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
];

const STORAGE_KEY = 'plume-du-deen-language';

const en: Record<string, string> = {
  'nav.home': 'Home',
  'nav.collection': 'Collection',
  'nav.ramadan': 'Ramadan',
  'nav.contact': 'Contact',
  'nav.about': 'About',
  'common.backHome': 'Back to home',
  'common.backCollection': 'Back to collection',
  'common.legalDocument': 'Legal document',
  'common.lastUpdated': 'Last updated',
  'common.discover': 'Discover',
  'common.free': 'Free',
  'common.askAvailability': 'Ask about availability',
  'common.priceToConfirm': 'Price to confirm',
  'common.addToCart': 'Add to cart',
  'common.format': 'Format',
  'common.price': 'Price',
  'common.paperLimited': 'Very limited paper',
  'common.pdf': 'PDF',
  'common.new': 'New',
  'common.quantity': 'Quantity',
  'common.currency': 'Currency',
  'header.search': 'Search',
  'header.openMenu': 'Open menu',
  'header.closeMenu': 'Close menu',
  'hero.eyebrow': 'Spiritual stationery & everyday reminders',
  'hero.title1': 'Nurture your faith,',
  'hero.title2': 'one page at a time',
  'hero.description': 'Spiritual creations in PDF and limited paper editions to nurture faith with gentleness.',
  'hero.badge': 'PDF available · Very limited paper edition · Sadaqa jariya with every sale',
  'hero.collectionCta': 'Discover the collection',
  'hero.intentCta': 'Our intention',
  'values.eyebrow': 'Our commitment',
  'values.title': 'Designed with meaning',
  'values.description': 'Each creation is designed with care to support everyday faith.',
  'values.intent.title': 'Products made with intention',
  'values.intent.description': 'Tools created to support a real spiritual gesture, without adding noise to daily life.',
  'values.ritual.title': 'Simple daily rituals',
  'values.ritual.description': 'Formats that are easy to return to after prayer, during reading, or in a quiet moment.',
  'values.gift.title': 'Useful formats & gift ideas',
  'values.gift.description': 'Creations to keep close, offer as a gift, or place in a space of remembrance.',
  'collection.eyebrow': 'Plume du Deen collection',
  'collection.title': 'For your faith',
  'collection.description': 'Creations that guide your everyday life.',
  'collection.availabilityTitle': 'New creations available',
  'collection.availabilityDescription': 'Our creations are offered as PDFs, with a very limited paper edition for new releases.',
  'collection.sadaqa': 'Sadaqa jariya',
  'collection.donation': 'CHF 1 will be donated to sadaqa jariya causes for every sale.',
  'collection.showing': 'creations displayed',
  'collection.showingOne': 'creation displayed',
  'collection.filter.all': 'All',
  'collection.filter.new': 'New',
  'collection.filter.paper': 'Limited paper',
  'collection.filter.paid': 'Paid PDFs',
  'collection.filter.free': 'Free',
  'product.notFoundTitle': 'Product not found',
  'product.notFoundDescription': 'This product page is no longer available or has been moved.',
  'product.viewCollection': 'View collection',
  'product.digitalVersion': 'Digital version',
  'product.paperVersion': 'Very limited paper',
  'product.descriptionTitle': 'Detailed description',
  'product.featuresTitle': 'Features',
  'product.availabilityDefault': 'Digital version - PDF',
  'cart.emptyTitle': 'Your cart is empty',
  'cart.emptyDescription': 'Discover our spiritual creations and add them to your cart.',
  'cart.viewCollection': 'View the collection',
  'cart.title': 'Your cart',
  'cart.description': 'Review your selected creations before finalizing your order.',
  'cart.summary': 'Summary',
  'cart.subtotal': 'Subtotal',
  'cart.delivery': 'Delivery',
  'cart.deliveryFree': 'Free',
  'cart.deliveryCheckout': 'Calculated at checkout from Switzerland',
  'cart.total': 'Total',
  'cart.totalBeforeShipping': 'Total before shipping',
  'cart.shippingNotice': 'Paper versions are shipped manually from Switzerland. Exact shipping fees are added at checkout according to the destination country.',
  'cart.checkout': 'Proceed to payment',
  'cart.continue': 'Continue shopping',
  'checkout.summary': 'Order summary',
  'checkout.items': 'item(s)',
  'checkout.customerInfo': 'Delivery information',
  'checkout.customerDescription': 'Fill in your details to complete your order',
  'checkout.firstName': 'First name',
  'checkout.lastName': 'Last name',
  'checkout.email': 'Email',
  'checkout.paymentMethod': 'Payment method',
  'checkout.card': 'Credit card',
  'checkout.paypal': 'PayPal',
  'checkout.otherPayment': 'Other payment method (Orange Money, etc.)',
  'checkout.freeOrder': 'Free order',
  'checkout.noPayment': 'No payment required',
  'checkout.freeNotice': 'You will receive your ebook by email after submitting the form.',
  'checkout.submitFree': 'Confirm free order',
  'checkout.continuePayment': 'Continue to payment',
  'checkout.securePayment': 'Secure payment',
  'checkout.cardDescription': 'Your payment information is encrypted and secure',
  'checkout.paypalDescription': 'Payment via PayPal',
  'checkout.emptyTitle': 'Your cart is empty',
  'checkout.emptyDescription': 'Add products to your cart before proceeding to payment.',
  'footer.tagline': 'Pages for the heart and soul.',
  'footer.quickLinks': 'Quick links',
  'footer.information': 'Information',
  'footer.contact': 'Contact us',
  'footer.terms': 'Terms and conditions',
  'footer.privacy': 'Privacy policy',
  'footer.returns': 'Returns & refunds',
  'footer.legal': 'Legal notice',
  'footer.made': 'Created with intention and gentleness',
};

const productTranslations: Record<number, Partial<StoreProduct>> = {
  1: {
    name: 'Invocations from the Quran',
    title: 'Invocations from the Quran',
    subtitle: 'New',
    description: 'A set of 30 cards with Quranic invocations to accompany your everyday life.',
    longDescription: `A set of 30 cards with Quranic invocations to accompany your everyday life.
Each card includes a precious invocation from the Quran, a clear translation, and a spiritual reflection to guide your daily practice.

This unique collection brings together some of the most powerful and frequently used invocations from the Quran, presented in an elegant and accessible way.

Whether you are beginning or deepening your practice, these cards can accompany your moments of prayer, meditation, and remembrance.`,
    category: 'Invocations',
    availabilityNote: 'Digital version - PDF.',
    features: [
      '30 selected invocation cards',
      'Clear and accessible translations',
      'Guided spiritual reflections',
      'Elegant and sober design',
      'Practical format',
      'High-quality presentation'
    ],
  },
  2: {
    name: 'Ramadan ALIF Planner',
    title: 'Ramadan ALIF Planner',
    subtitle: 'Free',
    description: 'A guided 30-day ritual to transform Ramadan from within.',
    category: 'Spiritual organization',
    availabilityNote: 'Digital version - free PDF.',
    features: [
      '30 days of spiritual guidance',
      'Daily Quranic invocations',
      'Prayer and reading tracker',
      'Personal reflection space',
      'Daily goals',
      'Elegant and practical design'
    ],
  },
  3: {
    name: 'The 99 Names of Allah',
    title: 'The 99 Names of Allah',
    subtitle: 'Gift idea',
    description: "Connect with Allah's Names through 99 spiritual cards.",
    category: 'Spiritual knowledge',
    availabilityNote: 'Digital version - PDF.',
    features: [
      "99 cards with Allah's Names",
      'Detailed meanings',
      'Associated invocations',
      'Spiritual reflections',
      'Meditative and elegant design',
      'Practical format'
    ],
  },
  4: {
    name: 'Invocations of the Prophets',
    title: 'Invocations of the Prophets',
    subtitle: 'The essentials of the heart',
    description: "A daily companion to slow down, recentre, and place your words in Allah's hands.",
    longDescription: `In the silence of a sincere moment, this book becomes a refuge.
An invitation to slow down, recentre, and place your words in Allah's hands with gentleness and trust.

Designed as a daily companion, Invocations of the Prophets gathers inspired words transmitted through prophetic stories. Each page is a breath. Each invocation, a light.

Its clean ivory design with delicate golden details evokes purity and the nobility of remembrance. It naturally fits into your most precious moments: after prayer, upon waking, before sleep, or during quiet reflection.

Soft to the touch and soothing to the eye, it invites deep connection without distraction.`,
    category: 'Invocations',
    availabilityNote: 'Available as a PDF and in a very limited paper edition.',
    features: [
      'Invocations from prophetic stories',
      'A spiritual companion for moments of remembrance',
      'Ivory design with delicate golden details',
      'Gentle reading after prayer, upon waking, or before sleep',
      'PDF version available',
      'Very limited paper edition'
    ],
  },
  5: {
    name: 'Worship Tracker',
    title: 'Worship Tracker',
    subtitle: 'Elegant spiritual board',
    description: 'A refined board to track prayers, Quran reading, dhikr, invocations, and good deeds.',
    category: 'Spiritual organization',
    availabilityNote: 'Available as a PDF and in a very limited paper edition. Erasable pen included.',
    features: [
      'Tracks Fajr, Dhuhr, Asr, Maghrib, and Isha',
      'Spaces for Quran, dhikr, and invocations',
      'Daily good deeds section',
      'Soft cream and gold design',
      'Erasable pen included',
      'Very limited paper edition'
    ],
  },
  6: {
    name: 'Spiritual Door Hanger',
    title: 'Spiritual Door Hanger',
    subtitle: 'Protected moment',
    description: 'A gentle and elegant door hanger to protect your moments of Quran, prayer, and reflection.',
    category: 'Spiritual decor',
    availabilityNote: 'Price per hanger. Available in a very limited paper edition.',
    features: [
      'Two messages: Quran reading or prayer time',
      'Peaceful visuals with Quran, prayer beads, lantern, and spiritual decor',
      'Soft beige, sage green, and golden tones',
      'Ideal for preserving a focused moment',
      'Designed to hang directly on a door',
      'Very limited paper edition'
    ],
  },
  7: {
    name: 'Invocation Bookmarks',
    title: 'Invocation Bookmarks',
    subtitle: 'Sparks of remembrance',
    description: 'Delicate bookmarks with Arabic invocations to turn each reading pause into remembrance.',
    category: 'Spiritual stationery',
    availabilityNote: 'Price per bookmark. Available in a very limited paper edition.',
    features: [
      'Arabic invocations beautifully highlighted',
      'Natural tones: sage green, powder beige, and pearl grey',
      'Clean finish with an elegant tassel',
      'Suitable for a Mushaf or spiritual reading',
      'A discreet companion for moments of remembrance',
      'Very limited paper edition'
    ],
  },
};

function normalizeLanguage(value: string | null): LanguageCode {
  return value === 'en' || value === 'fr' ? value : 'fr';
}

interface LanguageContextValue {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: string, fallback: string) => string;
  localizeProduct: (product: StoreProduct) => StoreProduct;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    if (typeof window === 'undefined') return 'fr';
    return normalizeLanguage(localStorage.getItem(STORAGE_KEY));
  });

  const setLanguage = (nextLanguage: LanguageCode) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, nextLanguage);
      document.documentElement.lang = nextLanguage;
    }
    setLanguageState(nextLanguage);
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<LanguageContextValue>(() => ({
    language,
    setLanguage,
    t: (key, fallback) => (language === 'en' ? en[key] || fallback : fallback),
    localizeProduct: (product) => {
      if (language !== 'en') return product;
      return {
        ...product,
        ...productTranslations[product.id],
      };
    },
  }), [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

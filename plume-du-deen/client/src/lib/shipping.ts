export type ShippingDestinationZone = 'CH' | 'EUROPE' | 'WORLD'

type CartFormatItem = {
  format?: string
}

export interface ShippingCountryOption {
  code: string
  labelFr: string
  labelEn: string
  zone: ShippingDestinationZone
}

export interface ShippingSummary {
  required: boolean
  originCountry: 'CH'
  originLabel: string
  countryCode: string
  countryLabel: string
  zone: ShippingDestinationZone
  method: 'manual_from_switzerland'
  amountChf: number
  amount: number
  preparation: string
  estimate: string
  label: string
}

export const SHIPPING_ORIGIN_COUNTRY = 'CH'
export const SHIPPING_ORIGIN_LABEL = 'Suisse'
export const SHIPPING_PREPARATION = '3 à 5 jours ouvrés'

export const SHIPPING_RATES_CHF: Record<ShippingDestinationZone, number> = {
  CH: 3.9,
  EUROPE: 9.9,
  WORLD: 14.9,
}

export const SHIPPING_COUNTRIES: ShippingCountryOption[] = [
  { code: 'CH', labelFr: 'Suisse', labelEn: 'Switzerland', zone: 'CH' },
  { code: 'FR', labelFr: 'France', labelEn: 'France', zone: 'EUROPE' },
  { code: 'BE', labelFr: 'Belgique', labelEn: 'Belgium', zone: 'EUROPE' },
  { code: 'LU', labelFr: 'Luxembourg', labelEn: 'Luxembourg', zone: 'EUROPE' },
  { code: 'DE', labelFr: 'Allemagne', labelEn: 'Germany', zone: 'EUROPE' },
  { code: 'IT', labelFr: 'Italie', labelEn: 'Italy', zone: 'EUROPE' },
  { code: 'AT', labelFr: 'Autriche', labelEn: 'Austria', zone: 'EUROPE' },
  { code: 'OTHER', labelFr: 'Autre pays', labelEn: 'Other country', zone: 'WORLD' },
]

const SHIPPING_ESTIMATES_FR: Record<ShippingDestinationZone, string> = {
  CH: 'Préparation 3 à 5 jours ouvrés, puis livraison suisse estimée 2 à 5 jours ouvrés.',
  EUROPE: 'Préparation 3 à 5 jours ouvrés, puis livraison Europe estimée 5 à 10 jours ouvrés.',
  WORLD: 'Préparation 3 à 5 jours ouvrés, puis livraison internationale estimée 7 à 15 jours ouvrés.',
}

const SHIPPING_ESTIMATES_EN: Record<ShippingDestinationZone, string> = {
  CH: 'Prepared in 3 to 5 business days, then estimated Swiss delivery in 2 to 5 business days.',
  EUROPE: 'Prepared in 3 to 5 business days, then estimated European delivery in 5 to 10 business days.',
  WORLD: 'Prepared in 3 to 5 business days, then estimated international delivery in 7 to 15 business days.',
}

export function cartRequiresShipping(items: CartFormatItem[]) {
  return items.some((item) => item.format === 'paper')
}

export function getShippingCountry(countryCode = 'CH') {
  return SHIPPING_COUNTRIES.find((country) => country.code === countryCode) || SHIPPING_COUNTRIES[0]
}

export function getShippingZone(countryCode = 'CH'): ShippingDestinationZone {
  return getShippingCountry(countryCode).zone
}

export function getShippingRateChf(countryCode = 'CH') {
  return SHIPPING_RATES_CHF[getShippingZone(countryCode)]
}

export function resolveShippingCountryLabel(countryCode = 'CH', countryOther = '', isEnglish = false) {
  if (countryCode === 'OTHER' && countryOther.trim()) {
    return countryOther.trim()
  }

  const country = getShippingCountry(countryCode)
  return isEnglish ? country.labelEn : country.labelFr
}

export function buildShippingSummary({
  items,
  countryCode = 'CH',
  countryOther = '',
  convertPrice,
  isEnglish = false,
}: {
  items: CartFormatItem[]
  countryCode?: string
  countryOther?: string
  convertPrice: (amountChf: number) => number
  isEnglish?: boolean
}): ShippingSummary {
  const required = cartRequiresShipping(items)
  const zone = getShippingZone(countryCode)
  const amountChf = required ? getShippingRateChf(countryCode) : 0

  return {
    required,
    originCountry: SHIPPING_ORIGIN_COUNTRY,
    originLabel: SHIPPING_ORIGIN_LABEL,
    countryCode,
    countryLabel: resolveShippingCountryLabel(countryCode, countryOther, isEnglish),
    zone,
    method: 'manual_from_switzerland',
    amountChf,
    amount: convertPrice(amountChf),
    preparation: SHIPPING_PREPARATION,
    estimate: isEnglish ? SHIPPING_ESTIMATES_EN[zone] : SHIPPING_ESTIMATES_FR[zone],
    label: isEnglish ? 'Manual shipment from Switzerland' : 'Expédition manuelle depuis la Suisse',
  }
}

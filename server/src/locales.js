// Lingue dell'interfaccia (non dei linguaggi di programmazione: quelli stanno in languages.js).
export const LOCALES = ['it', 'en'];
export const DEFAULT_LOCALE = 'it';

export function pickLocale(value) {
  return LOCALES.includes(value) ? value : DEFAULT_LOCALE;
}

// Un testo localizzabile è una stringa (uguale in tutte le lingue) oppure { it, en }.
export function localize(value, locale) {
  return typeof value === 'string' ? value : value[locale];
}

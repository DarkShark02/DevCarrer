import { createContext, useContext, useMemo } from 'react';
import { LOCALES, STRINGS } from './strings.js';

export { LOCALES };

const STORAGE_KEY = 'devcareer:locale';

export function loadLocale() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return LOCALES.some((l) => l.id === saved) ? saved : null;
  } catch {
    return null;
  }
}

export function saveLocale(locale) {
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    /* storage non disponibile: la scelta vale solo per questa sessione */
  }
}

const I18nContext = createContext(null);

export function I18nProvider({ locale, children }) {
  const value = useMemo(() => {
    const dict = STRINGS[locale];
    const t = (key, vars = {}) =>
      (dict[key] ?? key).replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? `{${name}}`);
    return { locale, t };
  }, [locale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}

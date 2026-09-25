import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import LanguagePicker from './LanguagePicker.jsx';
import { I18nProvider, loadLocale, saveLocale } from './i18n/index.jsx';
import { setApiLocale } from './api.js';
import './styles.css';

function Root() {
  const [locale, setLocale] = useState(loadLocale);

  function changeLocale(next) {
    saveLocale(next);
    setLocale(next);
  }

  if (!locale) return <LanguagePicker onPick={changeLocale} />;

  // Impostata prima del render di App, così le sue richieste partono già nella lingua giusta.
  setApiLocale(locale);
  document.documentElement.lang = locale;
  return (
    <I18nProvider locale={locale}>
      <App onChangeLocale={changeLocale} />
    </I18nProvider>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);

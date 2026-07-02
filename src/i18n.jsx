import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationRU from './locales/ru.json';
import translationRO from './locales/ro.json';
import translationEN from './locales/en.json';

const STORAGE_KEY = 'tsv_language';
const SUPPORTED_LANGS = ['ru', 'ro', 'en'];

function getStoredLanguage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED_LANGS.includes(stored)) return stored;
  } catch {
    // localStorage недоступен (приватный режим и т.д.)
  }
  return 'ru';
}

function persistLanguage(lng) {
  const code = String(lng || '').split('-')[0];
  if (!SUPPORTED_LANGS.includes(code)) return;
  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch {
    // ignore
  }
}

const resources = {
  ru: { translation: translationRU },
  ro: { translation: translationRO },
  en: { translation: translationEN },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getStoredLanguage(),
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false
    }
  });

i18n.on('languageChanged', persistLanguage);

export default i18n;
import enTranslation from './locales/en/translation.json';
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import uaTranslation from './locales/ua/translation.json';

export const LANG_KEY = 'LANG_KEY'

const lang = localStorage.getItem(LANG_KEY) ?? "en"

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: enTranslation },
            ua: { translation: uaTranslation },
        },
        lng: lang,
        fallbackLng: lang,
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
import i18n from "i18next";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import translationEN from "./App/locales/en/translation.json";
import translationHI from "./App/locales/hi/translation.json";
import translationTE from "./App/locales/te/translation.json";

const resources = {
  en: {
    translation: translationEN
  },
  hi: {
    translation: translationHI
  },
  te: {
    translation: translationTE
  }
};

console.log(i18n, "i18n");

i18n
  // load translation using http -> see /public/locales
  // learn more: https://github.com/i18next/i18next-http-backend
  .use(Backend)
  // pass the i18n instance to react-i18next.
  .use(LanguageDetector)
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources,
    fallbackLng: "en",
    lng: "en",
    debug: false,
    interpolation: {
      escapeValue: false // not needed for react as it escapes by default
    }
  });

export default i18n;

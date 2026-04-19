import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Cookies from "js-cookie";

// Import translation files
import enTranslations from "./locales/en.json";
import arTranslations from "./locales/ar.json";
import frTranslations from "./locales/fr.json";

const resources = {
  en: {
    translation: enTranslations,
  },
  ar: {
    translation: arTranslations,
  },
  fr: {
    translation: frTranslations,
  },
};

// Helper function to get initial language - always default to Arabic
const getInitialLanguage = (): string => {
  const cookieLang = Cookies.get("i18nextLng");
  if (cookieLang && ["en", "ar", "fr"].includes(cookieLang)) {
    return cookieLang;
  }

  // Always default to Arabic if no cookie is set
  return "ar";
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: "ar",
    debug: process.env.NODE_ENV === "development",

    interpolation: {
      escapeValue: false, // React already does escaping
    },

    detection: {
      order: ["cookie", "localStorage", "navigator", "htmlTag"],
      lookupCookie: "i18nextLng",
      cookieMinutes: 525600, // 1 year (365 days * 24 hours * 60 minutes)
      caches: ["cookie", "localStorage"],
    },
  });

// Save language changes to cookie
i18n.on("languageChanged", (lng) => {
  Cookies.set("i18nextLng", lng, {
    expires: 365,
    sameSite: "strict",
    path: "/",
  });
});

export default i18n;

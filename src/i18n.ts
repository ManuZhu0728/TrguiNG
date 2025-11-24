import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const require: any;

const resources: Record<string, { translation: unknown }> = {};
export const availableLanguages: string[] = [];

try {
  const context = require.context("./locales", false, /\.json$/);
  context.keys().forEach((key: string) => {
    const langCode = key.replace("./", "").replace(".json", "");
    resources[langCode] = {
      translation: context(key),
    };
    availableLanguages.push(langCode);
  });
} catch (e) {
  console.error("Failed to load locales via require.context", e);
}

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: availableLanguages,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["querystring", "localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;

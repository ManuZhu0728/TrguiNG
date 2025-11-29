import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

declare const require: any; // eslint-disable-line @typescript-eslint/no-explicit-any

const resources: Record<string, { translation: any }> = {};  // eslint-disable-line @typescript-eslint/no-explicit-any
export const availableLanguages: string[] = [];

try {
    const context = require.context("./locales", false, /\.json$/);
    const seenLangs = new Set<string>();
    context.keys().forEach((key: string) => {
        const fileName = key.split("/").pop();
        if (fileName) {
            const langCode = fileName.replace(".json", "");
            if (!seenLangs.has(langCode)) {
                seenLangs.add(langCode);
                resources[langCode] = {
                    translation: context(key),
                };
                availableLanguages.push(langCode);
            }
        }
    });
} catch (e) {
    console.error("Failed to load locales via require.context", e);
}

void i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: {
            "zh": ["zh-CN"],
            "zh-Hans": ["zh-CN"],
            "zh-SG": ["zh-CN"],
            "zh-Hant": ["zh-TW"],
            "zh-HK": ["zh-TW"],
            "zh-MO": ["zh-TW"],
            "ru": ["ru"],
            "ru-BY": ["ru"],
            "ru-KZ": ["ru"],
            "ru-UA": ["ru"],
            "default": ["en"],
        },
        supportedLngs: availableLanguages,
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ["querystring", "localStorage", "navigator"],
            caches: [],
        },
    });

export default i18n;

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      "app.title": "TrguiNG",
      "toolbar.createTorrent": "Create torrent",
      "toolbar.configureServers": "Configure servers",
      "toolbar.switchServer": "Switch server",
      "toolbar.createTorrentWithHotkey":
        "Create new torrent file ({{hotkey}} + T)",
    },
  },
  zh: {
    translation: {
      "app.title": "TrguiNG 远程管理",
      "toolbar.createTorrent": "创建种子",
      "toolbar.configureServers": "配置服务器",
      "toolbar.switchServer": "切换服务器",
      "toolbar.createTorrentWithHotkey": "创建新的种子文件（{{hotkey}} + T）",
    },
  },
} as const;

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: ["en", "zh"],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["querystring", "localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;

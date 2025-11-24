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
      "toolbar.addTorrentFile": "Add torrent file",
      "toolbar.addMagnetLink": "Add magnet link",
      "toolbar.startTorrent": "Start torrent (F3)",
      "toolbar.pauseTorrent": "Pause torrent (F4)",
      "toolbar.removeTorrent": "Remove torrent (del)",
      "toolbar.moveUpQueue": "Move up in queue",
      "toolbar.moveDownQueue": "Move down in queue",
      "toolbar.moveTorrent": "Move torrent (F6)",
      "toolbar.setLabels": "Set labels (F7)",
      "toolbar.setPriority": "Set priority",
      "toolbar.priorityHigh": "High",
      "toolbar.priorityNormal": "Normal",
      "toolbar.priorityLow": "Low",
      "toolbar.altSpeedOn": "Turn alternative bandwidth mode on (F8)",
      "toolbar.altSpeedOff": "Turn alternative bandwidth mode off (F8)",
      "toolbar.searchPlaceholder": "search ({{hotkey}} + f)",
      "toolbar.searchHint":
        "search by name or path:somepath or label:somelabel",
      "toolbar.clearSearch": "Clear",
      "toolbar.layoutMenu": "Layout",
      "toolbar.changeLayout": "Change layout",
      "toolbar.toggleFilters": "Toggle filters",
      "toolbar.toggleDetails": "Toggle details",
      "toolbar.toggleTabStrip": "Toggle tab strip",
      "toolbar.interfaceSettings": "Interface settings",
      "toolbar.exportSettings": "Export",
      "toolbar.importSettings": "Import",
      "toolbar.daemonSettings": "Polling intervals and server settings (F9)",
    },
  },
  zh: {
    translation: {
      "app.title": "TrguiNG 远程管理",
      "toolbar.createTorrent": "创建种子",
      "toolbar.configureServers": "配置服务器",
      "toolbar.switchServer": "切换服务器",
      "toolbar.createTorrentWithHotkey": "创建新的种子文件（{{hotkey}} + T）",
      "toolbar.addTorrentFile": "添加种子文件",
      "toolbar.addMagnetLink": "添加磁力链接",
      "toolbar.startTorrent": "开始种子 (F3)",
      "toolbar.pauseTorrent": "暂停种子 (F4)",
      "toolbar.removeTorrent": "删除种子 (Del)",
      "toolbar.moveUpQueue": "在队列中上移",
      "toolbar.moveDownQueue": "在队列中下移",
      "toolbar.moveTorrent": "移动种子 (F6)",
      "toolbar.setLabels": "设置标签 (F7)",
      "toolbar.setPriority": "设置优先级",
      "toolbar.priorityHigh": "高",
      "toolbar.priorityNormal": "正常",
      "toolbar.priorityLow": "低",
      "toolbar.altSpeedOn": "开启备用带宽模式 (F8)",
      "toolbar.altSpeedOff": "关闭备用带宽模式 (F8)",
      "toolbar.searchPlaceholder": "搜索（{{hotkey}} + f）",
      "toolbar.searchHint": "按名称、路径 path:某路径 或标签 label:某标签 搜索",
      "toolbar.clearSearch": "清空",
      "toolbar.layoutMenu": "布局",
      "toolbar.changeLayout": "切换布局",
      "toolbar.toggleFilters": "显示/隐藏筛选面板",
      "toolbar.toggleDetails": "显示/隐藏详情面板",
      "toolbar.toggleTabStrip": "显示/隐藏标签栏",
      "toolbar.interfaceSettings": "界面设置",
      "toolbar.exportSettings": "导出设置",
      "toolbar.importSettings": "导入设置",
      "toolbar.daemonSettings": "轮询间隔与服务器设置 (F9)",
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

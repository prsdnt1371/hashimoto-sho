import { createContext, useContext, useEffect, useMemo, useState } from "react";

const SUPPORTED = ["ja", "en"];
const STORAGE_KEY = "portfolio-lang";

// ?lang=en のようにURLで言語を指定できる → 保存済みの設定 → ブラウザの言語 → 日本語
const detectInitialLang = () => {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get("lang");
    if (SUPPORTED.includes(fromUrl)) return fromUrl;
  } catch (_) {}
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (SUPPORTED.includes(saved)) return saved;
  } catch (_) {}
  const nav = (navigator.language || "ja").toLowerCase();
  return nav.startsWith("ja") ? "ja" : "en";
};

const LangContext = createContext({ lang: "ja", setLang: () => {}, t: (v) => v });

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(detectInitialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch (_) {}
  }, [lang]);

  // t({ ja: "…", en: "…" }) → 現在の言語の値。文字列や配列はそのまま返す
  const value = useMemo(() => {
    const t = (v) => {
      if (v && typeof v === "object" && !Array.isArray(v) && ("ja" in v || "en" in v)) {
        return v[lang] ?? v.ja ?? v.en;
      }
      return v;
    };
    return { lang, setLang, t };
  }, [lang]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
};

export const useLang = () => useContext(LangContext);

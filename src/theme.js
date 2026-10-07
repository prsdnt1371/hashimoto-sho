// ============================================================
//  配色テーマ
//  使うテーマは src/constants/index.js の siteTheme で指定します。
//  URL に ?theme=terracotta のように付けると一時的に他のテーマを試せます。
//  色は "R G B"（0–255）で書きます。
// ============================================================
import { siteTheme } from "./constants";

export const themes = {
  // 夕焼けのようなアンバー × コーラル（ダーク）
  ember: {
    scheme: "dark",
    colors: {
      bg: "20 15 12",
      surface: "30 23 19",
      "surface-2": "40 31 25",
      ink: "250 243 234",
      text: "232 222 209",
      muted: "176 160 143",
      accent: "245 158 80",
      "accent-2": "233 99 82",
      "on-accent": "20 15 12",
      line: "74 58 47",
      shadow: "10 6 4",
    },
    stars: "#f5b97a",
    linesOpacity: 0.5,
    modelGlow: "#ffa552", // PCのRGBライトの色（null で元の虹色のまま）
  },

  // テラコッタ × サンド。落ち着いたアースカラー（ダーク）
  terracotta: {
    scheme: "dark",
    colors: {
      bg: "24 20 18",
      surface: "35 29 26",
      "surface-2": "46 38 34",
      ink: "247 240 232",
      text: "230 221 211",
      muted: "171 158 146",
      accent: "224 122 95",
      "accent-2": "233 196 106",
      "on-accent": "24 20 18",
      line: "78 66 59",
      shadow: "12 9 8",
    },
    stars: "#e9c46a",
    linesOpacity: 0.45,
    modelGlow: "#f29a6c",
  },

  // クリーム × バーントオレンジ（ライト）
  cream: {
    scheme: "light",
    colors: {
      bg: "250 245 238",
      surface: "255 252 247",
      "surface-2": "244 235 223",
      ink: "43 33 27",
      text: "74 61 51",
      muted: "128 113 101",
      accent: "210 96 42",
      "accent-2": "230 160 60",
      "on-accent": "255 255 255",
      line: "226 212 196",
      shadow: "180 150 120",
    },
    stars: "#c98b55",
    linesOpacity: 0.35,
    modelGlow: "#ff9a4d",
  },
};

const resolveThemeName = () => {
  try {
    const q = new URLSearchParams(window.location.search).get("theme");
    if (q && themes[q]) return q;
  } catch (_) {}
  return themes[siteTheme] ? siteTheme : "ember";
};

export const activeThemeName = resolveThemeName();
export const activeTheme = themes[activeThemeName];

const hex = (rgb) =>
  "#" + rgb.split(" ").map((n) => Number(n).toString(16).padStart(2, "0")).join("");

// CSS変数・ファビコン・ブラウザのテーマ色に反映
export const applyTheme = (theme = activeTheme) => {
  const root = document.documentElement;
  Object.entries(theme.colors).forEach(([k, v]) => root.style.setProperty(`--c-${k}`, v));
  root.style.setProperty("--hero-lines-opacity", theme.linesOpacity);
  root.style.colorScheme = theme.scheme;
  root.dataset.theme = activeThemeName;

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", hex(theme.colors.bg));
};

// イニシャル入りのファビコンをテーマ色で生成
export const applyFavicon = (initials, theme = activeTheme) => {
  const c = theme.colors;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${hex(c.accent)}"/><stop offset="100%" stop-color="${hex(c["accent-2"])}"/></linearGradient></defs><rect x="1" y="1" width="38" height="38" rx="10" fill="url(#g)"/><text x="20" y="21" text-anchor="middle" dominant-baseline="central" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="${initials.length > 2 ? 13 : 16}" fill="${hex(c["on-accent"])}">${initials}</text></svg>`;
  const link = document.querySelector('link[rel="icon"]');
  if (link) link.setAttribute("href", "data:image/svg+xml," + encodeURIComponent(svg));
};

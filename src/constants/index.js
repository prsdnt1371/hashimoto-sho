// ============================================================
//  サイトの内容はすべてこのファイルで編集できます。
//  { ja: "日本語", en: "English" } の形で書くと言語切替に対応します。
// ============================================================
import { work, school, program, project, radar, trend, sparkles } from "../assets";
import { photo } from "../assets/photos";

// ---------- 配色 ----------
// "ember"（アンバー×コーラル） / "terracotta"（テラコッタ×サンド） / "cream"（明るいクリーム）
// 色の中身は src/theme.js で調整できます
export const siteTheme = "terracotta";

// ---------- 基本情報 ----------
export const profile = {
  name: { ja: "橋本将", en: "Hashimoto Sho" },
  initials: "HS", // ロゴ・ファビコンに使う文字
  affiliation: {
    ja: "崇城大学 情報学部 3年",
    en: "3rd-year student, Faculty of Computer and Information Sciences, Sojo University",
  },
  motto: { ja: "頑張ります♪", en: "I'll do my best ♪" }, // ひとこと
  // ヒーローの見出し：before + name + after
  hero: {
    before: { ja: "こんにちは、", en: "Hi, I'm " },
    name: { ja: "橋本将", en: "Hashimoto Sho" },
    after: { ja: "です", en: "" },
  },
  intro: null, // 自己紹介文（入れる場合は { ja: "…", en: "…" }）
  email: "", // 例: "you@example.com"（空なら非表示）
};

// ---------- 画面の文言 ----------
export const ui = {
  nav: {
    about: { ja: "プロフィール", en: "Profile" },
    photos: { ja: "フォト", en: "Photos" },
    experience: { ja: "経歴", en: "Experience" },
    skills: { ja: "スキル", en: "Skills" },
    works: { ja: "制作物", en: "Works" },
    contact: { ja: "連絡先", en: "Contact" },
  },
  about: {
    sub: { ja: "はじめに", en: "Introduction" },
    head: { ja: "プロフィール", en: "Profile." },
    affiliation: { ja: "所属", en: "Affiliation" },
    motto: { ja: "ひとこと", en: "Motto" },
  },
  experience: {
    sub: { ja: "これまでの歩み", en: "What I have done so far" },
    head: { ja: "経歴", en: "Experience." },
  },
  skills: {
    sub: { ja: "使える技術", en: "Tools I work with" },
    head: { ja: "スキル", en: "Skills." },
  },
  photos: {
    sub: { ja: "写真でちょっと自己紹介", en: "A few snapshots" },
    head: { ja: "フォト", en: "Photos." },
    open: { ja: "拡大して見る", en: "View larger" },
    close: { ja: "閉じる", en: "Close" },
    prev: { ja: "前の写真", en: "Previous photo" },
    next: { ja: "次の写真", en: "Next photo" },
  },
  works: {
    sub: { ja: "これまでに作ったもの", en: "Things I've built" },
    head: { ja: "制作物", en: "Works." },
    open: { ja: "サイトを開く", en: "Visit site" },
  },
  contact: {
    sub: { ja: "お気軽にどうぞ", en: "Get in touch" },
    head: { ja: "連絡先", en: "Contact." },
    lead: {
      ja: "ご連絡は Instagram の DM からお気軽にどうぞ。",
      en: "Feel free to send me a DM on Instagram.",
    },
  },
  scrollHint: { ja: "下へスクロール", en: "Scroll down" },
  // 3DのPCの画面内デスクトップ
  pc: {
    hint: { ja: "モニターをクリックすると操作できます", en: "Click the monitor to use it" },
    hintTouch: { ja: "モニターをタップすると操作できます", en: "Tap the monitor to use it" },
    back: { ja: "戻る", en: "Back" },
    booting: { ja: "起動しています…", en: "Starting up…" },
    app: { ja: "プロフィール", en: "Profile" },
    openHint: { ja: "ダブルクリックで開く", en: "Double-click to open" },
    openHintTouch: { ja: "タップで開く", en: "Tap to open" },
    tabs: {
      about: { ja: "プロフィール", en: "Profile" },
      experience: { ja: "経歴", en: "Experience" },
      skills: { ja: "スキル", en: "Skills" },
      works: { ja: "制作物", en: "Works" },
      photos: { ja: "写真", en: "Photos" },
    },
    focus: { ja: "得意なこと", en: "What I do" },
    shutdown: { ja: "シャットダウン", en: "Shut down" },
    minimize: { ja: "最小化", en: "Minimize" },
    maximize: { ja: "最大化", en: "Maximize" },
    close: { ja: "閉じる", en: "Close" },
    start: { ja: "スタート", en: "Start" },
  },
  langLabel: { ja: "English に切り替え", en: "日本語に切り替え" },
  credits: {
    ja: "3Dモデル",
    en: "3D model",
  },
};

// ---------- できること（自己紹介の下のカード） ----------
// 空なら非表示。例: { title: { ja: "データ分析", en: "Data analysis" }, icon: data }
// icon: code / data / research / design / people / idea / globe / mobile / rocket / book
export const services = [];

// ---------- スキル（3Dボール） ----------
// 空ならスキル欄ごと非表示。例: { name: "Python", icon: python }（画像は src/assets/tech/ に置く）
// 1画面のWebGL数に上限があるため 12個程度までを推奨
export const technologies = [];

// ---------- 経歴タイムライン（新しい順） ----------
// type: "work" | "school" | "program" | "project"（アイコンが変わります）
// 所属のロゴを使いたい場合は logo に画像を指定（指定がなければ種類アイコン）
const typeIcons = { work, school, program, project };

export const experiences = [
  {
    title: { ja: "GCI 2026 修了", en: "Completed GCI 2026" },
    organization: { ja: "東京大学", en: "The University of Tokyo" },
    date: { ja: "2026年", en: "2026" },
    type: "program",
    points: { ja: [], en: [] },
  },
].map((e) => ({ ...e, icon: typeIcons[e.type] ?? work }));

// ---------- フォト（並べたい順） ----------
// 写真ファイルは src/assets/photos/ に置き、photo("ファイル名") で指定します。空なら欄ごと非表示
export const photos = [
  { ...photo("01-childhood"), w: 1600, h: 1303, caption: { ja: "子どものころ", en: "As a kid" } },
  {
    ...photo("02-phonecard"), w: 1200, h: 1600,
    caption: { ja: "橋本タイル工業のテレカ（佐賀県庁舎の施工記念）", en: "A Hashimoto Tile phone card (Saga Prefectural Office tiling)" },
  },
  { ...photo("03-hatachi"), w: 1108, h: 1477, caption: { ja: "2025年 二十歳のつどい（佐賀市）", en: "Coming-of-age ceremony, Saga City 2025" } },
  { ...photo("04-mountain"), w: 1600, h: 1200, caption: { ja: "山頂からの景色", en: "View from the summit" } },
  { ...photo("05-skilift"), w: 1600, h: 1200, caption: { ja: "リフトで自撮り", en: "Selfie on the chairlift" } },
  { ...photo("06-seaside"), w: 1108, h: 1477, caption: { ja: "海辺で", en: "By the sea" } },
  { ...photo("07-themepark"), w: 1200, h: 1600, caption: { ja: "東京ディズニーランド", en: "Tokyo Disneyland" } },
  { ...photo("08-party"), w: 1440, h: 1080, caption: { ja: "国際交流パーティー", en: "International exchange party" } },
  { ...photo("09-armwrestling"), w: 1108, h: 1477, caption: { ja: "ステージで腕相撲", en: "Arm wrestling on stage" } },
  { ...photo("10-pose"), w: 1108, h: 1477, caption: { ja: "キメ顔", en: "Striking a pose" } },
];

// ---------- 制作物（新しい順でなくてもOK） ----------
// image にスクリーンショット（src/assets/works/ に置いて import）を指定するとカードに表示されます
// 空なら制作物の欄ごと非表示
export const works = [
  {
    name: { ja: "GitHub Daily Radar", en: "GitHub Daily Radar" },
    description: null,
    url: "https://github-daily-radar-ecru.vercel.app",
    icon: radar,
  },
  {
    name: { ja: "GitHub Trending（総スター数順）", en: "GitHub Trending (by total stars)" },
    description: {
      ja: "GitHub のトレンドリポジトリを総スター数順に表示。期間（日・週・月）や言語で絞り込めます。",
      en: "GitHub trending repositories sorted by total stars, filterable by period (daily / weekly / monthly) and language.",
    },
    url: "https://gh-trending-vercel.vercel.app",
    icon: trend,
  },
  {
    name: { ja: "AIツールギャラリー", en: "AI Tool Gallery" },
    description: {
      ja: "600以上のAIツールを、料金・機能・レビューで比較・検索できるまとめサイト。",
      en: "A directory for searching and comparing 600+ AI tools by pricing, features and reviews.",
    },
    url: "https://ai-gallery.jp/",
    icon: sparkles,
  },
];

// ---------- ナビゲーション（中身が空の欄は自動で外れます） ----------
export const navLinks = [
  { id: "about", title: ui.nav.about },
  photos.length > 0 && { id: "photos", title: ui.nav.photos },
  experiences.length > 0 && { id: "experience", title: ui.nav.experience },
  technologies.length > 0 && { id: "skills", title: ui.nav.skills },
  works.length > 0 && { id: "works", title: ui.nav.works },
  { id: "contact", title: ui.nav.contact },
].filter(Boolean);

// ---------- 連絡先リンク ----------
// icon: github / x / linkedin / zenn / qiita / note / instagram / youtube /
//       facebook / wantedly / bluesky / threads / speakerdeck / website / email
export const socials = [
  { name: "@prsdnt._.sub1116", icon: "instagram", url: "https://www.instagram.com/prsdnt._.sub1116/" },
];

// ---------- クレジット（3Dモデルのライセンス表記・削除しないでください） ----------
export const credits = [
  {
    label: "“Gaming Desktop PC” by Yolala1232",
    url: "https://sketchfab.com/3d-models/gaming-desktop-pc-d1d8282c9916438091f11aeb28787b66",
    license: "CC BY 4.0",
    licenseUrl: "http://creativecommons.org/licenses/by/4.0/",
  },
];

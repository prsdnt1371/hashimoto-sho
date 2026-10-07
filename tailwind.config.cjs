/** @type {import('tailwindcss').Config} */
// 色はすべて src/theme.js の CSS変数から読み込みます
const v = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;

module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: v("bg"), // 背景
        secondary: v("muted"), // 補足テキスト
        tertiary: v("surface"), // カード
        "surface-2": v("surface-2"),
        ink: v("ink"), // 見出し
        "white-100": v("text"), // 本文
        accent: v("accent"),
        "accent-2": v("accent-2"),
        "on-accent": v("on-accent"),
        line: v("line"),
      },
      boxShadow: {
        card: "0px 35px 120px -15px rgb(var(--c-shadow) / 0.6)",
      },
      screens: {
        xs: "450px",
      },
    },
  },
  plugins: [],
};

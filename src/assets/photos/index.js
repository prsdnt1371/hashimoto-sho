// 写真は src/assets/photos/ に「名前.webp」（大）と「名前-thumb.webp」（一覧用）で置きます
const files = import.meta.glob("./*.webp", { eager: true, import: "default" });

export const photo = (name) => ({
  src: files[`./${name}.webp`],
  thumb: files[`./${name}-thumb.webp`] ?? files[`./${name}.webp`],
});

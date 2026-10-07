import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { ui } from "../constants";
import { useLang } from "../i18n";

const Chevron = ({ dir }) => (
  <svg viewBox='0 0 24 24' className='h-6 w-6' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
    <path d={dir === "left" ? "M15 18l-6-6 6-6" : "M9 6l6 6-6 6"} />
  </svg>
);

// 写真を全画面で見るビューア（← → で移動、Esc で閉じる、スマホはスワイプ）
const Lightbox = ({ photos, index, onIndex, onClose }) => {
  const { t } = useLang();
  const touch = useRef(null);
  const p = photos[index];
  const go = (d) => onIndex((index + d + photos.length) % photos.length);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.stopImmediatePropagation();
        onClose();
      } else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey, true);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = prev;
    };
  });

  // 前後の写真を先読み
  useEffect(() => {
    [1, -1].forEach((d) => {
      const img = new Image();
      img.src = photos[(index + d + photos.length) % photos.length].src;
    });
  }, [index, photos]);

  const btn =
    "flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/25";

  return createPortal(
    <div
      className='pc-fade fixed inset-0 z-[60] flex flex-col bg-black/95 backdrop-blur-sm'
      role='dialog'
      aria-modal='true'
      onClick={onClose}
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touch.current == null) return;
        const dx = e.changedTouches[0].clientX - touch.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touch.current = null;
      }}
    >
      <div className='flex items-center justify-between p-4 text-white/80'>
        <span className='text-[13px] tabular-nums'>
          {index + 1} / {photos.length}
        </span>
        <button type='button' aria-label={t(ui.photos.close)} className={btn} onClick={onClose}>
          <svg viewBox='0 0 24 24' className='h-5 w-5' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' aria-hidden='true'>
            <path d='M6 6l12 12M18 6L6 18' />
          </svg>
        </button>
      </div>

      <div className='relative flex min-h-0 flex-1 items-center justify-center px-3 sm:px-20'>
        <img
          key={p.src}
          src={p.src}
          alt={t(p.caption)}
          className='pc-pop max-h-full max-w-full rounded-lg object-contain shadow-2xl'
          onClick={(e) => e.stopPropagation()}
        />
        <button
          type='button'
          aria-label={t(ui.photos.prev)}
          className={`${btn} absolute left-3 top-1/2 hidden -translate-y-1/2 sm:flex`}
          onClick={(e) => {
            e.stopPropagation();
            go(-1);
          }}
        >
          <Chevron dir='left' />
        </button>
        <button
          type='button'
          aria-label={t(ui.photos.next)}
          className={`${btn} absolute right-3 top-1/2 hidden -translate-y-1/2 sm:flex`}
          onClick={(e) => {
            e.stopPropagation();
            go(1);
          }}
        >
          <Chevron dir='right' />
        </button>
      </div>

      <p className='px-4 pb-6 pt-4 text-center text-[15px] text-white/90'>{t(p.caption)}</p>
    </div>,
    document.body
  );
};

export default Lightbox;

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { ComputersCanvas } from "./canvas";
import { profile, ui } from "../constants";
import { useLang } from "../i18n";
import { enterPc, leavePc, usePc } from "../pc/store";
import { useIsTouch } from "../hooks/useIsMobile";
import PcOverlay from "./pc/PcOverlay";

const MouseGlyph = () => (
  <svg viewBox='0 0 24 24' className='h-4 w-4' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' aria-hidden='true'>
    <rect x='6' y='3' width='12' height='18' rx='6' />
    <path d='M12 7v3' />
  </svg>
);

const Hero = () => {
  const { t, lang } = useLang();
  const { hero } = profile;
  const mode = usePc((s) => s.mode);
  const isTouch = useIsTouch();
  const idle = mode === "idle";
  const anchor = usePc((s) => s.anchor);

  // ヒントが画面の端からはみ出さないように左右位置を調整
  const hintRef = useRef(null);
  const [hintX, setHintX] = useState(null);
  useLayoutEffect(() => {
    if (!anchor || !hintRef.current) return;
    const half = hintRef.current.offsetWidth / 2;
    const max = hintRef.current.closest("section").offsetWidth - half - 12;
    setHintX(Math.min(Math.max(anchor.x, half + 12), max));
  }, [anchor, lang, isTouch]);

  // Esc で画面から離れる
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && leavePc();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section className='relative w-full h-screen mx-auto'>
      <div
        className={`absolute inset-0 top-[120px] max-w-7xl mx-auto ${styles.paddingX} flex flex-row items-start gap-5 transition-opacity duration-500 ${
          idle ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className='flex flex-col justify-center items-center mt-5'>
          <div className='w-5 h-5 rounded-full bg-accent' />
          <div className='w-1 sm:h-80 h-40 accent-line' />
        </div>

        <div className='relative z-10 pointer-events-none'>
          <h1 className={lang === "ja" ? styles.heroHeadTextJa : styles.heroHeadText}>
            {t(hero.before)}
            <span className='text-accent inline-block'>{t(hero.name)}</span>
            {t(hero.after)}
          </h1>
          <p className={`${styles.heroSubText} mt-2 max-w-[680px] [text-wrap:balance]`}>{t(profile.affiliation)}</p>
          {profile.motto && (
            <p className={`${styles.heroSubText} mt-1 font-semibold text-accent-2`}>
              {lang === "ja" ? `「${t(profile.motto)}」` : `“${t(profile.motto)}”`}
            </p>
          )}
        </div>
      </div>

      <ComputersCanvas />
      <PcOverlay />

      {/* 「モニターをクリック」のヒント（モニターの上に表示。押しても入れる） */}
      {anchor && (
        <div
          className={`absolute z-10 transition-opacity duration-300 ${idle ? "opacity-100" : "pointer-events-none opacity-0"}`}
          style={{ left: hintX ?? anchor.x, top: anchor.y - 14, transform: "translate(-50%, -100%)" }}
        >
          <button
            ref={hintRef}
            type='button'
            onClick={enterPc}
            className='pc-bob relative flex items-center gap-2 whitespace-nowrap rounded-full bg-tertiary/80 px-4 py-2 text-[13px] text-white-100 ring-1 ring-line backdrop-blur transition hover:text-ink hover:ring-accent/60'
          >
            <span className='relative flex h-2 w-2'>
              <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60' />
              <span className='relative inline-flex h-2 w-2 rounded-full bg-accent' />
            </span>
            <MouseGlyph />
            {t(isTouch ? ui.pc.hintTouch : ui.pc.hint)}
            <span
              className='absolute top-full h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-tertiary/80 ring-1 ring-line [clip-path:polygon(100%_0,100%_100%,0_100%)]'
              style={{ left: `calc(50% + ${(anchor.x - (hintX ?? anchor.x)).toFixed(1)}px)` }}
            />
          </button>
        </div>
      )}

      {/* 画面から戻るボタン */}
      <div
        className={`absolute inset-x-0 bottom-5 z-10 flex justify-center transition-opacity duration-300 ${
          mode === "focused" ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <button
          type='button'
          onClick={leavePc}
          className='flex items-center gap-2 rounded-full bg-tertiary/85 px-5 py-2.5 text-[14px] font-medium text-ink ring-1 ring-line backdrop-blur transition hover:ring-accent/60'
        >
          <svg viewBox='0 0 24 24' className='h-4 w-4' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
            <path d='M15 18l-6-6 6-6' />
          </svg>
          {t(ui.pc.back)}
          {!isTouch && <kbd className='ml-1 rounded bg-ink/10 px-1.5 py-0.5 text-[11px] font-normal text-secondary'>Esc</kbd>}
        </button>
      </div>

      <div
        className={`absolute bottom-8 sm:bottom-10 w-full flex justify-center items-center transition-opacity duration-300 ${
          idle ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <a href='#about' aria-label={t(ui.scrollHint)}>
          <div className='w-[35px] h-[64px] rounded-3xl border-4 border-secondary flex justify-center items-start p-2'>
            <motion.div
              animate={{ y: [0, 24, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
              className='w-3 h-3 rounded-full bg-secondary mb-1'
            />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;

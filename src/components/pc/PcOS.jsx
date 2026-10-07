import { useEffect, useRef, useState } from "react";

import { experiences, photos, profile, services, socials, technologies, ui, works } from "../../constants";
import { iconPaths } from "../../assets/iconPaths";
import { profileIcon } from "../../assets";
import { useLang } from "../../i18n";
import { useIsTouch } from "../../hooks/useIsMobile";
import Logo from "../Logo";
import MaskIcon from "../MaskIcon";

// ============================================================
//  3DのPCの画面に映る、操作できるミニデスクトップ
//  （起動画面 → デスクトップ → 「プロフィール」アプリ）
// ============================================================

const TASKBAR_H = 40;

// ---------- 小さな部品 ----------
const WinButton = ({ label, onClick, danger, children }) => (
  <button
    type='button'
    aria-label={label}
    title={label}
    onClick={onClick}
    onPointerDown={(e) => e.stopPropagation()}
    className={`flex h-full w-10 items-center justify-center text-secondary transition-colors ${
      danger ? "hover:bg-[#c4473a] hover:text-white" : "hover:bg-ink/10 hover:text-ink"
    }`}
  >
    {children}
  </button>
);

const Glyph = ({ d }) => (
  <svg viewBox='0 0 12 12' className='h-3 w-3' fill='none' stroke='currentColor' strokeWidth='1.3' aria-hidden='true'>
    <path d={d} />
  </svg>
);

const Clock = () => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className='tabular-nums text-[12px] text-white-100'>
      {String(now.getHours()).padStart(2, "0")}:{String(now.getMinutes()).padStart(2, "0")}
    </span>
  );
};

// ---------- 起動画面 ----------
const Boot = () => {
  const { t } = useLang();
  return (
    <div className='pc-fade absolute inset-0 flex flex-col items-center justify-center gap-5 bg-primary'>
      <Logo className='h-16 w-16 animate-pulse' />
      <p className='text-[13px] text-secondary'>{t(ui.pc.booting)}</p>
      <div className='h-1 w-44 overflow-hidden rounded-full bg-line'>
        <div className='pc-boot-bar h-full rounded-full bg-accent' />
      </div>
    </div>
  );
};

// ---------- プロフィールアプリの中身 ----------
const AboutTab = ({ compact }) => {
  const { t } = useLang();
  return (
    <div className='space-y-5'>
      <div className={`flex gap-4 ${compact ? "flex-col items-start" : "items-center"}`}>
        <Logo className='h-16 w-16 shrink-0' />
        <div className='min-w-0'>
          <h3 className='text-[22px] font-bold leading-tight text-ink'>{t(profile.name)}</h3>
          <p className='mt-1 text-[13px] leading-relaxed text-secondary'>{t(profile.affiliation)}</p>
        </div>
      </div>
      {profile.motto && (
        <div className='relative rounded-xl bg-accent/10 px-4 py-3 ring-1 ring-accent/30'>
          <p className='text-[11px] font-semibold uppercase tracking-wider text-secondary'>{t(ui.about.motto)}</p>
          <p className='mt-0.5 text-[18px] font-bold text-accent'>{t(profile.motto)}</p>
        </div>
      )}
      {profile.intro && (
        <p className='whitespace-pre-line text-[13.5px] leading-[1.9] text-white-100'>{t(profile.intro)}</p>
      )}
      {services.length > 0 && (
        <div>
          <p className='mb-2 text-[11px] font-semibold uppercase tracking-wider text-secondary'>{t(ui.pc.focus)}</p>
          <ul className='flex flex-wrap gap-2'>
            {services.map((s, i) => (
              <li key={i} className='flex items-center gap-2 rounded-full bg-surface-2 px-3 py-1.5 text-[12.5px] text-ink ring-1 ring-line'>
                <MaskIcon src={s.icon} className='h-4 w-4 bg-accent' />
                {t(s.title)}
              </li>
            ))}
          </ul>
        </div>
      )}
      {socials.length > 0 && (
        <div className='flex flex-wrap gap-2'>
          {socials.map((s) => (
            <a
              key={s.url}
              href={s.url}
              target='_blank'
              rel='noreferrer'
              onPointerDown={(e) => e.stopPropagation()}
              className='inline-flex items-center gap-2 rounded-full bg-surface-2 px-3 py-1.5 text-[12.5px] text-ink ring-1 ring-line hover:ring-accent/60'
            >
              <svg viewBox='0 0 24 24' className='h-3.5 w-3.5 text-accent' fill='currentColor' aria-hidden='true'>
                <path d={iconPaths[s.icon] ?? iconPaths.website} />
              </svg>
              {s.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

const ExperienceTab = () => {
  const { t } = useLang();
  return (
    <ol className='relative ml-1.5 space-y-5 border-l border-line pl-5'>
      {experiences.map((e, i) => {
        const points = t(e.points) ?? [];
        return (
          <li key={i} className='relative'>
            <span className='absolute -left-[26px] top-1 h-2.5 w-2.5 rounded-full bg-accent ring-4 ring-tertiary' />
            <p className='text-[11.5px] text-secondary'>{t(e.date)}</p>
            <p className='text-[15px] font-semibold leading-snug text-ink'>{t(e.title)}</p>
            <p className='text-[12.5px] text-accent'>{t(e.organization)}</p>
            {points.length > 0 && (
              <ul className='mt-1.5 list-disc space-y-0.5 pl-4 text-[12.5px] leading-relaxed text-white-100'>
                {points.map((p, j) => (
                  <li key={j}>{p}</li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ol>
  );
};

const SkillsTab = ({ compact }) => (
  <ul className={`grid gap-3 ${compact ? "grid-cols-3" : "grid-cols-4"}`}>
    {technologies.map((tech) => (
      <li key={tech.name} className='flex flex-col items-center gap-2 rounded-lg bg-surface-2 px-2 py-3 ring-1 ring-line'>
        <img src={tech.icon} alt='' className='h-9 w-9 object-contain' draggable='false' />
        <span className='text-center text-[12px] leading-tight text-white-100'>{tech.name}</span>
      </li>
    ))}
  </ul>
);

const WorksTab = () => {
  const { t } = useLang();
  return (
    <ul className='space-y-2.5'>
      {works.map((w) => {
        let domain = w.url;
        try { domain = new URL(w.url).hostname; } catch (_) {}
        return (
          <li key={w.url}>
            <a
              href={w.url}
              target='_blank'
              rel='noreferrer'
              onPointerDown={(e) => e.stopPropagation()}
              className='group flex items-center gap-3 rounded-lg bg-surface-2 p-3 ring-1 ring-line transition hover:ring-accent/60'
            >
              <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 ring-1 ring-accent/30'>
                <MaskIcon src={w.icon} className='h-5 w-5 bg-accent' />
              </span>
              <span className='min-w-0 flex-1'>
                <span className='block truncate text-[14px] font-semibold text-ink'>{t(w.name)}</span>
                <span className='block truncate text-[11.5px] text-secondary'>{domain}</span>
              </span>
              <svg viewBox='0 0 24 24' className='h-4 w-4 shrink-0 text-accent transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
                <path d='M7 17L17 7' />
                <path d='M8 7h9v9' />
              </svg>
            </a>
          </li>
        );
      })}
    </ul>
  );
};

const PhotosTab = ({ compact }) => {
  const { t } = useLang();
  const [i, setI] = useState(null);
  const go = (d) => setI((v) => (v + d + photos.length) % photos.length);

  if (i !== null) {
    const p = photos[i];
    return (
      <div className='flex h-full min-h-[260px] flex-col gap-2'>
        <div className='flex items-center justify-between'>
          <button type='button' onClick={() => setI(null)} className='rounded-md px-2 py-1 text-[12px] text-secondary hover:bg-ink/10 hover:text-ink'>
            ← {t(ui.pc.tabs.photos)}
          </button>
          <span className='text-[11px] tabular-nums text-secondary'>{i + 1} / {photos.length}</span>
        </div>
        <div className='relative flex min-h-0 flex-1 items-center justify-center rounded-lg bg-black/40'>
          <img key={p.src} src={p.src} alt={t(p.caption)} className='pc-fade max-h-[300px] max-w-full object-contain' draggable='false' />
          {["left", "right"].map((dir) => (
            <button
              key={dir}
              type='button'
              aria-label={t(dir === "left" ? ui.photos.prev : ui.photos.next)}
              onClick={() => go(dir === "left" ? -1 : 1)}
              className={`absolute top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 ${dir === "left" ? "left-2" : "right-2"}`}
            >
              {dir === "left" ? "‹" : "›"}
            </button>
          ))}
        </div>
        <p className='text-center text-[12.5px] text-white-100'>{t(p.caption)}</p>
      </div>
    );
  }

  return (
    <ul className={`grid gap-2 ${compact ? "grid-cols-2" : "grid-cols-4"}`}>
      {photos.map((p, idx) => (
        <li key={p.src}>
          <button
            type='button'
            onClick={() => setI(idx)}
            className='group relative block aspect-square w-full overflow-hidden rounded-lg ring-1 ring-line hover:ring-accent/60'
            title={t(p.caption)}
          >
            <img src={p.thumb} alt={t(p.caption)} loading='lazy' className='h-full w-full object-cover transition duration-300 group-hover:scale-105' draggable='false' />
          </button>
        </li>
      ))}
    </ul>
  );
};

// 中身が空のタブは出さない
const TABS = [
  { id: "about", label: ui.pc.tabs.about, Comp: AboutTab },
  photos.length > 0 && { id: "photos", label: ui.pc.tabs.photos, Comp: PhotosTab },
  experiences.length > 0 && { id: "experience", label: ui.pc.tabs.experience, Comp: ExperienceTab },
  technologies.length > 0 && { id: "skills", label: ui.pc.tabs.skills, Comp: SkillsTab },
  works.length > 0 && { id: "works", label: ui.pc.tabs.works, Comp: WorksTab },
].filter(Boolean);

// ---------- ウィンドウ ----------
const ProfileWindow = ({ win, setWin, bounds, scale, compact, onClose }) => {
  const { t } = useLang();
  const [tab, setTab] = useState("about");
  const drag = useRef(null);
  const maximized = compact || win.maximized;
  const Active = TABS.find((x) => x.id === tab).Comp;

  const style = maximized
    ? { left: 0, top: 0, right: 0, bottom: TASKBAR_H }
    : { left: win.x, top: win.y, width: win.w, height: win.h };

  const onDown = (e) => {
    if (maximized || e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { sx: e.clientX, sy: e.clientY, x: win.x, y: win.y };
  };
  const onMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const x = d.x + (e.clientX - d.sx) / scale;
    const y = d.y + (e.clientY - d.sy) / scale;
    setWin((w) => ({
      ...w,
      x: Math.min(Math.max(x, 80 - w.w), bounds.w - 80),
      y: Math.min(Math.max(y, 0), bounds.h - 36),
    }));
  };
  const onUp = () => {
    drag.current = null;
  };

  return (
    <section
      className={`pc-pop absolute flex flex-col overflow-hidden bg-tertiary ring-1 ring-line ${
        maximized ? "" : "rounded-xl shadow-[0_24px_60px_-12px_rgb(0_0_0/0.55)]"
      }`}
      style={style}
      aria-label={t(ui.pc.app)}
    >
      <header
        className={`flex h-9 shrink-0 items-center border-b border-line bg-surface-2 pl-3 ${
          maximized ? "" : "cursor-grab active:cursor-grabbing"
        }`}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onDoubleClick={() => !compact && setWin((w) => ({ ...w, maximized: !w.maximized }))}
      >
        <MaskIcon src={profileIcon} className='h-4 w-4 bg-accent' />
        <span className='ml-2 truncate text-[12.5px] font-medium text-ink'>
          {t(ui.pc.app)} — {t(profile.name)}
        </span>
        <div className='ml-auto flex h-full'>
          <WinButton label={t(ui.pc.minimize)} onClick={() => setWin((w) => ({ ...w, minimized: true }))}>
            <Glyph d='M2.5 6h7' />
          </WinButton>
          {!compact && (
            <WinButton label={t(ui.pc.maximize)} onClick={() => setWin((w) => ({ ...w, maximized: !w.maximized }))}>
              <Glyph d={win.maximized ? "M3.5 4.5h4v4h-4z M5 4.5V3h4v4H7.5" : "M2.5 2.5h7v7h-7z"} />
            </WinButton>
          )}
          <WinButton label={t(ui.pc.close)} onClick={onClose} danger>
            <Glyph d='M3 3l6 6M9 3L3 9' />
          </WinButton>
        </div>
      </header>

      <div className={`flex min-h-0 flex-1 ${compact ? "flex-col" : ""}`}>
        <nav
          className={`shrink-0 border-line bg-surface-2/50 ${
            compact ? "flex gap-1 border-b p-1.5" : "w-[132px] space-y-1 border-r p-2"
          }`}
        >
          {TABS.map((x) => (
            <button
              key={x.id}
              type='button'
              onClick={() => setTab(x.id)}
              className={`rounded-md py-2 text-left transition-colors ${compact ? "flex-1 whitespace-nowrap px-1.5 text-center text-[12px]" : "block w-full px-3 text-[13px]"} ${
                tab === x.id ? "bg-accent/15 font-semibold text-accent" : "text-white-100 hover:bg-ink/5"
              }`}
            >
              {t(x.label)}
            </button>
          ))}
        </nav>
        <div key={tab} className='pc-fade min-h-0 flex-1 overflow-y-auto overscroll-contain p-5'>
          <Active compact={compact} />
        </div>
      </div>
    </section>
  );
};

// ---------- スタートメニュー ----------
const StartMenu = ({ onOpen, onShutdown, onClose }) => {
  const { t, lang, setLang } = useLang();
  const item = "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-[13px] text-white-100 hover:bg-ink/10 hover:text-ink";
  return (
    <div
      className='pc-pop absolute bottom-[46px] left-2 z-30 w-60 rounded-xl bg-tertiary/95 p-2 shadow-[0_18px_50px_-10px_rgb(0_0_0/0.55)] ring-1 ring-line backdrop-blur'
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div className='flex items-center gap-3 px-2 pb-3 pt-1'>
        <Logo className='h-9 w-9' />
        <div className='min-w-0'>
          <p className='truncate text-[14px] font-semibold text-ink'>{t(profile.name)}</p>
          <p className='truncate text-[11px] text-secondary'>{t(profile.affiliation)}</p>
        </div>
      </div>
      <div className='h-px bg-line' />
      <button type='button' className={`${item} mt-2`} onClick={() => { onOpen(); onClose(); }}>
        <MaskIcon src={profileIcon} className='h-4 w-4 bg-accent' />
        {t(ui.pc.app)}
      </button>
      <button type='button' className={item} onClick={() => setLang(lang === "ja" ? "en" : "ja")}>
        <span className='w-4 text-center text-[11px] font-bold text-accent'>{lang === "ja" ? "EN" : "JA"}</span>
        {t(ui.langLabel)}
      </button>
      <div className='my-2 h-px bg-line' />
      <button type='button' className={item} onClick={onShutdown}>
        <svg viewBox='0 0 24 24' className='h-4 w-4 text-accent-2' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' aria-hidden='true'>
          <path d='M12 3v8' />
          <path d='M6.3 7.3a8 8 0 1 0 11.4 0' />
        </svg>
        {t(ui.pc.shutdown)}
      </button>
    </div>
  );
};

// ---------- デスクトップ全体 ----------
const PcOS = ({ width, height, scale = 1, compact = false, onShutdown }) => {
  const { t, lang, setLang } = useLang();
  const isTouch = useIsTouch();
  const [booting, setBooting] = useState(true);
  const [selected, setSelected] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const [opened, setOpened] = useState(false); // 一度でも開いたか（ヒントを消す）
  const iconRef = useRef(null);
  const bounds = { w: width, h: height - TASKBAR_H };
  const [win, setWin] = useState(() => {
    const w = Math.min(620, bounds.w - 60);
    const h = Math.min(390, bounds.h - 40);
    return { open: false, minimized: false, maximized: false, w, h, x: Math.round((bounds.w - w) / 2 + 50), y: Math.round((bounds.h - h) / 2) };
  });

  useEffect(() => {
    const id = setTimeout(() => setBooting(false), 1100);
    return () => clearTimeout(id);
  }, []);

  // 起動後はアイコンにフォーカス（キーボードでも Enter で開ける）
  useEffect(() => {
    if (!booting) iconRef.current?.focus({ preventScroll: true });
  }, [booting]);

  const open = () => {
    setWin((w) => ({ ...w, open: true, minimized: false }));
    setOpened(true);
    setSelected(false);
  };

  if (booting) return <Boot />;

  return (
    <div
      className='pc-fade absolute inset-0 select-none overflow-hidden'
      onPointerDown={() => {
        setStartOpen(false);
        setSelected(false);
      }}
    >
      {/* 壁紙 */}
      <div
        className='absolute inset-0'
        style={{
          background:
            "radial-gradient(circle at 82% 88%, rgb(var(--c-accent) / 0.35), transparent 55%), radial-gradient(circle at 12% 8%, rgb(var(--c-accent-2) / 0.22), transparent 50%), rgb(var(--c-bg))",
        }}
      />
      <div className='hero-lines absolute inset-0' style={{ opacity: 0.22 }} />
      <div className='pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.05]'>
        <Logo className='h-40 w-40' />
      </div>

      {/* デスクトップのアイコン */}
      <div className='absolute left-4 top-4'>
        <button
          ref={iconRef}
          type='button'
          className={`flex w-[96px] flex-col items-center gap-1.5 rounded-lg p-2 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent ${
            selected ? "bg-accent/20 ring-1 ring-accent/60" : "hover:bg-ink/10"
          }`}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => (isTouch ? open() : setSelected(true))}
          onDoubleClick={open}
          onKeyDown={(e) => e.key === "Enter" && open()}
        >
          <span className='flex h-12 w-12 items-center justify-center rounded-xl bg-tertiary/80 ring-1 ring-line'>
            <MaskIcon src={profileIcon} className='h-7 w-7 bg-accent' />
          </span>
          <span className='whitespace-nowrap text-[12px] font-medium text-ink [text-shadow:0_1px_3px_rgb(0_0_0/0.6)]'>{t(ui.pc.app)}</span>
        </button>
        {!opened && (
          <div className='pc-hint absolute left-[104px] top-5 whitespace-nowrap rounded-lg bg-accent px-3 py-1.5 text-[12px] font-semibold text-on-accent shadow-lg'>
            <span className='absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-accent' />
            {t(isTouch ? ui.pc.openHintTouch : ui.pc.openHint)}
          </div>
        )}
      </div>

      {win.open && !win.minimized && (
        <ProfileWindow
          win={win}
          setWin={setWin}
          bounds={bounds}
          scale={scale}
          compact={compact}
          onClose={() => setWin((w) => ({ ...w, open: false, maximized: false }))}
        />
      )}

      {startOpen && <StartMenu onOpen={open} onShutdown={onShutdown} onClose={() => setStartOpen(false)} />}

      {/* タスクバー */}
      <div
        className='absolute inset-x-0 bottom-0 z-20 flex items-center gap-1 border-t border-line bg-tertiary/85 px-2 backdrop-blur'
        style={{ height: TASKBAR_H }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <button
          type='button'
          aria-label={t(ui.pc.start)}
          title={t(ui.pc.start)}
          onClick={() => setStartOpen((v) => !v)}
          className={`flex h-8 w-9 items-center justify-center rounded-md transition-colors ${startOpen ? "bg-ink/15" : "hover:bg-ink/10"}`}
        >
          <Logo className='h-6 w-6' />
        </button>
        {win.open && (
          <button
            type='button'
            onClick={() => setWin((w) => ({ ...w, minimized: !w.minimized }))}
            className={`relative flex h-8 items-center gap-2 rounded-md px-3 text-[12px] transition-colors ${
              win.minimized ? "text-white-100 hover:bg-ink/10" : "bg-ink/10 text-ink"
            }`}
          >
            <MaskIcon src={profileIcon} className='h-4 w-4 bg-accent' />
            {t(ui.pc.app)}
            <span className={`absolute bottom-0.5 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-accent transition-all ${win.minimized ? "w-1.5" : "w-4"}`} />
          </button>
        )}
        <div className='ml-auto flex items-center gap-2 pr-1'>
          <button
            type='button'
            onClick={() => setLang(lang === "ja" ? "en" : "ja")}
            title={t(ui.langLabel)}
            className='h-7 rounded-md px-2 text-[11px] font-bold text-white-100 hover:bg-ink/10'
          >
            {lang.toUpperCase()}
          </button>
          <Clock />
        </div>
      </div>
    </div>
  );
};

export default PcOS;

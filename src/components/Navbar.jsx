import { useEffect, useState } from "react";

import { styles } from "../styles";
import { navLinks, profile, ui } from "../constants";
import { menu, close } from "../assets";
import { useLang } from "../i18n";
import Logo from "./Logo";
import MaskIcon from "./MaskIcon";

const LangToggle = () => {
  const { lang, setLang, t } = useLang();
  return (
    <button
      type='button'
      onClick={() => setLang(lang === "ja" ? "en" : "ja")}
      aria-label={t(ui.langLabel)}
      title={t(ui.langLabel)}
      className='flex items-center rounded-full border border-secondary/40 p-[3px] text-[13px] font-semibold'
    >
      {["ja", "en"].map((l) => (
        <span
          key={l}
          className={`px-2.5 py-1 rounded-full transition-colors ${
            lang === l ? "bg-accent text-on-accent" : "text-secondary"
          }`}
        >
          {l.toUpperCase()}
        </span>
      ))}
    </button>
  );
};

const Navbar = () => {
  const { t } = useLang();
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 表示中のセクションをナビでハイライト
  useEffect(() => {
    const targets = navLinks
      .map((n) => document.getElementById(n.id))
      .filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    targets.forEach((el) => io.observe(el.closest("section") ?? el));
    return () => io.disconnect();
  }, []);

  return (
    <nav
      className={`${styles.paddingX} w-full flex items-center py-5 fixed top-0 z-20 transition-colors ${
        scrolled ? "bg-primary/95 backdrop-blur" : "bg-transparent"
      }`}
    >
      <div className='w-full flex justify-between items-center max-w-7xl mx-auto gap-4'>
        <a
          href='#'
          className='flex items-center gap-2'
          onClick={(e) => {
            e.preventDefault();
            setActive("");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <Logo />
          <p className='text-ink text-[18px] font-bold cursor-pointer'>
            {t(profile.name)}
          </p>
        </a>

        <div className='hidden sm:flex items-center gap-10'>
          <ul className='list-none flex flex-row gap-8 lg:gap-10'>
            {navLinks.map((nav) => (
              <li
                key={nav.id}
                className={`${
                  active === nav.id ? "text-ink" : "text-secondary"
                } hover:text-ink text-[17px] font-medium cursor-pointer`}
              >
                <a href={`#${nav.id}`}>{t(nav.title)}</a>
              </li>
            ))}
          </ul>
          <LangToggle />
        </div>

        <div className='sm:hidden flex flex-1 justify-end items-center gap-4'>
          <LangToggle />
          <button type='button' onClick={() => setToggle(!toggle)} aria-label='menu'>
            <MaskIcon src={toggle ? close : menu} className='w-[28px] h-[28px] bg-ink' />
          </button>

          <div
            className={`${
              !toggle ? "hidden" : "flex"
            } p-6 bg-tertiary border border-line/60 shadow-card absolute top-20 right-0 mx-4 my-2 min-w-[160px] z-10 rounded-xl`}
          >
            <ul className='list-none flex justify-end items-start flex-1 flex-col gap-4'>
              {navLinks.map((nav) => (
                <li
                  key={nav.id}
                  className={`font-medium cursor-pointer text-[16px] ${
                    active === nav.id ? "text-ink" : "text-secondary"
                  }`}
                  onClick={() => setToggle(false)}
                >
                  <a href={`#${nav.id}`}>{t(nav.title)}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

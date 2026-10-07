import { motion } from "framer-motion";

import { styles } from "../styles";
import { works, ui } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import { useLang } from "../i18n";
import Tilt from "./Tilt";
import MaskIcon from "./MaskIcon";

const domainOf = (url) => {
  try {
    return new URL(url).hostname;
  } catch (_) {
    return url;
  }
};

const ArrowUpRight = ({ className = "h-4 w-4" }) => (
  <svg viewBox='0 0 24 24' className={className} fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
    <path d='M7 17L17 7' />
    <path d='M8 7h9v9' />
  </svg>
);

// ブラウザ風のカード（スクリーンショットがあれば表示、なければアイコン）
const WorkCard = ({ work, index }) => {
  const { t } = useLang();
  const domain = domainOf(work.url);
  const desc = work.description ? t(work.description) : null;

  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.2, 0.75)} className='w-full sm:w-[360px]'>
      <Tilt max={8} className='h-full'>
        <a
          href={work.url}
          target='_blank'
          rel='noreferrer'
          className='group block h-full rounded-2xl gradient-border p-[1px] shadow-card'
        >
          <div className='flex h-full flex-col overflow-hidden rounded-[15px] bg-tertiary'>
            <div className='flex h-9 items-center gap-2 border-b border-line bg-surface-2 px-3'>
              <span className='flex gap-1.5' aria-hidden='true'>
                <span className='h-2.5 w-2.5 rounded-full bg-line' />
                <span className='h-2.5 w-2.5 rounded-full bg-line' />
                <span className='h-2.5 w-2.5 rounded-full bg-line' />
              </span>
              <span className='ml-1 min-w-0 flex-1 truncate rounded-md bg-primary/60 px-2.5 py-0.5 text-[12px] text-secondary'>
                {domain}
              </span>
            </div>

            <div
              className='relative flex h-40 items-center justify-center overflow-hidden'
              style={{
                background:
                  "radial-gradient(circle at 75% 85%, rgb(var(--c-accent) / 0.28), transparent 60%), radial-gradient(circle at 20% 15%, rgb(var(--c-accent-2) / 0.18), transparent 55%), rgb(var(--c-bg))",
              }}
            >
              {work.image ? (
                <img src={work.image} alt='' className='h-full w-full object-cover object-top transition duration-500 group-hover:scale-105' />
              ) : (
                <>
                  <div className='hero-lines absolute inset-0' style={{ opacity: 0.18 }} />
                  <span className='relative flex h-20 w-20 items-center justify-center rounded-2xl bg-tertiary/80 ring-1 ring-accent/40 transition duration-300 group-hover:scale-110'>
                    <MaskIcon src={work.icon} className='h-10 w-10 bg-accent' />
                  </span>
                </>
              )}
            </div>

            <div className='flex flex-1 flex-col p-5'>
              <h3 className='text-[20px] font-bold leading-snug text-ink'>{t(work.name)}</h3>
              {desc && <p className='mt-2 text-[14px] leading-relaxed text-secondary'>{desc}</p>}
              <span className='mt-auto inline-flex items-center gap-1.5 pt-4 text-[14px] font-semibold text-accent'>
                {t(ui.works.open)}
                <ArrowUpRight className='h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5' />
              </span>
            </div>
          </div>
        </a>
      </Tilt>
    </motion.div>
  );
};

const Works = () => {
  const { t } = useLang();
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>{t(ui.works.sub)}</p>
        <h2 className={styles.sectionHeadText}>{t(ui.works.head)}</h2>
      </motion.div>

      <div className='mt-12 flex flex-wrap items-stretch gap-7'>
        {works.map((work, index) => (
          <WorkCard key={work.url} work={work} index={index} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Works, "works");

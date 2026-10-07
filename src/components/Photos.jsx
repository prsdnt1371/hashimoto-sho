import { useState } from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { photos, ui } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import { useLang } from "../i18n";
import Lightbox from "./Lightbox";

// 縦横いろいろな写真を石畳のように並べ、クリックで拡大
const Photos = () => {
  const { t } = useLang();
  const [open, setOpen] = useState(null);

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>{t(ui.photos.sub)}</p>
        <h2 className={styles.sectionHeadText}>{t(ui.photos.head)}</h2>
      </motion.div>

      <div className='mt-12 columns-2 gap-3 sm:gap-5 lg:columns-3'>
        {photos.map((p, i) => (
          <motion.div
            key={p.src}
            variants={fadeIn("up", "tween", Math.min(i * 0.06, 0.5), 0.6)}
            className='mb-3 break-inside-avoid sm:mb-5'
          >
            <button
              type='button'
              onClick={() => setOpen(i)}
              aria-label={`${t(p.caption)} — ${t(ui.photos.open)}`}
              className='group relative block w-full overflow-hidden rounded-2xl bg-tertiary ring-1 ring-line shadow-card transition hover:ring-accent/60 focus-visible:ring-2 focus-visible:ring-accent'
            >
              <img
                src={p.thumb}
                width={p.w}
                height={p.h}
                alt={t(p.caption)}
                loading='lazy'
                decoding='async'
                className='block h-auto w-full transition duration-500 group-hover:scale-[1.04]'
              />
              <span className='pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent px-3 pb-2.5 pt-10 text-left text-[12px] leading-snug text-white sm:px-4 sm:pb-3 sm:text-[14px]'>
                {t(p.caption)}
              </span>
            </button>
          </motion.div>
        ))}
      </div>

      {open !== null && <Lightbox photos={photos} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </>
  );
};

export default SectionWrapper(Photos, "photos");

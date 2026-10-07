import { motion } from "framer-motion";

import { styles } from "../styles";
import { profile, socials, ui } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn } from "../utils/motion";
import { iconPaths } from "../assets/iconPaths";
import { useLang } from "../i18n";

const Icon = ({ name, className = "w-5 h-5" }) => (
  <svg viewBox='0 0 24 24' className={className} fill='currentColor' aria-hidden='true'>
    <path d={iconPaths[name] ?? iconPaths.website} />
  </svg>
);

const Contact = () => {
  const { t } = useLang();

  const links = [
    ...(profile.email
      ? [{ name: profile.email, icon: "email", url: `mailto:${profile.email}` }]
      : []),
    ...socials,
  ];

  return (
    <motion.div
      variants={fadeIn("up", "tween", 0.1, 0.8)}
      className='max-w-3xl mx-auto bg-tertiary/90 p-8 sm:p-10 rounded-2xl border border-line/60 shadow-card'
    >
      <p className={styles.sectionSubText}>{t(ui.contact.sub)}</p>
      <h2 className={styles.sectionHeadText}>{t(ui.contact.head)}</h2>
      <p className='mt-4 text-secondary text-[17px] leading-[30px]'>{t(ui.contact.lead)}</p>

      <ul className='mt-10 grid grid-cols-1 xs:grid-cols-2 gap-4'>
        {links.map((link) => (
          <li key={link.url}>
            <a
              href={link.url}
              target={link.url.startsWith("mailto:") ? undefined : "_blank"}
              rel='noreferrer'
              className='group flex items-center gap-4 rounded-xl bg-surface-2 px-5 py-4 text-ink transition hover:bg-surface-2/70 hover:-translate-y-0.5'
            >
              <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink/10 text-accent group-hover:bg-accent group-hover:text-on-accent transition-colors'>
                <Icon name={link.icon} />
              </span>
              <span className='font-medium break-all'>{link.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default SectionWrapper(Contact, "contact");

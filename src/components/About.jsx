import { motion } from "framer-motion";

import { styles } from "../styles";
import { profile, services, socials, ui } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import { useLang } from "../i18n";
import { iconPaths } from "../assets/iconPaths";
import Tilt from "./Tilt";
import MaskIcon from "./MaskIcon";
import Logo from "./Logo";

const ServiceCard = ({ index, title, icon }) => (
  <Tilt className='xs:w-[250px] w-full'>
    <motion.div
      variants={fadeIn("right", "spring", index * 0.3, 0.75)}
      className='w-full gradient-border p-[1px] rounded-[20px] shadow-card'
    >
      <div className='bg-tertiary rounded-[20px] py-5 px-10 min-h-[260px] flex justify-evenly items-center flex-col'>
        <span className='flex w-20 h-20 items-center justify-center rounded-full bg-accent/10 ring-1 ring-accent/30'>
          <MaskIcon src={icon} className='w-10 h-10 bg-accent' />
        </span>
        <h3 className='text-ink text-[20px] font-bold text-center'>{title}</h3>
      </div>
    </motion.div>
  </Tilt>
);

// 名前・所属・ひとことをまとめたプロフィールカード
const ProfileCard = () => {
  const { t } = useLang();
  const rows = [
    { label: ui.about.affiliation, value: t(profile.affiliation) },
    { label: ui.about.motto, value: t(profile.motto), accent: true },
  ].filter((r) => r.value);

  return (
    <motion.div variants={fadeIn("up", "spring", 0.15, 0.75)} className='mt-10 max-w-3xl'>
      <Tilt max={6}>
        <div className='gradient-border rounded-[22px] p-[1px] shadow-card'>
          <div className='flex flex-col gap-6 rounded-[21px] bg-tertiary p-6 sm:flex-row sm:items-center sm:gap-8 sm:p-8'>
            <Logo className='h-20 w-20 shrink-0 sm:h-24 sm:w-24' />
            <div className='min-w-0 flex-1'>
              <h3 className='text-[28px] font-black leading-tight text-ink sm:text-[34px]'>{t(profile.name)}</h3>
              <dl className='mt-4 space-y-3'>
                {rows.map((r) => (
                  <div key={t(r.label)} className='flex flex-col gap-0.5 sm:flex-row sm:gap-4'>
                    <dt className='w-24 shrink-0 text-[13px] font-semibold uppercase tracking-wider text-secondary sm:pt-[3px]'>
                      {t(r.label)}
                    </dt>
                    <dd className={`text-[17px] leading-relaxed ${r.accent ? "font-semibold text-accent" : "text-white-100"}`}>
                      {r.value}
                    </dd>
                  </div>
                ))}
              </dl>
              {socials.length > 0 && (
                <div className='mt-5 flex flex-wrap gap-2'>
                  {socials.map((s) => (
                    <a
                      key={s.url}
                      href={s.url}
                      target='_blank'
                      rel='noreferrer'
                      className='inline-flex items-center gap-2 rounded-full bg-surface-2 px-4 py-2 text-[14px] text-ink ring-1 ring-line transition hover:ring-accent/60'
                    >
                      <svg viewBox='0 0 24 24' className='h-4 w-4 text-accent' fill='currentColor' aria-hidden='true'>
                        <path d={iconPaths[s.icon] ?? iconPaths.website} />
                      </svg>
                      {s.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Tilt>
    </motion.div>
  );
};

const About = () => {
  const { t } = useLang();
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>{t(ui.about.sub)}</p>
        <h2 className={styles.sectionHeadText}>{t(ui.about.head)}</h2>
      </motion.div>

      <ProfileCard />

      {profile.intro && (
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className='mt-8 text-secondary text-[17px] max-w-3xl leading-[30px] whitespace-pre-line'
        >
          {t(profile.intro)}
        </motion.p>
      )}

      {services.length > 0 && (
        <div className='mt-20 flex flex-wrap gap-10'>
          {services.map((service, index) => (
            <ServiceCard key={index} index={index} title={t(service.title)} icon={service.icon} />
          ))}
        </div>
      )}
    </>
  );
};

export default SectionWrapper(About, "about");

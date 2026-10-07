import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import { motion } from "framer-motion";

import "react-vertical-timeline-component/style.min.css";

import { styles } from "../styles";
import { experiences, ui } from "../constants";
import { SectionWrapper } from "../hoc";
import { textVariant } from "../utils/motion";
import { useLang } from "../i18n";
import MaskIcon from "./MaskIcon";

const ExperienceCard = ({ experience }) => {
  const { t } = useLang();
  const points = t(experience.points) ?? [];
  const org = t(experience.organization);

  return (
    <VerticalTimelineElement
      contentStyle={{ background: "rgb(var(--c-surface-2))", color: "rgb(var(--c-ink))" }}
      contentArrowStyle={{ borderRight: "7px solid rgb(var(--c-surface-2))" }}
      date={t(experience.date)}
      iconStyle={{ background: "rgb(var(--c-surface))" }}
      icon={
        <div className='flex justify-center items-center w-full h-full'>
          {experience.logo ? (
            <img src={experience.logo} alt={org} className='w-[60%] h-[60%] object-contain' />
          ) : (
            <MaskIcon src={experience.icon} className='w-[50%] h-[50%] bg-accent' />
          )}
        </div>
      }
    >
      <div>
        <h3 className='text-ink text-[22px] sm:text-[24px] font-bold leading-snug'>
          {t(experience.title)}
        </h3>
        <p className='text-secondary text-[16px] font-semibold' style={{ margin: 0 }}>
          {experience.url ? (
            <a href={experience.url} target='_blank' rel='noreferrer' className='hover:text-ink underline-offset-4 hover:underline'>
              {org}
            </a>
          ) : (
            org
          )}
        </p>
      </div>

      {points.length > 0 && (
        <ul className='mt-5 list-disc ml-5 space-y-2'>
          {points.map((point, index) => (
            <li key={index} className='text-white-100 text-[14px] pl-1 tracking-wider leading-relaxed'>
              {point}
            </li>
          ))}
        </ul>
      )}
    </VerticalTimelineElement>
  );
};

const Experience = () => {
  const { t } = useLang();
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} text-center`}>{t(ui.experience.sub)}</p>
        <h2 className={`${styles.sectionHeadText} text-center`}>{t(ui.experience.head)}</h2>
      </motion.div>

      <div className='mt-20 flex flex-col'>
        <VerticalTimeline>
          {experiences.map((experience, index) => (
            <ExperienceCard key={index} experience={experience} />
          ))}
        </VerticalTimeline>
      </div>
    </>
  );
};

export default SectionWrapper(Experience, "experience");

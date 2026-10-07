import { motion } from "framer-motion";

import { BallCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { technologies, ui } from "../constants";
import { styles } from "../styles";
import { textVariant } from "../utils/motion";
import { useLang } from "../i18n";

const Tech = () => {
  const { t } = useLang();
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} text-center`}>{t(ui.skills.sub)}</p>
        <h2 className={`${styles.sectionHeadText} text-center`}>{t(ui.skills.head)}</h2>
      </motion.div>

      <div className='mt-16 flex flex-row flex-wrap justify-center gap-x-10 gap-y-6'>
        {technologies.map((technology) => (
          <div className='w-28 flex flex-col items-center' key={technology.name}>
            <div className='w-28 h-28'>
              <BallCanvas icon={technology.icon} />
            </div>
            <p className='mt-1 text-secondary text-[13px] text-center'>{technology.name}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Tech, "skills");

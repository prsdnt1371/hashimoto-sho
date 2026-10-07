import { useEffect } from "react";

import { About, Contact, Experience, Footer, Hero, Navbar, Photos, Tech, Works, StarsCanvas } from "./components";
import { experiences, photos, profile, technologies, works } from "./constants";
import { useLang } from "./i18n";

const App = () => {
  const { t } = useLang();

  useEffect(() => {
    document.title = `${t(profile.name)} | Portfolio`;
  }, [t]);

  return (
    <div className='relative z-0 bg-primary'>
      <div className='relative'>
        <div aria-hidden='true' className='hero-lines absolute inset-0 pointer-events-none' />
        <Navbar />
        <Hero />
      </div>
      <About />
      {photos.length > 0 && <Photos />}
      {experiences.length > 0 && <Experience />}
      {technologies.length > 0 && <Tech />}
      {works.length > 0 && <Works />}
      <div className='relative z-0'>
        <Contact />
        <Footer />
        <StarsCanvas />
      </div>
    </div>
  );
};

export default App;

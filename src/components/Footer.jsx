import { credits, profile, ui } from "../constants";
import { useLang } from "../i18n";

const Footer = () => {
  const { t } = useLang();
  return (
    <footer className='relative z-10 sm:px-16 px-6 pb-10 pt-4 max-w-7xl mx-auto text-center text-[12px] text-secondary/80 leading-6'>
      <p>
        © {new Date().getFullYear()} {t(profile.name)}
      </p>
      <p>
        {t(ui.credits)}:{" "}
        {credits.map((c) => (
          <span key={c.url}>
            <a href={c.url} target='_blank' rel='noreferrer' className='underline underline-offset-2 hover:text-ink'>
              {c.label}
            </a>{" "}
            (
            <a href={c.licenseUrl} target='_blank' rel='noreferrer' className='underline underline-offset-2 hover:text-ink'>
              {c.license}
            </a>
            )
          </span>
        ))}
        {" · "}
        Template:{" "}
        <a
          href='https://github.com/adrianhajdin/project_3D_developer_portfolio'
          target='_blank'
          rel='noreferrer'
          className='underline underline-offset-2 hover:text-ink'
        >
          JavaScript Mastery
        </a>
      </p>
    </footer>
  );
};

export default Footer;

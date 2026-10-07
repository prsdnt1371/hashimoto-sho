import { profile } from "../constants";

// イニシャルのモノグラム（画像ファイル不要）
const Logo = ({ className = "w-9 h-9" }) => (
  <svg viewBox='0 0 40 40' className={className} aria-hidden='true'>
    <defs>
      <linearGradient id='logo-grad' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' style={{ stopColor: "rgb(var(--c-accent))" }} />
        <stop offset='100%' style={{ stopColor: "rgb(var(--c-accent-2))" }} />
      </linearGradient>
    </defs>
    <rect x='1' y='1' width='38' height='38' rx='10' fill='url(#logo-grad)' />
    <text
      x='20'
      y='21'
      textAnchor='middle'
      dominantBaseline='central'
      fontFamily='Poppins, sans-serif'
      fontWeight='800'
      fontSize={profile.initials.length > 2 ? 13 : 16}
      style={{ fill: "rgb(var(--c-on-accent))" }}
      letterSpacing='0.5'
    >
      {profile.initials}
    </text>
  </svg>
);

export default Logo;

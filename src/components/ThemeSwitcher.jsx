const SunIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="4.5" fill="currentColor" />
    <path
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
    />
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path fill="currentColor" d="M20.5 14.6A8.5 8.5 0 0 1 9.4 3.5a8.5 8.5 0 1 0 11.1 11.1Z" />
  </svg>
);

const GlassIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <rect
      x="3.5"
      y="3.5"
      width="17"
      height="17"
      rx="4.5"
      fill="currentColor"
      fillOpacity="0.25"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M8 15.5 15.5 8M8 10.5 10.5 8" />
  </svg>
);

const OPTIONS = [
  { value: "light", label: "Light", icon: <SunIcon /> },
  { value: "dark", label: "Dark", icon: <MoonIcon /> },
  { value: "glass", label: "Glass", icon: <GlassIcon /> },
];

/** Segmented control built on native radio buttons (arrow keys move between options). */
const ThemeSwitcher = ({ theme, onChange }) => (
  <fieldset className="theme-switcher">
    <legend className="visually-hidden">Theme</legend>
    {OPTIONS.map(({ value, label, icon }) => (
      <label key={value} className="theme-option" title={`${label} theme`}>
        <input
          type="radio"
          name="theme"
          value={value}
          className="theme-option-input"
          checked={theme === value}
          onChange={() => onChange(value)}
        />
        <span className="theme-option-face">
          {icon}
          <span className="theme-option-label">{label}</span>
        </span>
      </label>
    ))}
  </fieldset>
);

export default ThemeSwitcher;

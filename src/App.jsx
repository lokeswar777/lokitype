import TypingBox from "./components/TypingBox";
import ThemeSwitcher from "./components/ThemeSwitcher";
import { useTheme } from "./theme";

const LOGO_TEXT = "Loki type";

function App() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="app">
      <header className="site-header">
        <h1 className="logo">
          <span className="visually-hidden">{LOGO_TEXT}</span>
          <span className="logo-letters" aria-hidden="true">
            {[...LOGO_TEXT].map((char, i) => {
              // --i drives the staggered typing animation in index.css.
              const style = { "--i": i };
              const last = i === LOGO_TEXT.length - 1 ? " logo-char--last" : "";
              return char === " " ? (
                <span key={i} className={`logo-space logo-char${last}`} style={style} />
              ) : (
                <span
                  key={i}
                  className={`logo-letter logo-char${i > 4 ? " logo-letter--accent" : ""}${last}`}
                  style={style}
                >
                  {char}
                </span>
              );
            })}
          </span>
        </h1>
        <ThemeSwitcher theme={theme} onChange={setTheme} />
      </header>

      <main className="site-main">
        <TypingBox />
      </main>

      <footer className="site-footer">
        <p>
          <kbd>Space</kbd> next word
          <span className="footer-sep" aria-hidden="true">·</span>
          <kbd>Tab</kbd> then <kbd>Enter</kbd> restart
        </p>
      </footer>
    </div>
  );
}

export default App;

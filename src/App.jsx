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
            {[...LOGO_TEXT].map((char, i) =>
              char === " " ? (
                <span key={i} className="logo-space" />
              ) : (
                <span key={i} className={i > 4 ? "logo-letter logo-letter--accent" : "logo-letter"}>
                  {char}
                </span>
              )
            )}
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

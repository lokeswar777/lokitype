import { useState, useEffect, useRef, useCallback } from "react";
import "./TypingBox.css";

const wordBank = [
  "cat", "dog", "red", "sun", "sky", "run", "fox", "jam", "cup", "pen",
  "apple", "grape", "chair", "table", "mouse", "light", "water", "train", "music", "dance",
  "elephant", "keyboard", "javascript", "computer", "internet", "mountain", "language", "building", "calendar", "chocolate",
  "quartz", "jigsaw", "vortex", "xylophone", "buzzard", "wizard", "oxygen", "zebra", "quiz", "fizz",
  "London", "Paris", "Amazon", "Google", "Python", "React", "Tesla", "India", "Tokyo", "Berlin",
  "banjo", "sphinx", "jovial", "zephyr", "crypt", "plasma", "fjord", "glyph", "whiskey", "puzzle"
];

const generateWords = (count = 20) => {
  let words = [];
  for (let i = 0; i < count; i++) {
    let nextWord;
    do {
      nextWord = wordBank[Math.floor(Math.random() * wordBank.length)];
    } while (i > 0 && words[i - 1] === nextWord);
    words.push(nextWord);
  }
  return words;
};

const TypingBox = () => {
  const [words, setWords] = useState([]);
  const [currentInput, setCurrentInput] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedWords, setTypedWords] = useState([]);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalCharsTyped, setTotalCharsTyped] = useState(0);
  const [finished, setFinished] = useState(false);
  const [timeLimit, setTimeLimit] = useState(30);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [testStarted, setTestStarted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef(null);
  const timerRef = useRef(null);

  const resetTest = useCallback(() => {
    clearInterval(timerRef.current);
    setWords(generateWords(30)); // Generate more words for longer tests
    setCurrentInput("");
    setCurrentIndex(0);
    setTypedWords([]);
    setCorrectChars(0);
    setTotalCharsTyped(0);
    setFinished(false);
    setTimeLeft(timeLimit);
    setTestStarted(false);
    containerRef.current.scrollTop = 0;
    containerRef.current.focus();
  }, [timeLimit]);

  useEffect(() => {
    resetTest();
  }, [resetTest]);

  // Keep the active line as the second visible line so upcoming words stay in view.
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !testStarted) return;
    const currentWordEl = container.querySelector(".word.current-word");
    if (!currentWordEl) return;
    const lineHeight =
      parseFloat(getComputedStyle(container).lineHeight) || currentWordEl.offsetHeight;
    const line = Math.round((currentWordEl.offsetTop - container.offsetTop) / lineHeight);
    container.scrollTop = Math.max(0, (line - 1) * lineHeight);
  }, [currentIndex, testStarted]);

  useEffect(() => {
    if (testStarted && !finished) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [testStarted, finished]);

  const handleKeyDown = (e) => {
    if (finished || timeLeft === 0) return;

    if (!testStarted) setTestStarted(true);

    if (e.key === " ") {
      e.preventDefault();
      const currentWord = words[currentIndex];
      let correctCharsInWord = 0;

      for (let i = 0; i < Math.min(currentInput.length, currentWord.length); i++) {
        if (currentInput[i] === currentWord[i]) correctCharsInWord++;
      }

      setCorrectChars(prev => prev + correctCharsInWord);
      setTotalCharsTyped(prev => prev + currentWord.length); // Count all chars in the word for accuracy
      setTypedWords(prev => [...prev, currentInput]);
      setCurrentInput("");
      setCurrentIndex(prev => prev + 1);

      if (currentIndex === words.length - 1) {
        setWords(prevWords => [...prevWords, ...generateWords(20)]);
      }

      return;
    }

    if (e.key === "Backspace") {
      if (currentInput.length > 0) {
        setCurrentInput(prev => prev.slice(0, -1));
      }
      e.preventDefault(); // stops going back to previous word
      return;
    }

    if (e.key.length === 1) {
      setCurrentInput(prev => prev + e.key);
    }
  };

  const handleTimeChange = (newTime) => {
    setTimeLimit(newTime);
    setTimeLeft(newTime);
  };

  const calculateWPM = () => {
    if (finished) {
      const minutes = timeLimit / 60;
      return Math.round(correctChars / 5 / minutes);
    }
    const timeSpent = timeLimit - timeLeft;
    if (timeSpent === 0) return 0;
    const minutes = timeSpent / 60;
    if (minutes === 0) return 0;
    const wpm = Math.round(correctChars / 5 / minutes);
    return wpm;
  };

  const calculateAccuracy = () => {
    if (totalCharsTyped === 0) return 100;
    return Math.round((correctChars / totalCharsTyped) * 100);
  };

  const renderWord = (word, index) => {
    return (
      <span key={index} className={`word ${index === currentIndex ? 'current-word' : ''}`}>
        {word.split("").map((char, i) => {
          let charClass = "char";

          if (index === currentIndex) {
            if (i < currentInput.length) {
              charClass += currentInput[i] === char ? " correct" : " incorrect";
            }
            if (i === currentInput.length) {
              charClass += " current";
            }
          } else if (index < currentIndex) {
            const typed = typedWords[index] || "";
            if (i < typed.length) {
              charClass += typed[i] === char ? " correct" : " incorrect";
            } else {
              charClass += " incorrect";
            }
          }

          return (
            <span key={i} className={charClass}>
              {char}
            </span>
          );
        })}
        <span
          className={`space${
            index === currentIndex && currentInput.length >= word.length ? " current" : ""
          }`}
        >
          {" "}
        </span>
      </span>
    );
  };

  const wpm = calculateWPM();
  const accuracy = calculateAccuracy();

  let statusMessage = "Start typing to begin. The timer starts on your first keystroke.";
  if (finished) {
    statusMessage = `Time's up! ${wpm} WPM at ${accuracy}% accuracy.`;
  } else if (testStarted) {
    statusMessage = "Keep going. Press space to move to the next word.";
  }

  const progress = timeLimit > 0 ? timeLeft / timeLimit : 0;

  return (
    <section className="typing-container" aria-labelledby="typing-heading">
      <h2 id="typing-heading" className="visually-hidden">
        Typing test
      </h2>

      <div className="controls">
        <div className="timer" role="timer" aria-label={`${timeLeft} seconds remaining`}>
          <span className="timer-value">{timeLeft}</span>
          <span className="timer-unit" aria-hidden="true">s</span>
        </div>
        <div className="time-options" role="group" aria-label="Test duration">
          {[15, 30, 60, 120].map((time) => (
            <button
              key={time}
              type="button"
              className={`time-btn ${timeLimit === time ? "active" : ""}`}
              aria-pressed={timeLimit === time}
              onClick={() => handleTimeChange(time)}
            >
              {time}s
            </button>
          ))}
        </div>
      </div>

      <div className="progress" aria-hidden="true">
        <div className="progress-bar" style={{ transform: `scaleX(${progress})` }} />
      </div>

      <div
        className={`words-wrapper${isFocused ? " is-focused" : ""}${
          finished ? " is-finished" : ""
        }`}
      >
        <div
          className="words-display"
          ref={containerRef}
          tabIndex="0"
          role="textbox"
          aria-label="Typing area"
          aria-describedby="typing-status"
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        >
          {words.map((word, index) => renderWord(word, index))}
        </div>
        <div className="focus-hint" aria-hidden="true">
          <span>Click here to focus and start typing</span>
        </div>
      </div>

      <p id="typing-status" className="status" aria-live="polite">
        {statusMessage}
      </p>

      <dl className={`stats${finished ? " is-final" : ""}`}>
        <div className="stat">
          <dt>WPM</dt>
          <dd>{finished ? wpm : "-"}</dd>
        </div>
        <div className="stat">
          <dt>Accuracy</dt>
          <dd>{finished ? `${accuracy}%` : "-"}</dd>
        </div>
      </dl>

      <div className="actions">
        <button type="button" className="btn btn-primary reset-btn" onClick={resetTest}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5"
            />
          </svg>
          Reset
        </button>
      </div>
    </section>
  );
};

export default TypingBox;

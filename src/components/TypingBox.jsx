import React, { useState, useEffect, useRef } from "react";
import "./TypingBox.css";

const wordBank = ["Lokeswar",
  "apple", "banana", "grape", "fast", "keyboard", "react", "javascript",
  "hello", "code", "type", "fun", "dark", "light", "train", "car", "random",
  "quiz", "vivid", "window", "xylophone", "zebra",

  "quick",      // q, u, i, c, k
  "jazz",       // j, a, z, z
  "oxygen",     // o, x, y, g, e, n
  "wizard",     // w, i, z, a, r, d
  "velocity",   // v, e, l, o, c, i, t, y
  "exquisite",  // e, x, q, u, i, s, i, t, e
  "buzz",       // b, u, z, z
  "whiskey",    // w, h, i, s, k, e, y
  "vortex",     // v, o, r, t, e, x
  "quiver",     // q, u, i, v, e, r
  "fizz",       // f, i, z, z
  "oxygenate",  // o, x, y, g, e, n, a, t, e
  "quickly",    // q, u, i, c, k, l, y
  "wax",        // w, a, x
  "zombie",     // z, o, m, b, i, e
  "exodus",     // e, x, o, d, u, s
  "wave",       // w, a, v, e
  "mix",        // m, i, x
  "quack",      // q, u, a, c, k
  "jovial",     // j, o, v, i, a, l
  "zesty",      // z, e, s, t, y
  "whale",      // w, h, a, l, e
  "fizzing",    // f, i, z, z, i, n, g
  "vixen",      // v, i, x, e, n
  "quickest",   // q, u, i, c, k, e, s, t
  "wizardry",   // w, i, z, a, r, d, r, y
  "xerox",      // x, e, r, o, x
  "Apple", "Banana", "Grape", "Fast", "Keyboard", "React", "Javascript",
  "Hello", "Code", "Type", "Fun", "Dark", "Light", "Train", "Car", "Random",
  "Quiz", "Vivid", "Window", "Xylophone", "Zebra",

  "Quick",      // q, u, i, c, k
  "Jazz",       // j, a, z, z
  "Oxygen",     // o, x, y, g, e, n
  "Wizard",     // w, i, z, a, r, d
  "Velocity",   // v, e, l, o, c, i, t, y
  "Exquisite",  // e, x, q, u, i, s, i, t, e
  "Buzz",       // b, u, z, z
  "Whiskey",    // w, h, i, s, k, e, y
  "Vortex",     // v, o, r, t, e, x
  "Quiver",     // q, u, i, v, e, r
  "Fizz",       // f, i, z, z
  "Oxygenate",  // o, x, y, g, e, n, a, t, e
  "Quickly",    // q, u, i, c, k, l, y
  "Wax",        // w, a, x
  "Zombie",     // z, o, m, b, i, e
  "Exodus",     // e, x, o, d, u, s
  "Wave",       // w, a, v, e
  "Mix",        // m, i, x
  "Quack",      // q, u, a, c, k
  "Jovial",     // j, o, v, i, a, l
  "Zesty",      // z, e, s, t, y
  "Whale",      // w, h, a, l, e
  "Fizzing",    // f, i, z, z, i, n, g
  "Vixen",      // v, i, x, e, n
  "Quickest",   // q, u, i, c, k, e, s, t
  "Wizardry",   // w, i, z, a, r, d, r, y
  "Xerox"
];


const generateWords = (count = 30) =>
  Array.from({ length: count }, () => wordBank[Math.floor(Math.random() * wordBank.length)]);

const TypingBox = () => {
  const [words, setWords] = useState(generateWords());
  const [currentInput, setCurrentInput] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [finished, setFinished] = useState(false);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalCharsTyped, setTotalCharsTyped] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleInputChange = (e) => {
    if (finished) return;

    const value = e.target.value;
    if (!startTime) setStartTime(Date.now());

    setCurrentInput(value);

    // Count chars typed (excluding trailing spaces)
    setTotalCharsTyped((prev) => prev + (value.length - currentInput.length));

    // If space pressed, evaluate word
    if (value.endsWith(" ")) {
      const wordTyped = value.trim();
      const currentWord = words[currentIndex];
      let correctCharsInWord = 0;

      for (let i = 0; i < Math.min(wordTyped.length, currentWord.length); i++) {
        if (wordTyped[i] === currentWord[i]) correctCharsInWord++;
      }

      setCorrectChars((prev) => prev + correctCharsInWord);

      setCurrentInput("");
      setCurrentIndex((prev) => prev + 1);

      if (currentIndex + 1 === words.length) {
        setFinished(true);
      }
    }
  };

  const getElapsedMinutes = () => {
    if (!startTime) return 0;
    return (Date.now() - startTime) / 1000 / 60;
  };

  const calculateWPM = () => {
    const minutes = getElapsedMinutes();
    if (minutes === 0) return 0;

    // Standard: 5 chars = 1 word
    return Math.round((correctChars / 5) / minutes);
  };

  const calculateAccuracy = () => {
    if (totalCharsTyped === 0) return 100;
    return ((correctChars / totalCharsTyped) * 100).toFixed(2);
  };

  // Render each word as span with per-char colored spans
  const renderWord = (word, index) => {
    if (index === currentIndex) {
      return (
        <span className="word" key={index}>
          {word.split("").map((char, i) => {
            let charClass = "char";
            if (i < currentInput.length) {
              charClass +=
                currentInput[i] === char ? " correct" : " incorrect";
            }
            if (i === currentInput.length) {
              charClass += " current";
            }
            return (
              <span key={i} className={charClass}>
                {char}
              </span>
            );
          })}
        </span>
      );
    }

    if (index < currentIndex) {
      // already typed words - green if correct, red if incorrect
      return (
        <span
          className="word"
          key={index}
          style={{ color: "#4ade80" }}
        >
          {word}
        </span>
      );
    }

    return (
      <span className="word" key={index} style={{ color: "#e0e0e0" }}>
        {word}
      </span>
    );
  };

  return (
    <div className="typing-container">
      <div className="words-display">{words.map(renderWord)}</div>

      <input
        ref={inputRef}
        className="typing-input"
        type="text"
        value={currentInput}
        onChange={handleInputChange}
        disabled={finished}
        placeholder="Start typing..."
        spellCheck={false}
        autoComplete="off"
      />

      <div className="stats">
        <span>WPM: {calculateWPM()}</span>
        <span>Accuracy: {calculateAccuracy()}%</span>
      </div>

      {finished && (
        <button onClick={() => window.location.reload()}>Try Again</button>
      )}
    </div>
  );
};

export default TypingBox;

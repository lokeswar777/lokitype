import React, { useState, useEffect, useRef } from "react";
import "./TypingBox.css";

const wordBank = [
  "Lokeswar", "apple", "banana", "grape", "fast", "keyboard", "react", "javascript",
  "hello", "code", "type", "fun", "dark", "light", "train", "car", "random",
  "quiz", "vivid", "window", "xylophone", "zebra", "quick", "jazz", "oxygen", "wizard",
  "velocity", "exquisite", "buzz", "whiskey", "vortex", "quiver", "fizz", "oxygenate",
  "quickly", "wax", "zombie", "exodus", "wave", "mix", "quack", "jovial", "zesty",
  "whale", "fizzing", "vixen", "quickest", "wizardry", "xerox",
  "Apple", "Banana", "Grape", "Fast", "Keyboard", "React", "Javascript",
  "Hello", "Code", "Type", "Fun", "Dark", "Light", "Train", "Car", "Random",
  "Quiz", "Vivid", "Window", "Xylophone", "Zebra", "Quick", "Jazz", "Oxygen", "Wizard",
  "Velocity", "Exquisite", "Buzz", "Whiskey", "Vortex", "Quiver", "Fizz", "Oxygenate",
  "Quickly", "Wax", "Zombie", "Exodus", "Wave", "Mix", "Quack", "Jovial", "Zesty",
  "Whale", "Fizzing", "Vixen", "Quickest", "Wizardry", "Xerox"
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
  const [typedWords, setTypedWords] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleInputChange = (e) => {
    if (finished) return;

    const value = e.target.value;
    if (!startTime) setStartTime(Date.now());

    setCurrentInput(value);

    // Count new characters typed (positive difference only)
    const newChars = Math.max(value.length - currentInput.length, 0);
    setTotalCharsTyped(prev => prev + newChars);

    if (value.endsWith(" ")) {
      const wordTyped = value.trim();
      const currentWord = words[currentIndex];

      let correctCharsInWord = 0;
      for (let i = 0; i < Math.min(wordTyped.length, currentWord.length); i++) {
        if (wordTyped[i] === currentWord[i]) correctCharsInWord++;
      }

      setCorrectChars(prev => prev + correctCharsInWord);
      setTypedWords(prev => [...prev, wordTyped]);
      setCurrentInput("");
      setCurrentIndex(prev => prev + 1);

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
    return Math.round((correctChars / 5) / minutes);
  };

  const calculateAccuracy = () => {
    if (totalCharsTyped === 0) return 100;
    return ((correctChars / totalCharsTyped) * 100).toFixed(2);
  };

  const renderWord = (word, index) => {
    // Current word
    if (index === currentIndex) {
      return (
        <span className="word" key={index}>
          {word.split("").map((char, i) => {
            let charClass = "char";
            if (i < currentInput.length) {
              charClass += currentInput[i] === char ? " correct" : " incorrect";
            }
            if (i === currentInput.length) {
              charClass += " current";
            }
            return (
              <span key={i} className={charClass}>{char}</span>
            );
          })}
        </span>
      );
    }

    // Previously typed words
    if (index < currentIndex) {
      const typed = typedWords[index] || "";
      return (
        <span className="word" key={index}>
          {word.split("").map((char, i) => {
            let charClass = "char";
            if (i < typed.length) {
              charClass += typed[i] === char ? " correct" : " incorrect";
            } else {
              charClass += " incorrect";
            }
            return (
              <span key={i} className={charClass}>{char}</span>
            );
          })}
        </span>
      );
    }

    // Future words
    return (
      <span className="word" key={index} style={{ color: "#e0e0e0" }}>
        {word}
      </span>
    );
  };

  return (
    <div className="typing-container">
      <div className="words-display">
        {words.map((word, index) => renderWord(word, index))}
      </div>

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

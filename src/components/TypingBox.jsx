import React, { useState, useEffect, useRef } from "react";
import "./TypingBox.css";

const wordBank = [
  "cat", "dog", "red", "sun", "sky", "run", "fox", "jam", "cup", "pen",
  "apple", "grape", "chair", "table", "mouse", "light", "water", "train", "music", "dance",
  "elephant", "keyboard", "javascript", "computer", "internet", "mountain", "language", "building", "calendar", "chocolate",
  "quartz", "jigsaw", "vortex", "xylophone", "buzzard", "wizard", "oxygen", "zebra", "quiz", "fizz",
  "London", "Paris", "Amazon", "Google", "Python", "React", "Tesla", "India", "Tokyo", "Berlin",
  "banjo", "sphinx", "jovial", "zephyr", "crypt", "plasma", "fjord", "glyph", "whiskey", "puzzle"
];

const generateWords = (count = 30) => {
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
  const [words, setWords] = useState(generateWords());
  const [currentInput, setCurrentInput] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedWords, setTypedWords] = useState([]);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalCharsTyped, setTotalCharsTyped] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [finished, setFinished] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    containerRef.current.focus();
  }, []);

  const handleKeyDown = (e) => {
    if (finished) return;

    if (!startTime) setStartTime(Date.now());

    if (e.key === " ") {
      e.preventDefault();
      const currentWord = words[currentIndex];
      let correctCharsInWord = 0;

      for (let i = 0; i < Math.min(currentInput.length, currentWord.length); i++) {
        if (currentInput[i] === currentWord[i]) correctCharsInWord++;
      }

      setCorrectChars(prev => prev + correctCharsInWord);
      setTypedWords(prev => [...prev, currentInput]);
      setCurrentInput("");
      setCurrentIndex(prev => prev + 1);

      if (currentIndex + 1 === words.length) {
        setFinished(true);
      }
      return;
    }

    if (e.key === "Backspace") {
      if (currentInput.length > 0) {
        setCurrentInput(prev => prev.slice(0, -1));
        setTotalCharsTyped(prev => prev - 1);
      }
      e.preventDefault(); // stops going back to previous word
      return;
    }

    if (e.key.length === 1) {
      setCurrentInput(prev => prev + e.key);
      setTotalCharsTyped(prev => prev + 1);
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
    return (
      <span key={index} className="word">
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
        <span className="space"> </span>
      </span>
    );
  };

  return (
    <div className="typing-container">
      <div
        className="words-display"
        ref={containerRef}
        tabIndex="0"
        onKeyDown={handleKeyDown}
      >
        {words.map((word, index) => renderWord(word, index))}
      </div>

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

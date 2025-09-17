import React, { useState, useEffect, useRef, useCallback } from "react";
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
    containerRef.current.focus();
  }, [timeLimit]);

  useEffect(() => {
    resetTest();
  }, [resetTest]);

  useEffect(() => {
    if (containerRef.current && testStarted) {
      const currentWordEl = containerRef.current.querySelector('.word.current-word');
      if (currentWordEl) {
        const container = containerRef.current;
        const wordTop = currentWordEl.offsetTop;
        const containerTop = container.offsetTop;
        container.scrollTop = wordTop - containerTop - container.clientHeight / 3;
      }
    }
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
        <span className="space"> </span>
      </span>
    );
  };

  return (
    <div className="typing-container">
      <div className="controls">
        <div className="timer">{timeLeft}</div>
        <div className="time-options">
          {[15, 30, 60, 120].map((time) => (
            <button
              key={time}
              className={`time-btn ${timeLimit === time ? "active" : ""}`}
              onClick={() => handleTimeChange(time)}
            >
              {time}s
            </button>
          ))}
        </div>
      </div>
      <div
        className="words-display"
        ref={containerRef}
        tabIndex="0"
        onKeyDown={handleKeyDown}
      >
        {words.map((word, index) => renderWord(word, index))}
      </div>

      <div className="stats">
        <span>WPM: {finished ? calculateWPM() : "-"}</span>
        <span>Accuracy: {finished ? `${calculateAccuracy()}%` : "-"}</span>
      </div>

      <button onClick={resetTest}>Reset</button>
    </div>
  );
};

export default TypingBox;

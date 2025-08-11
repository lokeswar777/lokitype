import React, { useState, useEffect, useRef } from "react";
import "./TypingBox.css";

const sentenceBank = [
  "The quick brown fox jumps over the lazy dog",
  "Pack my box with five dozen liquor jugs",
  "Jived fox nymph grabs quick waltz",
  "Sphinx of black quartz judge my vow",
  "How vexingly quick daft zebras jump",
  "Crazy Fredrick bought many very exquisite opal jewels",
  "We promptly judged antique ivory buckles for the next prize",
  "Jack quickly moved up the zebra fence",
  "Bright vixens jump dozy fowl quack",
  "Waltz bad nymph for quick jigs vex",
  "Five quacking zephyrs jolt my wax bed",
  "Quick zephyrs blow vexing daft Jim",
  "Grumpy wizards make a toxic brew for the jovial queen",
  "Just keep examining every low bid quoted for zinc etchings",
  "The job of waxing linoleum frequently peeves chintzy kids",
  "Sympathizing would fix Quaker objectives",
  "A wizard’s job is to vex chumps quickly in fog",
  "Brawny gods just flocked up to quiz and vex him",
  "Heavy boxes perform quick waltzes and jigs",
  "Quick blowing zephyrs vex daft Jim",
  "All questions asked by five watched experts amaze the judge",
  "Back in June we delivered oxygen equipment of the same size",
  "The five boxing wizards jump quickly",
  "When zombies arrive quickly fax Judge Pat",
  "Mr Jock, TV quiz PhD, bags few lynx",
  "Cwm fjord bank glyphs vext quiz",
  "Big fjords vex quick waltz nymph",
  "Glib jocks quiz nymph to vex dwarf",
  "Silly buzzing quips vexed Jack the dwarf",
  "Foxy diva Jennifer Lopez was not baking my quiche"
  
];


const generateSentences = (count = 5) =>
  Array.from({ length: count }, () => sentenceBank[Math.floor(Math.random() * sentenceBank.length)]);


const TypingBox = () => {

const [words, setWords] = useState(generateSentences());

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

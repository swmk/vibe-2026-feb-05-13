
import { useState, useEffect, useCallback } from "react";
import "./App.css";

const phrases = [
  "Hello world",
  "How are you",
  "What is your name",
  "This is a test",
  "React is a JavaScript library",
];

// Helper to get a random phrase
const getRandomPhrase = () => phrases[Math.floor(Math.random() * phrases.length)];

function App() {
  const [currentPhrase, setCurrentPhrase] = useState(getRandomPhrase()); // Initialize with a random phrase
  const [userInput, setUserInput] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);



  // Function to select a new phrase and reset state, wrapped in useCallback
  const selectNewPhrase = useCallback(() => {
    setCurrentPhrase(getRandomPhrase());
    setUserInput("");
    setIsCorrect(null);
    setShowAnswer(false);
  }, []);

  const handleVerify = () => {
    setIsCorrect(userInput.toLowerCase() === currentPhrase.toLowerCase());
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleNextClick = () => {
    selectNewPhrase();
  };

  const handleSpeakClick = useCallback(() => {
    if (currentPhrase && !isSpeaking) {
      const utterance = new SpeechSynthesisUtterance(currentPhrase);
      utterance.lang = 'en-US'; // Ensure English voice
      utterance.onstart = () => { // Set isSpeaking to true when speech actually starts
        setIsSpeaking(true);
      };
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
      };
      speechSynthesis.speak(utterance);
    }
  }, [currentPhrase, isSpeaking]);

  return (
    <div className="container">
      <h1 className="title">Listen and Type</h1>
      <p className="phrase-display">
        {isSpeaking ? "(Speaking...)" : "Click 'Speak' to hear the phrase."}
      </p>

      <div className="button-group">
        <button onClick={handleSpeakClick} className="primary" disabled={!currentPhrase || isSpeaking}>Speak</button>
        <button onClick={handleNextClick} className="secondary">Next Phrase</button>
      </div>

      <div className="input-section">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type what you hear"
          disabled={!currentPhrase || isSpeaking}
        />
        <div className="button-group">
          <button onClick={handleVerify} className="primary" disabled={!currentPhrase || !userInput || isSpeaking}>Verify</button>
          <button onClick={handleShowAnswer} className="warning" disabled={!currentPhrase || isSpeaking}>Show Answer</button>
        </div>
      </div>

      {isCorrect !== null && (
        <div className={`feedback ${isCorrect ? "correct" : "incorrect"}`}>
          {isCorrect ? "Correct!" : "Incorrect, try again."}
        </div>
      )}
      {showAnswer && <div className="answer">Correct Answer: {currentPhrase}</div>}
      <footer>Powered by Gemini CLI</footer>
    </div>
  );
}

export default App;

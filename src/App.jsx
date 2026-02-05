
import { useState, useEffect, useCallback } from "react";
import "./App.css";
import FeedbackForm from "./components/FeedbackForm";

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
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  // Effect for timer updates
  useEffect(() => {
    let intervalId;
    if (timerRunning && startTime !== null) {
      intervalId = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000); // Update every second
    }
    return () => clearInterval(intervalId); // Cleanup interval on component unmount or timer stop
  }, [timerRunning, startTime]);

  // Function to select a new phrase and reset state, wrapped in useCallback
  const selectNewPhrase = useCallback(() => {
    setCurrentPhrase(getRandomPhrase());
    setUserInput("");
    setIsCorrect(null);
    setShowAnswer(false);
    setStartTime(null);
    setElapsedTime(0);
    setTimerRunning(false);
  }, []);

  const handleVerify = () => {
    const correct = userInput.toLowerCase() === currentPhrase.toLowerCase();
    setIsCorrect(correct);
    if (correct) {
      setTimerRunning(false); // Stop the timer
    }
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
        setStartTime(Date.now()); // Start timer when speaking begins
        setElapsedTime(0);
        setTimerRunning(true);
      };
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        setTimerRunning(false); // Stop timer on error as well
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

      {timerRunning && <p className="timer">Time: {Math.floor(elapsedTime / 1000)}s</p>}

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
      <FeedbackForm />
      <footer>Powered by Gemini CLI</footer>
    </div>
  );
}

export default App;



import { useState, useEffect } from "react";
import "./App.css";

const phrases = [
  "Hello world",
  "How are you",
  "What is your name",
  "This is a test",
  "React is a JavaScript library",
];

function App() {
  const [currentPhrase, setCurrentPhrase] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    handleNext();
  }, []);

  const speakPhrase = () => {
    const utterance = new SpeechSynthesisUtterance(currentPhrase);
    speechSynthesis.speak(utterance);
  };

  const handleVerify = () => {
    setIsCorrect(userInput.toLowerCase() === currentPhrase.toLowerCase());
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleNext = () => {
    const randomIndex = Math.floor(Math.random() * phrases.length);
    setCurrentPhrase(phrases[randomIndex]);
    setUserInput("");
    setIsCorrect(null);
    setShowAnswer(false);
  };

  return (
    <div className="app-container">
      <div className="card">
        <h1 className="title">Listen and Type</h1>
        <div className="button-group">
          <button onClick={speakPhrase}>Speak</button>
          <button onClick={handleNext}>Next</button>
        </div>
        <input
          type="text"
          className="text-input"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type what you hear"
        />
        <div className="button-group" style={{ marginTop: "20px" }}>
          <button onClick={handleVerify}>Verify</button>
          <button onClick={handleShowAnswer}>Show Answer</button>
        </div>
        {isCorrect !== null && (
          <div className={`feedback ${isCorrect ? "correct" : "incorrect"}`}>
            {isCorrect ? "Correct!" : "Incorrect, try again."}
          </div>
        )}
        {showAnswer && <div className="show-answer">{currentPhrase}</div>}
      </div>
      <footer>Powered by Gemini CLI</footer>
    </div>
  );
}

export default App;


import { useState, useEffect, useCallback, useRef } from "react";
import Tesseract from "tesseract.js";
import "./App.css";
import FeedbackForm from "./components/FeedbackForm";

const defaultPhrases = [
  "Hello world",
  "How are you",
  "What is your name",
  "This is a test",
  "React is a JavaScript library",
];

function App() {
  const [phrases, setPhrases] = useState(defaultPhrases);
  const [currentPhrase, setCurrentPhrase] = useState(() => defaultPhrases[Math.floor(Math.random() * defaultPhrases.length)]);
  const [userInput, setUserInput] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const fileInputRef = useRef(null);

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
    setCurrentPhrase(phrases[Math.floor(Math.random() * phrases.length)]);
    setUserInput("");
    setIsCorrect(null);
    setShowAnswer(false);
    setStartTime(null);
    setElapsedTime(0);
    setTimerRunning(false);
  }, [phrases]);

  // Handle image upload and OCR processing
  const handleImageUpload = useCallback(async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create preview URL
    const imageUrl = URL.createObjectURL(file);
    setUploadedImageUrl(imageUrl);
    setIsProcessingImage(true);
    setOcrProgress(0);

    try {
      const result = await Tesseract.recognize(file, "eng", {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setOcrProgress(Math.round(m.progress * 100));
          }
        },
      });

      // Extract words from recognized text
      const text = result.data.text;
      const words = text
        .split(/\s+/)
        .map((word) => word.replace(/[^a-zA-Z]/g, "").trim())
        .filter((word) => word.length > 0);

      if (words.length > 0) {
        setPhrases(words);
        setCurrentPhrase(words[Math.floor(Math.random() * words.length)]);
        setUserInput("");
        setIsCorrect(null);
        setShowAnswer(false);
        setStartTime(null);
        setElapsedTime(0);
        setTimerRunning(false);
      }
    } catch (error) {
      console.error("OCR Error:", error);
    } finally {
      setIsProcessingImage(false);
      setOcrProgress(0);
    }
  }, []);

  // Reset to default phrases
  const handleResetPhrases = useCallback(() => {
    setPhrases(defaultPhrases);
    setCurrentPhrase(defaultPhrases[Math.floor(Math.random() * defaultPhrases.length)]);
    setUploadedImageUrl(null);
    setUserInput("");
    setIsCorrect(null);
    setShowAnswer(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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

      {/* Image Upload Section */}
      <div className="upload-section">
        <label htmlFor="image-upload" className="upload-label">
          Upload an image to extract words:
        </label>
        <input
          ref={fileInputRef}
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={isProcessingImage}
          className="file-input"
        />
        {uploadedImageUrl && (
          <div className="image-preview">
            <img src={uploadedImageUrl} alt="Uploaded" />
          </div>
        )}
        {isProcessingImage && (
          <div className="ocr-progress">
            <p>Processing image... {ocrProgress}%</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${ocrProgress}%` }}></div>
            </div>
          </div>
        )}
        {phrases !== defaultPhrases && (
          <div className="phrases-info">
            <p>{phrases.length} words extracted from image</p>
            <button onClick={handleResetPhrases} className="secondary small">
              Reset to Default
            </button>
          </div>
        )}
      </div>

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


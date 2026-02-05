
# Project Blueprint

## Overview

This project is a simple "listen and type" web application designed to help users practice their English listening and spelling skills. The application will play an audio of a simple English phrase, and the user will have to type the phrase they heard into a text box. The application will then verify if the user's input is correct.

## Implemented Features

*   **Audio Playback:** The application will use the Web Speech API to generate and play audio of English phrases.
*   **Text Input:** A text input field will be provided for users to type the phrases they hear.
*   **Verification:** The application will compare the user's input with the correct phrase and provide feedback.
*   **Show Answer:** A button will be available to reveal the correct answer.
*   **Modern UI:** The application will have a clean and modern user interface, with a visually balanced layout and polished styles.

## Plan for Current Request

1.  **Create `blueprint.md`:** Document the project overview, features, and the plan for the current request.
2.  **Style the application:**
    *   Modify `src/App.css` to add styles for the main application container, the buttons, the text input field, and the feedback messages.
    *   Modify `src/index.css` to add some basic global styles.
3.  **Implement the application logic in `src/App.jsx`:**
    *   Create a list of simple English phrases.
    *   Use the `useState` hook to manage the application's state, including the current phrase, the user's input, the verification status, and whether the correct answer is shown.
    *   Implement a function to select a random phrase from the list and speak it using the `speechSynthesis` API.
    *   Create the JSX for the application, including a "Speak" button, the text input field, a "Verify" button, and a "Show Answer" button.
    *   Implement the logic for the "Verify" and "Show Answer" buttons.
    *   Add a "Next" button to allow users to move to the next phrase.
4.  **Update `eslint.config.js`:** Change the configuration to use `globals` to avoid warnings for browser-specific APIs.
5.  **Clean up `src/App.css`:** Remove the default content of `src/App.css`.


import React, { useState } from 'react';

function FeedbackForm() {
  const [status, setStatus] = useState("");

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const form = ev.target;
    const data = new FormData(form);
    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });
      if (response.ok) {
        setStatus("Thanks for your feedback!");
        form.reset();
      } else {
        const result = await response.json();
        if (Object.hasOwnProperty.call(result, 'errors')) {
          setStatus(result.errors.map(error => error.message).join(", "));
        } else {
          setStatus("Oops! There was an error submitting your form.");
        }
      }
    } catch (error) {
      setStatus("Oops! There was a network error. Please try again later.");
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h2>Give Us Feedback!</h2>
      <form onSubmit={handleSubmit} action="https://formspree.io/f/mvzbpage" method="POST">
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Name:</label>
          <input type="text" id="name" name="name" style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email:</label>
          <input type="email" id="email" name="email" required style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="message" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Message:</label>
          <textarea id="message" name="message" required rows="5" style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}></textarea>
        </div>
        <button type="submit" style={{ backgroundColor: '#007bff', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}>Submit Feedback</button>
        {status && <p style={{ marginTop: '15px', color: status.includes("Oops") ? 'red' : 'green' }}>{status}</p>}
      </form>
    </div>
  );
}

export default FeedbackForm;

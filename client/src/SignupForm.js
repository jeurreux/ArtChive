import React, { useState } from 'react';
import './LoginForm.css';

function SignupForm({ onSignup, switchToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    fetch('http://localhost:5000/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        if (response.ok) {
          onSignup();
        } else {
          alert('Signup failed');
        }
      })
      .catch((error) => {
        console.error('Signup error:', error);
        alert('Something went wrong.');
      });

    setEmail('');
    setPassword('');
  }

  return (
    <div className="login-wrapper">
      <div className="video-background">
        <video autoPlay muted loop playsInline>
          <source src="/login-videobackground.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="login-container">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className='loginbutton' type="submit">Create Account</button>
        </form>
        <p>
          Already have an account?{' '}
          <button className='signuploginbutton' onClick={switchToLogin}>Log in</button>
        </p>
      </div>
    </div>
  );
}

export default SignupForm;

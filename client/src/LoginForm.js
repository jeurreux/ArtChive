import React, { useState } from 'react';
import './LoginForm.css';

function LoginForm({ onLogin, switchToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

function handleSubmit(event) {
  event.preventDefault();

  fetch('http://localhost:5000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
    .then(response => {
      if (response.ok) {
        onLogin();
      } else {
        alert('Invalid credentials');
      }
    })
    .catch(error => {
      console.error('Login error:', error);
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
        <h2>Login</h2>
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

          <button className='loginbutton' type="submit">Login</button>
        </form>
        <p>
          Don't have an account?{' '}
          <button className='signupbutton'onClick={switchToSignup}>Sign Up</button>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;

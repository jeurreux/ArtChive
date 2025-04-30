import React from 'react';
import './LoginForm.css';

function AuthForm({
  isSignup,
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  toggleMode,
}) {
  return (
    <div className="login-wrapper">
      <div className="video-background">
        <video autoPlay muted loop playsInline>
          <source src="/login-background.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="login-container">
        <h2>{isSignup ? 'Sign Up' : 'Log In'}</h2>

        <form onSubmit={onSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={onEmailChange}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={onPasswordChange}
          />
          <button type="submit">
            {isSignup ? 'Create Account' : 'Log In'}
          </button>
        </form>

        <p>
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button onClick={toggleMode}>
            {isSignup ? 'Log In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthForm;

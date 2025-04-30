import React, { useState } from 'react';
import ArtForm from './ArtForm';
import SignupForm from './SignupForm';
import LoginForm from './LoginForm';
import './App.css';

function App() {
  const [showSignup, setShowSignup] = useState(false);
  const [entries, setEntries] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  function addNewEntry(entry) {
    setEntries([entry, ...entries]);
  }

  function handleLogin() {
    setLoggedIn(true);
  }

  function switchToSignup(){
    setShowSignup(true);
  }

  function switchToLogin(){
    setShowSignup(false);
  }

  function handleSignup(){
    setLoggedIn(true);
  }

  return (
    <div>
      {loggedIn ? (
        <div>
          <h1>ArtChive</h1>
          <ArtForm onAddEntry={addNewEntry} />
          <div>
            <h2>Archive</h2>
            {entries.map((entry) => (
              <div key={entry.id}>
                <h3>{entry.title}</h3>
                <img src={entry.imageUrl} alt={entry.title} style={{ width: '300px' }} />
                <p><strong>Tags:</strong> {entry.tags.join(', ')}</p>
                <p>{entry.notes}</p>
                <p><em>Added on: {entry.date}</em></p>
              </div>
            ))}
          </div>

        </div>
      ) : showSignup ? (
      <SignupForm onSignup={handleSignup} switchToLogin={switchToLogin} />
    ) : (
      <LoginForm onLogin={handleLogin} switchToSignup={switchToSignup} />
    )}
    </div>
  );
}

export default App;

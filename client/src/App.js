import React, { useState } from 'react';
import AuthForm from './AuthForm';
import ArtForm from './ArtForm';
import ArtEntry from './ArtEntry';
import './App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);


  function handleLoginSubmit(e) {
    e.preventDefault();
    fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => {
        if (res.ok) {
          setLoggedIn(true);
        } else {
          alert('Login failed');
        }
      })
      .catch((err) => {
        console.error('Login error:', err);
        alert('Something went wrong');
      });
    setEmail('');
    setPassword('');
  }

  function handleSignupSubmit(e) {
    e.preventDefault();
    fetch('http://localhost:5000/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => {
        if (res.ok) {
          setLoggedIn(true); // or redirect to login instead
        } else {
          alert('Signup failed');
        }
      })
      .catch((err) => {
        console.error('Signup error:', err);
        alert('Something went wrong');
      });
    setEmail('');
    setPassword('');
  }

  function addNewEntry(entry) {
    setEntries([...entries, entry]);
  }

  if (loggedIn) {
    return (
      <div>
        <div className='topbar'>
          <h1>ArtChive</h1>
          <div className='top-buttons'>
          <button className='addbutton' onClick={() => setShowModal(true)}>Add Art</button>
          <button className="logoutbutton" onClick={() => setLoggedIn(false)}>Logout</button>
          </div>
        </div>

        <h2 className='h2gallery'>Gallery</h2>

        <div className='gallery-container'>
          <div className='entries-section'>
            {entries.map((entry, index) => (
              <ArtEntry key={index} entry={entry} onClick={() => setSelectedEntry(entry)} />
            ))}
          </div>
        </div>

        {selectedEntry && (
          <div className="modal-overlay" onClick={() => setSelectedEntry(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setSelectedEntry(null)}>✖</button>
            <h2>{selectedEntry.title}</h2>
            <img src={selectedEntry.imageUrl} alt={selectedEntry.title} />
            <p><strong>Notes:</strong> {selectedEntry.notes}</p>
            <p><strong>Tags:</strong> {selectedEntry.tags.join(', ')}</p>
            <p><em>Date added: {selectedEntry.date}</em></p>

            </div>
          </div>
        )}


        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="close-button" onClick={() => setShowModal(false)}>✖</button>
              <ArtForm onAddEntry={(entry) => {
                addNewEntry(entry);
                setShowModal(false);
              }} />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <AuthForm
      isSignup={showSignup}
      email={email}
      password={password}
      onEmailChange={(e) => setEmail(e.target.value)}
      onPasswordChange={(e) => setPassword(e.target.value)}
      onSubmit={showSignup ? handleSignupSubmit : handleLoginSubmit}
      toggleMode={() => setShowSignup(!showSignup)}
    />
  );
}

export default App;

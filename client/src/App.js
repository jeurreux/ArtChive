import React, { useState } from 'react';
import AuthForm from './AuthForm';
<<<<<<< HEAD
import './App.css'; // or './LoginForm.css' if styling is here

function App() {
  const [loggedIn, setLoggedIn] = useState(true);
=======
import ArtForm from './ArtForm';
import ArtEntry from './ArtEntry';
import './App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(true);
  const [showModal, setShowModal] = useState(false);
>>>>>>> new-artentry
  const [showSignup, setShowSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [entries, setEntries] = useState([]);

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
    setEntries([entry, ...entries]);
  }

  if (loggedIn) {
    return (
      <div>
<<<<<<< HEAD
        <h1>ArtChive</h1>
        {/* Add your app content like ArtForm, gallery, etc. */}
      </div>
=======

        <div className='toppart'>
        <h1>ArtChive</h1>
        <button className='addbutton' onClick={() => setShowModal(true)}>Add Art</button>
        <button className="logoutbutton" onClick={() => setLoggedIn(false)}>Logout</button>
        </div>

        <div className='entries-section'>
          <h2>Gallery</h2>
          {entries.map((entry,index) => (
            <ArtEntry key={index} entry={entry} />
          ))}
        </div>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="close-button" onClick={() => setShowModal(false)}>✖</button>
              <ArtForm onAddEntry={(entry) => {
                addNewEntry(entry);
                setShowModal(false); // close after submit
              }} />
            </div>
          </div>
        )}

      </div>

      
>>>>>>> new-artentry
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

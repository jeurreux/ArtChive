import React, { useState, useEffect } from 'react';
import AuthForm from './AuthForm';
import ArtForm from './ArtForm';
import ArtEntry from './ArtEntry';
import './App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);

  
  useEffect(() => {
    const userId =localStorage.getItem("userId");
    if (!userId) return;

    fetch(`http://localhost:5050/entries?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setEntries(data);
      })
      .catch((err) => {
        console.error("Error fetching entries:", err);
      });
  }, [loggedIn]);


  function handleLoginSubmit(e) {
    e.preventDefault();
    fetch('http://localhost:5050/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({username, password}),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Login failed");
        return res.json();
      })
      .then((data) => {
        localStorage.setItem("userId", data.userId);
        setLoggedIn(true);
      })
      .catch((err) => {
        console.error('Login error:', err);
        alert('Something went wrong');
      });
    setUsername('');
    setPassword('');
  }

  function handleSignupSubmit(e) {
    e.preventDefault();
    fetch('http://localhost:5050/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Signup failed');
        }
        return res.json();
      })
      .then((data) => {
        localStorage.setItem("userId", data.userId);
        setLoggedIn(true);
        loadEntries();
      })
      .catch((err) => {
        console.error('Signup error:', err);
        alert('Something went wrong');
      });
    setUsername('');
    setPassword('');
  }

  function addNewEntry(entry) {
    const userId = localStorage.getItem("userId");

    fetch('http://localhost:5050/entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...entry, userId }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add entry");
        return res.json();
      })
      .then((savedEntry) => {
        setEntries([...entries, savedEntry]);
      })
      .catch((err) => {
        console.error("Error saving entry:", err);
        alert("Could not save entry. Please try again.");
      });
  }

  function deleteEntry(id) {
    fetch(`http://localhost:5050/entries/${id}`, {
      method: 'DELETE',
    })
      .then(res => {
        if (!res.ok) throw new Error('Delete failed');
        setEntries(prev => prev.filter(entry => entry.id !== id));
      })
      .catch(err => console.error('Delete error:', err));
  }

  function loadEntries() {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
  
    fetch(`http://localhost:5050/entries?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setEntries(data);
      })
      .catch((err) => {
        console.error("Error fetching entries:", err);
      });
  }
  
  

  if (loggedIn) {
    return (
      <div>
        <div className='topbar'>
          <h1>ArtChive</h1>
          <div className='top-buttons'>
          <button className='addbutton' onClick={() => setShowModal(true)}>Add Art</button>
          <button className="logoutbutton" onClick={() => {
            const confirmLogout = window.confirm("Are you sure wou want to logout?");
            if(!confirmLogout) return;

            localStorage.removeItem("userId");
            setEntries([]);
            setLoggedIn(false);
            }}>Logout</button>
          </div>
        </div>

        <h2 className='h2gallery'>Gallery</h2>

        <div className='gallery-container'>
        {entries.length === 0 ? (
          <p className="empty-message">Your gallery is empty. Add an entry</p>):(
          <div className='entries-section'>
            {entries.map((entry, index) => (
              <ArtEntry
                key={index}
                entry={entry}
                onClick={() => setSelectedEntry(entry)}
                onDelete={deleteEntry}
              />))
            }
          </div>
      )}

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
            <button className="delete-button"
            onClick={() => {
              const confirmDelete = window.confirm("Delete this entry permanently");
              if (!confirmDelete) return;

              deleteEntry(selectedEntry.id);setSelectedEntry(null);
              setSelectedEntry(null);
              }}> Delete </button>

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
      username={username}
      password={password}
      onUsernameChange={(e) => setUsername(e.target.value)}
      onPasswordChange={(e) => setPassword(e.target.value)}
      onSubmit={showSignup ? handleSignupSubmit : handleLoginSubmit}
      toggleMode={() => setShowSignup(!showSignup)}
    />
  );
}

export default App;

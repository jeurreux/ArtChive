import React, { useState, useEffect } from 'react';
import AuthForm from './AuthForm';
import ArtForm from './ArtForm';
import ArtEntry from './ArtEntry';
import './App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("userId"));
  const [showModal, setShowModal] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editTags, setEditTags] = useState('');
  const placeholderCount = 7;
  const placeholderArray = Array.from({ length: placeholderCount }, (_, i) => i);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);


  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    if (selectedEntry) {
      setEditTitle(selectedEntry.title);
      setEditNotes(selectedEntry.notes);
      setEditTags(selectedEntry.tags.join(', '));
    }

    fetch(`http://localhost:5050/entries?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => setEntries(data))
      .catch((err) => console.error("Error fetching entries:", err));
  }, [selectedEntry, loggedIn]);

  function handleLoginSubmit(e) {
    e.preventDefault();
    fetch('http://localhost:5050/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        localStorage.setItem("userId", data.userId);
        setLoggedIn(true);
      })
      .catch(() => alert('Login failed'));
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
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        localStorage.setItem("userId", data.userId);
        setLoggedIn(true);
      })
      .catch(() => alert('Signup failed'));
    setUsername('');
    setPassword('');
  }

  function addNewEntry(entry) {
    const userId = localStorage.getItem("userId");
    const newEntry = {
      ...entry,
      userId,
      date: new Date().toISOString()
    };

    fetch('http://localhost:5050/entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEntry),
    })
      .then(res => res.json())
      .then(savedEntry => setEntries([...entries, savedEntry]))
      .catch(err => console.error("Error saving entry:", err));
  }

  function deleteEntry(id) {
    fetch(`http://localhost:5050/entries/${id}`, { method: 'DELETE' })
      .then(() => setEntries(entries.filter(entry => entry.id !== id)))
      .catch(err => console.error("Delete failed:", err));
  }

  function formatDate(dateString) {
    const d = new Date(dateString);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function handleSaveEdit() {
    const updatedEntry = {
      title: editTitle,
      notes: editNotes,
      tags: editTags.split(',').map(tag => tag.trim()),
    };

    fetch(`http://localhost:5050/entries/${selectedEntry.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedEntry),
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(() => {
        setEntries(prev =>
          prev.map(entry =>
            entry.id === selectedEntry.id ? { ...entry, ...updatedEntry } : entry
          )
        );
        setEditMode(false);
        setSelectedEntry(null);
      })
      .catch(err => console.error("Edit error:", err));
  }

  function toggleSelection(id) {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  }
  
  function handleDeleteSelected() {
    const confirmed = window.confirm("Are you sure you want to delete these entries?");
    if (!confirmed) return;
  
    Promise.all(
      selectedIds.map(id =>
        fetch(`http://localhost:5050/entries/${id}`, { method: 'DELETE' })
      )
    )
      .then(() => {
        setEntries(prev => prev.filter(entry => !selectedIds.includes(entry.id)));
        setSelectedIds([]);
        setSelectMode(false);
      })
      .catch(err => console.error("Batch delete error:", err));
  }
  
  

  if (!loggedIn) {
    return (
      <AuthForm
        isSignup={showSignup}
        username={username}
        password={password}
        onUsernameChange={e => setUsername(e.target.value)}
        onPasswordChange={e => setPassword(e.target.value)}
        onSubmit={showSignup ? handleSignupSubmit : handleLoginSubmit}
        toggleMode={() => setShowSignup(!showSignup)}
      />
    );
  }

  return (
    <div>
      <div className="topbar">
        <h1>ArtChive</h1>
        <div className="top-buttons">
        {selectMode ? (
          <>
            <button className="delete-selected" onClick={handleDeleteSelected}>Delete Selected</button>
            <button className="exit-select" onClick={() => {
              setSelectMode(false);
              setSelectedIds([]);
            }}>Cancel</button>
          </>
        ) : (
          <>
            <button className="select-mode-button" onClick={() => setSelectMode(true)}>Select Multiple</button>
          </>
        )}

          <button className="logoutbutton" onClick={() => {
            if (window.confirm("Are you sure you want to logout?")) {
              localStorage.removeItem("userId");
              setLoggedIn(false);
              setEntries([]);
            }
          }}>Logout</button>
        </div>
      </div>

      <h2 className='h2gallery'>Gallery</h2>
      <div className='gallery-container'>
        <div className="entries-section">
          <div className="art-entry add-box" onClick={() => setShowModal(true)}>
            <span className="plus-icon">＋</span>
          </div>
          {entries.length === 0
            ? placeholderArray.map(i => <div key={i} className="art-entry placeholder" />)
            : entries.map(entry => (
              <div
                key={entry.id}
                className={`art-entry-wrapper ${selectMode && selectedIds.includes(entry.id) ? "selected" : ""}`}
                onClick={() => {
                  if (selectMode) {
                    toggleSelection(entry.id);
                  } else {
                    setSelectedEntry(entry);
                  }
                }}
              >
                <ArtEntry entry={entry} onDelete={deleteEntry} />
              </div>

            ))}
        </div>
      </div>

      {selectedEntry && (
        <div className="modal-overlay" onClick={() => {
          setSelectedEntry(null);
          setEditMode(false);
        }}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-button" onClick={() => {
              setSelectedEntry(null);
              setEditMode(false);
            }}>✖</button>

            {!editMode && (
              <>
                <h2>{selectedEntry.title}</h2>
                <img src={selectedEntry.imageUrl} alt={selectedEntry.title} />
                <p><strong>Notes:</strong> {selectedEntry.notes}</p>
                <p><strong>Tags:</strong> {selectedEntry.tags.join(', ')}</p>
                <p><em>Date added: {selectedEntry.date ? formatDate(selectedEntry.date) : 'N/A'}</em></p>
                <button className="edit-button" onClick={() => setEditMode(true)}>Edit</button>
                <button className="delete-button" onClick={() => {
                  if (window.confirm("Delete this entry permanently?")) {
                    deleteEntry(selectedEntry.id);
                    setSelectedEntry(null);
                  }
                }}>Delete</button>
              </>
            )}

            {editMode && (
              <div className="edit-card">
                <label>Title:
                  <input value={editTitle} onChange={e => setEditTitle(e.target.value)} />
                </label>
                <label>Notes:
                  <textarea value={editNotes} onChange={e => setEditNotes(e.target.value)} />
                </label>
                <label>Tags (comma-separated):
                  <input value={editTags} onChange={e => setEditTags(e.target.value)} />
                </label>
                <button className="save-button" onClick={handleSaveEdit}>Save</button>
              </div>
            )}
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={() => setShowModal(false)}>✖</button>
            <ArtForm onAddEntry={entry => {
              addNewEntry(entry);
              setShowModal(false);
            }} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

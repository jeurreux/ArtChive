import React from 'react';
import './App.css';

function ArtEntry({ entry, onClick, onDelete }) {
  return (
    <div className="art-entry" onClick={onClick}>
      <img src={entry.imageUrl} alt={entry.title} />
    </div>
  );
}

export default ArtEntry;

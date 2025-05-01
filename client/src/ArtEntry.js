import React from 'react';

function ArtEntry({ entry, onClick }) {
  return (
    <div className="art-entry" onClick={onClick}>
      <img src={entry.imageUrl} alt={entry.title} />
    </div>
  );
}

export default ArtEntry;

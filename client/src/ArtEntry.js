import React from 'react';

function ArtEntry({ entry }) {
  return (
    <div className="art-entry">
      <h3>{entry.title}</h3>
      <img src={entry.imageUrl} alt={entry.title} />
      <p>{entry.notes}</p>
    </div>
  );
}

export default ArtEntry;

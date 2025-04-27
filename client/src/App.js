
import React, { useState } from 'react';
import './App.css';
import ArtForm from './ArtForm';


function App() {
  const [entries,setEntries] = useState([]);

  function addNewEntry(entry) {
    setEntries ([entry, ...entries]);
  }

  function deleteEntry(id){
    const updatedEntries = entries.filter(entry => entry.id !== id);
    setEntries(updatedEntries);
  }


  return (
    <div>
      <title>ArtChive</title>
      <h1>ArtChive</h1>
       <ArtForm onAddEntry={addNewEntry}/>

       <div>
        <h2>Archive</h2>
        {entries.map((entry) => (
          <div key={entry.id}>
            <h3>{entry.title}</h3>
            <img src={entry.imageUrl} alt={entry.title} style= {{width: '300px'}}/>
            <p><strong>Tags:</strong> {entry.tags.join(', ')}</p>
            <p>{entry.notes}</p>
            <p><em>Added on: {entry.date}</em></p>
            <button onClick={() => deleteEntry(entry.id)}>Delete</button>
            </div>
        ))}
       </div>
    </div>
  );
}

export default App;

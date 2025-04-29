import React, {useState} from 'react';
import ArtEntry from './ArtEntry';

function ArtForm({onAddEntry}) {
    const [title, setTitle] = useState('');
    const [imageUrl, setimageUrl] = useState('');
    const [tags, setTags] = useState('');
    const [notes, setNotes] = useState('');

    function handleSubmit(event){
        event.preventDefault();

        const newEntry = new ArtEntry(
            title,
            imageUrl,
            tags.split(',').map(tag => tag.trim()),
            notes
        );

        onAddEntry(newEntry);

        setTitle('');
        setimageUrl('');
        setTags('');
        setNotes('');

    }

    return(

        <form onSubmit={handleSubmit}>
            <h2> Add New Art Entry</h2>

            <input
            type="text"
            placeholder='Title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            />

            <input
            type="text"
            placeholder='Image URL'
            value={imageUrl}
            onChange={(e) => setimageUrl(e.target.value)}
            />

            <input
            type="text"
            placeholder='Tags'
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            />

            <input
            type= "text"
            placeholder='Notes'
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            />

            <button type = "submit">Add Entry</button>

        </form>


    );

}
export default ArtForm;
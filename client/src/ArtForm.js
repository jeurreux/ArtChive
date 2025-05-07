import React, {useState} from 'react';
import './AuthForm.css';


function ArtForm({onAddEntry}) {
    const [title, setTitle] = useState('');
    const [imageUrl, setimageUrl] = useState('');
    const [tags, setTags] = useState('');
    const [notes, setNotes] = useState('');
    const [imageFile, setImageFile] = useState(null);


    function handleSubmit(event){
        event.preventDefault();

        const newEntry = {
            title,
            imageUrl,
            tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
            notes,
            date: new Date().toLocaleDateString()
          };
          

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
            placeholder="Paste an image URL"
            value={imageUrl}
            onChange={(e) => setimageUrl(e.target.value)}
            />

            <input
            type="file"
            accept="image/*"
            onChange={(e) => {
                const file = e.target.files[0];
                setImageFile(file);
                setimageUrl(URL.createObjectURL(file));
            }}
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

            <button className='submit-entry-button' type = "submit">Add Entry</button>

        </form>


    );

}
export default ArtForm;
class ArtEntry{
    constructor(title, imageUrl, tags, notes){
        this.id = Math.floor(Math.random() * 1000000);
        this.title = title;
        this.imageUrl = imageUrl;
        this.tags = tags;
        this.notes = notes;
        this.date = new Date().toLocaleDateString();

    }
}

export default ArtEntry;
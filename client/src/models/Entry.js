class Entry{
constructor({ title, notes, tags = [], imageUrl, userId, date, id }) {
    this.title = title;
    this.notes = notes;
    this.tags = tags;
    this.imageUrl = imageUrl;
    this.userId = userId;
    this.date = date;
    this.id = id;
  }

  getFormattedDate() {
    return new Date(this.date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
}

export default Entry;
  
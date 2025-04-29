import Database from "better-sqlite3";
import path from "path";

const db = new Database(path.resolve("entries.db"));

db.exec(`
    CREATE TABLE IF NOT EXISTS entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    tags TEXT,
    notes TEXT,
    url TEXT
    );     
`);

export default db;
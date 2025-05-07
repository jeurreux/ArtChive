import Database from "better-sqlite3";
import path from "path";

const db = new Database(path.resolve("entries.db"));

db.exec(`
    CREATE TABLE IF NOT EXISTS entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    tags TEXT,
    notes TEXT,
    imageUrl TEXT,
    userId INTEGER NOT NULL,
    date TEXT
    );     
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
        );
`);

export default db;
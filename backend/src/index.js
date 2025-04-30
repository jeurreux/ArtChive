import express from "express";
import cors from "cors";
import "dotenv/config";
import db from "./db.js";
import { artEntrySchema } from "./validators.js";

const app = express();
const PORT =  process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/status", (req, res) =>
{
    res.send("server is good");   
});

app.post("/entries", (req, res) => 
{
    const parsed = artEntrySchema.safeParse(req.body);

    if (!parsed.success) {i
        return res.status(400).json({error: parsed.error.flatten() });
    }

    const {title, tags, notes, imageUrl } = parsed.data;

    const result = db.prepare(`
        INSERT INTO entries (title, tags, notes, imageUrl)
        VALUES (?, ?, ?, ?)
    `).run(title, JSON.stringify(tags), notes, imageUrl);

    const newEntry= {
        id: result.lastInsertRowid,
        title, tags, notes, imageUrl,
    };

    res.status(201).json(newEntry);
});

app.get("/entries", (req, res) => 
{
    const rows = db.prepare("SELECT * FROM entries").all();

    const entries = rows.map((row) => ({
        id: row.id,
        title: row.title,
        tags: JSON.parse(row.tags),
        notes: row.notes,
        imageUrl: row.imageUrl,
    }));

    res.json(entries);
});

app.listen(PORT, () =>
{
    console.log(`server is running http://localhost:${PORT}`);
});
import express from "express";
import cors from "cors";
import "dotenv/config";
import db from "./db.js";
import { artEntrySchema } from "./validators.js";
import bcrypt from 'bcryptjs';

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

    if (!parsed.success) {
        return res.status(400).json({error: parsed.error.flatten() });
    }

    const {title, tags, notes, imageUrl, userId } = parsed.data;

    const result = db.prepare(`
        INSERT INTO entries (title, tags, notes, imageUrl, userId)
        VALUES (?, ?, ?, ?, ?)
    `).run(title, JSON.stringify(tags), notes, imageUrl, userId);

    const newEntry= {
        id: result.lastInsertRowid,
        title, tags, notes, imageUrl,
    };

    res.status(201).json(newEntry);
});

app.get("/entries", (req, res) => {
    const { userId } = req.query;
    const stmt = db.prepare("SELECT * FROM entries WHERE userId = ?");
    const rows = stmt.all(userId);
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

app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username);
  
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
  
    const passwordMatch = bcrypt.compareSync(password, user.password);
  
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
  
    res.json({ userId: user.id });
  });

app.delete('/entries/:id', (req, res) => {
  const { id } = req.params;
  try {
    const stmt = db.prepare("DELETE FROM entries WHERE id = ?");
    stmt.run(id);
    res.status(204).send(); // No content
  } catch (err) {
    console.error('Delete failed:', err);
    res.status(500).json({ error: 'Failed to delete entry' });
  }
});

  

app.post('/signup', (req,res) =>{
    const {username, password} = req.body;

    if (!username || !password){
        return res.status(400).json({ error: 'username and password required' })
    }

    const hashed =bcrypt.hashSync(password, 10);

    try{
        const stmt = db.prepare('INSERT INTO users (username,password) VALUES (?,?)');
        const result = stmt.run(username, hashed);

        res.json({userId: result.lastInsertRowid});
    } catch (err){
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            res.status(409).json({ error: 'username already in use' });
          } else {
            console.error('Signup error:', err);
            res.status(500).json({ error: 'Signup failed' });
          }
    }
})
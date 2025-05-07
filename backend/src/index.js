import express from "express";
import cors from "cors";
import "dotenv/config";
import db from "./db.js";
import { artEntrySchema } from "./validators.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

const { verify } = jwt;
const app = express();
const PORT =  process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

function verifyToken(req, res, next) 
{
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
    {
        return res.status(401).json({error: "Missing or malformed token"});
    }

    const token = authHeader.split(" ")[1];
    try
    {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }catch(err){
        res.status(401).json({error: "Invalid or expired token"});
    }
}

app.use(cors());
app.use(express.json());

app.get("/status", (req, res) =>
{
    res.send("server is good");   
});

app.post("/entries", verifyToken, (req, res) => 
{   
    console.log("NEW ENTRY SUBMISSION:", req.body);

    const parsed = artEntrySchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({error: parsed.error.flatten() });
    }

    const {title, tags, notes, imageUrl, date } = parsed.data;

    const result = db.prepare(`INSERT INTO entries (title, tags, notes, imageUrl, userId, date)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(title, JSON.stringify(tags), notes, imageUrl, req.user.userId, date);
    

    const newEntry= {
        id: result.lastInsertRowid,
        title, 
        tags, 
        notes, 
        imageUrl,
        date,
    };

    res.status(201).json(newEntry);

});

app.get("/entries", verifyToken, (req, res) => {
    const userId = req.user.userId;
    const stmt = db.prepare("SELECT * FROM entries WHERE userId = ?");
    const rows = stmt.all(userId);
    const entries = rows.map((row) => ({
        id: row.id,
        title: row.title,
        tags: row.tags ? JSON.parse(row.tags) : [],
        notes: row.notes,
        imageUrl: row.imageUrl,
        date:row.date,
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

    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, {
        expiresIn: "1h"
    });

    res.json({ token });
  });

app.delete('/entries/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const  userId = req.user.userId;

  const entry = db.prepare("SELECT * FROM entries WHERE id = ?").get(id);
  if (!entry)
  {
    return res.status(404).json({error: "Entry not found"});
  }
  if (entry.userId !== userId)
  {
    return res.status(403).json({error: "You cannot delete this entry"});
  }
  db.prepare("DELETE FROM entries WHERE id = ?").run(id);
  res.status(204).send();
});

app.patch('/entries/:id', verifyToken, (req, res) => {
  const { title, notes, tags } = req.body;
  const id = req.params.id;
  const userId = req.user.userId;

  const entry = db.prepare("SELECT * FROM entries WHERE id = ?").get(id);
  if (!entry || entry.userId !== userId)
  {
    return res.status(403).json({error: "Forbidden"});
  }

  db.prepare(`
    UPDATE entries
    SET title = ?, notes = ?, tags = ?
    WHERE id = ?
  `).run(title, notes, JSON.stringify(tags), id);

  res.json({ id, title, notes, tags });
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
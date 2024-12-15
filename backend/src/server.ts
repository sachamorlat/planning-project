import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import { User } from './types';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Simple in-memory storage (for development)
let users: User[] = [];
let nextId = 1;

const JWT_SECRET = 'votre_secret_super_securise';

app.post('/api/auth/register', (req, res) => {
    const { email, name, password } = req.body;

    // Check if the user already exists
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    // Create a new user
    const newUser = {
        id: nextId++,
        email,
        name,
        password
    };

    users.push(newUser);

    // Generate a token
    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET);

    res.status(201).json({
        token,
        user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name
        }
    });
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);

    res.json({
        token,
        user: {
            id: user.id,
            email: user.email,
            name: user.name
        }
    });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
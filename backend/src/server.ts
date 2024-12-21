import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import "reflect-metadata";
import { AppDataSource } from './database/data-source';
import { User } from './types';
import workEntries from "./routes/workEntries";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const JWT_SECRET = 'votre_secret_super_securise';

// Initialiser la base de données
AppDataSource.initialize()
    .then(() => {
        console.log("Base de données initialisée avec succès");
    })
    .catch((error) => {
        console.log("Erreur lors de l'initialisation de la base de données:", error);
    });

const userRepository = AppDataSource.getRepository(User);

app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, name, password } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await userRepository.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email déjà utilisé' });
        }

        // Créer un nouvel utilisateur
        const newUser = userRepository.create({
            email,
            name,
            password // Note: Dans un vrai projet, il faudrait hasher le mot de passe!
        });

        // Sauvegarder l'utilisateur
        await userRepository.save(newUser);

        // Générer un token
        const token = jwt.sign({ userId: newUser.id }, JWT_SECRET);

        res.status(201).json({
            token,
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name
            }
        });
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userRepository.findOne({
            where: {
                email: email,
                password: password // Note: Dans un vrai projet, il faudrait comparer avec un hash
            }
        });

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
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

app.use('/api', workEntries);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
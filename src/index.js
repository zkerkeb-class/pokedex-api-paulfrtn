import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import pokemonRoutes from "./routes/pokemonRoutes.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

connectDB();

// Obtenir le chemin absolu du fichier actuel en utilisant les modules ES
const __filename = fileURLToPath(import.meta.url);
// __filename contient le chemin complet du fichier actuel

// Obtenir le chemin absolu du répertoire actuel
const __dirname = path.dirname(__filename);
// __dirname contient le chemin complet du répertoire où se trouve le fichier actuel

const app = express();
const PORT = process.env.PORT || 3000;

console.log(process.env);

// Middleware pour CORS
// Configuration CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Middleware pour parser le JSON
app.use(express.json());

// Middleware pour servir des fichiers statiques
// 'app.use' est utilisé pour ajouter un middleware à notre application Expresss
// '/assets' est le chemin virtuel où les fichiers seront accessibles
// 'express.static' est un middleware qui sert des fichiers statiques
// 'path.join(__dirname, '../assets')' construit le chemin absolu vers le dossier 'assets'
app.use("/assets", express.static(path.join(__dirname, "../assets")));

app.use("/api/pokemons", pokemonRoutes);
app.use("/api/auth", authRoutes);

// Démarrage du serveur
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Serveur démarré sur http://0.0.0.0:${PORT}`);
});

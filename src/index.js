import express from 'express';
import cors from 'cors';
import pokemonsList from './data/pokemons.json' assert { type: 'json' }
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

// Obtenir le chemin absolu du fichier actuel en utilisant les modules ES
const __filename = fileURLToPath(import.meta.url);
// __filename contient le chemin complet du fichier actuel

// Obtenir le chemin absolu du répertoire actuel
const __dirname = path.dirname(__filename);
// __dirname contient le chemin complet du répertoire où se trouve le fichier actuel

const app = express();
const PORT = 3000;

console.log(process.env);

// Middleware pour CORS
app.use(cors());

// Middleware pour parser le JSON
app.use(express.json());

// Middleware pour servir des fichiers statiques
// 'app.use' est utilisé pour ajouter un middleware à notre application Express
// '/assets' est le chemin virtuel où les fichiers seront accessibles
// 'express.static' est un middleware qui sert des fichiers statiques
// 'path.join(__dirname, '../assets')' construit le chemin absolu vers le dossier 'assets'
app.use('/assets', express.static(path.join(__dirname, '../assets')));

// Route GET de base
app.get('/api/pokemons', (req, res) => {
    res.send({
        pokemons: pokemonsList.map((pokemon) => ({
            name: pokemon.name.english,
            type: pokemon.type
        }))
    });
});

// Route GET pour obtenir un Pokémon par son nom
app.get('/api/pokemons/:id', (req, res) => {
    const pokemon = pokemonsList.find((pokemon) => pokemon.id === parseInt(req.params.id));

    if (pokemon) {
        res.send({
            id: pokemon.id,
            name: pokemon.name.french,
            type: pokemon.type,
            base: pokemon.base,
            image: pokemon.image
        });
    } else {
        res.status(404).send({
            message: 'Pokemon not found'
        });
    }
});

// Route POST pour ajouter un Pokémon
app.post('/api/pokemons', (req, res) => {
    const newPokemon = req.body;

    const filePath = path.join(__dirname, 'data', 'pokemons.json');

    if (newPokemon && newPokemon.id && newPokemon.name && newPokemon.type && newPokemon.base) {
        pokemonsList.push(newPokemon);

        try{
            fs.writeFileSync(filePath, JSON.stringify(pokemonsList, null, 2), 'utf-8');
            res.status(200).send({
                message: 'Pokemon added successfully'
            })
        }catch (error){
            res.status(500).send({
                message: 'Error saving Pokemon to file',
                error: error.message
            });
        }
    } else {
        res.status(400).send({
            message: 'Invalid Pokemon data'
        });
    }
});

// Route PUT pour mettre à jour un Pokémon
app.put('/api/pokemons/:id', (req, res) => {
    const pokemonIndex = pokemonsList.findIndex((pokemon) => pokemon.id === parseInt(req.params.id));

    if (pokemonIndex !== -1) {
        const updatedPokemon = req.body;

        // Vérification des données du Pokémon
        if (updatedPokemon && updatedPokemon.id && updatedPokemon.name && updatedPokemon.type && updatedPokemon.base) {

            pokemonsList[pokemonIndex] = updatedPokemon;

            const filePath = path.join(__dirname, 'data', 'pokemons.json');
            try {
                fs.writeFileSync(filePath, JSON.stringify(pokemonsList, null, 2), 'utf-8');
                res.status(200).send({
                    message: 'Pokemon updated successfully'
                });
            } catch (error) {
                res.status(500).send({
                    message: 'Error saving Pokemon to file',
                    error: error.message
                });
            }
        } else {
            res.status(400).send({
                message: 'Invalid Pokemon data'
            });
        }
    } else {
        res.status(404).send({
            message: 'Pokemon not found'
        });
    }
});



// Route DELETE pour supprimer un Pokémon
app.delete('/api/pokemons/:id', (req, res) => {
    const pokemonIndex = pokemonsList.findIndex((pokemon) => pokemon.id === parseInt(req.params.id));

    if (pokemonIndex !== -1) {
        pokemonsList.splice(pokemonIndex, 1);

        const filePath = path.join(__dirname, 'data', 'pokemons.json');

        try {
            fs.writeFileSync(filePath, JSON.stringify(pokemonsList, null, 2), 'utf-8');
            res.status(200).send({
                message: 'Pokemon deleted successfully'
            });
        } catch (error) {
            res.status(500).send({
                message: 'Error saving Pokemon to file',
                error: error.message
            });
        }
    } else {
        res.status(404).send({
            message: 'Pokemon not found'
        });
    }
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

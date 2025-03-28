// src/scripts/importData.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Pokemon from "../models/Pokemon.js";
import connectDB from "../config/db.js";

dotenv.config();
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lecture du JSON
const rawData = fs.readFileSync(path.join(__dirname, "../data/pokemons.json"));
const pokemons = JSON.parse(rawData);

// Transformation du format
const formattedPokemons = pokemons.map((p) => ({
  id: p.id,
  name: {
    french: p.name.french,
    english: p.name.english,
    japanese: p.name.japanese,
    chinese: p.name.chinese,
  },
  type: p.type.map((t) => t.toLowerCase()),
  base: {
    hp: p.base.HP,
    attack: p.base.Attack,
    defense: p.base.Defense,
    specialAttack: p.base["Sp. Attack"],
    specialDefense: p.base["Sp. Defense"],
    speed: p.base.Speed,
  },
  image: p.image,
}));

const importData = async () => {
  try {
    await Pokemon.deleteMany(); // on wipe la collection
    await Pokemon.insertMany(formattedPokemons);
    console.log("✔️ Données importées avec succès !");
    process.exit();
  } catch (error) {
    console.error("❌ Erreur d'importation :", error);
    process.exit(1);
  }
};

importData();

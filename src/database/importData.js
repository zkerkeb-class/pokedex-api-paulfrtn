import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Pokemon from "../models/Pokemon.js";
import User from "../models/User.js";
import connectDB from "../config/db.js";

dotenv.config();
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lecture du JSON
const rawData = fs.readFileSync(path.join(__dirname, "../data/pokemons.json"));
const pokemons = JSON.parse(rawData);

// Transformation du format
const formattedPokemons = pokemons.map((p) => {
  const base = {
    hp: p.base.HP,
    attack: p.base.Attack,
    defense: p.base.Defense,
    specialAttack: p.base["Sp. Attack"],
    specialDefense: p.base["Sp. Defense"],
    speed: p.base.Speed,
  };

  const totalStats = Object.values(base).reduce((sum, val) => sum + val, 0);

  let rarity;
  if (totalStats >= 600) rarity = "Mythic";
  else if (totalStats >= 525) rarity = "Legendary";
  else if (totalStats >= 475) rarity = "Ultra Rare";
  else if (totalStats >= 400) rarity = "Rare";
  else rarity = "Common";

  return {
    id: p.id,
    name: {
      french: p.name.french,
      english: p.name.english,
      japanese: p.name.japanese,
      chinese: p.name.chinese,
    },
    type: p.type.map((t) => t.toLowerCase()),
    base,
    image: p.image,
    rarity,
  };
});

const importData = async () => {
  try {
    await Pokemon.deleteMany();
    await User.deleteMany();
    await Pokemon.insertMany(formattedPokemons);
    console.log("✔️ Pokémons importées avec succès !");

    const admin = new User({
      firstname: "Admin",
      lastname: "Test",
      mail: "adminTTS@poke.com",
      password: "admin123",
      role: "admin",
    });

    const user = new User({
      firstname: "Aldous",
      lastname: "LeGrand",
      mail: "aldous@huxley.com",
      password: "password",
      role: "user",
    });

    await admin.save();
    await user.save();
    console.log("✔️ Utilisateurs créés avec succès.");

    process.exit();
  } catch (error) {
    console.error("❌ Erreur d'importation :", error);
    process.exit(1);
  }
};

importData();

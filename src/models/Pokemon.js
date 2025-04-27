import mongoose from "mongoose";

const pokemonSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      french: { type: String, required: true },
      english: { type: String, required: true },
      japanese: String,
      chinese: String,
    },
    type: [
      {
        type: String,
        enum: [
          "normal",
          "fire",
          "water",
          "grass",
          "electric",
          "ice",
          "fighting",
          "poison",
          "ground",
          "flying",
          "psychic",
          "bug",
          "rock",
          "ghost",
          "dragon",
          "dark",
          "steel",
          "fairy",
        ],
      },
    ],
    image: {
      type: String,
    },
    base: {
      hp: Number,
      attack: Number,
      defense: Number,
      specialAttack: Number,
      specialDefense: Number,
      speed: Number,
    },
    rarity: {
      type: String,
      enum: ["Common", "Rare", "Ultra Rare", "Legendary", "Mythic"],
      required: true,
    },
    evolutions: [
      {
        type: Number,
        ref: "Pokemon",
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Pokemon = mongoose.model("Pokemon", pokemonSchema);

export default Pokemon;

import express from "express";
import Pokemon from "../models/Pokemon.js";
import User from "../models/User.js";
import verifyToken from "../middleware/auth.middleware.js";
import isAdmin from "../middleware/admin.middleware.js";

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    const pokemons = await Pokemon.find({});
    res.json(pokemons);
  } catch (e) {
    res.status(500).json({ message: "Erreur serveur", error: e.message });
  }
});

router.get("/page/:page", verifyToken, async (req, res) => {
  const page = parseInt(req.params.page);
  const limit = 10;
  const skip = (page - 1) * limit;
  try {
    const totalCount = await Pokemon.countDocuments();
    const pokemons = await Pokemon.find({}).skip(skip).limit(limit);

    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      pokemons,
      totalPages,
    });
  } catch (e) {
    res.status(500).json({ message: "Erreur serveur", error: e.message });
  }
});

router.get("/id/:id", verifyToken, async (req, res) => {
  try {
    const pokemon = await Pokemon.findById(req.params.id);
    if (!pokemon)
      return res.status(404).json({ message: "Pokemon non trouvé" });
    res.json(pokemon);
  } catch (e) {
    res.status(500).json({ message: "Erreur serveur", error: e.message });
  }
});

router.get("/name/:name", verifyToken, async (req, res) => {
  const name = req.params.name.toLowerCase();
  try {
    const pokemons = await Pokemon.findOne({
      name: new RegExp(`^${name}$`, "i"),
    });
    if (!pokemons)
      return res.status(404).json({ message: "Pokemon non trouvé" });
    res.json(pokemons);
  } catch (e) {
    res.status(500).json({ message: "Erreur serveur", error: e.message });
  }
});

router.get("/type/:type", verifyToken, async (req, res) => {
  const type = req.params.type.toLowerCase();
  try {
    const pokemons = await Pokemon.find({
      type: type,
    });
    if (!pokemons)
      return res.status(404).json({ message: "Pokemon non trouvé" });
    res.json(pokemons);
  } catch (e) {
    res.status(500).json({ message: "Erreur serveur", error: e.message });
  }
});

router.get("/search", verifyToken, async (req, res) => {
  const { searchTerm, types, page = 1 } = req.query;
  const limit = 10;
  const skip = (parseInt(page) - 1) * limit;
  const query = {};

  if (searchTerm) {
    query.$or = [
      { "name.french": { $regex: searchTerm, $options: "i" } },
      { "name.english": { $regex: searchTerm, $options: "i" } },
    ];
  }

  if (types) {
    const typeArray = types.split(",");
    query.type = { $all: typeArray.map((t) => t.trim()) };
  }

  try {
    const totalCount = await Pokemon.countDocuments(query);
    const pokemons = await Pokemon.find(query).skip(skip).limit(limit);
    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      pokemons,
      totalPages,
    });
  } catch (e) {
    res.status(500).json({ message: "Erreur serveur", error: e.message });
  }
});

/**
 * @route   POST /api/pokemons
 * @desc    Ajouter un nouveau Pokémon
 * @access  Privé (JWT et role admin requis)
 * @headers Authorization: Bearer <token>
 * @body    {
 *            id: Number,
 *            name: { french, english, japanese, chinese },
 *            type: [String],
 *            base: { hp, attack, defense, special_attack, special_defense, speed },
 *            image: String
 *          }
 * @return  201 Created avec le Pokémon créé, ou 400 si déjà existant, ou 500 en erreur serveur
 */
router.post("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const pokemonData = req.body;

    const exists = await Pokemon.findOne({ id: pokemonData.id });
    if (exists) {
      return res.status(400).json({ message: "Ce pokemon existe déjà" });
    }

    const base = pokemonData.base;
    const totalStats = Object.values(base).reduce((sum, val) => sum + val, 0);
    
    let rarity;
    if (totalStats >= 600) rarity = "Mythic";
    else if (totalStats >= 525) rarity = "Legendary";
    else if (totalStats >= 475) rarity = "Ultra Rare";
    else if (totalStats >= 400) rarity = "Rare";
    else rarity = "Common";
    
    pokemonData.rarity = rarity;

    const newPokemon = new Pokemon(pokemonData);
    const savedPokemon = await newPokemon.save();

    res.status(201).json(savedPokemon);
  } catch (e) {
    res.status(500).json({ message: "Erreur serveur", error: e.message });
  }
});

/**
 * @route   PUT /api/pokemons/id/:id
 * @desc    Modifier un Pokémon existant par son ID MongoDB
 * @access  Privé (JWT et role admin requis)
 * @headers Authorization: Bearer <token>
 * @params  :id (String) → ID MongoDB du Pokémon à modifier
 * @body    Toutes les propriétés modifiables du Pokémon
 * @return  200 OK avec le Pokémon mis à jour, 404 si non trouvé, ou 500 en erreur serveur
 */
router.put("/id/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const updated = await Pokemon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated)
      return res.status(404).json({ message: "Pokemon introuvable" });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: "Erreur serveur", error: e.message });
  }
});

/**
 * @route   DELETE /api/pokemons/id/:id
 * @desc    Supprimer un Pokémon (admin uniquement)
 * @access  Privé (JWT + admin)
 * @headers Authorization: Bearer <token>
 * @params  :id (String) → ID MongoDB du Pokémon
 * @return  200 OK ou 403/401/404
 */
router.delete("/id/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const deleted = await Pokemon.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Pokémon introuvable" });
    res.json({ message: "Supprimé avec succès", pokemon: deleted });
  } catch (e) {
    res.status(500).json({ message: "Erreur suppression", error: e.message });
  }
});

/**
 * @route   GET /api/pokemons/booster
 * @desc    Tirer un booster de 5 Pokémon aléatoires selon la rareté
 * @access  Privé (JWT requis)
 * @headers Authorization: Bearer <token>
 * @return  200 OK avec un tableau de 5 Pokémon tirés
 *          Ces Pokémon sont automatiquement ajoutés au champ `unlockedPokemons` du user
 *          500 en cas d'erreur serveur
 */
router.get("/booster", verifyToken, async (req, res) => {
  const rarityChances = [
    { rarity: "Common", weight: 60 },
    { rarity: "Rare", weight: 25 },
    { rarity: "Ultra Rare", weight: 10 },
    { rarity: "Legendary", weight: 4 },
    { rarity: "Mythic", weight: 1 },
  ];

  function drawRarity() {
    const total = rarityChances.reduce((sum, r) => sum + r.weight, 0);
    const rand = Math.random() * total;
    let cumulative = 0;
    for (const rarity of rarityChances) {
      cumulative += rarity.weight;
      if (rand < cumulative) {
        return rarity.rarity;
      }
    }
  }

  function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("unlockedPokemons");

    const booster = [];

    for (let i = 0; i < 5; i++) {
      const rarity = drawRarity();
      const pokemons = await Pokemon.find({ rarity });
      if (pokemons.length === 0) continue;

      const randomPokemon = getRandomElement(pokemons);
      const isAlreadyUnlocked = user.unlockedPokemons.some((id) =>
        id.equals(randomPokemon._id),
      );

      booster.push({
        ...randomPokemon.toObject(),
        new: !isAlreadyUnlocked,
      });
    }

    const newPokemonIds = booster.filter((p) => p.new).map((p) => p._id);

    if (newPokemonIds.length > 0) {
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { unlockedPokemons: { $each: newPokemonIds } } },
        { new: true },
      );
    }

    res.json({ booster });
  } catch (e) {
    res
      .status(500)
      .json({ message: "Erreur lors du tirage", error: e.message });
  }
});

/**
 * @route   GET /api/pokemons/unlocked
 * @desc    Obtenir tous les Pokémon débloqués par l'utilisateur connecté
 * @access  Privé (JWT requis)
 * @headers Authorization: Bearer <token>
 * @return  200 OK avec la liste des Pokémon débloqués
 *          404 si l'utilisateur n'existe pas
 *          500 en cas d'erreur serveur
 */
router.get("/unlocked", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("unlockedPokemons");
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    res.json({ pokemons: user.unlockedPokemons });
  } catch (e) {
    res.status(500).json({ message: "Erreur serveur", error: e.message });
  }
});

export default router;

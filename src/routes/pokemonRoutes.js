import express from "express";
import Pokemon from "../models/Pokemon.js";
import verifyToken from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const pokemons = await Pokemon.find({});
    res.json(pokemons);
  } catch (e) {
    res.status(500).json({ message: "Erreur serveur", error: e.message });
  }
});

router.get("/page/:page", async (req, res) => {
  const page = parseInt(req.params.page);
  const limit = 10;
  const skip = (page - 1) * limit;
  try {
    const pokemons = await Pokemon.find({}).skip(skip).limit(limit);
    res.json(pokemons);
  } catch (e) {
    res.status(500).json({ message: "Erreur serveur", error: e.message });
  }
});

router.get("/id/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const pokemons = await Pokemon.findOne({ id });
    if (!pokemons)
      return res.status(404).json({ message: "Pokemon non trouvé" });
    res.json(pokemons);
  } catch (e) {
    res.status(500).json({ message: "Erreur serveur", error: e.message });
  }
});

router.get("/name/:name", async (req, res) => {
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

router.get("/type/:type", async (req, res) => {
  const type = req.params.type.toLowerCase();
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

router.get("/search", async (req, res) => {
  const { searchTerm, types } = req.query;
  const query = {};

  if (searchTerm) {
    query.name = { $regex: searchTerm, $options: "i" };
  }

  if (types) {
    const typeArray = types.split(",");
    query.type = { $all: typeArray.map((t) => t.toLowerCase()) };
  }

  try {
    const pokemons = await Pokemon.find(query);
    res.json(pokemons);
  } catch (e) {
    res.status(500).json({ message: "Erreur serveur", error: e.message });
  }
});

/**
 * @route   POST /api/pokemons
 * @desc    Ajouter un nouveau Pokémon
 * @access  Privé (JWT requis)
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
router.post("/", verifyToken, async (req, res) => {
  try {
    const pokemonData = req.body;

    // Vérifier si un Pokémon avec cet ID existe déjà
    const exists = await Pokemon.findOne({ id: pokemonData.id });
    if (exists) {
      return res.status(400).json({ message: "Ce pokemon existe déjà" });
    }

    // Créer le nouveau Pokémon
    const newPokemon = new Pokemon(pokemonData);
    const savedPokemon = await newPokemon.save();

    res.status(201).json(savedPokemon);
  } catch (e) {
    res.status(500).json({ message: "Erreur serveur", error: e.message });
  }
});


/**
 * @route   PUT /api/pokemons/:id
 * @desc    Modifier un Pokémon existant par son ID
 * @access  Privé (JWT requis)
 * @headers Authorization: Bearer <token>
 * @params  :id (Number) → ID du Pokémon à modifier
 * @body    Toutes les propriétés modifiables du Pokémon
 * @return  200 OK avec le Pokémon mis à jour, 404 si non trouvé, ou 500 en erreur serveur
 */
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updated = await Pokemon.findOneAndUpdate({ id }, req.body, {
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
 * @route   DELETE /api/pokemons/:id
 * @desc    Supprimer un Pokémon (admin uniquement)
 * @access  Privé (JWT + admin)
 * @headers Authorization: Bearer <token>
 * @params  :id (int)
 * @return  200 OK ou 403/401/404
 */
router.delete("/:id", verifyToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Accès interdit: admin uniquement." });
  }

  try {
    const id = parseInt(req.params.id);
    const deleted = await Pokemon.findOneAndDelete({ id });
    if (!deleted)
      return res.status(404).json({ message: "Pokémon introuvable" });
    res.json({ message: "Supprimé avec succès", pokemon: deleted });
  } catch (e) {
    res.status(500).json({ message: "Erreur suppression", error: e.message });
  }
});

export default router;

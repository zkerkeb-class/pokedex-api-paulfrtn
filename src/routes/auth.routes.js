import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import verifyToken from "../middleware/auth.middleware.js";

dotenv.config();

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * @route POST /api/auth/register
 * @desc Inscription d'un nouvel utilisateur
 * @access Public
 * @body { firstname, lastname, mail, password, role }
 * @return 201 Created ou 400/500 en erreur
 * */
router.post("/register", async (req, res) => {
  const { firstname, lastname, mail, password } = req.body;
  const role = "user";

  try {
    const existingUser = await User.findOne({ mail });
    if (existingUser) {
      return res.status(400).json({ message: "Erreur serveur." });
    }

    const newUser = new User({ firstname, lastname, mail, password, role });
    await newUser.save();

    res.status(201).json({ message: "Utilisateur crée avec succès" });
  } catch (e) {
    console.error("Erreur d'inscription :", e);
    res.status(500).json({ message: "Erreur serveur." });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Connexion utilisateur (retourne un token JWT)
 * @access  Public
 * @body    { mail, password }
 * @return  200 OK avec { token, user } ou 400/500
 */
router.post("/login", async (req, res) => {
  const { mail, password } = req.body;

  try {
    const user = await User.findOne({ mail });
    if (!user) {
      return res.status(400).json({ message: "Email incorrect." });
    }

    const isPassword = await user.comparePassword(password);
    if (!isPassword) {
      return res.status(400).json({ message: "Mot de passe incorrect." });
    }

    const token = jwt.sign(
      { id: user._id, mail: user.mail, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" },
    );

    res
      .status(200)
      .json({ token, user: { firstname: user.firstname, role: user.role } });
  } catch (e) {
    console.error("Erreur de connexion : ", e);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * @route   POST /api/auth/refresh
 * @desc    Rafraîchir le token JWT
 * @access  Privé (nécessite un token valide)
 * @return  200 OK avec le nouveau token ou 401
 */
router.post("/refresh", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ message: "Utilisateur introuvable" });
    }
    
    const newToken = jwt.sign(
      { id: user._id, mail: user.mail, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    
    res.status(200).json({ 
      token: newToken, 
      user: { firstname: user.firstname, role: user.role } 
    });
  } catch (e) {
    console.error("Erreur lors du rafraîchissement du token :", e);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;

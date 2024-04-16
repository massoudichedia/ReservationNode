import express from "express";
import { login, register } from "../controllers/auth.js";

const router = express.Router();

// Afficher le formulaire de login
router.get("/login", (req, res) => {
  res.render("login");
});

// Afficher le formulaire d'inscription
router.get("/register", (req, res) => {
  res.render("register");
});

// Traiter la soumission du formulaire d'inscription
router.post("/register", register);

// Traiter la soumission du formulaire de login
router.post("/login", login);

export default router;

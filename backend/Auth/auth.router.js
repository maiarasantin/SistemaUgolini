const express = require("express");
const authController = require("./auth.controller");
const { requireJWTAuth } = require("./auth.config");

const router = express.Router();

 // função login
router.post("/login", authController.login);

// GET /auth/perfil: só passa quem tiver token válido.
// Lê-se: primeiro o requireJWTAuth confere o token, depois o controller responde.
router.get("/perfil", requireJWTAuth, authController.perfil);


// função registrar
router.post("/registrar", authController.registrar);

module.exports = router;
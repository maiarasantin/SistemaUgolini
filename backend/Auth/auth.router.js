const express = require("express");
const authController = require("./auth.controller");


// Traz do auth.config dois "seguranças":
// requireJWTAuth = confere só o token (quem é você?).
// requirePerfil  = confere o token E o perfil (você pode entrar aqui?).
const { requireJWTAuth, requirePerfil } = require("./auth.config");


const router = express.Router();

 // função login
router.post("/login", authController.login);

// GET /auth/perfil: só passa quem tiver token válido.
// Lê-se: primeiro o requireJWTAuth confere o token, depois o controller responde.
router.get("/perfil", requireJWTAuth, authController.perfil);


// função registrar
// POST /auth/registrar: só passa quem estiver logado E for admin.
// Lê-se: primeiro o requirePerfil("admin") confere o token e o perfil,
// depois o controller cadastra o funcionário.
// Sem token = 401. Token de vendedor = 403. Token de admin = segue pro controller.
router.post("/registrar", requirePerfil("admin"), authController.registrar);

module.exports = router;
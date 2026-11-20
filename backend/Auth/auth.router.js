const express = require("express");
const authController = require("./auth.controller");



// requireJWTAuth = confere o token antes de deixar passar
const { requireJWTAuth } = require("./auth.config");


const router = express.Router();

router.post("/login", authController.login);

// Primeiro o requireJWTAuth confere o token, depois o controller responde
router.get("/perfil", requireJWTAuth, authController.perfil);


module.exports = router;
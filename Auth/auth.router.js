const express = require("express");
const authController = require("./auth.controller");

const router = express.Router();

 // função login
router.post("/login", authController.login);


// função registrar
router.post("/registrar", authController.registrar);

module.exports = router;
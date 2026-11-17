const express = require("express");
const categoriasController = require("./categorias.controller");
const {requirePerfil} = require("../Auth/auth.config");

const router = express.Router();

router.use(requirePerfil("admin", "vendedor"));

// GET /categorias?busca=&possuiSubcategorias=&ordenarPor=&direcao=
router.get("/", categoriasController.listar);

// GET /categorias/:id
router.get("/:id", categoriasController.buscarPorId);

// POST /categorias
router.post("/", categoriasController.criar);

// PUT /categorias/:id
router.put("/:id", categoriasController.atualizar);

// DELETE /categorias/:id
router.delete("/:id", categoriasController.excluir);

module.exports = router;
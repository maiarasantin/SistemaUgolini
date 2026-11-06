const express = require("express");
const categoriasController = require("./categorias.controller");

const router = express.Router();

// GET /categorias
router.get("/categorias", categoriasController.listar);

// GET /categorias/:id
router.get("/categorias/:id", categoriasController.buscarPorId);

// POST /categorias
router.post("/categorias", categoriasController.criar);

// PUT /categorias/:id
router.put("/categorias/:id", categoriasController.atualizar);

// DELETE /categorias/:id
router.delete("/categorias/:id", categoriasController.deletar);

module.exports = router;
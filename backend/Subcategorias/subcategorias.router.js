const express = require("express");
const subcategoriasController = require("./subcategorias.controller");

const router = express.Router();

// GET /subcategorias
router.get("/subcategorias", subcategoriasController.listar);

// GET /subcategorias/:id
router.get("/subcategorias/:id", subcategoriasController.buscarPorId);

// GET /subcategorias/nome
router.get("/subcategorias/nome", subcategoriasController.buscarPorNome);

// POST /subcategorias
router.post("/subcategorias", subcategoriasController.criar);

// PUT /subcategorias/:id
router.put("/subcategorias/:id", subcategoriasController.atualizar);

// DELETE /subcategorias/:id
router.delete("/subcategorias/:id", subcategoriasController.deletar);

module.exports = router;
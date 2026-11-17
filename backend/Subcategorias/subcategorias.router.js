const express = require("express");
const subcategoriasController = require("./subcategorias.controller");
const {requirePerfil} = require("../Auth/auth.config");

const router = express.Router();

router.use(requirePerfil("admin", "vendedor"));

// GET /subcategorias?busca=&idCategoria=&ordenarPor=&direcao=
router.get("/", subcategoriasController.listar);

// GET /subcategorias/:id
router.get("/:id", subcategoriasController.buscarPorId);

// POST /subcategorias
router.post("/", subcategoriasController.criar);

// PUT /subcategorias/:id
router.put("/:id", subcategoriasController.atualizar);

// DELETE /subcategorias/:id
router.delete("/:id", subcategoriasController.excluir);

module.exports = router;
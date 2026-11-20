const express = require("express");
const funcionariosController = require("./funcionarios.controller");
const { requirePerfil } = require("../Auth/auth.config");

const router = express.Router();

// Todas as rotas  exigem token válido E perfil Admin
router.use(requirePerfil("admin"));

router.get("/", funcionariosController.listar);

router.get("/:id", funcionariosController.buscarPorId);

router.post("/", funcionariosController.criar);

router.put("/:id", funcionariosController.atualizar);

router.delete("/:id", funcionariosController.excluir);

module.exports = router;

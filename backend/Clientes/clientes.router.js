const express = require("express");
const clientesController = require("./clientes.controller");
const { requirePerfil } = require("../Auth/auth.config");

const router = express.Router();

// Todas as rotas daqui exigem token válido e perfil vendedor
// router.use roda a proteção ANTES de qualquer rota abaixo
router.use(requirePerfil("vendedor"));

router.get("/", clientesController.listar);

router.get("/:id", clientesController.buscarPorId);

router.post("/", clientesController.criar);

router.put("/:id", clientesController.atualizar);

router.delete("/:id", clientesController.excluir);

module.exports = router;

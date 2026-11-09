const express = require("express");
const clientesController = require("./clientes.controller");
const {requirePerfil} = require("../Auth/auth.config");

const router = express.Router();


// Todas as rotas daqui exigem token válido E perfil vendedor ou admin.
// router.use: roda a proteção ANTES de qualquer rota abaixo (confere token e perfil; se falhar, responde 401/403 e nem chega na rota).
router.use(requirePerfil("admin", "vendedor"));



router.get("/", clientesController.listar);

router.get("/:id", clientesController.buscarPorId);

router.post("/", clientesController.criar);

router.put("/:id", clientesController.atualizar);

router.delete("/:id", clientesController.excluir);

module.exports = router;
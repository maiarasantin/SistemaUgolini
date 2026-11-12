const express = require("express");
const pedidosController = require("./pedidos.controller");

const {requirePerfil} = require("../Auth/auth.config");

const multer = require("multer");
const { responderErro, criarErro } = require("../utils/erros");

const router = express.Router();

router.use(requirePerfil("admin", "vendedor"));

// memoryStorage: o arquivo fica na memória só até ser enviado ao Supabase.
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024, files: 1 }, // máximo 5 MB, 1 arquivo
});

// receberImagem: lê o campo "imagem" e, se der erro (ex.: arquivo grande demais),
// responde 400 com mensagem clara em vez de erro interno.
function receberImagem(req, res, next) {
    upload.single("imagem")(req, res, (erro) => {
        if (!erro) return next();
        if (erro.code === "LIMIT_FILE_SIZE") {
            return responderErro(res, criarErro(400, "Imagem muito grande. O limite é 5 MB."));
        }
        return responderErro(res, criarErro(400, "Não foi possível ler a imagem enviada."));
    });
}


// GET /pedidos
router.get("/pedidos", pedidosController.listar);

// GET /relatorio (apenas para admin)
//router.get("/relatorio", pedidosController.relatorio);

// GET /pedidos/:id
router.get("/pedidos/:id", pedidosController.buscarPorId);

// POST /pedidos
router.post("/pedidos", pedidosController.criar);

// PATCH /pedidos/:id
router.patch("/pedidos/:id", pedidosController.atualizarStatus);

// POST /pedidos/:id/imagem
router.put("/pedidos/:id/imagem", receberImagem, pedidosController.anexarImagem);

// POST /pedidos/:id/imagem/whatsapp
router.post("/peiddos/:id/imagem/whatsapp", pedidosController.enviarImagemWhatsapp);

// DELETE /pedidos/:id
router.delete("/pedidos/:id", pedidosController.deletar);

module.exports = router;
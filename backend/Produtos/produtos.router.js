const express = require("express");
const produtosController = require("./produtos.controller");
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

function receberFoto(req, res, next) {
    upload.single("imagem")(req, res, (erro) => {
        if (!erro) return next();
        if (erro.code === "LIMIT_FILE_SIZE") {
            return responderErro(res, criarErro(400, "Imagem muito grande. O limite é 5 MB."));
        }
        return responderErro(res, criarErro(400, "Não foi possível ler a imagem enviada."));
    });
}

// GET /produtos?busca=...&idCategoria=...&idSubcategoria=...&estoque=...
router.get("/", produtosController.listar);

router.get("/:id/composicao", produtosController.buscarComponentes);

router.put("/:id/composicao", produtosController.atualizarComposicao);

router.get("/:id", produtosController.buscarPorId);

router.post("/", receberFoto, produtosController.criar);

router.put("/:id", receberFoto, produtosController.atualizar);

router.delete("/:id", produtosController.deletar);

module.exports = router;

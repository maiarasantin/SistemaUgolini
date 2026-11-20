const categoriasService = require("./categorias.service");
const { responderErro } = require("../utils/erros");

async function listar(req, res){
    try {
        const categorias = await categoriasService.listar(req.query);
        return res.status(200).json({ categorias });
    } catch(erro){
        return responderErro(res, erro);
    }
}

async function buscarPorId(req, res){
    try {
        const categoria = await categoriasService.buscarPorId(req.params.id);
        return res.status(200).json({ categoria });
    } catch(erro){
        return responderErro(res, erro);
    }
}

async function criar(req, res){
    try {
        const categoria = await categoriasService.criar(req.body);
        return res.status(201).json({ categoria });
    } catch(erro){
        return responderErro(res, erro);
    }
}

async function atualizar(req, res){
    try {
        const categoria = await categoriasService.atualizar(req.params.id, req.body);
        return res.status(200).json({ categoria });
    } catch(erro){
        return responderErro(res, erro);
    }
}

async function excluir(req, res){
    try {
        await categoriasService.excluir(req.params.id);
        return res.status(204).send();
    } catch(erro){
        return responderErro(res, erro);
    }
}

module.exports = {
    listar,
    buscarPorId,
    criar,
    atualizar,
    excluir,
};
const subcategoriasService = require("./subcategorias.service");
const { responderErro } = require("../utils/erros");

async function listar(req, res){
    try {
        const subcategorias = await subcategoriasService.listar(req.query);
        return res.status(200).json({ subcategorias });
    } catch(erro){
        return responderErro(res, erro);
    }
}

async function buscarPorId(req, res){
    try {
        const subcategoria = await subcategoriasService.buscarPorId(req.params.id);
        return res.status(200).json({ subcategoria });
    } catch(erro){
        return responderErro(res, erro);
    }
}

async function criar(req, res){
    try {
        const subcategoria = await subcategoriasService.criar(req.body);
        return res.status(201).json({ subcategoria });
    } catch(erro){
        return responderErro(res, erro);
    }
}

async function atualizar(req, res){
    try {
        const subcategoria = await subcategoriasService.atualizar(req.params.id, req.body);
        return res.status(200).json({ subcategoria });
    } catch(erro){
        return responderErro(res, erro);
    }
}

async function excluir(req, res){
    try {
        await subcategoriasService.excluir(req.params.id);
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

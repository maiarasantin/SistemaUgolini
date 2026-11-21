const produtosService = require("./produtos.service");
const { responderErro } = require("../utils/erros");

async function listar(req, res){
    try {
        const produtos = await produtosService.listar(req.query);
        return res.status(200).json(produtos);
    } catch(erro){
        return responderErro(res, erro);
    }
}

async function catalogo(req, res){
    try {
        const catalogo = await produtosService.listar(req.query);
        return res.status(200).json(catalogo);
    } catch(erro){
        return responderErro(res, erro);
    }
}

async function buscarPorId(req, res){
    try {
        const produto = await produtosService.buscarPorId(req.params.id);
        return res.status(200).json(produto);
    } catch(erro){
        return responderErro(res, erro);
    }
}

async function criar(req, res) {
    try {
        const produto = await produtosService.criar(req.body, req.file);
        return res.status(201).json(produto);
    } catch (erro) {
        return responderErro(res, erro);
    }
}

async function atualizar(req, res){
    try {
        const produto = await produtosService.atualizar(req.params.id, req.body, req.file);
        return res.status(200).json(produto);
    } catch(erro){
        return responderErro(res, erro);
    }
}

async function deletar(req, res){
    try {
        const produto = await produtosService.deletar(req.params.id);
        return res.status(204).send();
    } catch(erro){
        return responderErro(res, erro);
    }
}

async function buscarComponentes(req, res){
    try{
        const composicao = await produtosService.buscarComponentes(req.params.id);
        return res.status(200).json(composicao);
    } catch(erro){
        return responderErro(res, erro);
    }
}

async function atualizarComposicao(req, res){
    try {
        const composicao = await produtosService.atualizarComposicao(req.params.id, req.body);
        return res.status(200).json(composicao);
    } catch(erro){
        return responderErro(res, erro);
    }
}

module.exports = {
    listar,
    catalogo,
    buscarPorId,
    criar,
    atualizar,
    deletar,
    buscarComponentes,
    atualizarComposicao,
};
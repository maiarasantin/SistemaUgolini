const pedidosService = require("./pedidos.service");
const { responderErro } = require("../utils/erros");

async function listar(req, res) {
    try {
        const pedidos = await pedidosService.listar(req.query);
        return res.status(200).json(pedidos);
    } catch (erro) {
        console.log("Erro ao buscar pedidos:", erro);
        return res.status(erro.status || 500).json({ erro: erro.message });
    }
}

async function relatorio(req, res) {
    try {
        const relatorio = await pedidosService.listar(req.query);
        return res.status(200).json(relatorio);
    } catch (erro) {
        console.log("Erro ao buscar relatorio:", erro);
        return res.status(erro.status || 500).json({ erro: erro.message });
    }
}

async function buscarPorId(req, res) {
    try {
        const pedido = await pedidosService.buscarPorId(req.params.id);
        return res.status(200).json(pedido);
    } catch (erro) {
        console.log("Erro ao buscar pedido:", erro);
        return res.status(500).json({ erro: erro.message });
    }
}

async function criar(req, res) {
    try {
        const pedido = await pedidosService.criar(req.body);
        return res.status(201).json(pedido);
    } catch (erro) {
        console.log("Erro ao criar pedido:", erro);
        return res.status(500).json({ erro: erro.message });
    }
}

async function atualizar(req, res) {
    try {
        const pedido = await pedidosService.atualizar(req.params.id, req.body);
        if (!pedido) return res.status(404).json({ erro: "Pedido não encontrado" });
        return res.status(200).json(pedido);
    } catch (erro) {
        console.log("Erro ao atualizar pedido:", erro);
        return res.status(500).json({ erro: erro.message });
    }
}

async function atualizarStatus(req, res) {
    try {
        const pedido = await pedidosService.atualizarStatus(req.params.id, req.body?.status);
        return res.status(200).json(pedido);
    } catch (erro) {
        return responderErro(res, erro);
    }
}

async function deletar(req, res) {
    try {
        const pedido = await pedidosService.deletar(req.params.id);
        if (!pedido) return res.status(404).json({ erro: "Pedido não encontrado" });
        return res.status(204).send();
    } catch (erro) {
        console.log("Erro ao deletar pedido:", erro);
        return res.status(500).json({ erro: erro.message });
    }
}

async function anexarImagem(req, res) {
    try {
        const resultado = await pedidosService.anexarImagem(req.params.id, req.file);
        return res.status(200).json(resultado);
    } catch (erro) {
        return responderErro(res, erro);
    }
}

async function enviarImagemWhatsapp(req, res) {
    try {
        const resultado = await pedidosService.enviarImagemWhatsapp(req.params.id);
        return res.status(200).json(resultado);
    } catch (erro) {
        return responderErro(res, erro);
    }
}

module.exports = {
    listar,
    relatorio,
    buscarPorId,
    criar,
    atualizar,
    atualizarStatus,
    deletar,
    anexarImagem,
    enviarImagemWhatsapp,
};
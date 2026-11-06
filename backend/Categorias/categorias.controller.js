const categoriasService = require("./categorias.service");

async function listar(req, res) {
    try{
        const categorias = await categoriasService.listar();
        return res.status(200).json(categorias);
    } catch(erro) {
        console.log("Erro ao buscar categorias:", erro);
        return res.status(500).json({ erro: erro.message });
    }
}

async function buscarPorId(req, res) {
    try {
        const categoria = await categoriasService.buscarPorId(req.params.id);
        return res.status(200).json(categoria);
    } catch (erro) {
        console.log("Erro ao buscar categoria:", erro);
        return res.status(500).json({ erro: erro.message });
    }
}

async function criar(req, res) {
    try {
        const categoria = await categoriasService.criar(req.body);
        return res.status(201).json(categoria);
    } catch (erro) {
        console.log("Erro ao criar categoria:", erro);
        return res.status(500).json({ erro: erro.message });
    }
}

async function atualizar(req, res) {
    try {
        const categoria = await categoriasService.atualizar(req.params.id, req.body);
        if (!categoria) return res.status(404).json({ erro: "Categoria não encontrado" });
        return res.status(200).json(categoria);
    } catch (erro) {
        console.log("Erro ao atualizar categoria:", erro);
        return res.status(500).json({ erro: erro.message });
    }
}

async function deletar(req, res) {
    try {
        const categoria = await categoriasService.deletar(req.params.id);
        if (!categoria) return res.status(404).json({ erro: "Categoria não encontrado" });
        return res.status(204).send();
    } catch (erro) {
        console.log("Erro ao deletar categoria:", erro);
        return res.status(500).json({ erro: erro.message });
    }
}

module.exports = {
    listar,
    buscarPorId,
    criar,
    atualizar,
    deletar,
};
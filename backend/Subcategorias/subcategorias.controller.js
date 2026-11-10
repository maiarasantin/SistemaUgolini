const subcategoriasService = require("./subcategorias.service");

async function listar(req, res) {
    try {
        const subcategorias = await subcategoriasService.listar();
        return res.status(200).json(subcategorias);
    } catch (erro) {
        console.log("Erro ao buscar subcategorias:", erro);
        return res.status(500).json({ erro: erro.message });
    }
}

async function buscarPorId(req, res) {
    try {
        const subcategoria = await subcategoriasService.buscarPorId(req.params.id);
        return res.status(200).json(subcategoria);
    } catch (erro) {
        console.log("Erro ao buscar subcategoria:", erro);
        return res.status(500).json({ erro: erro.message });
    }
}

async function buscarPorNome(req, res) {
    try{
        const subcategoria = await subcategoriasService.buscarPorNome(req.body);
        return res.status(200).json(subcategoria);
    }catch (erro) {
        console.log("Erro ao buscar subcategoria:", erro);
        return res.status(500).json({ erro: erro.message });
    }
}

async function criar(req, res) {
    try {
        const subcategoria = await subcategoriasService.criar(req.body);
        return res.status(201).json(subcategoria);
    } catch (erro) {
        console.log("Erro ao criar subcategoria:", erro);
        return res.status(500).json({ erro: erro.message });
    }
}

async function atualizar(req, res) {
    try {
        const subcategoria = await subcategoriasService.atualizar(req.params.id, req.body);
        if (!subcategoria) return res.status(404).json({ erro: "Subcategoria não encontrado" });
        return res.status(200).json(subcategoria);
    } catch (erro) {
        console.log("Erro ao atualizar subcategoria:", erro);
        return res.status(500).json({ erro: erro.message });
    }
}

async function deletar(req, res) {
    try {
        const subcategoria = await subcategoriasService.deletar(req.params.id);
        if (!subcategoria) return res.status(404).json({ erro: "Subcategoria não encontrado" });
        return res.status(204).send();
    } catch (erro) {
        console.log("Erro ao deletar subcategoria:", erro);
        return res.status(500).json({ erro: erro.message });
    }
}

module.exports = {
    listar,
    buscarPorId,
    buscarPorNome,
    criar,
    atualizar,
    deletar,
};
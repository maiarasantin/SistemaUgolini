const { Subcategoria } = require("../database/models");

async function listar() {
    return Subcategoria.findAll({ order: [["nome", "ASC"]] });
}

async function buscarPorId(id) {
    return Subcategoria.findByPk(id);
}

async function buscarPorNome(dado){
    return Subategoria.findAll({
        where : {
            nome: {[Op.iLike] : `%${nome}%`}
        }
    });
}

async function criar(dados) {
    return Subcategoria.create(dados);
}

async function atualizar(id, dados) {
    const subcategoria = await Subcategoria.findByPk(id);
    if (!subcategoria) return null;
    return subcategoria.update(dados);
}

async function deletar(id) {
    const subcategoria = await Subcategoria.findByPk(id);
    if (!subcategoria) return null;
    await subcategoria.destroy();
    return subcategoria;
}

module.exports = {
    listar,
    buscarPorId,
    buscarPorNome,
    criar,
    atualizar,
    deletar,
};
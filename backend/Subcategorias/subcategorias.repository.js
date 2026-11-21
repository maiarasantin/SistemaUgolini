const { Op } = require("sequelize");
const { SubCategoria, Categoria, Produto } = require("../database/models");
const { escaparLike } = require("../utils/validacoes");


const INCLUIR_CATEGORIA = {
    model: Categoria,
    as: "categoria",
    attributes: ["idCategoria", "nome"],
};


function montarOrdem(ordenarPor, direcao){
    const nomeDaCategoria = [{ model: Categoria, as: "categoria" }, "nome"];

    if(ordenarPor === "categoria"){
        return [[...nomeDaCategoria, direcao], ["nome", "ASC"]];
    }

    if(ordenarPor === "nome"){
        return [["nome", direcao], [...nomeDaCategoria, "ASC"]];
    }

    return [[ordenarPor, direcao]];
}


async function listar({ busca, idCategoria, ordenarPor, direcao }){
    const where = {};

    if(busca){
        where.nome = { [Op.iLike]: `%${escaparLike(busca)}%` };
    }

    if(idCategoria){
        where.idCategoria = idCategoria;
    }

    return SubCategoria.findAll({
        where,
        include: [INCLUIR_CATEGORIA],
        order: montarOrdem(ordenarPor, direcao),
    });
}

async function buscarPorId(id){
    return SubCategoria.findByPk(id, { include: [INCLUIR_CATEGORIA] });
}

async function buscarPorNomeNaCategoria(nome, idCategoria){
    return SubCategoria.findOne({
        where: { nome: { [Op.iLike]: escaparLike(nome) }, idCategoria },
    });
}

async function categoriaExiste(idCategoria){
    const categoria = await Categoria.findByPk(idCategoria, { attributes: ["idCategoria"] });
    return categoria !== null;
}

async function criar(dados){
    return SubCategoria.create(dados);
}

async function atualizar(subcategoria, dados){
    return subcategoria.update(dados);
}

async function excluir(subcategoria){
    return subcategoria.destroy();
}

async function contarProdutos(idSubcategoria){
    return Produto.count({ where: { idSubcategoria } });
}

module.exports = {
    listar,
    buscarPorId,
    buscarPorNomeNaCategoria,
    categoriaExiste,
    criar,
    atualizar,
    excluir,
    contarProdutos,
};

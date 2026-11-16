const { Op } = require("sequelize");
const { SubCategoria, Categoria, Produto } = require("../database/models");
const { escaparLike } = require("../utils/validacoes");

// Toda subcategoria vem acompanhada da sua categoria (só id e nome),
// pra tela poder mostrar "Rosas — Flores" sem uma segunda consulta.
const INCLUIR_CATEGORIA = {
    model: Categoria,
    as: "categoria",
    attributes: ["idCategoria", "nome"],
};

// montarOrdem: transforma o campo escolhido na ordem que o Sequelize entende.
// "categoria" ordena pelo NOME da categoria (tabela ligada), não pelo id.
// Sempre há um desempate, pra a lista não "pular" de ordem entre uma chamada e outra.
function montarOrdem(ordenarPor, direcao) {
    const nomeDaCategoria = [{ model: Categoria, as: "categoria" }, "nome"];

    if (ordenarPor === "categoria") {
        return [[...nomeDaCategoria, direcao], ["nome", "ASC"]];
    }

    if (ordenarPor === "nome") {
        return [["nome", direcao], [...nomeDaCategoria, "ASC"]];
    }

    return [[ordenarPor, direcao]];
}

// listar: busca as subcategorias com filtros e ordenação.
//
// Recebe (do service):
//   busca       -> texto digitado: o nome precisa conter o texto (sem diferenciar maiúscula/minúscula)
//   idCategoria -> se vier, traz só as subcategorias dessa categoria
//   ordenarPor  -> nome, categoria ou idSubcategoria
//   direcao     -> "ASC" ou "DESC"
//
// Os dois filtros se combinam: sem nada, traz todas; com os dois, precisa bater nos dois.
async function listar({ busca, idCategoria, ordenarPor, direcao }) {
    const where = {};

    if (busca) {
        where.nome = { [Op.iLike]: `%${escaparLike(busca)}%` };
    }

    if (idCategoria) {
        where.idCategoria = idCategoria;
    }

    return SubCategoria.findAll({
        where,
        include: [INCLUIR_CATEGORIA],
        order: montarOrdem(ordenarPor, direcao),
    });
}

async function buscarPorId(id) {
    return SubCategoria.findByPk(id, { include: [INCLUIR_CATEGORIA] });
}

// Usada pelo service antes de salvar, pra recusar nome repetido DENTRO da mesma categoria (409).
async function buscarPorNomeNaCategoria(nome, idCategoria) {
    return SubCategoria.findOne({
        where: { nome: { [Op.iLike]: escaparLike(nome) }, idCategoria },
    });
}

async function categoriaExiste(idCategoria) {
    const categoria = await Categoria.findByPk(idCategoria, { attributes: ["idCategoria"] });
    return categoria !== null;
}

async function criar(dados) {
    return SubCategoria.create(dados);
}

async function atualizar(subcategoria, dados) {
    return subcategoria.update(dados);
}

async function excluir(subcategoria) {
    return subcategoria.destroy();
}

async function contarProdutos(idSubcategoria) {
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

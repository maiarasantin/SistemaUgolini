const { Op, literal } = require("sequelize");
const { Categoria, Produto, SubCategoria } = require("../database/models");
const { escaparLike } = require("../utils/validacoes");



const SQL_TOTAL_SUBCATEGORIAS =
    `(SELECT COUNT(*)::int FROM subcategoria AS s WHERE s.id_categoria = "Categoria"."id_categoria")`;

const SQL_TEM_SUBCATEGORIAS =
    `EXISTS (SELECT 1 FROM subcategoria AS s WHERE s.id_categoria = "Categoria"."id_categoria")`;

const COM_TOTAL_SUBCATEGORIAS = {
    include: [[literal(SQL_TOTAL_SUBCATEGORIAS), "totalSubcategorias"]],
};


function montarOrdem(ordenarPor, direcao){
    if (ordenarPor === "totalSubcategorias"){
        return [[literal('"totalSubcategorias"'), direcao], ["nome", "ASC"]];
    }
    return [[ordenarPor, direcao]];
}


async function listar({ busca, possuiSubcategorias, ordenarPor, direcao }){
    const condicoes = [];

    if(busca){
        condicoes.push({ nome: { [Op.iLike]: `%${escaparLike(busca)}%`}});
    }

    if(possuiSubcategorias === true){
        condicoes.push(literal(SQL_TEM_SUBCATEGORIAS));
    }

    if(possuiSubcategorias === false){
        condicoes.push(literal(`NOT ${ SQL_TEM_SUBCATEGORIAS }`));
    }

    return Categoria.findAll({
        where: { [Op.and]: condicoes },
        attributes: COM_TOTAL_SUBCATEGORIAS,
        order: montarOrdem(ordenarPor, direcao),
    });
}

async function buscarPorId(id){
    return Categoria.findByPk(id, { attributes: COM_TOTAL_SUBCATEGORIAS });
}

// Usada pelo service antes de salvar, pra recusar nome repetido com mensagem clara (409).
// iLike sem curingas = igualdade sem diferenciar maiúscula de minúscula.
async function buscarPorNomeExato(nome){
    return Categoria.findOne({ where: { nome: { [Op.iLike]: escaparLike(nome) }}});
}

async function criar(dados){
    return Categoria.create(dados);
}

async function atualizar(categoria, dados){
    return categoria.update(dados);
}

async function excluir(categoria){
    return categoria.destroy();
}

async function contarSubcategorias(idCategoria){
    return SubCategoria.count({ where: { idCategoria }});
}

// Conta os produtos das subcategorias desta categoria
async function contarProdutos(idCategoria){
    const subcategorias = await SubCategoria.findAll({
        where: { idCategoria },
        attributes: ["idSubcategoria"],
        raw: true,
    });

    if(subcategorias.length === 0){
        return 0;
    }

    const ids = subcategorias.map((sub) => sub.idSubcategoria);
    return Produto.count({ where: { idSubcategoria: { [Op.in]: ids }}});
}

module.exports = {
    listar,
    buscarPorId,
    buscarPorNomeExato,
    criar,
    atualizar,
    excluir,
    contarSubcategorias,
    contarProdutos,
};

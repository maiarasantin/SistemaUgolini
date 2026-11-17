const { Op } = require("sequelize");
const { Produto, Composicao, SubCategoria, Categoria, ItemPedido, ItemInputEstoque, } = require("../database/models");
const { escaparLike } = require("../utils/validacoes");

// Lista do catálogo: busca, categoria, subcategoria, estoque, ordenação e paginação.

async function listar({
    busca,
    idCategoria,
    idSubcategoria,
    estoque,
    ordenarPor = "nome",
    direcao = "ASC"
}) {
    const where = {};
    const whereSubcategoria = {};
    const whereCategoria = {};

    // Busca pelo nome
    if (busca) {
        where.nome = {
            [Op.iLike]: `%${escaparLike(busca)}%`
        };
    }

    // Filtro por categoria
    if (idCategoria) {
        whereCategoria.idCategoria = idCategoria;
    }

    // Filtro por subcategoria
    if (idSubcategoria) {
        whereSubcategoria.idSubcategoria = idSubcategoria;
    }

    // Filtro por estoque
    if (estoque === "semEstoque") {
        where.quantidadeEstoque = 0;
    } else if (estoque === "comEstoque") {
        where.quantidadeEstoque = {
            [Op.gt]: 0
        };
    }

    const include = [
        {
            model: SubCategoria,
            as: "subcategoria",
            attributes: ["idSucCategoria", "nome"],
            required: !!(idCategoria || idSubcategoria),
            where: whereSubcategoria,
            include: [
                {
                    model: Categoria,
                    as: "categoria",
                    attributes: ["idCategoria", "nome"],
                    required: !!idCategoria,
                    where: whereCategoria
                }
            ]
        }
    ];

    // Ordenação permitida
    const ordenacoes = {
        nome: [["nome", direcao]],
        preco: [["preco", direcao]]
    };

    return await Produto.findAll({
        attributes: [
            "idProduto",
            "nome",
            "descricao",
            "preco",
            "foto",
            "unidadeMedida",
            "idSubcategoria"
        ],
        where,
        include,
        order: [
            ...ordenacoes[ordenarPor],
            ["nome", "ASC"]
        ]
    });
}

async function buscarPorId(idProduto, transaction = null) {
    return Produto.findByPk(idProduto, { transaction });
}

async function buscarProdutoCompleto(idProduto, transaction = null) {
    return Produto.findByPk(idProduto, {
        transaction,
        include: [
            {
                model: SubCategoria, as: "subcategoria", required: false,
                attributes: ["idSubcategoria", "nome", "idCategoria"],
                include: [{ model: Categoria, as: "categoria", required: false, attributes: ["idCategoria", "nome"] }],
            },
            {
                model: Composicao, as: "composicoes", required: false,
                attributes: ["idProdutoComponente", "quantidade"],
                include: [{ model: Produto, as: "produtoComponente", attributes: ["idProduto", "nome", "unidadeMedida"] }],
            },
        ],
    });
}

async function buscarPorNome(nome, ignorarId = null) {
    const where = { nome: { [Op.iLike]: nome } };
    if (ignorarId !== null) where.idProduto = { [Op.ne]: ignorarId };
    return Produto.findOne({ where });
}

async function buscarSubcategoriaPorId(idSubcategoria) {
    return SubCategoria.findByPk(idSubcategoria);
}

async function criar(dados, transaction = null) {
    return Produto.create(dados, { transaction });
}

async function atualizar(idProduto, dados, transaction = null) {
    return Produto.update(dados, { where: { idProduto }, transaction });
}

async function buscarComponentes(idProduto, transaction = null) {
    return Composicao.findAll({
        where: { idProdutoComposto: idProduto },
        include: [{ model: Produto, as: "produtoComponente", attributes: ["idProduto", "nome", "unidadeMedida"] }],
        transaction,
    });
}

async function buscarProdutosExistentes(ids, transaction = null) {
    return Produto.findAll({ attributes: ["idProduto"], where: { idProduto: { [Op.in]: ids } }, transaction });
}

async function buscarProdutosQueUtilizam(idProduto, transaction = null) {
    return Composicao.findAll({
        where: { idProdutoComponente: idProduto },
        include: [{ model: Produto, as: "produtoComposto", attributes: ["idProduto", "nome"] }],
        transaction,
    });
}

async function excluirComposicao(idProduto, transaction) {
    return Composicao.destroy({ where: { idProdutoComposto: idProduto }, transaction });
}

async function inserirComposicao(componentes, transaction) {
    return Composicao.bulkCreate(componentes, { transaction });
}

async function excluirProduto(idProduto, transaction) {
    return Produto.destroy({ where: { idProduto }, transaction });
}

async function contarVinculosProduto(idProduto) {
    const [itensPedido, itensEntrada] = await Promise.all([
        ItemPedido.count({ where: { idProduto } }),
        ItemInputEstoque.count({ where: { idProduto } }),
    ]);
    return { itensPedido, itensEntrada };
}

module.exports = {
    listar,
    buscarPorId,
    criar,
    atualizar,
    buscarComponentes,
    buscarPorId,
    buscarProdutoCompleto,
    buscarPorNome,
    buscarSubcategoriaPorId,
    buscarProdutosExistentes,
    buscarProdutosQueUtilizam,
    excluirComposicao,
    inserirComposicao,
    excluirProduto,
    contarVinculosProduto,
};

const sequelize = require("../connection");

const Categoria = require("./categoria.model");
const Cliente = require("./cliente.model");
const Composicao = require("./composicao.model");
const Entrega = require("./entrega.model");
const Funcionario = require("./funcionario.model");
const ItemPedido = require("./item-pedido.model");
const Pagamento = require("./pagamento.model");
const Pedido = require("./pedido.model");
const Produto = require("./produto.model");
const SubCategoria = require("./subcategoria.model");
const InputEstoque = require("./input-estoque.model.js");
const ItemInputEstoque = require("./item-input-estoque.model.js");

const db = {
    Categoria,
    Cliente,
    Composicao,
    Entrega,
    Funcionario,
    ItemPedido,
    Pagamento,
    Pedido,
    Produto,
    SubCategoria,
    InputEstoque,
    ItemInputEstoque,
};

Object.values(db).forEach((modelo) => {
    if (modelo.associate) {
        modelo.associate(db);
    }
});

module.exports = db;
const { DataTypes } = require("sequelize");
const sequelize = require("../connection");

const Produto = sequelize.define(
    "Produto",
    {
        idProduto: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: "id_produto"
        },

        nome: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            field: "nome"
        },

        idSubcategoria: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "id_subcategoria"
        },

        descricao: {
            type: DataTypes.TEXT,
            field: "descricao"
        },

        preco: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            field: "preco"
        },

        foto: {
            type: DataTypes.TEXT,
            field: "foto"
        },

        unidadeMedida: {
            type: DataTypes.STRING(50),
            allowNull: false,
            field: "unidade_medida"
        },

        estoqueMinimo: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "estoque_minimo"
        },

        quantidadeEstoque: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "quantidade_estoque"
        }
    },
    {
        timestamps: false,
        underscored: true,
        tableName: "produto"
    }
);

Produto.associate = (models) => {

    Produto.belongsTo(models.SubCategoria, {
        foreignKey: "idSubcategoria",
        as: "subcategoria"
    });

    Produto.hasMany(models.ItemPedido, {
        foreignKey: "idProduto",
        as: "itensPedido"
    });

    Produto.hasMany(models.Composicao, {
        foreignKey: "idProdutoComposto",
        as: "composicoes"
    });

    Produto.hasMany(models.Composicao, {
        foreignKey: "idProdutoComponente",
        as: "componenteDe"
    });

};

module.exports = Produto;

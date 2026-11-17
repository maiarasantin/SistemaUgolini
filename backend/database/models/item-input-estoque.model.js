const { DataTypes } = require('sequelize');
const sequelize = require('../connection');

const ItemInputEstoque = sequelize.define(
    "ItemInputEstoque", 
    {
        idProduto: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            field: "id_produto"
        },

        idEstoque: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            field: "id_estoque"
        },

        quantidadeInputEstoque: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "quantidade_input_estoque"
        },

        valorUnitario: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            field: "valor_unitario"
        }

    }, 
    {
        tableName: 'item_input_estoque',
        timestamps: false,
        freezeTableName: true
    }
);

ItemInputEstoque.associate = (models) => {

    ItemInputEstoque.belongsTo(models.Produto, {
        foreignKey: "idProduto",
        as: "produto"
    });

    ItemInputEstoque.belongsTo(models.InputEstoque, {
        foreignKey: "idEstoque",
        as: "estoque"
    });

};

module.exports = ItemInputEstoque;
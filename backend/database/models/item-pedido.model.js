const { DataTypes } = require('sequelize');
const sequelize = require('../connection');

const ItemPedido = sequelize.define(
    "ItemPedido", 
    {
        idProduto: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            field: "id_produto"
        },

        numPedido: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            field: "nem_pedido"
        },

        quantidade: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "quantidade"
        },

        precoUnitario: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            field: "preco_unitario"
        }

    }, 
    {
        tableName: 'item_pedido',
        timestamps: false,
        freezeTableName: true
    }
);

ItemPedido.associate = (models) => {

    ItemPedido.belongsTo(models.Pedido, {
        foreignKey: "numPedido",
        as: "pedido"
    });

    ItemPedido.belongsTo(models.Produto, {
        foreignKey: "idProduto",
        as: "produto"
    });

};

module.exports = ItemPedido;
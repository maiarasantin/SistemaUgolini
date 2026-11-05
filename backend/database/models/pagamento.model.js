const { DataTypes } = require("sequelize");
const sequelize = require("../connection");

const Pagamento = sequelize.define(
    "Pagamento",
    {
        idPagamento: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: "id_pagamento"
        },

        numPedido: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            field: "num_pedido"
        },

        status: {
            type: DataTypes.STRING(20),
            allowNull: false,
            field: "status"
        },

        formaPagamento: {
            type: DataTypes.STRING(30),
            field: "forma_pagamento"
        }
    },
    {
        timestamps: false,
        underscored: true,
        tableName: "pagamento"
    }
);

Pagamento.associate = (models) => {

    Pagamento.belongsTo(models.Pedido, {
        foreignKey: "numPedido", 
        as: "pedido"
    });
};

module.exports = Pagamento;

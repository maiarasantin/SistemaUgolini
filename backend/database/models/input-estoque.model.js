const { DataTypes } = require('sequelize');
const sequelize = require('../connection');

const ItemEstoque = sequelize.define(
    "ItemEstoque", 
    {
        idEstoque: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            field: "id_estoque"
        },

        dataEntrada: {
            type: DataTypes.DATE,
            allowNull: false,
            field: "data_entrada"
        },

        fornecedor: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: "fornecedor"
        },

        descricao: {
            type: DataTypes.STRING,
            allowNull: true,
            field: "descricao"
        }

    }, 
    {
        tableName: 'input_estoque',
        timestamps: false,
        freezeTableName: true
    }
);

module.exports = ItemEstoque;
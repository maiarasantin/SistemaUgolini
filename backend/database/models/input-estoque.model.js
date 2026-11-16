const { DataTypes } = require('sequelize');
const sequelize = require('../connection');

const InputEstoque = sequelize.define(
    "InputEstoque", 
    {
        idEstoque: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
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

InputEstoque.associate = (models) => {
    InputEstoque.hasMany(models.ItemInputEstoque, {
        foreignKey: "idEstoque",
        as: "itens"
    });
}

module.exports = InputEstoque;
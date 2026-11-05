const { DataTypes } = require("sequelize");
const sequelize = require("../connection");

const Cliente = sequelize.define(
    "Cliente",
    {
        idCliente: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: "id_cliente"
        },

        nome: {
            type: DataTypes.STRING(150),
            allowNull: false
        },

        telefone: {type: DataTypes.STRING(20)},

        email:    {type: DataTypes.STRING(150)},

        tipoCliente: {
            type: DataTypes.STRING(20),
            field: "tipo_cliente"
        },

        cpf: {
            type: DataTypes.STRING(11),
            unique: true
        },

        cnpj: {
            type: DataTypes.STRING(14),
            unique: true
        },

        rua:        {type: DataTypes.STRING(150)},

        numero:     {type: DataTypes.STRING(10)},

        bairro:     {type: DataTypes.STRING(100)},

        cep:        {type: DataTypes.STRING(8)},

        referencia: {type: DataTypes.TEXT}
    },
    {
        timestamps: false,
        underscored: true,
        tableName: "cliente"
    }
);

module.exports = Cliente;
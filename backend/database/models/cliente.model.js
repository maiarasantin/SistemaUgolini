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
            allowNull: false,
            field: "nome"
        },

        telefone: {
            type: DataTypes.STRING(20),
            field: "telefone"
        },

        email: {
            type: DataTypes.STRING(150),
            field: "email"
        },

        tipoCliente: {
            type: DataTypes.STRING(20),
            field: "tipo_cliente"
        },

        cpf: {
            type: DataTypes.STRING(11),
            unique: true,
            field: "cpf"
        },

        cnpj: {
            type: DataTypes.STRING(14),
            unique: true,
            field: "cnpj"
        },

        rua: {
            type: DataTypes.STRING(150),
            field: "rua"
        },

        numero: {
            type: DataTypes.STRING(10),
            field: "numero"
        },

        bairro: {
            type: DataTypes.STRING(100),
            field: "bairro"
        },
        
        cep: {
            type: DataTypes.STRING(8),
            field: "cep"
        },

        referencia: {
            type: DataTypes.TEXT,
            field: "referencia"
        }
    },
    {
        timestamps: false,
        underscored: true,
        tableName: "cliente"
    }
);

Cliente.associate = (models) => {

    Cliente.hasMany(models.Pedido, {
        foreignKey: "idCliente", 
        as: "pedidos"
    });
};

module.exports = Cliente;

const { DataTypes } = require("sequelize");
const sequelize = require("../connection");

const Entrega = sequelize.define(
    "Entrega",
    {
        idEntrega: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: "id_entrega"
        },

        numPedido: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            field: "num_pedido"
        },

        nomeRecebedor: {
            type: DataTypes.STRING(150),
            allowNull: false,
            field: "nome_recebedor"
        },

        telefoneRecebedor: {
            type: DataTypes.STRING(20),
            allowNull: false,
            field: "telefone_recebedor"
        },

        rua: {
            type: DataTypes.STRING(150),
            allowNull: false,
            field: "rua"
        },

        numero: {
            type: DataTypes.STRING(10),
            allowNull: false,
            field: "numero"
        },

        bairro: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: "bairro"
        },

        cep: {
            type: DataTypes.STRING(8),
            allowNull: false,
            field: "cep"
        },

        referencia: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: "referencia"
        }

    },
    {
        timestamps: false,
        underscored: true,
        tableName: "entrega"
    }
);

Entrega.associate = (models) => {
    
    Entrega.belongsTo(models.Pedido, {
        foreignKey: "numPedido",
        as: "pedido"
    });
};

module.exports = Entrega;

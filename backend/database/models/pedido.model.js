const { DataTypes } = require("sequelize");
const sequelize = require("../connection");

const Pedido = sequelize.define(
    "Pedido",
    {
        numPedido: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: "num_pedido"
        },

        dataHoraCriacao: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: "data_hora_criacao"
        },

        origem: {
            type: DataTypes.STRING(30),
            allowNull: false,
            field: "origem"
        },

        dataRetirada: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            field: "data_retirada"
        },

        horaRetirada: {
            type: DataTypes.TIME,
            allowNull: false,
            field: "hora_retirada"
        },

        precoTotal: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            field: "preco_total"
        },

        tipoPedido: {
            type: DataTypes.STRING(20),
            allowNull: false,
            field: "tipo_pedido"
        },

        status: {
            type: DataTypes.STRING(20),
            allowNull: false,
            field: "status"
        },

        tipoEntrega: {
            type: DataTypes.STRING(20),
            field: "tipo_entrega"
        },

        msgCartao: {
            type: DataTypes.TEXT,
            field: "msg_cartao"
        },

        observacao: {
            type: DataTypes.TEXT,
            field: "observacao"
        },

        foto: {
            type: DataTypes.TEXT,
            field: "foto"
        },

        idCliente: {
            type: DataTypes.INTEGER,
            field: "id_cliente"
        },

//        idCaixa: {
//            type: DataTypes.INTEGER,
//            field: "id_caixa"
//        }
    },
    {
        timestamps: false,
        underscored: true,
        tableName: "pedido"
    }
);

Pedido.associate = (models) => {

    Pedido.belongsTo(models.Cliente, {
        foreignKey: "idCliente",
        as: "cliente"
    });

    Pedido.hasOne(models.Entrega, {
        foreignKey: "numPedido",
        as: "entrega"
    });

    Pedido.hasOne(models.Pagamento, {
        foreignKey: "numPedido",
        as: "pagamento"
    });

    Pedido.hasMany(models.ItemPedido, {
        foreignKey: "numPedido",
        as: "itens"
    });

};

module.exports = Pedido;


const { DataTypes } = require('sequelize');
const sequelize = require('../connection');

const Composicao = sequelize.define(
    "Composicao", 
        {

        idProdutoComposto: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            field: "id_produto_composto",
            references: {
                model: 'produto',
                key: 'id_produto'
            }
        },

        idProdutoComponente: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            field: "id_produto_componente",
            references: {
                model: 'produto',
                key: 'id_produto'
            }
        },

        quantidade: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "quantidade"
        }

    }, 
    {
        tableName: 'composicao',
        timestamps: false,
        freezeTableName: true
    }
);

Composicao.associate = (models) => {

    Composicao.belongsTo(models.Produto, {
        foreignKey: "idProdutoComposto",
        as: "produtoComposto"
    });

    Composicao.belongsTo(models.Produto, {
        foreignKey: "idProdutoComponente",
        as: "produtoComponente"
    });

};

module.exports = Composicao;

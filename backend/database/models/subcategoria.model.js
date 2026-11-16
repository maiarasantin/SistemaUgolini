const { DataTypes } = require("sequelize");
const sequelize = require("../connection");

const SubCategoria = sequelize.define(
    "SubCategoria", 
    {
        idSubcategoria: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: "id_subcategoria"
        },

        nome: {
            type: DataTypes.STRING(50),
            allowNull: false,
            field: "nome"
        },

        idCategoria: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "id_categoria"
        }

    }, 
    {
        timestamps: false,
        underscored: true,
        tableName: "subcategoria"
    }
);

SubCategoria.associate = (models) => {

    SubCategoria.belongsTo(models.Categoria, {
        foreignKey: "idCategoria",
        as: "categoria"
    });

    SubCategoria.hasMany(models.Produto, {
        foreignKey: "idSubcategoria",
        as: "produtos"
    });

};

module.exports = SubCategoria;
const { DataTypes } = require("sequelize");
const sequelize = require("../connection");

const Categoria = sequelize.define(
    "Categoria", 
    {
        idCategoria: 
        {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: "id_categoria"
        },

        nome: {
            type: DataTypes.STRING(50),
            allowNull: false,
            field: "nome"
        }

    }, 
    {
        timestamps: false,
        underscored: true,
        tableName: "categoria"
    }   
);

Categoria.associate = (models) => {

    Categoria.hasMany(models.SubCategoria, {
        foreignKey: "idCategoria",
        as: "subcategorias"
    });

};

module.exports = Categoria;
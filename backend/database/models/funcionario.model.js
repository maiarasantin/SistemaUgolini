const { DataTypes } = require("sequelize");
const sequelize = require("../connection");

const Funcionario = sequelize.define(
	"Funcionario",
	{
		id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: "id_funcionario"
        },
		cpf: {
            type: DataTypes.STRING(11),
            allowNull: false,
            unique: true,
            field: "cpf",
        },
		nome: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: "nome",
        },
		 telefone: {
           type: DataTypes.STRING(20),
           allowNull: false,
           field: "telefone",
        }, 
          email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            field: "email",
        }, 
          dataContratacao: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            field: "data_contratacao",
        }, 
            status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            field: "status",
        },
            senha: {
            type: DataTypes.STRING(255),
            allowNull: false,
            field: "senha",
        }, 
            eAdmin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            field: "e_admin",
        },
	},
	{
        timestamps: false,
        underscored: true, 
        tableName: "funcionarios",
    },
);


module.exports = Funcionario;







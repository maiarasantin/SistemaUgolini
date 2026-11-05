const Funcionario = require("../database/models/funcionario.model");

async function buscarPorEmail(email) {
    return Funcionario.findOne({ where: { email } });
}

async function buscarPorId(id) {
    return Funcionario.findByPk(id);
}

async function criar(dados) {
    return Funcionario.create(dados);
}

module.exports = { buscarPorEmail, buscarPorId, criar };

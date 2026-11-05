const Funcionario = require("../database/models/funcionario.model");

async function buscarPorEmail(email) {
    return Funcionario.findOne({ where: { email } });
}

async function buscarPorCpf(cpf) {
    return Funcionario.findOne({ where: { cpf } });
}

async function buscarPorId(id) {
    return Funcionario.findByPk(id);
}

async function criar(dados) {
    return Funcionario.create(dados);
}

module.exports = { buscarPorEmail, buscarPorCpf, buscarPorId, criar };

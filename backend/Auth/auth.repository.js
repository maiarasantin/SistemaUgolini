const Funcionario = require("../database/models/funcionario.model");

// Usada pelo service no login
async function buscarPorEmail(email) {
    return Funcionario.findOne({ where: { email } });
}


// Usada pelo config para saber de quem é o token
async function buscarPorId(id) {
    return Funcionario.findByPk(id);
}


module.exports = { buscarPorEmail, buscarPorId };

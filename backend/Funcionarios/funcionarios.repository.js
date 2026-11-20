const { Op } = require("sequelize");
const Funcionario = require("../database/models/funcionario.model");
const { escaparLike } = require("../utils/validacoes");


async function listar({ busca, buscaNumeros, ordenarPor, direcao }) {
   
    const where = { eAdmin: false }; //Só traz quem não é admin

    const condicoes = [];


    //Se digitou algum texto procura ele no nome ou no email
    if (busca) {
        
        condicoes.push(
            { nome: { [Op.iLike]: `%${escaparLike(busca)}%` } },
            { email: { [Op.iLike]: `%${escaparLike(busca)}%` } },  // O escaparLike faz um "%" ou "_" digitado ser tratado como letra comum
        );
    }

    // Se digitou números procura eles no telefone ou no CPF
    if (buscaNumeros) {
        condicoes.push(
            { telefone: { [Op.iLike]: `%${buscaNumeros}%` } },
            { cpf: { [Op.iLike]: `%${buscaNumeros}%` } },
        );
    }

    // Junta as condições com "ou", o vendedor aparece se bater em qualquer uma
    if (condicoes.length > 0) {
        where[Op.or] = condicoes;
    }

    return Funcionario.findAll({
        where,
        attributes: { exclude: ["senha"] }, // traz todas as colunas menos a senha 
        order: [[ordenarPor, direcao]],
    });
}

async function buscarPorId(id) {
    return Funcionario.findOne({
        where:{ id, eAdmin: false},
        attributes: {exclude: ["senha"]}, // Devolve todos os atributos menos a senha
    })
    
}
async function criar(dados){
    return Funcionario.create(dados);
}

async function atualizar(funcionario, dados){
    return funcionario.update(dados);
}
async function excluir(funcionario) {
    return funcionario.destroy();
}



// --------FUNÇÕES USADAS PELO SERVICE PARA EVITAR CPF E EMAIL REPETIDOS -----

async function buscarPorCpf(cpf){
    return Funcionario.findOne({
        where: {cpf}
    });
}

async function buscarPorEmail(email){
    return Funcionario.findOne({
        where: {email}
    });
}

module.exports = {
    listar,
    buscarPorId,
    criar,
    atualizar, 
    excluir,
    buscarPorCpf,
    buscarPorEmail,
}
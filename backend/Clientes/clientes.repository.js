const { Op } = require("sequelize");
const { escaparLike } = require("../utils/validacoes");
const Cliente = require("../database/models/cliente.model");




// listar: busca os clientes no banco, com filtro de texto e ordenação.
//
// Recebe (do service):
//   busca        -> o texto digitado na caixa de busca
//   buscaNumeros -> esse mesmo texto, só com os números (pra telefone e CPF/CNPJ)
//   ordenarPor   -> a coluna usada pra ordenar (nome, telefone, email)
//   direcao      -> "ASC" (A a Z) ou "DESC" (Z a A)
//
// Como funciona:
//   1. Monta uma lista de condições conforme o que foi digitado:
//        - texto digitado -> o nome precisa conter o texto
//        - números digitados -> telefone, CPF ou CNPJ precisam conter os números
//      ("iLike" = contém, sem diferenciar maiúscula de minúscula; os "%" são curingas)
//   2. Junta as condições com "ou" (Op.or): o cliente aparece se bater em QUALQUER uma.
//   3. Sem nada digitado, não há condição e traz todos os clientes.
//   4. Busca no banco (findAll) já na ordem pedida.
async function listar({ busca, buscaNumeros, ordenarPor, direcao}) {
        //condições de filtro (começa vazia)
       const where = {};


       const condicoes = [];

       if(busca){
            condicoes.push({ nome: { [Op.iLike]: `%${escaparLike(busca)}%` } }); // Op.iLike = "contém o texto", sem diferenciar maiúscula de minúscula.
       }                                                                         // O escaparLike faz um "%" ou "_" digitado ser tratado como letra comum
    

         if (buscaNumeros) {
        condicoes.push(
            { telefone: { [Op.iLike]: `%${buscaNumeros}%` } },
            { cpf: { [Op.iLike]: `%${buscaNumeros}%` } },
            { cnpj: { [Op.iLike]: `%${buscaNumeros}%` } },
        );
    }

     if (condicoes.length > 0) {
        where[Op.or] = condicoes;
    }

     return Cliente.findAll({ where, order: [[ordenarPor, direcao]] });
}


async function buscarPorId(id){
    return Cliente.findByPk(id);
}

async function buscarPorCnpj(cnpj){
    return Cliente.findOne({ where: { cnpj } });
}

// Não é uma rota: é usada só pelo service, antes de salvar, pra recusar CPF repetido
// com uma mensagem clara (409) em vez de um erro técnico do banco (500).
async function buscarPorCpf (cpf) {
    return Cliente.findOne({ where: {cpf}});
    
}

async function criar(dados) {
    return Cliente.create(dados);
}

async function atualizar(cliente, dados){
    return cliente.update(dados);

}

async function excluir(cliente) {
    return cliente.destroy();
}


module.exports = {
    listar,
    buscarPorId,
    buscarPorCpf,
    buscarPorCnpj,
    criar,
    atualizar,
    excluir,
};
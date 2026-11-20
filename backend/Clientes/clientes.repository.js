const { Op } = require("sequelize");
const { escaparLike } = require("../utils/validacoes");
const Cliente = require("../database/models/cliente.model");

// listar: busca os clientes no banco, com filtro de texto e ordenação
// Recebe:
//   busca        -> o texto digitado na caixa de busca
//   buscaNumeros -> o mesmo texto, só com os números
//   ordenarPor   -> a coluna usada pra ordenar
//   direcao      -> "ASC" (A a Z)

// Como funciona:
//   1. Texto digitado -> o nome contém o texto (o escaparLike trata "%" e "_" como letra comum)
//   2. Números digitados -> telefone, CPF ou CNPJ contêm os números
//   3. As condições são juntas com "ou": aparece quem bater em qualquer uma
//   4. Sem nada digitado, traz todos os clientes, já na ordem pedida
async function listar({ busca, buscaNumeros, ordenarPor, direcao }) {
  //Condições de filtro (começa vazia)
  const where = {};

  const condicoes = [];

  if (busca) {
    condicoes.push({ nome: { [Op.iLike]: `%${escaparLike(busca)}%` } }); // Op.iLike = "contém o texto", sem diferenciar maiúscula de minúscula
  } // O escaparLike faz um "%" ou "_" digitado ser tratado como letra comum

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

async function buscarPorId(id) {
  return Cliente.findByPk(id);
}

// Função usada pelo service antes de salvar para recusar CNPJ repetido
async function buscarPorCnpj(cnpj) {
  return Cliente.findOne({ where: { cnpj } });
}

// Função usada pelo service antes de salvar para recusar CPF repetido
async function buscarPorCpf(cpf) {
  return Cliente.findOne({ where: { cpf } });
}

async function criar(dados) {
  return Cliente.create(dados);
}

async function atualizar(cliente, dados) {
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

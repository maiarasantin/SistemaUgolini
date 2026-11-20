const bcrypt = require("bcrypt");
const funcionariosRepository = require("./funcionarios.repository");
const { criarErro } = require("../utils/erros");
const { limparTexto, validarId, lerOrdenacao } = require("../utils/validacoes");

const SALT_ROUNDS = 12; // Quantas voltas o bcrypt da para embaralhar a senha

const CAMPOS_ORDENAVEIS = ["nome", "dataContratacao", "status"];



function somenteNumeros(valor) {
  const texto = String(valor);
  return texto.replace(/\D/g, ""); // Qualquer coisa que não seja digito será trocado por ""
}



//Devolve a data de hoje no formato AAAA-MM-DD, para não aceitar contratação no futuro
function dataDeHoje() {
  const hoje = new Date();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");
  return `${hoje.getFullYear()}-${mes}-${dia}`;
}



function tratarDados(dados, senhaObrigatoria) {
  if (!dados) {
    dados = {};
  }

  //----------Nome-----------

  const nome = limparTexto(dados.nome);

  if (nome === "") {
    throw criarErro(400, "Informe o nome do vendedor.");
  }

  if (nome.length > 100) {
    throw criarErro(400, "O Nome deve ter no máximo 100 caracteres.");
  }

  //----------CPF-----------
  const cpf = somenteNumeros(dados.cpf);

  if (cpf === "") {
    throw criarErro(400, "Informe o CPF do vendedor.");
  }

  if (cpf.length !== 11) {
    throw criarErro(400, "CPF inválido. O CPF deve conter 11 digitos");
  }

  //----------Telefone/WhatsApp-----------
  const telefone = somenteNumeros(dados.telefone);

  if (telefone === "") {
    throw criarErro(400, "Informe o telefone do vendedor.");
  }

  if (telefone.length < 10 || telefone.length > 11) {
    throw criarErro(400, "Telefone inválido, informe o DDD e o número.");
  }

  //----------Email-----------
  const email = limparTexto(dados.email);

  if (email !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    //não aceita se não tiver formato de email correto
    throw criarErro(400, "E-mail inválido.");
  }

  if (email.length > 100) {
    throw criarErro(400, "O Email deve ter no máximo 100 caracteres.");
  }

  if (email === "") {
    throw criarErro(400, "Informe o email do vendedor.");
  }

  //----------Data de contratação-----------

  const dataContratacao = String(dados.dataContratacao ?? "").trim();

  //Testa o formato porque ele tem que ser AAAA-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dataContratacao)) {
    throw criarErro(400, "Informe a data de contratação.");
  }

  if (dataContratacao > dataDeHoje()) {
    throw criarErro(400, "A data de contratação não pode ser no futuro.");
  }

  //Transforma o texto em uma data de verdade
  const data = new Date(`${dataContratacao}T00:00:00Z`);

  // Barra datas que não existem. São dois casos diferentes:
  //   - mês 13 ou 00: o JavaScript não consegue criar a data
  //    dia que não existe no mês, ex.: 31 de fevereiro: o JavaScript não dá erro,
  //     ele "ajusta" sozinho pro mês seguinte (2024-02-31 vira 2024-03-02).
  //     Então convertemos a data de volta pra texto e comparamos com a digitada:
  //     se mudou, é porque a original não existia.
  if (
    Number.isNaN(data.getTime()) ||
    data.toISOString().slice(0, 10) !== dataContratacao
  ) {
    throw criarErro(400, "Data de contratação inválida.");
  }

  //----------Status-----------

  // true = ativo, false = inativo
  let status = dados.status;

  if (status === undefined) {
    status = true;
  }

  if (typeof status !== "boolean") {
    throw criarErro(400, "Status inválido.");
  }

  //----------Senha-----------

  let senha;
  if (typeof dados.senha === "string") {
    senha = dados.senha; // Se for texto usa o que veio
  } else {
    senha = ""; // Se não for texto ou não veio usa vazio
  }

  if (senhaObrigatoria && senha === "") {
    throw criarErro(400, "Informe uma senha para o vendedor."); //Se é obrigatório e está vazia da erro
  }

  if (senha !== "" && senha.length < 8) {
    throw criarErro(400, "A senha deve ter pelo menos 8 caracteres.");
  }

  // O bcrypt só lê os 72 primeiros caracteres, acima disso a senha seria cortada em silêncio
  if (senha.length > 72) {
    throw criarErro(400, "A senha deve ter no máximo 72 caracteres.");
  }

  return {
    nome,
    cpf,
    telefone,
    email,
    dataContratacao,
    status,
    senha,
    eAdmin: false,
  };
}



// Confere se já existe outro funcionário com o mesmo CPF ou e-mail
async function validarCpfeEmailUnicos(dados, idAtual) {
  const funcComCpf = await funcionariosRepository.buscarPorCpf(dados.cpf); // Quem é o dono desse cpf

  //Se achou alguém e o esse alguém não for quem eu estou editando é o cpf de outra pessoa
  if (funcComCpf && funcComCpf.id !== idAtual) {
    throw criarErro(409, "Já existe um funcionário cadastrado com esse CPF.");
  }

  const funcComEmail = await funcionariosRepository.buscarPorEmail(dados.email);

  if (funcComEmail && funcComEmail.id !== idAtual) {
    throw criarErro(
      409,
      "Já existe um funcionário cadastrado com esse e-mail.",
    );
  }
}




// Confere o id e busca o vendedor
async function validacaoIDeVendedorExistente(id) {
  const numero = validarId(id, "Identificador de vendedor inválido.");

  const vendedor = await funcionariosRepository.buscarPorId(numero);

  if (!vendedor) {
    throw criarErro(404, "Vendedor não encontrado.");
  }

  return vendedor;
}



async function buscarPorId(id) {
  return validacaoIDeVendedorExistente(id);
}




async function listar(consulta) {
  const busca = String(consulta.busca ?? "").trim(); // Pega o que veio na URL  e tira os espaços do começo e do fim

  const ordenacao = lerOrdenacao(consulta, CAMPOS_ORDENAVEIS, "nome");

  return funcionariosRepository.listar({
    busca: busca,
    buscaNumeros: somenteNumeros(busca),
    ordenarPor: ordenacao.ordenarPor,
    direcao: ordenacao.direcao,
  });
}




async function criar(dados) {
  const dadosTratados = tratarDados(dados, true);

  await validarCpfeEmailUnicos(dadosTratados, null);

  dadosTratados.senha = await bcrypt.hash(dadosTratados.senha, SALT_ROUNDS); // Guardando o hash

  const criado = await funcionariosRepository.criar(dadosTratados);

  return funcionariosRepository.buscarPorId(criado.id); // Busca de novo para devolver sem a senha
}




async function atualizar(id, dados) {
  const vendedor = await validacaoIDeVendedorExistente(id);
  const dadosTratados = tratarDados(dados, false);

  await validarCpfeEmailUnicos(dadosTratados, vendedor.id);

  if (dados.status === undefined) {
    dadosTratados.status = vendedor.status; // Se o pedido não mandou status, mantém o que o vendedor já tinha
  }

  if (dadosTratados.senha !== "") {
    dadosTratados.senha = await bcrypt.hash(dadosTratados.senha, SALT_ROUNDS); // Senha nova é embaralhada
  } else {
    delete dadosTratados.senha; //Se o campo veio vazio é só tirar para não ir espaço em branco para o banco
  }

  await funcionariosRepository.atualizar(vendedor, dadosTratados);

  return funcionariosRepository.buscarPorId(vendedor.id);
}




async function excluir(id) {
  const vendedor = await validacaoIDeVendedorExistente(id);
  await funcionariosRepository.excluir(vendedor);
}

module.exports = { buscarPorId, listar, criar, atualizar, excluir };

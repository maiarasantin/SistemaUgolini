const clientesRepository = require("./clientes.repository");
const { criarErro } = require("../utils/erros");
const { limparTexto, validarId, lerOrdenacao } = require("../utils/validacoes");


const CAMPOS_ORDENAVEIS = ["nome", "telefone", "email"]; // Evitar que alguém mande um nome de campo qualquer pela URL



// Tira tudo que não é número: "(49) 99876-5432" vira "49998765432".
function somenteNumeros(valor) {
    const texto = String(valor); // Tem que converter em string antes por conta do replace que só funciona com texto
    return texto.replace(/\D/g, ""); // Qualquer coisa que não seja digito troque por ""
}



// Valida os dados que vieram do front e monta o objeto pro banco
function tratarDados(dados) {

    if(!dados){
        dados = {};
    }


      //------------NOME--------------------
    const nome = limparTexto(dados.nome);

    if( nome.length > 150 ){
        throw criarErro(400, "O nome deve ter no máximo 150 caracteres.");
    }

     if (nome === ""){
        throw criarErro(400, "Informe o nome do cliente.");
    }

    //------------TELEFONE--------------------

    const telefone = somenteNumeros(dados.telefone);

    if (telefone === ""){
        throw criarErro(400, "Informe o telefone do cliente.");
    }

    if(telefone.length < 10 || telefone.length > 11){
        throw criarErro(400, "Telefone inválido, informe o DDD e o número.");
    }


    //------------DOCUMENTO--------------------
    const documento =  somenteNumeros(dados.documento);
    let cpf = null;
    let cnpj = null;

    if (documento.length === 11){
        cpf = documento;
    } else if (documento.length === 14){
        cnpj = documento;
    } else if (documento.length > 0){
        throw criarErro(400, "CPF/CNPJ inválido. O CPF tem 11 digitos e o CNPJ tem 14.");
    } // Se não digitou nada, não faz nada e o cliente fica sem documento


    // Tipo do cliente: PF se tem CPF, PJ se tem CNPJ, vazio se não informou documento
    let tipoCliente = null;

    if (cpf) {
        tipoCliente = "PF";
    }

    if (cnpj) {
        tipoCliente = "PJ";
    }


     //------------EMAIL--------------------
    let email = limparTexto(dados.email);

    if(email !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ // Não aceita se não tiver formato de email correto
        throw criarErro(400, "E-mail inválido.");
    }

    if(email.length > 150){
        throw criarErro(400, "O email deve ter no máximo 150 caracteres.");
    }

     if (email === ""){
        email = null;
    }


    
    
    //------------CEP--------------------
    let cep = somenteNumeros(dados.cep);

    if(cep.length > 0 && cep.length !== 8){
        throw criarErro(400, "CEP Inválido. Informe os 8 dígitos");
    }

    if (cep === ""){
        cep = null;
    }




    //------------RUA--------------------
    let rua = limparTexto(dados.rua);

    if(rua.length > 150){
        throw criarErro(400, "A Rua deve ter no máximo 150 caracteres");
    }

    if (rua === ""){
        rua = null;
    }



    //------------BAIRRO--------------------
    let bairro = limparTexto(dados.bairro);

    if(bairro.length > 100){
        throw criarErro(400, "O Bairro deve ter no máximo 100 caracteres");
    }

    if (bairro === ""){
        bairro = null;
    }



    //------------NÚMERO--------------------

    let numero = limparTexto(dados.numero);

    if (numero.length > 10){
        throw criarErro(400, "O número deve ter no máximo 10 caracteres");
    }


    if (numero === ""){
        numero = null;
    }

    //------------REFERÊNCIA--------------------

    let referencia = limparTexto(dados.referencia);

    if (referencia.length > 255) {
        throw criarErro(400, "A referência deve ter no máximo 255 caracteres.");
    }

     if (referencia === ""){
        referencia = null;
    }

    return {
    nome,
    telefone,
    email,
    tipoCliente,
    cpf,
    cnpj,
    cep,
    rua,
    numero,
    bairro,
    referencia,
};
}





// Confere se já existe outro cliente com o mesmo CPF ou CNPJ
async function validarDocumentoUnico(dados, idAtual) {
    if(dados.cpf){
        const existe = await clientesRepository.buscarPorCpf(dados.cpf);
        if(existe && existe.idCliente !== idAtual) {  // Se existir um cliente a variavel "existe' vai receber ele e vai dar errado, se não existir vai dar null e nem entrar na condição
           throw criarErro(409, "Já existe um cliente cadastrado com esse CPF.");
    }
    
}

if(dados.cnpj){
    const existe = await clientesRepository.buscarPorCnpj(dados.cnpj);
    if(existe && existe.idCliente !== idAtual){
        throw criarErro(409, "Já existe um cliente cadastrado com esse CNPJ.");
    }
}
}



// Confere o id e busca o cliente
async function validacaoIDeClienteExistente(id) {

    // Confere se o id é um número inteiro positivo e se não for, dá erro 
    const numero = validarId(id, "Identificador de cliente inválido.");

    const cliente = await clientesRepository.buscarPorId(numero);

    if(!cliente){
        throw criarErro(404, "Cliente não encontrado.");
    }

    return cliente;
}


async function buscarPorId(id) {
    return validacaoIDeClienteExistente(id); 
}


// Lista os clientes com busca por texto e ordenação
async function listar(consulta) {


    let busca = consulta.busca;  //Pega o que veio na URL 
    
    if(!busca){
        busca = ""; //Se não veio nada, usa um valor padrão
    }

    busca = String(busca).trim(); //Tira os espaços do começo e do fim da busca

    const ordenacao = lerOrdenacao(consulta, CAMPOS_ORDENAVEIS, "nome");
   
    const buscaNumeros = somenteNumeros(busca);//Separa só os números do que a pessoa digitou

    const clientes = await clientesRepository.listar({
        busca: busca,
        buscaNumeros: buscaNumeros,
        ordenarPor: ordenacao.ordenarPor,
        direcao: ordenacao.direcao,
    });

    return clientes;  //Devolve a lista pro controller
} 




async function criar(dados) {
  const novo = tratarDados(dados); // Valida os dados novos
  await validarDocumentoUnico(novo, null); //Garante que o cpf/cnpj não seja duplicado
  return clientesRepository.criar(novo);
   
} 


async function atualizar(id, dados) {
    const cliente = await validacaoIDeClienteExistente(id); //Confere se o id ta certo e se o cliente existe
    const novo = tratarDados(dados); // Valida os novos dados
    await validarDocumentoUnico(novo, cliente.idCliente);  // Garante que o cpf/cnpj não seja duplicado
    return clientesRepository.atualizar(cliente, novo);
} 


//Se o cliente já tem pedido, ele não pode ser excluido do banco
async function excluir(id) {
    const cliente = await validacaoIDeClienteExistente(id); 
    try{
        await clientesRepository.excluir(cliente);
    } catch (erro){
        if(erro.name === "SequelizeForeignKeyConstraintError"){
            throw criarErro(409, "Não é possível excluir esse cliente, ele possui pedidos cadastrados.");
        }

        throw erro; // Para erros desconhecidos
    }
    
} 

module.exports = {buscarPorId, listar, criar, atualizar, excluir};




   
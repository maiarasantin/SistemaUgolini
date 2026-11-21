const subcategoriasRepository = require("./subcategorias.repository");
const { criarErro } = require("../utils/erros");
const { limparTexto, validarId, lerOrdenacao } = require("../utils/validacoes");



const CAMPOS_ORDENAVEIS = ["nome", "categoria", "idSubcategoria"];
const TAMANHO_MAXIMO_NOME = 50;


async function tratarDados(dados){
    const nome = limparTexto(dados?.nome);

    if(nome === ""){
        throw criarErro(400, "O nome da subcategoria é obrigatório.");
    }

    if(nome.length > TAMANHO_MAXIMO_NOME){
        throw criarErro(400, `O nome deve ter no máximo ${TAMANHO_MAXIMO_NOME} caracteres.`);
    }

    if(dados.idCategoria === undefined || dados.idCategoria === null || dados.idCategoria === ""){
        throw criarErro(400, "A categoria da subcategoria é obrigatória.");
    }

    const idCategoria = validarId(dados.idCategoria, "Identificador de categoria inválido.");

    if(!(await subcategoriasRepository.categoriaExiste(idCategoria))){
        throw criarErro(400, "A categoria informada não existe.");
    }

    return { nome, idCategoria };
}


async function validarNomeUnico(dados, idAtual){
    const existente = await subcategoriasRepository.buscarPorNomeNaCategoria(dados.nome, dados.idCategoria);

    if(existente && existente.idSubcategoria !== idAtual){
        throw criarErro(409, "Já existe uma subcategoria com esse nome nesta categoria.");
    }
}


async function validarIdESubcategoriaExistente(id){
    const numero = validarId(id, "Identificador de subcategoria inválido.");
    const subcategoria = await subcategoriasRepository.buscarPorId(numero);

    if(!subcategoria){
        throw criarErro(404, "Subcategoria não encontrada.");
    }

    return subcategoria;
}


function traduzirErroDeBanco(erro){
    if(erro.name === "SequelizeUniqueConstraintError"){
        return criarErro(409, "Já existe uma subcategoria com esse nome nesta categoria.");
    }
    return erro;
}

async function listar(consulta){
    const busca = limparTexto(consulta.busca);
    const { ordenarPor, direcao } = lerOrdenacao(consulta, CAMPOS_ORDENAVEIS, "nome");

    let idCategoria;
    if(consulta.idCategoria !== undefined && consulta.idCategoria !== ""){
        idCategoria = validarId(consulta.idCategoria, "Identificador de categoria inválido.");
    }

    return subcategoriasRepository.listar({ busca, idCategoria, ordenarPor, direcao });
}

async function buscarPorId(id){
    return validarIdESubcategoriaExistente(id);
}

async function criar(dados){
    const novo = await tratarDados(dados);
    await validarNomeUnico(novo, null);

    try {
        const subcategoria = await subcategoriasRepository.criar(novo);
        return subcategoriasRepository.buscarPorId(subcategoria.idSubcategoria);
    } catch(erro){
        throw traduzirErroDeBanco(erro);
    }
}

async function atualizar(id, dados){
    const subcategoria = await validarIdESubcategoriaExistente(id);
    const novo = await tratarDados(dados);
    await validarNomeUnico(novo, subcategoria.idSubcategoria);

    try {
        await subcategoriasRepository.atualizar(subcategoria, novo);
        return subcategoriasRepository.buscarPorId(subcategoria.idSubcategoria);
    } catch(erro){
        throw traduzirErroDeBanco(erro);
    }
}


async function excluir(id){
    const subcategoria = await validarIdESubcategoriaExistente(id);
    const totalProdutos = await subcategoriasRepository.contarProdutos(subcategoria.idSubcategoria);

    if(totalProdutos > 0){
        throw criarErro(409, "Não é possível excluir esta subcategoria, ela possui produtos cadastrados.");
    }

    try {
        await subcategoriasRepository.excluir(subcategoria);
    } catch(erro){
        
        if(erro.name === "SequelizeForeignKeyConstraintError"){
            throw criarErro(409, "Não é possível excluir esta subcategoria, ela possui produtos cadastrados.");
        }
        
        throw erro;
    }
}

module.exports = { 
    listar, 
    buscarPorId, 
    criar, 
    atualizar, 
    excluir, 
};

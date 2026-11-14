const categoriasRepository = require("./categorias.repository");
const { criarErro } = require("../utils/erros");
const { limparTexto, validarId, lerOrdenacao } = require("../utils/validacoes");

// Evita que alguém mande um nome de campo qualquer pela URL.
const CAMPOS_ORDENAVEIS = ["nome", "idCategoria", "totalSubcategorias"];

const TAMANHO_MAXIMO_NOME = 50; // mesmo tamanho da coluna no banco

// Valida os dados que vieram do front e monta o objeto pro banco.
// Só o "nome" é copiado: qualquer outro campo enviado no corpo é ignorado.
function tratarDados(dados) {
    const nome = limparTexto(dados?.nome);

    if (nome === "") {
        throw criarErro(400, "O nome da categoria é obrigatório.");
    }

    if (nome.length > TAMANHO_MAXIMO_NOME) {
        throw criarErro(400, `O nome deve ter no máximo ${TAMANHO_MAXIMO_NOME} caracteres.`);
    }

    return { nome };
}

// Garante que não exista outra categoria com o mesmo nome (sem diferenciar maiúscula de minúscula).
// idAtual: no editar, a própria categoria não conta como duplicada.
async function validarNomeUnico(nome, idAtual) {
    const existente = await categoriasRepository.buscarPorNomeExato(nome);

    if (existente && existente.idCategoria !== idAtual) {
        throw criarErro(409, "Já existe uma categoria com esse nome.");
    }
}

// Em todo lugar que recebe um id: confere se é um número válido e se a categoria existe.
async function validarIdECategoriaExistente(id) {
    const numero = validarId(id, "Identificador de categoria inválido.");
    const categoria = await categoriasRepository.buscarPorId(numero);

    if (!categoria) {
        throw criarErro(404, "Categoria não encontrada.");
    }

    return categoria;
}

// ?possuiSubcategorias=true | false  (se não vier, não filtra)
function lerFiltroPossuiSubcategorias(valor) {
    if (valor === undefined || valor === "") {
        return undefined;
    }
    if (valor === "true") {
        return true;
    }
    if (valor === "false") {
        return false;
    }
    throw criarErro(400, "Filtro possuiSubcategorias inválido. Use true ou false.");
}

// Se dois cadastros simultâneos passarem pela checagem de nome, o índice único do banco
// (ver database/scripts/categorias_subcategorias.sql) barra o segundo. Aqui traduzimos esse erro.
function traduzirErroDeBanco(erro) {
    if (erro.name === "SequelizeUniqueConstraintError") {
        return criarErro(409, "Já existe uma categoria com esse nome.");
    }
    return erro;
}

async function listar(consulta) {
    const busca = limparTexto(consulta.busca);
    const possuiSubcategorias = lerFiltroPossuiSubcategorias(consulta.possuiSubcategorias);
    const { ordenarPor, direcao } = lerOrdenacao(consulta, CAMPOS_ORDENAVEIS, "nome");

    return categoriasRepository.listar({ busca, possuiSubcategorias, ordenarPor, direcao });
}

async function buscarPorId(id) {
    return validarIdECategoriaExistente(id);
}

async function criar(dados) {
    const novo = tratarDados(dados);
    await validarNomeUnico(novo.nome, null);

    try {
        const categoria = await categoriasRepository.criar(novo);
        return categoriasRepository.buscarPorId(categoria.idCategoria);
    } catch (erro) {
        throw traduzirErroDeBanco(erro);
    }
}

async function atualizar(id, dados) {
    const categoria = await validarIdECategoriaExistente(id);
    const novo = tratarDados(dados);
    await validarNomeUnico(novo.nome, categoria.idCategoria);

    try {
        await categoriasRepository.atualizar(categoria, novo);
        return categoriasRepository.buscarPorId(categoria.idCategoria);
    } catch (erro) {
        throw traduzirErroDeBanco(erro);
    }
}

// Regra RF03: não pode excluir categoria que tenha produtos.
// Também não exclui se ainda tiver subcategorias (evita apagar dados sem querer):
// a pessoa precisa excluir ou mover as subcategorias antes.
async function excluir(id) {
    const categoria = await validarIdECategoriaExistente(id);

    const totalProdutos = await categoriasRepository.contarProdutos(categoria.idCategoria);

    if (totalProdutos > 0) {
        throw criarErro(409, "Não é possível excluir esta categoria, ela possui produtos cadastrados.");
    }

    const totalSubcategorias = await categoriasRepository.contarSubcategorias(categoria.idCategoria);

    if (totalSubcategorias > 0) {
        throw criarErro(409, "Não é possível excluir esta categoria, ela possui subcategorias. Exclua as subcategorias primeiro.");
    }

    try {
        await categoriasRepository.excluir(categoria);
    } catch (erro) {
        // Rede de segurança: se alguém criou uma subcategoria/produto entre a checagem e a exclusão,
        // a chave estrangeira do banco barra, e devolvemos a mesma mensagem clara.
        if (erro.name === "SequelizeForeignKeyConstraintError") {
            throw criarErro(409, "Não é possível excluir esta categoria, ela possui subcategorias ou produtos vinculados.");
        }
        throw erro;
    }
}

module.exports = { 
    listar, 
    buscarPorId, 
    criar, 
    atualizar, 
    excluir 
};

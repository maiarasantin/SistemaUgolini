const subcategoriasRepository = require("./subcategorias.repository");

async function listar() {
    return subcategoriasRepository.listar();
}

async function buscarPorId(id) {
    return subcategoriasRepository.buscarPorId(id);
}

async function buscarPorNome(dado){
    return subcategoriasRepository.buscarPorNome(dado);
}

async function criar(dados) {
    return subcategoriasRepository.criar(dados);
}

async function atualizar(id, dados) {
    return subcategoriasRepository.atualizar(id, dados);
}

async function deletar(id) {
    return subcategoriasRepository.deletar(id);
}

module.exports = {
    listar,
    buscarPorId,
    buscarPorNome,
    criar,
    atualizar,
    deletar,
};
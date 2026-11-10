const { buscarPorNome } = require("./categorias.controller");
const categoriasRepository = require("./categorias.repository");

async function listar(){
    return categoriasRepository.listar();
}

async function buscarPorId(id){
    return categoriasRepository.buscarPorId(id);
}

async function buscarPorNome(dado){
    return categoriasRepository.buscarPorNome(dado);
}

async function criar(dados){
    return categoriasRepository.criar(dados);
}

async function atualizar(id, dados){
    return categoriasRepository.atualizar(id, dados);
}

async function deletar(id){
    return categoriasRepository.deletar(id);
}

module.exports = {
    listar,
    buscarPorId,
    buscarPorNome,
    criar,
    atualizar,
    deletar,
};
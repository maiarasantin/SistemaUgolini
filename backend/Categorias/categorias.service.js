const categoriasRepository = require("./categorias.repository");

async function listar(){
    return categoriasRepository.listar();
}

async function buscarPorId(id){
    return categoriasRepository.buscarPorId(id);
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
    criar,
    atualizar,
    deletar,
};
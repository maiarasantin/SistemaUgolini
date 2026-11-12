const { Categoria } = require("../database/models");

async function listar(){
    return Categoria.findAll({ order: [["nome", "ASC"]] });
}

async function buscarPorId(id) {
    return Categoria.findByPk(id);
}

/*async function buscarPorNome(dado){
    return Categoria.findAll({
        where : {
            nome: {[Op.iLike] : `%${nome}%`}
        }
    });
}*/

async function criar(dados){
    return Categoria.create(dados);
}

async function atualizar(id, dados){
    const categoria = await Categoria.findByPk(id);
    if (!categoria) return null;
    return categoria.update(dados);
}

async function deletar(id){
    const categoria = await Categoria.findByPk(id);
    if(!categoria) return null;
    await categoria.destroy();
    return categoria;
}

module.exports = {
    listar,
    buscarPorId,
    //buscarPorNome,
    criar,
    atualizar,
    deletar,
};
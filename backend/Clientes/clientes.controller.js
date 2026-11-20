const clientesService = require("./clientes.service");
const { responderErro } = require("../utils/erros");



async function listar (req, res) {
    try {
       const clientes  = await clientesService.listar(req.query); //As opções de busca e ordenação vêm no endereço (req.query)
         return res.status(200).json({clientes});
    } catch (erro) {
        return responderErro(res, erro);
    }
}



async function buscarPorId (req, res) {
    try{
         const cliente  = await clientesService.buscarPorId(req.params.id);
         return res.status(200).json({cliente});
        
        } catch (erro){
            return responderErro(res, erro);
        }
}


async function criar (req, res) {
    try{
        const cliente = await clientesService.criar(req.body);
        return res.status(201).json({cliente})
    } catch (erro) {
        return responderErro(res, erro);
    }
}


async function atualizar (req, res) {
    try{
        const cliente = await clientesService.atualizar(req.params.id, req.body);
        return res.status(200).json({cliente})
    } catch (erro) {
        return responderErro(res, erro);
    }
}

async function excluir (req, res) {
    try{
        await clientesService.excluir(req.params.id);
        return res.status(204).send();
    } catch (erro) {
        return responderErro(res, erro);
    }
    
}


module.exports = {listar, buscarPorId, criar, atualizar, excluir};


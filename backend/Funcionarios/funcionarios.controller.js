const funcionariosService = require("./funcionarios.service");
const { responderErro } = require("../utils/erros");

async function listar(req, res) {
  try {
    const vendedores = await funcionariosService.listar(req.query);
    return res.status(200).json({ vendedores });
  } catch (erro) {
    return responderErro(res, erro);
  }
}

async function buscarPorId(req, res) {
  try {
    const vendedor = await funcionariosService.buscarPorId(req.params.id);
    return res.status(200).json({ vendedor });
  } catch (erro) {
    return responderErro(res, erro);
  }
}

async function criar(req, res) {
  try {
    const vendedor = await funcionariosService.criar(req.body);
    return res.status(201).json({ vendedor });
  } catch (erro) {
    return responderErro(res, erro);
  }
}

async function atualizar(req, res) {
  try {
    const vendedor = await funcionariosService.atualizar(
      req.params.id,
      req.body,
    );
    return res.status(200).json({ vendedor });
  } catch (erro) {
    return responderErro(res, erro);
  }
}

async function excluir(req, res) {
  try {
    await funcionariosService.excluir(req.params.id);
    return res.status(204).send();
  } catch (erro) {
    return responderErro(res, erro);
  }
}

module.exports = { listar, buscarPorId, criar, atualizar, excluir };

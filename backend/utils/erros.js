// Funções de erro compartilhadas por todos os módulos

function criarErro(status, mensagem) {  //Usada pelo service quando alguma regra é quebrada
 
  const erro = new Error(mensagem);

  erro.status = status; // Coloca o código HTTP no erro, pra saber depois qual código devolver

  return erro; // Devolve o erro pronto pra ser lançado com "throw"
}

function responderErro(res, erro) { //Usada no controller para responder o usúario

  if (erro.status) {
    return res.status(erro.status).json({ erro: erro.message });
  }

  console.error(erro); //Se não tem status é um erro inesperado então mostra os detalhes no terminal

  return res.status(500).json({ erro: "Erro interno do servidor." });
}

module.exports = { criarErro, responderErro };

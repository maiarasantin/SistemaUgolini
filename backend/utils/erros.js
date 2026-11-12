// Funções de erro compartilhadas por todos os módulos (Clientes, Produtos, Funcionários...).
// Ficam aqui pra não repetir o mesmo código em cada módulo.

// criarErro: cria um erro que carrega junto o código HTTP (400, 404, 409...).
// É usada no SERVICE, quando uma regra é quebrada. Exemplo:
//   throw criarErro(404, "Cliente não encontrado.");
function criarErro(status, mensagem) {
    
    const erro = new Error(mensagem);

    // Gruda o código HTTP no erro, pra saber depois qual código devolver.
    erro.status = status;

    // Devolve o erro pronto pra ser lançado com "throw".
    return erro;
}


function responderErro(res, erro) {
   
    if (erro.status) {
        return res.status(erro.status).json({ erro: erro.message });
    }

    // Se não tem "status", é um erro inesperado (banco fora do ar, bug...).
    // Mostra os detalhes só no terminal, pra você investigar.
    console.error(erro);

    // E manda ao usuário só uma mensagem genérica, sem detalhe técnico.
    return res.status(500).json({ erro: "Erro interno do servidor." });
}

module.exports = { criarErro, responderErro };
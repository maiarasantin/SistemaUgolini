// Funções de erro compartilhadas por todos os módulos 


// criarErro: cria um erro que carrega junto o código HTTP 
// É usada no SERVICE quando uma regra é quebrada
function criarErro(status, mensagem) {
    
    const erro = new Error(mensagem);

    // Gruda o código HTTP no erro, pra saber depois qual código devolver
    erro.status = status;

    // Devolve o erro pronto pra ser lançado com "throw".
    return erro;
}


function responderErro(res, erro) {
   
    if (erro.status) {
        return res.status(erro.status).json({ erro: erro.message });
    }

    //Se não tem status é um erro inesperado então só mostra os detalhes no terminal
    console.error(erro);

    // E manda ao usuário uma mensagem genérica sem detalhes técnicos
    return res.status(500).json({ erro: "Erro interno do servidor." });
}

module.exports = { criarErro, responderErro };
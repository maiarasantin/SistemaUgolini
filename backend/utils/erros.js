// Funções de erro compartilhadas por todos os módulos 

function criarErro(status, mensagem) { //Usada pelo service quando alguma regra é quebrada
    
    const erro = new Error(mensagem);

    // Coloca o código HTTP no erro, pra saber depois qual código devolver
    erro.status = status;

    // Devolve o erro pronto pra ser lançado com "throw"
    return erro;
}


function responderErro(res, erro) { //Usada no controller para responder o usúario
   
    if (erro.status) {
        return res.status(erro.status).json({ erro: erro.message });
    }

    //Se não tem status é um erro inesperado então mostra os detalhes no terminal
    console.error(erro);

    return res.status(500).json({ erro: "Erro interno do servidor." });
}

module.exports = { criarErro, responderErro };
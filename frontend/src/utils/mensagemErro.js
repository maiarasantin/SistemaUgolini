// Substitui erros internos do backend por mensagens genéricas e amigáveis ao usuário
export function pegarMensagemErro(error){

    if(error.response){
        return error.response.data?.erro || "Ocorreu um erro inesperado. Tente novamente.";
    }

    return "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.";
}
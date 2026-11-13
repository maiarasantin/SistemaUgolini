// ARQUIVO: frontend/src/utils/mensagemErro.js
//
// PARA QUE SERVE:
// Quando uma chamada ao backend (axios) dá errado, o React recebe um "error" cheio de
// detalhes técnicos. Esse NÃO pode ir pra tela do usuário (o professor tira nota por isso).
// Esta função olha o erro e devolve UMA FRASE amigável pra mostrar.
//
// Por que fica numa pasta "utils"? Porque várias telas vão usar a mesma função.
// Escrever uma vez e importar nos outros arquivos evita copiar e colar código.

// "export function" = deixa a função disponível pra outros arquivos usarem com import.
export function pegarMensagemErro(error) {

    // error.response existe quando o SERVIDOR RESPONDEU, mas respondeu com erro
    // (ex.: 400 dado inválido, 409 conflito, 500 erro interno).
    if (error.response) {

        // O nosso backend sempre devolve { erro: "frase pronta" }.
        // O "?." (encadeamento opcional) evita travar se "data" não existir.
        // O "||" usa a frase genérica se o backend não mandou nenhuma.
        return error.response.data?.erro || "Ocorreu um erro inesperado. Tente novamente.";
    }

    // Se NÃO existe error.response, o servidor nem respondeu
    // (backend desligado, sem internet, endereço errado no VITE_API_URL...).
    return "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.";
}
const { criarErro } = require("./erros");

// Maior valor que cabe em uma coluna INTEGER do PostgreSQL
const MAX_INTEGER = 2147483647;

// limparTexto: tira espaços do começo e do fim e troca espaços repetidos por um só
function limparTexto(valor){
    if(typeof valor !== "string") return "";
    return valor.trim().replace(/\s+/g, " ");
}

// Escapa "%" e "_" para serem buscados como caracteres literais, e não como curingas do LIKE/ILIKE
function escaparLike(texto){
    return texto.replace(/[\\%_]/g, "\\$&");
}

// validarId: confere se o id que veio na URL ou no corpo é um inteiro positivo
function validarId(id, mensagem){
    const texto = String(id);

    if(!/^\d+$/.test(texto)) throw criarErro(400, mensagem);

    const numero = Number(texto);

    if(numero <= 0 || numero > MAX_INTEGER) throw criarErro(400, mensagem);

    return numero;
}

// lerOrdenacao: lê "ordenarPor" e "direcao" da URL, só aceita campos da lista permitida
function lerOrdenacao(consulta, camposPermitidos, campoPadrao){
    const ordenarPor = consulta.ordenarPor ? String(consulta.ordenarPor) : campoPadrao;

    if(!camposPermitidos.includes(ordenarPor))
        throw criarErro(400, `Campo de ordenação inválido. Use: ${camposPermitidos.join(", ")}.`);

    const direcao = consulta.direcao ? String(consulta.direcao).toUpperCase() : "ASC";

    if (direcao !== "ASC" && direcao !== "DESC")
        throw criarErro(400, "Direção de ordenação inválida. Use ASC ou DESC.");

    return { ordenarPor, direcao };
}

module.exports = { limparTexto, escaparLike, validarId, lerOrdenacao };

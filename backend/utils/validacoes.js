// Funções de validação compartilhadas pelos módulos (Categorias, Subcategorias...).
// Ficam aqui pra não repetir o mesmo código em cada service.

const { criarErro } = require("./erros");

// Maior valor que cabe em uma coluna INTEGER do PostgreSQL.
const MAX_INTEGER = 2147483647;

// limparTexto: tira espaços do começo e do fim e troca espaços repetidos por um só.
// Se o valor não for texto (undefined, número, objeto...), devolve "".
//   "  Flores   de corte " -> "Flores de corte"
function limparTexto(valor) {
    if (typeof valor !== "string") {
        return "";
    }
    return valor.trim().replace(/\s+/g, " ");
}

// escaparLike: o LIKE/ILIKE do banco trata "%" e "_" como curingas.
// Se a pessoa digitar "50%" na busca, queremos procurar o texto "50%" mesmo,
// e não "50 seguido de qualquer coisa". Então colocamos uma barra antes desses caracteres.
function escaparLike(texto) {
    return texto.replace(/[\\%_]/g, "\\$&");
}

// validarId: confere se o id que veio na URL ou no corpo é um inteiro positivo.
// Devolve o id já como número; se estiver errado, lança erro 400 com a mensagem recebida.
function validarId(id, mensagem) {
    const texto = String(id);

    if (!/^\d+$/.test(texto)) {
        throw criarErro(400, mensagem);
    }

    const numero = Number(texto);

    if (numero <= 0 || numero > MAX_INTEGER) {
        throw criarErro(400, mensagem);
    }

    return numero;
}

// lerOrdenacao: lê "ordenarPor" e "direcao" da URL (?ordenarPor=nome&direcao=DESC).
// Só aceita campos da lista permitida, pra ninguém mandar um nome de coluna qualquer.
function lerOrdenacao(consulta, camposPermitidos, campoPadrao) {
    const ordenarPor = consulta.ordenarPor ? String(consulta.ordenarPor) : campoPadrao;

    if (!camposPermitidos.includes(ordenarPor)) {
        throw criarErro(400, `Campo de ordenação inválido. Use: ${camposPermitidos.join(", ")}.`);
    }

    const direcao = consulta.direcao ? String(consulta.direcao).toUpperCase() : "ASC";

    if (direcao !== "ASC" && direcao !== "DESC") {
        throw criarErro(400, "Direção de ordenação inválida. Use ASC ou DESC.");
    }

    return { ordenarPor, direcao };
}

module.exports = { limparTexto, escaparLike, validarId, lerOrdenacao };

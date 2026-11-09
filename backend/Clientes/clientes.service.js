const ordenarPor = consulta.ordenarPor ?? "nome";

if (!CAMPOS_ORDENAVEIS.includes(ordenarPor)) {
    throw criarErro(400, "Campo de ordenação inválido.");
}

const clientes = await clientesRepository.listar({
    busca,
    buscaNumeros: somenteNumeros(busca),
    ordenarPor,
    direcao: "ASC",
});
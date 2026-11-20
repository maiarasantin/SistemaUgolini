const crypto = require("crypto");
const path = require("path");

const sequelize = require("../database/connection");
const produtosRepository = require("./produtos.repository");

const { criarErro } = require("../utils/erros");
const { limparTexto, escaparLike, validarId, lerOrdenacao } = require("../utils/validacoes");

const { enviarArquivo, removerArquivo, extrairCaminho } = require("../utils/storage");

// Tipos de imagem aceitos
const tiposFoto = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp"
};

// Remove possíveis tags HTML de um texto
function removerTags(texto) {
    return texto.replace(/<[^>]*>/g, "").trim();
}

// Valida números inteiros
function validarNumeroInteiro(valor, nome, minimo = 0) {
    const numero = Number(valor);

    if (
        String(valor).trim() === "" ||
        valor === null ||
        valor === undefined ||
        !Number.isInteger(numero) ||
        numero < minimo
    ) {
        throw criarErro(
            400,
            `${nome} deve ser um número inteiro maior ou igual a ${minimo}.`
        );
    }

    return numero;
}

// Valida o preço do produto
function validarPreco(valor) {
    if (valor === "" || valor === null || valor === undefined) {
        throw criarErro(400, "O preço é obrigatório.");
    }

    const texto = String(valor).trim().replace(",", ".");

    if (!/^\d+(\.\d{1,2})?$/.test(texto)) {
        throw criarErro(
            400,
            "O preço deve ser um número com até duas casas decimais."
        );
    }

    const preco = Number(texto);

    if (
        !Number.isFinite(preco) ||
        preco < 0 ||
        preco > 99999999.99
    ) {
        throw criarErro(400, "Informe um preço válido.");
    }

    return preco.toFixed(2);
}

// Valida e organiza os dados recebidos do produto
function validarDados(dados, parcial = false) {
    if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
        throw criarErro(400, "Dados do produto inválidos.");
    }

    const novoProduto = {};

    // Nome
    if (!parcial || Object.hasOwn(dados, "nome")) {
        const nome = removerTags(limparTexto(dados.nome));

        if (!nome) {
            throw criarErro(400, "O nome do produto é obrigatório.");
        }

        if (nome.length > 100) {
            throw criarErro(400, "O nome deve ter no máximo 100 caracteres.");
        }

        novoProduto.nome = nome;
    }

    // Descrição
    if (Object.hasOwn(dados, "descricao")) {
        if (dados.descricao !== null && typeof dados.descricao !== "string") {
            throw criarErro(400, "A descrição deve ser um texto.");
        }

        const descricao = dados.descricao === null
            ? ""
            : removerTags(dados.descricao);

        if (descricao.length > 1000) {
            throw criarErro(400, "A descrição deve ter no máximo 1000 caracteres.");
        }

        novoProduto.descricao = descricao || null;
    }

    // Preço
    if (!parcial || Object.hasOwn(dados, "preco")) {
        novoProduto.preco = validarPreco(dados.preco);
    }

    // Subcategoria
    if (!parcial || Object.hasOwn(dados, "idSubcategoria")) {
        novoProduto.idSubcategoria = validarNumeroInteiro(
            dados.idSubcategoria,
            "A subcategoria",
            1
        );
    }

    // Unidade de medida
    if (Object.hasOwn(dados, "unidadeMedida")) {
        const unidade = limparTexto(dados.unidadeMedida);

        if (unidade.length > 50) {
            throw criarErro(
                400,
                "A unidade de medida deve ter no máximo 50 caracteres."
            );
        }

        novoProduto.unidadeMedida = unidade || "un";
    } else if (!parcial) {
        novoProduto.unidadeMedida = "un";
    }

    // Estoque mínimo
    if (Object.hasOwn(dados, "estoqueMinimo")) {
        novoProduto.estoqueMinimo = validarNumeroInteiro(
            dados.estoqueMinimo,
            "O estoque mínimo"
        );
    } else if (!parcial) {
        novoProduto.estoqueMinimo = 0;
    }

    // Não recebemos pelo body:
    // idProduto, quantidadeEstoque e foto.

    return novoProduto;
}

// Verifica se já existe um produto com o mesmo nome
async function verificarNome(nome, idAtual = null) {
    const produtoExistente = await produtosRepository.buscarPorNome(
        escaparLike(nome),
        idAtual
    );

    if (produtoExistente) {
        throw criarErro(409, "Já existe um produto com esse nome.");
    }
}

// Verifica se a subcategoria existe
async function verificarSubcategoria(idSubcategoria) {
    const subcategoria = await produtosRepository.buscarSubcategoriaPorId(
        idSubcategoria
    );

    if (!subcategoria) {
        throw criarErro(400, "A subcategoria informada não existe.");
    }
}

// Busca um produto e verifica se ele existe
async function verificarProduto(id) {
    const idProduto = validarId(
        id,
        "Identificador de produto inválido."
    );

    const produto = await produtosRepository.buscarPorId(idProduto);

    if (!produto) {
        throw criarErro(404, "Produto não encontrado.");
    }

    return produto;
}

// Verifica se a imagem enviada é válida
function validarFoto(arquivo) {
    if (!arquivo) {
        throw criarErro(400, "Nenhuma imagem foi enviada.");
    }

    const extensao = path.extname(arquivo.originalname || "").toLowerCase();
    const tipo = tiposFoto[extensao];

    if (!tipo || arquivo.mimetype !== tipo) {
        throw criarErro(400, "Envie uma imagem JPG, JPEG, PNG ou WebP.");
    }

    const buffer = arquivo.buffer;
    let imagemValida = false;

    // Verifica assinatura de imagem JPG
    if (extensao === ".jpg" || extensao === ".jpeg") {
        imagemValida =
            buffer.length >= 3 &&
            buffer[0] === 0xFF &&
            buffer[1] === 0xD8 &&
            buffer[2] === 0xFF;
    }

    // Verifica assinatura de imagem PNG
    if (extensao === ".png") {
        imagemValida =
            buffer.length >= 8 &&
            buffer.subarray(0, 8).equals(
                Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
            );
    }

    // Verifica assinatura de imagem WebP
    if (extensao === ".webp") {
        imagemValida =
            buffer.length >= 12 &&
            buffer.toString("ascii", 0, 4) === "RIFF" &&
            buffer.toString("ascii", 8, 12) === "WEBP";
    }

    if (!imagemValida) {
        throw criarErro(400, "O arquivo enviado não é uma imagem válida.");
    }

    return extensao;
}

// Salva a foto do produto no Supabase
async function salvarFoto(produto, arquivo) {
    const extensao = validarFoto(arquivo);

    const nomeArquivo = `produtos/${produto.idProduto}-${crypto.randomUUID()}${extensao}`;

    let novaFoto = null;

    try {
        // Envia a imagem para o Supabase
        novaFoto = await enviarArquivo(
            nomeArquivo,
            arquivo.buffer,
            arquivo.mimetype
        );

        // Atualiza o endereço da foto no banco
        await produtosRepository.atualizar(produto.idProduto, {
            foto: novaFoto
        });

    } catch (erro) {
        // Se ocorrer erro, tenta remover a imagem enviada
        if (novaFoto) {
            const caminhoNovo = extrairCaminho(novaFoto);

            if (caminhoNovo) {
                try {
                    await removerArquivo(caminhoNovo);
                } catch (erroRemocao) {
                    console.log("Erro ao remover nova imagem:", erroRemocao.message);
                }
            }
        }

        if (erro.status) {
            throw erro;
        }

        console.log("Erro ao salvar foto:", erro.message);
        throw criarErro(500, "Não foi possível salvar a imagem.");
    }

    // Depois de salvar a nova foto, remove a antiga
    if (produto.foto) {
        const caminhoAntigo = extrairCaminho(produto.foto);

        if (caminhoAntigo) {
            try {
                await removerArquivo(caminhoAntigo);
            } catch (erro) {
                console.log("Não foi possível remover a foto antiga:", erro.message);
            }
        }
    }

    produto.foto = novaFoto;
}

// Remove a foto de um produto
async function removerFoto(produto) {
    if (!produto.foto) {
        return;
    }

    const caminho = extrairCaminho(produto.foto);

    // Primeiro remove o endereço da foto do banco
    await produtosRepository.atualizar(produto.idProduto, {
        foto: null
    });

    // Depois tenta apagar o arquivo do Supabase
    if (caminho) {
        try {
            await removerArquivo(caminho);
        } catch (erro) {
            console.log("Não foi possível remover a foto:", erro.message);
        }
    }
}

// Lista os produtos com os filtros informados
async function listar(consulta = {}) {
    const busca = limparTexto(consulta.busca);

    let idCategoria;
    let idSubcategoria;

    if (consulta.idCategoria) {
        idCategoria = validarId(
            consulta.idCategoria,
            "Identificador de categoria inválido."
        );
    }

    if (consulta.idSubcategoria) {
        idSubcategoria = validarId(
            consulta.idSubcategoria,
            "Identificador de subcategoria inválido."
        );
    }

    // Filtro de estoque
    let estoque;

    if (consulta.estoque === "semEstoque") {
        estoque = "semEstoque";
    } else if (consulta.estoque === "comEstoque") {
        estoque = "comEstoque";
    } else if (consulta.estoque) {
        throw criarErro(400, "Filtro de estoque inválido.");
    }

    // Ordenação
    const { ordenarPor, direcao } = lerOrdenacao(
        consulta,
        ["nome", "preco"],
        "nome"
    );

    const produtos = await produtosRepository.listar({
    busca,
    idCategoria,
    idSubcategoria,
    estoque,
    ordenarPor,
    direcao
    });

    // Converte cada produto para objeto simples e o preço de texto para número
    return produtos.map((produto) => {
        const item = produto.toJSON();
        item.preco = Number(item.preco);
        return item;
    });
}

// Busca um produto pelo ID, incluindo categoria e composição
async function buscarPorId(id) {
    const produto = await verificarProduto(id);

    const completo = await produtosRepository.buscarProdutoCompleto(
        produto.idProduto
    );

    const resultado = completo.toJSON();

    // Converte o preço para número
    resultado.preco = Number(resultado.preco);

    // Verifica se o produto possui composição
    resultado.possuiComposicao = resultado.composicoes.length > 0;

    // Organiza os componentes
    resultado.componentes = resultado.composicoes.map((item) => ({
        idProduto: item.idProdutoComponente,
        nome: item.produtoComponente?.nome,
        quantidade: item.quantidade,
        unidadeMedida: item.produtoComponente?.unidadeMedida
    }));

    delete resultado.composicoes;

    return resultado;
}

// Cadastra um novo produto
async function criar(dados, arquivo = null) {
    const novoProduto = validarDados(dados);

    if (arquivo) validarFoto(arquivo);

    await verificarNome(novoProduto.nome);
    await verificarSubcategoria(novoProduto.idSubcategoria);

    try {
        const produto = await produtosRepository.criar({
            ...novoProduto,
            quantidadeEstoque: 0,
            foto: null
        });

        // Salva a foto, caso tenha sido enviada
        if (arquivo) {
            await salvarFoto(produto, arquivo);
        }

        return await buscarPorId(produto.idProduto);

    } catch (erro) {
        if (erro.name === "SequelizeUniqueConstraintError") {
            throw criarErro(409, "Já existe um produto com esse nome.");
        }

        throw erro;
    }
}

// Atualiza os dados de um produto
async function atualizar(id, dados, arquivo = null) {
    const produto = await verificarProduto(id);

    const novosDados = validarDados(dados, true);

    if (novosDados.nome) {
        await verificarNome(novosDados.nome, produto.idProduto);
    }

    if (novosDados.idSubcategoria) {
        await verificarSubcategoria(novosDados.idSubcategoria);
    }

    if (arquivo) validarFoto(arquivo);

    try {
        // Atualiza os dados enviados
        if (Object.keys(novosDados).length > 0) {
            await produtosRepository.atualizar(
                produto.idProduto,
                novosDados
            );
        }

        // Se recebeu uma nova foto, substitui a antiga
        if (arquivo) {
            await salvarFoto(produto, arquivo);
        } else if (
            dados.removerFoto === "true" ||
            dados.removerFoto === true
        ) {
            await removerFoto(produto);
        }

        return await buscarPorId(produto.idProduto);

    } catch (erro) {
        if (erro.name === "SequelizeUniqueConstraintError") {
            throw criarErro(409, "Já existe um produto com esse nome.");
        }

        throw erro;
    }
}

// Busca a composição de um produto
async function buscarComponentes(id) {
    const produto = await verificarProduto(id);

    const componentes = await produtosRepository.buscarComponentes(
        produto.idProduto
    );

    return componentes.map((item) => ({
        idProduto: item.idProdutoComponente,
        nome: item.produtoComponente?.nome,
        quantidade: item.quantidade,
        unidadeMedida: item.produtoComponente?.unidadeMedida
    }));
}

// Verifica se uma composição criaria um ciclo entre produtos
async function existeCaminhoAte(origem, destino, visitados = []) {
    if (origem === destino) {
        return true;
    }

    if (visitados.includes(origem)) {
        return false;
    }

    visitados.push(origem);

    const componentes = await produtosRepository.buscarComponentes(origem);

    for (const item of componentes) {
        const encontrou = await existeCaminhoAte(
            item.idProdutoComponente,
            destino,
            visitados
        );

        if (encontrou) {
            return true;
        }
    }

    return false;
}

// Cadastra ou substitui a composição de um produto
async function atualizarComposicao(id, dados) {
    const produto = await verificarProduto(id);

    if (!dados || !Array.isArray(dados.componentes)) {
        throw criarErro(400, "Envie uma lista de componentes.");
    }

    if (dados.componentes.length > 50) {
        throw criarErro(400, "Um produto pode ter no máximo 50 componentes.");
    }

    const novosComponentes = [];
    const idsInformados = [];

    // Valida cada componente enviado
    for (const item of dados.componentes) {
        if (!item || typeof item !== "object") 
            throw criarErro(400, "Componente inválido.");

        const idComponente = validarId(
            item.idProduto,
            "Identificador de componente inválido."
        );

        const quantidade = validarNumeroInteiro(
            item.quantidade,
            "A quantidade",
            1
        );

        if (idComponente === produto.idProduto) {
            throw criarErro(400, "Um produto não pode ser componente de si mesmo.");
        }

        if (idsInformados.includes(idComponente)) {
            throw criarErro(400, "O mesmo componente não pode ser informado duas vezes.");
        }

        idsInformados.push(idComponente);

        novosComponentes.push({
            idProdutoComposto: produto.idProduto,
            idProdutoComponente: idComponente,
            quantidade
        });
    }

    // Verifica se todos os produtos componentes existem
    if (idsInformados.length > 0) {
        const produtosExistentes = await produtosRepository.buscarProdutosExistentes(
            idsInformados
        );

        if (produtosExistentes.length !== idsInformados.length) {
            throw criarErro(400, "Um ou mais produtos componentes não existem.");
        }

        // Verifica se a composição não cria ciclos
        for (const idComponente of idsInformados) {
            const criaCiclo = await existeCaminhoAte(
                idComponente,
                produto.idProduto
            );

            if (criaCiclo) {
                throw criarErro(400, "Essa composição criaria um ciclo entre produtos.");
            }
        }
    }

    // Inicia uma transação para substituir a composição
    const transaction = await sequelize.transaction();

    try {
        // Remove a composição antiga
        await produtosRepository.excluirComposicao(
            produto.idProduto,
            transaction
        );

        // Insere a nova composição
        if (novosComponentes.length > 0) {
            await produtosRepository.inserirComposicao(
                novosComponentes,
                transaction
            );
        }

        await transaction.commit();

    } catch (erro) {
        await transaction.rollback();
        throw erro;
    }

    return await buscarPorId(produto.idProduto);
}

// Expande a composição até encontrar os produtos finais
async function expandirComposicao(idProduto, quantidade = 1) {
    const id = validarId(
        idProduto,
        "Identificador de produto inválido."
    );

    const qtd = validarNumeroInteiro(
        quantidade,
        "A quantidade",
        1
    );

    await verificarProduto(id);

    const produtosFinais = [];

    // Percorre a composição de forma recursiva
    async function percorrer(idAtual, quantidadeAtual, caminho = []) {
        if (caminho.includes(idAtual)) {
            throw criarErro(409, "Foi encontrada uma composição cíclica.");
        }

        const componentes = await produtosRepository.buscarComponentes(idAtual);

        // Se não possui componentes, é um produto final
        if (componentes.length === 0) {
            const produtoExistente = produtosFinais.find(
                (item) => item.idProduto === idAtual
            );

            if (produtoExistente) {
                produtoExistente.quantidade += quantidadeAtual;
            } else {
                produtosFinais.push({
                    idProduto: idAtual,
                    quantidade: quantidadeAtual
                });
            }

            return;
        }

        const novoCaminho = [...caminho, idAtual];

        for (const item of componentes) {
            await percorrer(
                item.idProdutoComponente,
                quantidadeAtual * item.quantidade,
                novoCaminho
            );
        }
    }

    await percorrer(id, qtd);

    return produtosFinais;
}

// Exclui um produto
async function deletar(id) {
    const produto = await verificarProduto(id);

    // Verifica se outro produto utiliza este como componente
    const produtosQueUtilizam = await produtosRepository.buscarProdutosQueUtilizam(
        produto.idProduto
    );

    if (produtosQueUtilizam.length > 0) {
        throw criarErro(
            409,
            "Não é possível excluir este produto porque ele é componente de outro produto."
        );
    }

    // Verifica se existem vínculos com pedidos ou entradas de estoque
    const vinculos = await produtosRepository.contarVinculosProduto(
        produto.idProduto
    );

    if (vinculos.itensPedido || vinculos.itensEntrada) {
        throw criarErro(
            409,
            "Não é possível excluir este produto porque ele está vinculado a pedidos ou entradas de estoque."
        );
    }

    const transaction = await sequelize.transaction();

    try {
        // Remove a composição do produto
        await produtosRepository.excluirComposicao(
            produto.idProduto,
            transaction
        );

        // Exclui o produto
        await produtosRepository.excluirProduto(
            produto.idProduto,
            transaction
        );

        await transaction.commit();

    } catch (erro) {
        await transaction.rollback();

        if (erro.name === "SequelizeForeignKeyConstraintError") {
            throw criarErro(
                409,
                "Não é possível excluir este produto porque ele possui vínculos com outros registros."
            );
        }

        throw erro;
    }

    // Remove a foto do produto, se existir
    if (produto.foto) {
        const caminho = extrairCaminho(produto.foto);

        if (caminho) {
            try {
                await removerArquivo(caminho);
            } catch (erro) {
                console.log("Não foi possível remover a foto:", erro.message);
            }
        }
    }

    return produto;
}

// Funções utilizadas pelo controller e por outros módulos
module.exports = {
    listar,
    buscarPorId,
    criar,
    atualizar,
    buscarComponentes,
    atualizarComposicao,
    expandirComposicao,
    deletar
};

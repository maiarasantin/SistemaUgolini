const pedidosRepository = require("./pedidos.repository");
const crypto = require("crypto");
const { criarErro } = require("../utils/erros");
const storage = require("../utils/storage");
const { STATUS_PEDIDO, TIPO_PEDIDO } = require("./pedidos.constants");
const FORMATO_DATA = /^\d{4}-\d{2}-\d{2}$/;


function erro400(mensagem){
    const erro = new Error(mensagem);
    erro.status = 400;
    return erro;
}


function validarId(id){
    const numero = Number(id);
    if(!Number.isInteger(numero) || numero <= 0){
        throw criarErro(400, "Número de pedido inválido.");
    }
    return numero;
}

async function listar(query = {}){
    const { status, dataInicio, dataFim, tipoData, busca } = query;

    if(dataInicio && !FORMATO_DATA.test(dataInicio))
        throw erro400("dataInicio inválida. Use o formato AAAA-MM-DD.");

    if(dataFim && !FORMATO_DATA.test(dataFim))
        throw erro400("dataFim inválida. Use o formato AAAA-MM-DD.");

    if(dataInicio && dataFim && dataInicio > dataFim) 
        throw erro400("dataInicio não pode ser maior que dataFim.");
    
    if(tipoData && !["retirada", "criacao"].includes(tipoData))
        throw erro400("tipoData deve ser 'retirada' ou 'criacao'.");
    

    return pedidosRepository.listar({
        status: status?.trim(),
        dataInicio,
        dataFim,
        tipoData,
        busca: busca?.trim(),
    });
}

async function buscarPorId(id){
    return pedidosRepository.buscarPorId(id);
}

async function criar(dados){
    return pedidosRepository.criar(dados);
}


async function atualizarStatus(id, status){
    if(!status) throw criarErro(400, "Informe o status do pedido.");

    const statusNormalizado = String(status).trim().toLowerCase();
    if(!STATUS_PEDIDO.includes(statusNormalizado)){
        throw criarErro(400, `Status inválido. Use um destes: ${STATUS_PEDIDO.join(", ")}.`);
    }

    const pedido = await carregarVenda(id, pedidosRepository.buscarPorId);
    await pedidosRepository.atualizarStatus(pedido, statusNormalizado);
    return pedido;
}

async function deletar(id){
    return pedidosRepository.deletar(id);
}

// carregarVenda: busca o pedido e confere que ele existe e é uma venda
async function carregarVenda(id, buscar){
    const numPedido = validarId(id);
    const pedido = await buscar(numPedido);

    if(!pedido){
        throw criarErro(404, "Pedido não encontrado.");
    }
    if(String(pedido.tipoPedido).toLowerCase() !== TIPO_PEDIDO.VENDA){
        throw criarErro(400, "Esta ação só vale para pedidos de venda, não para ajustes de estoque.");
    }
    return pedido;
}

function detectarTipoImagem(buffer){
    if (!buffer || buffer.length < 12) return null;

    const ehJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    if (ehJpeg) return { mime: "image/jpeg", ext: "jpg" };

    const assinaturaPng = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    if (buffer.subarray(0, 8).equals(assinaturaPng)) return { mime: "image/png", ext: "png" };

    const ehWebp =
        buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
        buffer.subarray(8, 12).toString("ascii") === "WEBP";
    if (ehWebp) return { mime: "image/webp", ext: "webp" };

    return null;
}

async function anexarImagem(id, arquivo){
    if(!arquivo){
        throw criarErro(400, "Envie uma imagem no campo 'imagem'.");
    }

    const tipo = detectarTipoImagem(arquivo.buffer);
    if (!tipo) {
        throw criarErro(400, "Formato inválido. Envie uma imagem JPG, PNG ou WEBP.");
    }

    const pedido = await carregarVenda(id, pedidosRepository.buscarPorId);

    const caminho = `pedidos/${pedido.numPedido}-${crypto.randomUUID()}.${tipo.ext}`;
    const novaUrl = await storage.enviarArquivo(caminho, arquivo.buffer, tipo.mime);
    const fotoAnterior = pedido.foto;

    try {
        await pedidosRepository.atualizarFoto(pedido, novaUrl);
    } catch(erro){
        await storage.removerArquivo(caminho).catch(() => {});
        throw erro;
    }

    // Apaga a imagem antiga
    if(fotoAnterior){
        const caminhoAntigo = storage.extrairCaminho(fotoAnterior);
        if(caminhoAntigo){
            await storage.removerArquivo(caminhoAntigo).catch(() => {});
        }
    }

    return { numPedido: pedido.numPedido, foto: novaUrl };
}

function normalizarTelefone(telefone){
    let numeros = String(telefone || "").replace(/\D/g, "").replace(/^0+/, "");

    if(numeros.length === 10 || numeros.length === 11){
        numeros = `55${numeros}`;
    }

    return /^55\d{10,11}$/.test(numeros) ? numeros : null;
}

async function enviarImagemWhatsapp(id){
    const pedido = await carregarVenda(id, pedidosRepository.buscarComCliente);

    if(!pedido.foto){
        throw criarErro(400, "Anexe uma imagem ao pedido antes de enviar.");
    }

    const telefone = normalizarTelefone(pedido.cliente?.telefone);
    if(!telefone){
        throw criarErro(400, "O cliente não tem um telefone válido cadastrado.");
    }

    const nome = pedido.cliente.nome;
    const mensagem =
        `Olá, ${nome}! Segue a foto do seu pedido nº ${pedido.numPedido} ` +
        `da Floricultura Ugolini: ${pedido.foto}`;

    return {
        numPedido: pedido.numPedido,
        cliente: nome,
        telefone,
        link: `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`,
    };
}

module.exports = {
    listar,
    buscarPorId,
    criar,
    atualizarStatus,
    deletar,
    anexarImagem,
    enviarImagemWhatsapp,
};
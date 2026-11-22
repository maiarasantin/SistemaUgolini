const { Op } = require("sequelize");
const { Pedido, Cliente} = require("../database/models");

async function listar(filtros = {}){
    const { status, dataInicio, dataFim, tipoData, busca } = filtros;
    const where = {};

    // Status: comparação sem diferenciar maiúscula/minúscula
    if(status){
        where.status = { [Op.iLike]: status };
    }

    // Data: por padrão filtra pela data de retirada/entrega
    // Com tipoData=criacao filtra pela data em que o pedido foi criado
    if(dataInicio || dataFim){
        const porCriacao = tipoData === "criacao";
        const campo = porCriacao ? "dataHoraCriacao" : "dataRetirada";
        const intervalo = {};

        if(dataInicio){
            intervalo[Op.gte] = porCriacao ? new Date(`${dataInicio}T00:00:00`) : dataInicio;
        }
        if(dataFim){
            intervalo[Op.lte] = porCriacao ? new Date(`${dataFim}T23:59:59.999`) : dataFim;
        }
        where[campo] = intervalo;
    }

    // Busca: número do pedido ou nome do cliente
    if(busca){
        const termo = busca.replace(/[%_\\]/g, "\\$&"); // escapa curingas do LIKE
        const condicoes = [{ "$cliente.nome$": { [Op.iLike]: `%${termo}%` } }];

        if(/^\d+$/.test(busca)){
            condicoes.push({ numPedido: Number(busca) });
        }
        where[Op.or] = condicoes;
    }

    return Pedido.findAll({
        where,
        include: [
            {
                model: Cliente,
                as: "cliente",
                attributes: ["idCliente", "nome", "telefone"],
                required: false,
            },
        ],
        order: [["numPedido", "DESC"]],
    });
}

async function buscarPorId(id){
    return Pedido.findByPk(id);
}

async function criar(dados){
    return Pedido.create(dados);
}

// buscarComCliente: o pedido junto com o nome e o telefone do cliente
// Usada para montar o link do WhatsApp
async function buscarComCliente(id){
    return Pedido.findByPk(id, {
        include: [{ model: Cliente, as: "cliente", attributes: ["idCliente", "nome", "telefone"] }],
    });
}

async function atualizarStatus(pedido, status){
    return pedido.update({ status });
}

async function atualizarFoto(pedido, foto){
    return pedido.update({ foto });
}

async function deletar(id){
    const pedido = await Pedido.findByPk(id);
    if (!pedido) return null;
    await pedido.destroy();
    return pedido;
}

module.exports = {
    listar,
    buscarPorId,
    criar,
    atualizarStatus,
    deletar,
    atualizarFoto,
};
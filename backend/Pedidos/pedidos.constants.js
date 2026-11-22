// Valores fixos do pedido, num lugar só, para não repetir texto solto pelo código
const STATUS_PEDIDO = ["aguardando", "em produção", "entrega"];

const TIPO_PEDIDO = {
    VENDA: "venda",
    AJUSTE: "ajuste",
};

module.exports = { STATUS_PEDIDO, TIPO_PEDIDO };
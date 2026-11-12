// Valores fixos do pedido, num lugar só, para não repetir texto solto pelo código.
// Se no seu banco os valores estão escritos de outro jeito, ajuste aqui.
const STATUS_PEDIDO = ["aguardando", "em produção", "entrega"];

const TIPO_PEDIDO = {
    VENDA: "venda",
    AJUSTE: "ajuste",
};

module.exports = { STATUS_PEDIDO, TIPO_PEDIDO };
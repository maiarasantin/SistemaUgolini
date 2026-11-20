// Lista única de itens do menu, usada pelo menu lateral e pela barra superior

import AssignmentOutlined from "@mui/icons-material/AssignmentOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import AccessTimeOutlined from "@mui/icons-material/AccessTimeOutlined";
import CreditCardOutlined from "@mui/icons-material/CreditCardOutlined";
import PeopleAltOutlined from "@mui/icons-material/PeopleAltOutlined";
import Inventory2Outlined from "@mui/icons-material/Inventory2Outlined";
import GridViewOutlined from "@mui/icons-material/GridViewOutlined";
import FileDownloadOutlined from "@mui/icons-material/FileDownloadOutlined";
import BadgeOutlined from "@mui/icons-material/BadgeOutlined";
import ReceiptLongOutlined from "@mui/icons-material/ReceiptLongOutlined";
import PointOfSaleOutlined from "@mui/icons-material/PointOfSaleOutlined";
import AssessmentOutlined from "@mui/icons-material/AssessmentOutlined";

// Itens do menu. "id" é o nome da página
export const ITENS = [
    { id: "catalogo", texto: "Catálogo",  icone: <AssignmentOutlined /> , perfis: ["vendedor"]},
    { id: "novoPedido", texto: "Novo pedido",  icone: <EditOutlined />, perfis: ["vendedor"] },
    { id: "statusDosPedidos", texto: "Status dos pedidos", icone: <AccessTimeOutlined /> , perfis: ["vendedor"]},
    { id: "caixa", texto: "Caixa" , icone: <CreditCardOutlined />, perfis: ["vendedor"]},
    { id: "clientes", texto: "Clientes", icone: <PeopleAltOutlined /> , perfis: ["vendedor"] },
    { id: "produtos", texto: "Produtos", icone: <Inventory2Outlined />, perfis: ["vendedor"] },
    { id: "categorias", texto: "Categorias", icone: <GridViewOutlined /> , perfis: ["vendedor"]},
    
    { id: "entradaDeEstoque", texto: "Entrada de estoque", icone: <FileDownloadOutlined />, perfis: ["vendedor", "admin"] },

    { id: "vendedores", texto: "Vendedores", icone: <BadgeOutlined />, perfis: ["admin"] },
    { id: "relatorioPedidos", texto: "Relatório de pedidos", icone: <ReceiptLongOutlined />, perfis: ["admin"] },
    { id: "relatorioCaixa", texto: "Relatório de caixa", icone: <PointOfSaleOutlined />, perfis: ["admin"] },
    { id: "relatorioEstoque", texto: "Relatório de estoque", icone: <AssessmentOutlined />, perfis: ["admin"] }, 
];


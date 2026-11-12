//tive que mover para cá pq tanto o menu quanto o barra superior usam esses itens
//icones:

import AssignmentOutlined from "@mui/icons-material/AssignmentOutlined";
import EditIcon from '@mui/icons-material/Edit';
import AccessTimeOutlined from "@mui/icons-material/AccessTimeOutlined";
import CreditCardOutlined from "@mui/icons-material/CreditCardOutlined";
import PeopleAltOutlined from "@mui/icons-material/PeopleAltOutlined";
import Inventory2Outlined from "@mui/icons-material/Inventory2Outlined";
import GridViewOutlined from "@mui/icons-material/GridViewOutlined";
import FileDownloadOutlined from "@mui/icons-material/FileDownloadOutlined";

// Itens do menu. "id" é o nome da página (o mesmo usado no App),
export const ITENS = [
    { id: "catalogo", texto: "Catálogo",  icone: <AssignmentOutlined /> },
    { id: "novoPedido", texto: "Novo pedido",  icone: <EditIcon /> },
    { id: "statusDosPedidos", texto: "Status dos pedidos", icone: <AccessTimeOutlined /> },
    { id: "caixa", texto: "Caixa" , icone: <CreditCardOutlined />},
    { id: "clientes", texto: "Clientes", icone: <PeopleAltOutlined />  },
    { id: "produtos", texto: "Produtos", icone: <Inventory2Outlined /> },
    { id: "categorias", texto: "Categorias", icone: <GridViewOutlined /> },
    { id: "entradaDeEstoque", texto: "Entrada de Estoque", icone: <FileDownloadOutlined /> },
];


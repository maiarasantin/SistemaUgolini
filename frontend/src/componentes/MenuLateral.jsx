import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

//icones:
import ListItemIcon from "@mui/material/ListItemIcon";
import AssignmentOutlined from "@mui/icons-material/AssignmentOutlined";
import EditIcon from '@mui/icons-material/Edit';
import AccessTimeOutlined from "@mui/icons-material/AccessTimeOutlined";
import CreditCardOutlined from "@mui/icons-material/CreditCardOutlined";
import PeopleAltOutlined from "@mui/icons-material/PeopleAltOutlined";
import Inventory2Outlined from "@mui/icons-material/Inventory2Outlined";
import GridViewOutlined from "@mui/icons-material/GridViewOutlined";
import FileDownloadOutlined from "@mui/icons-material/FileDownloadOutlined";

// Itens do menu. "id" é o nome da página (o mesmo usado no App),
const ITENS = [
    { id: "catalogo", texto: "Catálogo",  icone: <AssignmentOutlined /> },
    { id: "novoPedido", texto: "Novo pedido",  icone: <EditIcon /> },
    { id: "statusDosPedidos", texto: "Status dos pedidos", icone: <AccessTimeOutlined /> },
    { id: "caixa", texto: "Caixa" , icone: <CreditCardOutlined />},
    { id: "clientes", texto: "Clientes", icone: <PeopleAltOutlined />  },
    { id: "produtos", texto: "Produtos", icone: <Inventory2Outlined /> },
    { id: "categorias", texto: "Categorias", icone: <GridViewOutlined /> },
    { id: "entradaDeEstoque", texto: "Entrada de Estoque", icone: <FileDownloadOutlined /> },
];



// ---------- COMPONENTE ----------
// Recebe duas props do App:
//   paginaAtual = qual página está aberta (pra destacar o item certo)
//   aoSelecionar  = função que o menu chama quando alguém clica num item
export default function MenuLateral({ paginaAtual, aoSelecionar }) {
    return (
        <Box
            component="nav"
            sx={{
                width: 240,
                minHeight: "100vh",
                backgroundColor: "#2f5a45",
                color: "#fff",
                p: 2,
            }}
        >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 ,  textAlign: "center"}}>
                Floricultura Ugolini
            </Typography>



             {/*A lista que agrupa os itens */}
            <List>
                 {/*  O map percorre ITENS e desenha um botão para cada item */}
                {ITENS.map((item) => ( 
                    <ListItemButton //uma linha no menu, clicável
                        key={item.id}
                        selected={paginaAtual === item.id}
                        onClick={() => aoSelecionar(item.id)}
                        sx={{
                            borderRadius: 2,
                            mb: 0.5,


                            "&:hover": { backgroundColor: "#3d6e56" },   // quando o mouse está em cima: verde um pouco mais claro
                            "&.Mui-selected": { backgroundColor: "#dbe8dd", color: "#2f5a45" },  // quando está selecionado (página aberta): fundo claro e texto verde
                            "&.Mui-selected:hover": { backgroundColor: "#dbe8dd" },   // selecionado + mouse em cima: mantém a cor 
                        }}
                    >
                        <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                        {item.icone}
                        </ListItemIcon>
                        <ListItemText primary={item.texto} />  {/* texto que aparece dentro da linha*/}
                    </ListItemButton>
                ))}
            </List>
        </Box>
    );
}
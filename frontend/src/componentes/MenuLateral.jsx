import { ITENS } from "./itensMenu";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import ListItemIcon from "@mui/material/ListItemIcon";












// ---------- COMPONENTE ----------
// Recebe duas props do App:
//   paginaAtual = qual página está aberta (pra destacar o item certo)
//   aoSelecionar  = função que o menu chama quando alguém clica num item
export default function MenuLateral({ paginaAtual, aoSelecionar, perfil }) {

    const itensVisiveis = ITENS.filter((item) => item.perfis.includes(perfil)); // Só os itens que o perfil pode ver
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
                {itensVisiveis.map((item) => ( 
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
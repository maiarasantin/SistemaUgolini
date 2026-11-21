import { ITENS } from "./itensMenu";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import ListItemIcon from "@mui/material/ListItemIcon";
import Drawer from "@mui/material/Drawer"; // Drawer é a gaveta que desliza por cima da tela usada pra responsividade




// ---------- COMPONENTE ----------
// Recebe cinco props do App:
//   paginaAtual = qual página está aberta (pra destacar o item certo)
//   aoSelecionar  = função que o menu chama quando alguém clica num item
// aberto e aoFechar vêm do App e controlam a gaveta de responsividade
//  perfil = perfil de quem está logado "admin" ou "vendedor", usado para mostrar só o que é permitido
export default function MenuLateral({ paginaAtual, aoSelecionar, perfil , aberto, aoFechar }) {

    const itensVisiveis = ITENS.filter((item) => item.perfis.includes(perfil)); // Só os itens que o perfil pode ver

    // O conteúdo do menu virou uma variável para ser usado dentro da gaveta de responsividade em caso de celular e no menu fixo para tela grande
    const conteudo = (
        <Box
            component="nav"
            sx={{
                width: 240,
                height: "100vh",
                overflowY: "auto",
                boxSizing: "border-box",
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
                        onClick={() => { aoSelecionar(item.id); aoFechar(); }} //Troca de pagina e fehca a gaveta de responsividade em celulares
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


     return (
        <>
            {/* No celular o menu abre por cima da tela, escondido até clicar nos 3 tracinhos */}
            <Drawer
                open={aberto}
                onClose={aoFechar}
                sx={{ display: { xs: "block", md: "none" } }}
            >
                {conteudo}
            </Drawer>

            {/* Em telas grandes o menu fixo de sempre */}
            <Box sx={{ display: { xs: "none", md: "block" }, 
                       position: "sticky", top: 0, height: "100vh", alignSelf: "flex-start" }}>
                {conteudo}
            </Box>
        </>
    );
}
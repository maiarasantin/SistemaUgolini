import { ITENS } from "./itensMenu";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import LogoutOutlined from "@mui/icons-material/LogoutOutlined";


export default function BarraSuperior ({aoSair, tituloPagina, usuario }) {


    let textoPerfil = "Vendedor";

    if(usuario.perfil === "admin"){
        textoPerfil = "Administrador";
    }

    return(
 <Box
       component="header"
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 3,                                   // padding dos lados: 24px
                py: 1.5,                                 // padding de cima e de baixo: 12px
                backgroundColor: "#cdf0d3",
                borderBottom: "1px solid #e3e0d8",       // linha fininha embaixo
            }}
        >
            {/* ESQUERDA: caminho da página (por enquanto fixo) */}
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Floricultura Ugolini &gt; <strong>{tituloPagina}</strong>
            </Typography>

            {/* DIREITA: usuário + botão Sair */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                
                <Avatar
                    sx={{ bgcolor: "#dbe8dd", color: "#2f5a45", width: 36, height: 36, fontSize: 14 }}  src="/broken-image.jpg">
                  </Avatar>

                {/* Nome em cima e perfil embaixo */}
                <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                        {usuario.nome}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        {textoPerfil}
                    </Typography>
                </Box>

                {/* startIcon = ícone antes do texto do botão */}
                <Button onClick={aoSair} startIcon={<LogoutOutlined />} sx={{ color: "#2f5a45" }}>
                    Sair
                </Button>
            </Box>
        </Box>
    );

    
}
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import LogoutOutlined from "@mui/icons-material/LogoutOutlined";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

export default function BarraSuperior({
  aoSair,
  tituloPagina,
  usuario,
  aoAbrirMenu,
}) {
  let textoPerfil = "Vendedor";

  if (usuario.perfil === "admin") {
    textoPerfil = "Administrador";
  }

  return (
    <Box
      component="header"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: 3,
        py: 1.5,
        backgroundColor: "#e8efeb",
        borderBottom: "1px solid #e3e0d8", // linha fininha embaixo
      }}
    >
      {/* ESQUERDA: botão do menu (só em celular) e o caminho da página */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {/* Botão do menu: aparece abaixo de 900 px e some em telas maiores */}
        <IconButton
          aria-label="Abrir menu"
          onClick={aoAbrirMenu}
          sx={{ display: { xs: "inline-flex", md: "none" }, color: "#2f5a45" }}
        >
          <MenuIcon />
        </IconButton>

        {/* Caminho da página: aparece em todos os tamanhos de tela */}
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Floricultura Ugolini &gt; <strong>{tituloPagina}</strong>
        </Typography>
      </Box>

      {/* DIREITA: usuário + botão Sair */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar
          sx={{
            bgcolor: "#dbe8dd",
            color: "#2f5a45",
            width: 36,
            height: 36,
            fontSize: 14,
          }}
        >
          {usuario.nome.charAt(0)}
        </Avatar>

        {/* Nome e perfil: somem abaixo de 600 px (celular) e aparecem de 600 px para cima */}
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            {usuario.nome}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {textoPerfil}
          </Typography>
        </Box>

        {/* Botão Sair: aparece em todos os tamanhos de tela*/}
        <Button
          onClick={aoSair}
          startIcon={<LogoutOutlined />}
          sx={{ color: "#2f5a45" }}
        >
          Sair
        </Button>
      </Box>
    </Box>
  );
}

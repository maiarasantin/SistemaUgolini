
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const VERDE = "#2f5a45";

export default function CartaoContagem({ titulo, valor, cor, link }) {
    return (
        <Box
            component={link ? "a" : "div"}
            href={link || undefined}
            sx={{
                border: "1px solid #e3e0d8",
                borderRadius: 2,
                bgcolor: "#fffdf8",
                p: 2,
                display: "flex",
                flexDirection: "column",
                gap: 0.5,
                textDecoration: "none",
                color: "inherit",
                cursor: link ? "pointer" : "default",
                "&:hover": link ? {
                    borderColor: VERDE,
                } : {},
            }}
        >
            <Typography
                variant="body2"
                sx={{ color: "#52685b", fontSize: 13 }}
            >
                {titulo}
            </Typography>

            <Typography
                variant="h4"
                sx={{
                    color: cor || VERDE,
                    fontWeight: 700,
                    fontSize: 28,
                }}
            >
                {valor ?? "—"}
            </Typography>
        </Box>
    );
}

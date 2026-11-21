import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";

const VERDE = "#2f5a45";
const VERDE_CLARO = "#dbe8dd";

export default function CartaoCategoria({
    categoria,
    subcategorias,
    totalSubcategorias,
    aoEditarCategoria,
    aoExcluirCategoria,
    aoEditarSubcategoria,
    aoExcluirSubcategoria,
}) {

    const [aberta, setAberta] = useState(true);

    let textoTotal = `${totalSubcategorias} subcategorias`;
    if (totalSubcategorias === 1) {
        textoTotal = "1 subcategoria";
    }

    return (
        <Box
            sx={{
                border: "1px solid #e3e0d8",
                borderRadius: 2,
                overflow: "hidden",
                mb: 2,
                bgcolor: "#fffdf8",
            }}
        >
            {/* faixa verde da categoria*/}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 1,
                    px: 2,
                    py: 1,
                    bgcolor: VERDE_CLARO,
                }}
            >
                {/* lado esquerdo: seta + nome + quantidade */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IconButton
                        size="small"
                        onClick={() => setAberta(!aberta)}
                        aria-label={aberta ? "Recolher subcategorias" : "Expandir subcategorias"}
                    >
                        <ExpandMoreIcon
                            sx={{
                                color: VERDE,
                                transform: aberta ? "rotate(0deg)" : "rotate(-90deg)",
                                transition: "transform 0.2s",
                            }}
                        />
                    </IconButton>

                    <Typography sx={{ fontWeight: 700, color: VERDE }}>
                        {categoria.nome}
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                        {textoTotal}
                    </Typography>
                </Box>

                {/* lado direito: botões da categoria */}
                <Box>
                    <Button
                        size="small"
                        startIcon={<EditOutlinedIcon />}
                        sx={{ color: VERDE }}
                        onClick={() => aoEditarCategoria(categoria)}
                    >
                        Editar
                    </Button>
                    <Button
                        size="small"
                        color="error"
                        startIcon={<DeleteOutlineIcon />}
                        onClick={() => aoExcluirCategoria(categoria)}
                    >
                        Excluir
                    </Button>
                </Box>
            </Box>

            {/* SUBCATEGORIAS (a parte que abre e fecha) */}
            <Collapse in={aberta}>
                {subcategorias.length === 0 && (
                    <Typography color="text.secondary" sx={{ px: 3, py: 2 }}>
                        Nenhuma subcategoria para mostrar.
                    </Typography>
                )}

                {subcategorias.map((subcategoria) => (
                    <Box
                        key={subcategoria.idSubcategoria}
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: 1,
                            px: 3,
                            py: 1,
                            borderTop: "1px solid #e3e0d8",
                        }}
                    >
                        <Typography>— {subcategoria.nome}</Typography>

                        <Box>
                            <Button
                                size="small"
                                startIcon={<EditOutlinedIcon />}
                                sx={{ color: VERDE }}
                                onClick={() => aoEditarSubcategoria(subcategoria)}
                            >
                                Editar
                            </Button>
                            <Button
                                size="small"
                                color="error"
                                startIcon={<DeleteOutlineIcon />}
                                onClick={() => aoExcluirSubcategoria(subcategoria)}
                            >
                                Excluir
                            </Button>
                        </Box>
                    </Box>
                ))}
            </Collapse>
        </Box>
    );
}

import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LocalFloristOutlinedIcon from "@mui/icons-material/LocalFloristOutlined";

const VERDE = "#2f5a45";
const MARROM = "#7a6a4a";

// Cores da imagem do quadrado que aparece quando o produto não tem foto
const CORES_SEM_FOTO = ["#e48a5f", "#dbe8dd", "#385b49", "#7a6a4a"];

// Icone da flor
const CORES_ICONE = ["#2f5a45", "#2f5a45", "#2f5a45", "#2f5a45"];

export default function CartaoProduto({ produto }){
    const [fotoQuebrada, setFotoQuebrada] = useState(false);

    let nomeCategoria = "—";
    let nomeSubcategoria = "—";
    if(produto.subcategoria){
        nomeSubcategoria = produto.subcategoria.nome;

        if(produto.subcategoria.categoria){
            nomeCategoria = produto.subcategoria.categoria.nome;
        }
    }

    const posicaoCor = produto.idProduto % CORES_SEM_FOTO.length;
    const temFoto = Boolean(produto.foto) && !fotoQuebrada;

    // 12.5 -> "R$ 12,50"
    const precoFormatado = Number(produto.preco).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

    // O backend só manda quantidadeEstoque se o campo estiver na lista "attributes" do repository
    const semEstoque = produto.quantidadeEstoque === 0;

    return (
        <Box
            sx={{
                border: "1px solid #e3e0d8",
                borderRadius: 2,
                overflow: "hidden",
                bgcolor: "#fffdf8",
                display: "flex",
                flexDirection: "column",
                width: "100%",
                maxWidth: 360,
            }}
        >
            {/* Parte da imagem, a altura acompanha a largura (proporção 4 por 3),
                para a imgem não ficar esticada e nem achatada */}
            <Box sx={{ position: "relative", width: "100%", aspectRatio: "4 / 3", overflow: "hidden" }}>
                {temFoto ? (
                    <Box
                        component="img"
                        src={produto.foto}
                        alt={produto.nome}
                        onError={() => setFotoQuebrada(true)}
                        sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
                    />
                ) : (
                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            bgcolor: CORES_SEM_FOTO[posicaoCor],
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: CORES_ICONE[posicaoCor],
                        }}
                    >
                        <LocalFloristOutlinedIcon sx={{ fontSize: 48 }} />
                    </Box>
                )}

                {semEstoque && (
                    <Box
                        sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            px: 1,
                            py: 0.25,
                            borderRadius: 1,
                            bgcolor: "#fffdf8",
                            color: "#b3261e",
                            fontSize: 11,
                            fontWeight: 600,
                        }}
                    >
                        Sem estoque
                    </Box>
                )}
            </Box>

            {/* Parte dos textos */}
            <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1, flexGrow: 1 }}>

                {/* Linha com a categoria e a subcategoria */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1 }}>
                    <Box
                        sx={{
                            bgcolor: MARROM,
                            color: "white",
                            fontSize: 11,
                            fontWeight: 600,
                            px: 1.25,
                            py: 0.25,
                            borderRadius: 4,
                        }}
                    >
                        {nomeCategoria}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                        {nomeSubcategoria}
                    </Typography>
                </Box>

                <Typography variant="h6" component="h2" sx={{ color: VERDE, fontSize: 18 }}>
                    {produto.nome}
                </Typography>

                {/* A descrição ocupa no máximo 2 linhas, o que passar vira "..."*/}
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        flexGrow: 1,
                    }}
                >
                    {produto.descricao || "Sem descrição."}
                </Typography>

                <Typography sx={{ color: VERDE, fontWeight: 700, fontSize: 18, mt: 1 }}>
                    {precoFormatado}
                </Typography>
            </Box>
        </Box>
    );
}

import { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

import CartaoProduto from "../componentes/CartaoProduto";
import { pegarMensagemErro } from "../utils/mensagemErro.js";

const VERDE = "#2f5a45";

// Valor usado nos selects para dizer "sem filtro" (o MenuItem precisa de um valor).
const TODAS = "todas";

function Catalogo() {

    // DADOS QUE VÊM DO BACKEND
    const [produtos, setProdutos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [subcategorias, setSubcategorias] = useState([]);

    // ESTADO DA TELA
    const [carregando, setCarregando] = useState(true);
    const [erroCarregar, setErroCarregar] = useState("");
    const [erroFiltros, setErroFiltros] = useState("");

    // FILTROS E ORDENAÇÃO (cada um vira um parâmetro do GET /produtos)
    const [busca, setBusca] = useState("");
    const [idCategoria, setIdCategoria] = useState(TODAS);
    const [idSubcategoria, setIdSubcategoria] = useState(TODAS);
    const [estoque, setEstoque] = useState(TODAS);        // "todas", "comEstoque" ou "semEstoque"
    const [ordenarPor, setOrdenarPor] = useState("nome"); // "nome" ou "preco"
    const [direcao, setDirecao] = useState("ASC");        // "ASC" ou "DESC"

    // Contador para o botão "Tentar novamente" buscar tudo de novo.
    const [contadorRecarga, setContadorRecarga] = useState(0);

    // 1) Busca as categorias e subcategorias UMA vez, só para preencher os selects.
    useEffect(() => {
        async function carregarFiltros() {
            try {
                const [respostaCategorias, respostaSubcategorias] = await Promise.all([
                    axios.get("/categorias"),
                    axios.get("/subcategorias"),
                ]);

                setCategorias(respostaCategorias.data.categorias);
                setSubcategorias(respostaSubcategorias.data.subcategorias);
                setErroFiltros("");
            } catch (error) {
                setErroFiltros(pegarMensagemErro(error));
            }
        }

        carregarFiltros();
    }, [contadorRecarga]);

    // 2) Busca os produtos. Roda de novo SEMPRE que algum filtro mudar (a lista de baixo, [ ... ]).
    useEffect(() => {
        // "ativo" evita um bug: se a pessoa digita rápido, várias buscas saem juntas.
        // Quando uma resposta antiga chega atrasada, ela é ignorada.
        let ativo = true;

        async function carregarProdutos() {
            // Só manda o parâmetro quando a pessoa realmente escolheu algo.
            // O axios ignora parâmetros com valor undefined.
            const params = {
                busca: busca.trim() || undefined,
                idCategoria: idCategoria === TODAS ? undefined : idCategoria,
                idSubcategoria: idSubcategoria === TODAS ? undefined : idSubcategoria,
                estoque: estoque === TODAS ? undefined : estoque,
                ordenarPor: ordenarPor,
                direcao: direcao,
            };

            try {
                const resposta = await axios.get("/produtos", { params: params });

                if (ativo) {
                    setProdutos(resposta.data);
                    setErroCarregar("");
                }
            } catch (error) {
                if (ativo) {
                    setErroCarregar(pegarMensagemErro(error));
                }
            } finally {
                if (ativo) {
                    setCarregando(false);
                }
            }
        }

        carregarProdutos();

        // Roda quando o efeito é refeito: marca a busca antiga como "não vale mais".
        return () => {
            ativo = false;
        };
    }, [busca, idCategoria, idSubcategoria, estoque, ordenarPor, direcao, contadorRecarga]);

    // Quando escolhe outra categoria, a subcategoria escolhida antes não vale mais.
    function mudarCategoria(novoId) {
        setIdCategoria(novoId);
        setIdSubcategoria(TODAS);
    }

    function limparFiltros() {
        setBusca("");
        setIdCategoria(TODAS);
        setIdSubcategoria(TODAS);
        setEstoque(TODAS);
        setOrdenarPor("nome");
        setDirecao("ASC");
    }

    // O select de subcategorias só mostra as da categoria escolhida (ou todas, se não escolheu).
    const subcategoriasDoSelect = subcategorias.filter(
        (sub) => idCategoria === TODAS || sub.idCategoria === idCategoria
    );

    // Tem algum filtro ligado? (a ordenação não conta como filtro)
    const temFiltro =
        busca.trim() !== "" ||
        idCategoria !== TODAS ||
        idSubcategoria !== TODAS ||
        estoque !== TODAS;

    // O QUE MOSTRAR EMBAIXO DOS FILTROS
    let conteudo;

    if (carregando) {
        conteudo = <Typography>Carregando produtos...</Typography>;
    } else if (erroCarregar !== "") {
        conteudo = (
            <Alert
                severity="error"
                action={
                    <Button
                        color="inherit"
                        size="small"
                        onClick={() => {
                            setErroCarregar("");
                            setCarregando(true);
                            setContadorRecarga(contadorRecarga + 1);
                        }}
                    >
                        Tentar novamente
                    </Button>
                }
            >
                {erroCarregar}
            </Alert>
        );
    } else if (produtos.length === 0) {
        conteudo = (
            <Typography color="text.secondary">
                {temFiltro
                    ? "Nenhum produto encontrado com esses filtros."
                    : "Nenhum produto cadastrado ainda."}
            </Typography>
        );
    } else {
        conteudo = (
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                        lg: "repeat(3, 1fr)",
                    },
                    gap: 3,
                }}
            >
                {produtos.map((produto) => (
                    <CartaoProduto key={produto.idProduto} produto={produto} />
                ))}
            </Box>
        );
    }

    return (
        <Box>
            {/* Título da página */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="overline" color="text.secondary">
                    Floricultura Ugolini
                </Typography>
                <Typography variant="h4" component="h1" sx={{ color: VERDE }}>
                    Catálogo de produtos
                </Typography>
                <Typography color="text.secondary">
                    Consulte os produtos disponíveis durante o atendimento.
                </Typography>
            </Box>

            {/* Caixa branca com os filtros */}
            <Box
                sx={{
                    bgcolor: "white",
                    border: "1px solid #ddd",
                    borderRadius: 2,
                    p: 2,
                    mb: 3,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
            >
                {/* Linha 1: busca + categoria + subcategoria (igual ao protótipo) */}
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <TextField
                        size="small"
                        placeholder="Buscar produto por nome"
                        value={busca}
                        onChange={(event) => setBusca(event.target.value)}
                        sx={{ flexGrow: 1, minWidth: 220 }}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    <TextField
                        select
                        size="small"
                        value={idCategoria}
                        onChange={(event) => mudarCategoria(event.target.value)}
                        sx={{ minWidth: 200 }}
                    >
                        <MenuItem value={TODAS}>Todas as categorias</MenuItem>
                        {categorias.map((categoria) => (
                            <MenuItem key={categoria.idCategoria} value={categoria.idCategoria}>
                                {categoria.nome}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        size="small"
                        value={idSubcategoria}
                        onChange={(event) => setIdSubcategoria(event.target.value)}
                        sx={{ minWidth: 220 }}
                    >
                        <MenuItem value={TODAS}>Todas as subcategorias</MenuItem>
                        {subcategoriasDoSelect.map((sub) => (
                            <MenuItem key={sub.idSubcategoria} value={sub.idSubcategoria}>
                                {sub.nome}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>

                {/* Linha 2: estoque + ordenação */}
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
                    <TextField
                        select
                        size="small"
                        label="Estoque"
                        value={estoque}
                        onChange={(event) => setEstoque(event.target.value)}
                        sx={{ minWidth: 170 }}
                    >
                        <MenuItem value={TODAS}>Todos</MenuItem>
                        <MenuItem value="comEstoque">Com estoque</MenuItem>
                        <MenuItem value="semEstoque">Sem estoque</MenuItem>
                    </TextField>

                    <TextField
                        select
                        size="small"
                        label="Ordenar por"
                        value={ordenarPor}
                        onChange={(event) => setOrdenarPor(event.target.value)}
                        sx={{ minWidth: 150 }}
                    >
                        <MenuItem value="nome">Nome</MenuItem>
                        <MenuItem value="preco">Preço</MenuItem>
                    </TextField>

                    <TextField
                        select
                        size="small"
                        label="Ordem"
                        value={direcao}
                        onChange={(event) => setDirecao(event.target.value)}
                        sx={{ minWidth: 150 }}
                    >
                        <MenuItem value="ASC">Crescente</MenuItem>
                        <MenuItem value="DESC">Decrescente</MenuItem>
                    </TextField>

                    {temFiltro && (
                        <Button onClick={limparFiltros} sx={{ color: VERDE }}>
                            Limpar filtros
                        </Button>
                    )}

                    {/* Quantos produtos apareceram (só quando a lista carregou sem erro) */}
                    {!carregando && erroCarregar === "" && (
                        <Typography variant="body2" color="text.secondary" sx={{ ml: "auto" }}>
                            {produtos.length === 1 ? "1 produto" : `${produtos.length} produtos`}
                        </Typography>
                    )}
                </Box>

                {erroFiltros !== "" && (
                    <Alert severity="warning">
                        Não foi possível carregar as categorias dos filtros. {erroFiltros}
                    </Alert>
                )}
            </Box>

            {conteudo}
        </Box>
    );
}

export default Catalogo;

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
import CartaoContagem from "../componentes/CartaoContagem";
import { pegarMensagemErro } from "../utils/mensagemErro.js";

const VERDE = "#2f5a45";

// Valor usado nos selects para dizer "sem filtro"
const TODAS = "todas";

function Catalogo({ perfil }){

    const [produtos, setProdutos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [subcategorias, setSubcategorias] = useState([]);

    // Contagens utilizadas no dashboard
    const [contagens, setContagens] = useState({
        produtos: null,
        semEstoque: null,
        clientes: null,
    });

    const [carregando, setCarregando] = useState(true);
    const [erroCarregar, setErroCarregar] = useState("");
    const [erroFiltros, setErroFiltros] = useState("");

    const [busca, setBusca] = useState("");
    const [idCategoria, setIdCategoria] = useState(TODAS);
    const [idSubcategoria, setIdSubcategoria] = useState(TODAS);
    const [estoque, setEstoque] = useState(TODAS);        // "todas", "comEstoque" ou "semEstoque"
    const [ordenarPor, setOrdenarPor] = useState("nome"); // "nome" ou "preco"
    const [direcao, setDirecao] = useState("ASC");        // "ASC" ou "DESC"

    // Contador para o botão "Atualizar" buscar tudo de novo
    const [contadorRecarga, setContadorRecarga] = useState(0);

    // Busca as categorias e subcategorias UMA vez, só para preencher os selects.
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
            } catch (erro) {
                setErroFiltros(pegarMensagemErro(erro));
            }
        }

        carregarFiltros();
    }, [contadorRecarga]);

    // Busca os dados das contagens do dashboard
    useEffect(() => {
        let ativo = true;

        async function carregarContagens() {

            // Busca todos os produtos
            try {
                const resposta = await axios.get("/produtos");

                if(ativo){
                    const todosProdutos = resposta.data;

                    setContagens((anterior) => ({
                        ...anterior,
                        produtos: todosProdutos.length,
                        semEstoque: todosProdutos.filter(
                            (produto) => produto.quantidadeEstoque === 0
                        ).length,
                    }));
                }
            } catch(erro){

                if(ativo){
                    setContagens((anterior) => ({
                        ...anterior,
                        produtos: null,
                        semEstoque: null,
                    }));
                }
            }

            // Clientes só podem ser consultados pelo vendedor
            if(perfil === "vendedor"){
                try {
                    const respostaClientes = await axios.get("/clientes");

                    if(ativo){
                        setContagens((anterior) => ({
                            ...anterior,
                            clientes: respostaClientes.data.clientes.length,
                        }));
                    }
                } catch(erro){

                    if(ativo){
                        setContagens((anterior) => ({
                            ...anterior,
                            clientes: null,
                        }));
                    }
                }
            }
        }

        carregarContagens();

        return () => {
            ativo = false;
        };

    }, [contadorRecarga, perfil]);

    // Busca os produtos
    useEffect(() => {
        // "ativo" evita se a pessoa digita rápido e várias buscas sair juntas
        let ativo = true;

        async function carregarProdutos(){
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

                if(ativo){
                    setProdutos(resposta.data);
                    setErroCarregar("");
                }
            } catch(erro){

                if(ativo){
                    setErroCarregar(pegarMensagemErro(erro));
                }

            } finally {
                if(ativo) setCarregando(false);
            }
        }

        carregarProdutos();

        return () => {
            ativo = false;
        };

    }, [busca, idCategoria, idSubcategoria, estoque, ordenarPor, direcao, contadorRecarga]);

    // Quando escolhe outra categoria, a subcategoria escolhida antes não vale mais
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

    // Atualiza os dados do dashboard e do catálogo
    function atualizarPainel(){
        setContagens({
            produtos: null,
            semEstoque: null,
            clientes: null,
        });

        setCarregando(true);
        setErroCarregar("");

        setContadorRecarga((anterior) => anterior + 1);
    }

    // O select de subcategorias só mostra as da categoria escolhida
    const subcategoriasDoSelect = subcategorias.filter(
        (sub) => idCategoria === TODAS || sub.idCategoria === idCategoria
    );

    const temFiltro =
        busca.trim() !== "" ||
        idCategoria !== TODAS ||
        idSubcategoria !== TODAS ||
        estoque !== TODAS;

    let conteudo;

    if(carregando){
        conteudo = <Typography>Carregando produtos...</Typography>;

    } else if(erroCarregar !== ""){
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

    } else if(produtos.length === 0){
        conteudo = (
            <Typography color="text.secondary">
                {temFiltro
                    ? "Nenhum produto encontrado com esses filtros."
                    : "Nenhum produto cadastrado ainda."}
            </Typography>
        );

    } else{
        conteudo = (
            <Box
                sx={{
                    display: "grid",
                    // auto-fill: o navegador calcula quantas colunas cabem, para telas largas não esticar os quadradinhos
                    gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 240px), 1fr))",
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

            {/* Cabeçalho do painel */}
            <Box
                sx={{
                    mb: 3,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2,
                }}
            >
                <Box>
                    <Typography variant="overline" color="text.secondary">
                        Floricultura Ugolini
                    </Typography>

                    <Typography variant="h4" component="h1" sx={{ color: VERDE }}>
                        Visão geral
                    </Typography>

                    <Typography color="text.secondary">
                        Visão geral do sistema e catálogo de produtos para o atendimento.
                    </Typography>
                </Box>

                <Button
                    variant="outlined"
                    onClick={atualizarPainel}
                    sx={{
                        color: VERDE,
                        borderColor: VERDE,
                        "&:hover": {
                            borderColor: VERDE,
                            bgcolor: "#dbe8dd",
                        },
                    }}
                >
                    Atualizar
                </Button>
            </Box>

            {/* Dashboard com as contagens */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 150px), 1fr))",
                    gap: 2,
                    mb: 3,
                }}
            >
                <CartaoContagem
                    titulo="Produtos"
                    valor={contagens.produtos}
                />

                <CartaoContagem
                    titulo="Categorias"
                    valor={categorias.length}
                />

                <CartaoContagem
                    titulo="Subcategorias"
                    valor={subcategorias.length}
                />

                {perfil === "vendedor" && (
                    <CartaoContagem
                        titulo="Clientes"
                        valor={contagens.clientes}
                    />
                )}

                <CartaoContagem
                    titulo="Sem estoque"
                    valor={contagens.semEstoque}
                    cor="#b3261e"
                />
            </Box>

            {/* Título do catálogo */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="h5" sx={{ color: VERDE }}>
                    Catálogo de produtos
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
                {/* Busca + categoria + subcategoria */}
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

                {/* Estoque + ordenação */}
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

import { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import AddIcon from "@mui/icons-material/Add";

import CartaoCategoria from "../componentes/CartaoCategoria";
import FormCategoria from "../componentes/FormCategoria";
import FormSubcategoria from "../componentes/FormSubcategoria";
import DialogoExcluir from "../componentes/DialogoExcluir";
import { pegarMensagemErro } from "../utils/mensagemErro.js";

const VERDE = "#2f5a45";
const MARROM = "#7a6a4a"; // cor do botão "Nova subcategoria"

function semAcento(texto) {
    return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function Categorias() {

    const [categorias, setCategorias] = useState([]);
    const [subcategorias, setSubcategorias] = useState([]);

    const [carregando, setCarregando] = useState(true);
    const [erroCarregar, setErroCarregar] = useState("");

    const [tela, setTela] = useState("lista");

    const [itemEmEdicao, setItemEmEdicao] = useState(null);

    const [itemParaExcluir, setItemParaExcluir] = useState(null);
    const [excluindo, setExcluindo] = useState(false);

    const [dialogoAberto, setDialogoAberto] = useState(false);

    const [aviso, setAviso] = useState(null);

    const [busca, setBusca] = useState("");
    const [ordenarPor, setOrdenarPor] = useState("nome");   // "nome" ou "total"
    const [direcao, setDirecao] = useState("asc");          // "asc" ou "desc"

    const [contadorRecarga, setContadorRecarga] = useState(0);

    useEffect(() => {
        async function carregarDados() {
            try {
                const [respostaCategorias, respostaSubcategorias] = await Promise.all([
                    axios.get("/categorias"),
                    axios.get("/subcategorias"),
                ]);

                setCategorias(respostaCategorias.data.categorias);
                setSubcategorias(respostaSubcategorias.data.subcategorias);
                setErroCarregar("");
            } catch (error) {
                setErroCarregar(pegarMensagemErro(error));
            } finally {
                setCarregando(false);
            }
        }

        carregarDados();
    }, [contadorRecarga]);

    function abrirFormCategoria(categoria = null) {
        setItemEmEdicao(categoria);
        setTela("formCategoria");
    }

    function abrirFormSubcategoria(subcategoria = null) {
        setItemEmEdicao(subcategoria);
        setTela("formSubcategoria");
    }

    // Volta pra lista sem salvar (botão Cancelar dos formulários)
    function voltarParaLista() {
        setItemEmEdicao(null);
        setTela("lista");
    }

    // Os formulários chamam esta função quando salvam com sucesso.
    function aoSalvarComSucesso(texto) {
        setItemEmEdicao(null);
        setTela("lista");
        setAviso({ texto: texto, tipo: "success" });
        setContadorRecarga(contadorRecarga + 1); 
    }
    

    function pedirExclusao(tipo, item) {
        setItemParaExcluir({ tipo: tipo, item: item });
        setDialogoAberto(true);
    }

    function cancelarExclusao() {
        setDialogoAberto(false);
    }

    async function confirmarExclusao() {
        setExcluindo(true);

        try {
            if (itemParaExcluir.tipo === "categoria") {
                await axios.delete(`/categorias/${itemParaExcluir.item.idCategoria}`);
                setAviso({ texto: "Categoria excluída com sucesso.", tipo: "success" });
            } else {
                await axios.delete(`/subcategorias/${itemParaExcluir.item.idSubcategoria}`);
                setAviso({ texto: "Subcategoria excluída com sucesso.", tipo: "success" });
            }

            setContadorRecarga(contadorRecarga + 1);
        } catch (error) {
            // Aqui aparece o 409, pois o backend recusa excluir quem tem produtos ou subcategorias
            setAviso({ texto: pegarMensagemErro(error), tipo: "error" });
        } finally {
            setExcluindo(false);
            setDialogoAberto(false);
        }
    }

    
    //SE NÃO É A LISTA, MOSTRA O FORMULÁRIO 
    if (tela === "formCategoria") {
        return (
            <FormCategoria
                categoria={itemEmEdicao}
                aoCancelar={voltarParaLista}
                aoSalvar={aoSalvarComSucesso}
            />
        );
    }

    if (tela === "formSubcategoria") {
        return (
            <FormSubcategoria
                subcategoria={itemEmEdicao}
                categorias={categorias}
                aoCancelar={voltarParaLista}
                aoSalvar={aoSalvarComSucesso}
            />
        );
    }

    // PREPARAR A LISTA: juntar, filtrar e ordenar
    const termo = semAcento(busca.trim());

    // para cada categoria, descobre as subcategorias dela e conta o total
    const categoriasMontadas = categorias.map((categoria) => {
        const doGrupo = subcategorias.filter(
            (sub) => sub.idCategoria === categoria.idCategoria
        );

        // a categoria "bate" com a busca se o nome dela contém o termo
        const categoriaBate = semAcento(categoria.nome).includes(termo);

        // sem busca, ou a CATEGORIA bateu -> mostra todas dela
        // senão -> só as subcategorias cujo nome bate
        let visiveis = doGrupo;
        if (termo !== "" && !categoriaBate) {
            visiveis = doGrupo.filter((sub) => semAcento(sub.nome).includes(termo));
        }

        return {
            categoria: categoria,
            total: doGrupo.length,
            visiveis: visiveis,
            // a categoria entra na lista se ela mesma bateu OU alguma subcategoria dela bateu
            aparece: termo === "" || categoriaBate || visiveis.length > 0,
        };
    });

    // filtra (tira quem não aparece) e ordena.
    const listaFinal = categoriasMontadas
        .filter((grupo) => grupo.aparece)
        .sort((a, b) => {
            let resultado;

            if (ordenarPor === "total") {
                resultado = a.total - b.total;
            } else {
                resultado = a.categoria.nome.localeCompare(b.categoria.nome, "pt-BR");
            }

            // se empate, desempata pelo nome
            if (resultado === 0) {
                resultado = a.categoria.nome.localeCompare(b.categoria.nome, "pt-BR");
            }

            // se a direção for decrescente, inverte o sinal
            if (direcao === "desc") {
                resultado = -resultado;
            }
            return resultado;
        });

    let conteudo;

    if (carregando) {
        conteudo = <Typography>Carregando categorias...</Typography>;
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
    } else if (categorias.length === 0) {
        conteudo = <Typography color="text.secondary">Nenhuma categoria cadastrada ainda.</Typography>;
    } else if (listaFinal.length === 0) {
        conteudo = <Typography color="text.secondary">Nenhum resultado para a busca.</Typography>;
    } else {
        conteudo = listaFinal.map((grupo) => (
            <CartaoCategoria
                key={grupo.categoria.idCategoria}
                categoria={grupo.categoria}
                subcategorias={grupo.visiveis}
                totalSubcategorias={grupo.total}
                aoEditarCategoria={abrirFormCategoria}
                aoExcluirCategoria={(cat) => pedirExclusao("categoria", cat)}
                aoEditarSubcategoria={abrirFormSubcategoria}
                aoExcluirSubcategoria={(sub) => pedirExclusao("subcategoria", sub)}
            />
        ));
    }

    let nomeParaExcluir = "";
    if (itemParaExcluir) {
        nomeParaExcluir = itemParaExcluir.item.nome;
    }

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: 2,
                    mb: 3,
                }}
            >
                <Box>
                    <Typography variant="overline" color="text.secondary">
                        Floricultura Ugolini
                    </Typography>
                    <Typography variant="h4" component="h1" sx={{ color: VERDE }}>
                        Categorias e subcategorias
                    </Typography>
                    <Typography color="text.secondary">
                        Organize o catálogo em uma estrutura simples e fácil de consultar.
                    </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{ bgcolor: MARROM, "&:hover": { bgcolor: "#665839" } }}
                        onClick={() => abrirFormSubcategoria()}
                    >
                        Nova subcategoria
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{ bgcolor: VERDE, "&:hover": { bgcolor: "#264a39" } }}
                        onClick={() => abrirFormCategoria()}
                    >
                        Nova categoria
                    </Button>
                </Box>
            </Box>

            <Box
                sx={{
                    bgcolor: "white",
                    border: "1px solid #ddd",
                    borderRadius: 2,
                    p: 3,
                }}
            >
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
                    <TextField
                        size="small"
                        placeholder="Buscar categoria ou subcategoria"
                        value={busca}
                        onChange={(event) => setBusca(event.target.value)}
                        sx={{ flexGrow: 1, minWidth: 220 }}
                    />

                    <TextField
                        select
                        size="small"
                        label="Ordenar por"
                        value={ordenarPor}
                        onChange={(event) => setOrdenarPor(event.target.value)}
                        sx={{ minWidth: 200 }}
                    >
                        <MenuItem value="nome">Nome</MenuItem>
                        <MenuItem value="total">Quantidade de subcategorias</MenuItem>
                    </TextField>

                    <TextField
                        select
                        size="small"
                        label="Ordem"
                        value={direcao}
                        onChange={(event) => setDirecao(event.target.value)}
                        sx={{ minWidth: 150 }}
                    >
                        <MenuItem value="asc">Crescente</MenuItem>
                        <MenuItem value="desc">Decrescente</MenuItem>
                    </TextField>
                </Box>

                {conteudo}
            </Box>

            <DialogoExcluir
                aberto={dialogoAberto}
                nomeItem={nomeParaExcluir}
                excluindo={excluindo}
                aoCancelar={cancelarExclusao}
                aoConfirmar={confirmarExclusao}
            />

            <Snackbar
                open={aviso !== null}
                autoHideDuration={6000}
                onClose={() => setAviso(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >

                <Alert severity={aviso?.tipo || "success"} onClose={() => setAviso(null)} variant="filled">
                    {aviso?.texto}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default Categorias;

import { useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { pegarMensagemErro } from "../utils/mensagemErro.js";

const VERDE = "#2f5a45";

export default function FormCategoria({ categoria, aoCancelar, aoSalvar }) {

    // Se estamos editando, "categoria" não é null.
    const editando = categoria !== null;

    const [nome, setNome] = useState(editando ? categoria.nome : "");
    const [erro, setErro] = useState("");
    const [salvando, setSalvando] = useState(false);

    // ---------- FUNÇÃO QUE RODA AO CLICAR EM SALVAR ----------
    async function salvar(event) {
        event.preventDefault();

        setErro("");

        // .trim() para tira espaços do começo e do fim.
        if (nome.trim() === "") {
            setErro("O nome da categoria é obrigatório.");
        }

        setSalvando(true);

        try {
            if (editando) {
                await axios.put(`/categorias/${categoria.idCategoria}`, { nome: nome });
                aoSalvar("Categoria atualizada com sucesso.");
            } else {
                await axios.post("/categorias", { nome: nome });
                aoSalvar("Categoria criada com sucesso.");
            }
        } catch (error) {
            setErro(pegarMensagemErro(error));
        } finally {
            setSalvando(false);
        }
    }

    // ---------- O QUE APARECE NA TELA ----------
    return (
        <Box>
            {/* Cabeçalho da página */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="overline" color="text.secondary">
                    Floricultura Ugolini
                </Typography>
                <Typography variant="h4" component="h1" sx={{ color: VERDE }}>
                    {editando ? "Editar categoria" : "Nova categoria"}
                </Typography>
                <Typography color="text.secondary">
                    Organize os produtos para facilitar a busca e o atendimento.
                </Typography>
            </Box>

            {/* cartão branco do formulário */}
            <Box
                component="form"
                onSubmit={salvar}
                noValidate
                sx={{
                    bgcolor: "#fffdf8",
                    border: "1px solid #e3e0d8",
                    borderRadius: 2,
                    p: 3,
                }}
            >
                {erro && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {erro}
                    </Alert>
                )}

                <TextField
                    label="Nome"
                    required
                    fullWidth
                    value={nome}
                    onChange={(event) => setNome(event.target.value)}
                    
                    slotProps={{ htmlInput: { maxLength: 50 } }}
                    disabled={salvando}
                />

                {/* linha com os dois botões, alinhados à direita */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 1,
                        mt: 3,
                        pt: 2,
                        borderTop: "1px solid #e3e0d8",
                    }}
                >
                    <Button type="button" onClick={aoCancelar} disabled={salvando} sx={{ color: VERDE }}>
                        Cancelar
                    </Button>

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={salvando}
                        sx={{ bgcolor: VERDE, "&:hover": { bgcolor: "#264a39" } }}
                    >
                        {salvando ? "Salvando..." : "Salvar"}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

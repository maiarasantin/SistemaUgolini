import { useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { pegarMensagemErro } from "../utils/mensagemErro.js";

const VERDE = "#2f5a45";

export default function FormSubcategoria({ subcategoria, categorias, aoCancelar, aoSalvar }) {

    const editando = subcategoria !== null;

    const [nome, setNome] = useState(editando ? subcategoria.nome : "");
    const [idCategoria, setIdCategoria] = useState(editando ? subcategoria.idCategoria : "");
    const [erro, setErro] = useState("");
    const [salvando, setSalvando] = useState(false);

    async function salvar(event) {
        event.preventDefault();
        setErro("");

        if (nome.trim() === "") {
            setErro("O nome da subcategoria é obrigatório.");
            return;
        }

        if (idCategoria === "") {
            setErro("Selecione a categoria à qual a subcategoria pertence.");
            return;
        }

        setSalvando(true);

        try {
            const dados = { nome: nome, idCategoria: idCategoria };

            if (editando) {
                await axios.put(`/subcategorias/${subcategoria.idSubcategoria}`, dados);
                aoSalvar("Subcategoria atualizada com sucesso.");
            } else {
                await axios.post("/subcategorias", dados);
                aoSalvar("Subcategoria criada com sucesso.");
            }
        } catch (error) {
            setErro(pegarMensagemErro(error));
        } finally {
            setSalvando(false);
        }
    }

    return (
        <Box>
            <Box sx={{ mb: 3 }}>
                <Typography variant="overline" color="text.secondary">
                    Floricultura Ugolini
                </Typography>
                <Typography variant="h4" component="h1" sx={{ color: VERDE }}>
                    {editando ? "Editar subcategoria" : "Nova subcategoria"}
                </Typography>
                <Typography color="text.secondary">
                    Organize os produtos para facilitar a busca e o atendimento.
                </Typography>
            </Box>

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
                    sx={{ mb: 2 }}
                />

                <TextField
                    select
                    label="Categoria à qual pertence"
                    required
                    fullWidth
                    value={idCategoria}
                    onChange={(event) => setIdCategoria(event.target.value)}
                    disabled={salvando}
                    helperText={categorias.length === 0 ? "Cadastre uma categoria antes de criar subcategorias." : ""}
                >
                    {categorias.map((cat) => (
                        <MenuItem key={cat.idCategoria} value={cat.idCategoria}>
                            {cat.nome}
                        </MenuItem>
                    ))}
                </TextField>

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

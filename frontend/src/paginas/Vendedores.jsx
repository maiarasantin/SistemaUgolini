import { useState, useEffect } from "react";
import axios from "axios";
import { formatarCpf, formatarTelefone, formatarData } from "../utils/formatacao";
import { pegarMensagemErro } from "../utils/mensagemErro";
import FormularioVendedor from "../componentes/FormularioVendedor";
import DialogoExcluir from "../componentes/DialogoExcluir";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Snackbar from "@mui/material/Snackbar";

const VERDE = "#2f5a45";

function Vendedores() {

    
  const [vendedores, setVendedores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [ordenarPor, setOrdenarPor] = useState("nome");

    
  const [vendedorExcluindo, setVendedorExcluindo] = useState(null);
  const [excluindo, setExcluindo] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState(""); //Mensagem de sucesso depois de ações feitas


  const [tela, setTela] = useState("lista");

  const [recarregar, setRecarregar] = useState(0);

  // null se for cadastro novo, ou então o vendedor que está sendo editado
  const [vendedorEditando, setVendedorEditando] = useState(null);






// Busca os vendedores na API e guarda o resultado
  useEffect(() => {

    async function carregarVendedores() {
      try {

        const resposta = await axios.get("/funcionarios", {
          params: { busca, ordenarPor },

        });
        setVendedores(resposta.data.vendedores);
       
        setErro("");  // Limpa um erro se a busca anterior falhou
      } catch (error) {
        setErro(pegarMensagemErro(error));
      } finally {
        setCarregando(false);
      }
    }



    // Espera 400 ms depois da última tecla antes de buscar
    const espera = setTimeout(() => {
      carregarVendedores();

    }, 400);

    // Se a pessoa digitar de novo antes dos 400 ms, cancela a espera anterior
    return () => clearTimeout(espera);
  }, [busca, ordenarPor, recarregar]);

  
  let aviso = null;

  if (erro) {
    aviso = (
      <Alert severity="error" sx={{ mb: 2 }}>
        {erro}
      </Alert>
    );
  }

  if (carregando) {
    aviso = <Typography sx={{ mb: 2 }}>Carregando vendedores...</Typography>;
  }

  // Linha que aparece quando a lista está vazia
  let linhaVazia = null;

  if (carregando === false && erro === "" && vendedores.length === 0) {
    linhaVazia = (
      <TableRow>
        <TableCell colSpan={6}>Nenhum vendedor encontrado.</TableCell>
      </TableRow>
    );
  }



   // BOTÃO NOVO VENDEDOR: abre o formulário vazio
  function novoVendedor() {
    setVendedorEditando(null);
    setTela("formulario");
  }

  // BOTÃO EDITAR: abre o formulário com os dados desse vendedor
  function editarVendedor(vendedor) {
    setVendedorEditando(vendedor);
    setTela("formulario");
  }

  
  function aoSalvarVendedor() {

     if (vendedorEditando) {
      setMensagemSucesso("Vendedor atualizado com sucesso.");
    } else {
      setMensagemSucesso("Vendedor cadastrado com sucesso.");
    }

    setRecarregar(recarregar + 1);
    setTela("lista");
  }




  if (tela === "formulario") {
    return (
      <FormularioVendedor
        vendedor={vendedorEditando}
        aoCancelar={() => setTela("lista")}
        aoSalvar={aoSalvarVendedor}
      />
    );
  }


function pedirExclusao(vendedor){
  setVendedorExcluindo(vendedor);
}

async function confirmarExclusao(){
  setExcluindo(true);

try{
  await axios.delete("/funcionarios/" + vendedorExcluindo.id);

  setRecarregar(recarregar +1);
  setErro("");
  setMensagemSucesso("Vendedor excluído com sucesso.");
} catch( error){
  setErro(pegarMensagemErro(error)); //Mostra a mensagem de erro do back
} finally{
  setExcluindo(false);
  setVendedorExcluindo(null);
}

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
            Vendedores
          </Typography>

          <Typography color="text.secondary">
            Cadastre e mantenha os dados dos vendedores da loja.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ bgcolor: VERDE }}
          onClick={novoVendedor}
        >
          Novo vendedor
        </Button>
      </Box>

      {/* Parte branca com busca, ordenação e tabela */}
      <Box
        sx={{
          bgcolor: "white",
          border: "1px solid #ddd",
          borderRadius: 2,
          p: { xs: 2, sm: 3 },
        }}
      >
        {/* Busca e ordenação.*/}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mb: 2,
          }}
        >
          <TextField
            size="small"
            placeholder="Buscar por nome, CPF ou e-mail"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            sx={{ flex: 1 }}
          />
            {/*Select é a lista de opções*/}
          <TextField
            select 
            size="small"
            label="Ordenar por"
            value={ordenarPor}
            onChange={(e) => setOrdenarPor(e.target.value)}
            sx={{ width: { xs: "100%", sm: 200 } }}
          >
            <MenuItem value="nome">Nome</MenuItem>
            <MenuItem value="dataContratacao">Data de contratação</MenuItem>
            <MenuItem value="status">Status</MenuItem>
          </TextField>
        </Box>

       
       
        {aviso}

        {/* TableContainer cria uma rolagem lateral se a tabela não couber na tela */}
        <TableContainer>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: VERDE }}>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Nome</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>CPF</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Telefone</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>
                  Data de contratação
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Ações</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {linhaVazia}

              {vendedores.map((vendedor) => (
                <TableRow key={vendedor.id}>
                  {/* Nome em negrito e o e-mail pequeno embaixo */}
                  <TableCell>

                    <Typography sx={{ fontWeight: 600 }}>{vendedor.nome}</Typography>

                    <Typography variant="caption" color="text.secondary">


                      {vendedor.email}
                    </Typography>
                  </TableCell>

                  <TableCell>{formatarCpf(vendedor.cpf)}</TableCell>
                  <TableCell>{formatarTelefone(vendedor.telefone)}</TableCell>
                  <TableCell>{formatarData(vendedor.dataContratacao)}</TableCell>
                  <TableCell>{vendedor.status ? "Ativo" : "Inativo"}</TableCell>

                  <TableCell>
                    <Button
                      size="small"
                      startIcon={<EditOutlinedIcon />}
                      sx={{ color: VERDE }}
                      onClick={() => editarVendedor(vendedor)}
                    >
                      Editar
                    </Button>

                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteOutlineIcon />}
                      onClick={() => pedirExclusao(vendedor)}
                    >
                      Excluir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", textAlign: "right", mt: 1 }}
        >
          {vendedores.length} vendedores encontrados.
        </Typography>
      </Box>

      {/* Janelinha de confirmação */}
      <DialogoExcluir
        aberto={vendedorExcluindo !== null}
        nomeItem={vendedorExcluindo ? vendedorExcluindo.nome : ""}
        excluindo={excluindo}
        aoCancelar={() => setVendedorExcluindo(null)}
        aoConfirmar={confirmarExclusao}
      />


       {/* Aviso verde que some sozinho depois de 4 segundos */}
      <Snackbar
        open={mensagemSucesso !== ""}
        autoHideDuration={4000}
        onClose={() => setMensagemSucesso("")} // Limpa o texto e o aviso some
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}   // Onde o aviso aparece
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setMensagemSucesso("")} // O botão X que fecha o aviso antes dos 4 segundos
        >
          {mensagemSucesso}
        </Alert>
      </Snackbar>
    </Box>

    
  );
}

export default Vendedores;
import { useState, useEffect } from "react";
import axios from "axios";
import FormularioCliente from "../componentes/FormularioCliente";
import { formatarTelefone, formatarDocumento } from "../utils/formatacao";
import { pegarMensagemErro } from "../utils/mensagemErro";
import DialogoExcluir from "../componentes/DialogoExcluir";
import Alert from "@mui/material/Alert";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import MenuItem from "@mui/material/MenuItem";
import Snackbar from "@mui/material/Snackbar";

const VERDE = "#2f5a45";


function Clientes() {
  const [clientes, setClientes] = useState([]); //lista de clientes
  const [carregando, setCarregando] = useState(true);  // Se está esperando a resposta da API
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState(""); // o texto digitado no campo de busca, vai junto na chamada à API
  const [ordenarPor, setOrdenarPor] = useState("nome");  // Critério de ordenação escolhido
  const [tela, setTela] = useState("lista");  // Qual tela mostrar: "lista" ou "formulario".
  const [recarregar, setRecarregar] = useState(0); // Quando o número muda, o useEffect busca a lista de novo.
  const [clienteEditando, setClienteEditando] = useState(null); // null = cadastro novo; senão, o cliente que está sendo editado


 
const [clienteExcluindo, setClienteExcluindo] = useState(null);  // Qual cliente está na caixinha de confirmação se estiver null ela não está aberta
const [excluindo, setExcluindo] = useState(false);
const [mensagemSucesso, setMensagemSucesso] = useState("");  //Mensagem de sucesso depois de ações feitas

  

  // Busca os clientes na API e coloca os resultados na tela
    useEffect(() => {
      async function carregarClientes() {
        try {
          // params monta a URL sozinho: /clientes?busca=texto
          const resposta = await axios.get("/clientes", { params: { busca, ordenarPor  } });
          setClientes(resposta.data.clientes); //resposta.data é o conteúdo que a API respondeu o set aq guarda a lista e faz o react redesenhar a tabela
          setErro(""); // limpa um erro antigo, se a busca anterior tinha falhado
        } catch (error) {
          setErro(pegarMensagemErro(error));
        } finally {
          setCarregando(false); //roda sempre mesmo que deu certo ou errado
        }
      }

      // Espera 400 ms depois da última tecla antes de buscar.
      const espera = setTimeout(() => {
        carregarClientes();
      }, 400);

      // Se a pessoa digitar de novo antes dos 400 ms, cancela a espera anterior.
      return () => clearTimeout(espera);
    }, [busca, ordenarPor, recarregar ]); // roda de novo toda vez que a busca mudar

   

    // a mensagem que aparece em cima da tabela
  let aviso = null;

  if (erro) {
    aviso = (
      <Alert severity="error" sx={{ mb: 2 }}>
        {erro}
      </Alert>
    );
  }

  if (carregando) {
    aviso = <Typography sx={{ mb: 2 }}>Carregando clientes...</Typography>;
  }

  let linhaVazia = null;

  if (carregando === false && erro === "" && clientes.length === 0) {
    linhaVazia = (
      <TableRow>
        <TableCell colSpan={5}>Nenhum cliente encontrado.</TableCell>{" "}
        {/*colSpan é pra ocupar as 5 colunas*/}
      </TableRow>
    );
  }



  
  // BOTÃO EXCLUIR: só abre a caixinha de confirmação 
function pedirExclusao(cliente) {
  setClienteExcluindo(cliente);
}

// Se for confirmada a exclusão
async function confirmarExclusao() {
  setExcluindo(true);

  try {
    await axios.delete("/clientes/" + clienteExcluindo.idCliente);
    setRecarregar(recarregar + 1);
    setErro("");
    setMensagemSucesso("Cliente excluído com sucesso.");            
  } catch (error) {
    setErro(pegarMensagemErro(error));
  } finally {
    setClienteExcluindo(null);
    setExcluindo(false);
  }
}



// Chamada pelo formulário quando o cliente foi salvo
function aoSalvarCliente() {
  if (clienteEditando) { // Se era uma edição aparece mensagem de atualizado caso contrário era um cadastro
    setMensagemSucesso("Cliente atualizado com sucesso.");
  } else {
    setMensagemSucesso("Cliente cadastrado com sucesso.");
  }
  setRecarregar(recarregar + 1); // Busca a lista de novo
  setTela("lista"); // Volta pra lista
}


//BOTÃO EDITAR
function editarCliente(cliente){
  setClienteEditando(cliente); // Guarda qual foi o cliente clicado
  setTela("formulario"); // Chama o formulário na tela
}






// Se a tela é o formulário, mostra só ele e para por aqui
if (tela === "formulario") {
  return ( 
    <FormularioCliente
      cliente={clienteEditando}   // Quem está sendo editado se for null = cadastro novo
      aoCancelar={() => setTela("lista")}    // Função que o formulário chama para voltar à lista
      aoSalvar={aoSalvarCliente}    //Função que o formulário chama depois de salvar
    />
  );
}









  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap", // se não couber faz o botão desce para a linha de baixo
          gap: 2, // espaço entre o título e o botão
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="overline" color="text.secondary">
            Floricultura Ugolini
          </Typography>

          <Typography variant="h4" component="h1" sx={{ color: VERDE }}>
            Clientes
          </Typography>

          <Typography color="text.secondary">
            Consulte e mantenha os dados dos clientes da loja.
          </Typography>
        </Box>

        <Button
          variant="contained" // botão preenchido
          startIcon={<AddIcon />} // ícone de +
          sx={{ bgcolor: VERDE }} // cor de fundo verde
          onClick={() => {
             setClienteEditando(null);  //Pode ter dois valores o null que é ninguem está sendo editado então precisa vim em branco pois é cadastro novo
               setTela("formulario");   //Ou objeto cliente que seria a edição desse cliente
          }}
        >
          Novo cliente
        </Button>
      </Box>

      <Box
        sx={{
          bgcolor: "white",
          border: "1px solid #ddd",
          borderRadius: 2, // cantos arredondados
          p: { xs: 2, sm: 3 }, //  16px no celular, 24px em telas maiores
        }}
      >
                
            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, mb: 2 }}>
            <TextField
                size="small"
                placeholder="Buscar por nome, telefone ou CPF/CNPJ"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                sx={{ flex: { xs: "none", sm: 1 } }}
            />

            {/* select faz o TextField virar uma lista de opções */}
            <TextField
                select
                size="small"
                label="Ordenar por"
                value={ordenarPor}
                onChange={(e) => setOrdenarPor(e.target.value)}
                sx={{ width: { xs: "100%", sm: 180 } }}
            >
                <MenuItem value="nome">Nome</MenuItem>
                <MenuItem value="telefone">Telefone</MenuItem>
                <MenuItem value="email">E-mail</MenuItem>
            </TextField>
            </Box>



        {/* Mostra a faixa de erro ou o "Carregando...". Se não tem nada
                    pra avisar nada aparece. */}
        {aviso}

        {/* -------- TABELA -------- */}
        <TableContainer>
          <Table  sx={{ minWidth: 700 }}>
            {/* Cabeçalho: uma linha verde com os nomes das colunas */}
            <TableHead>
              <TableRow sx={{ bgcolor: VERDE }}>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>
                  Nome
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>
                  Telefone / WhatsApp
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>
                  CPF / CNPJ
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>
                  E-mail
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>
                  Ações
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {/* Mostra a linha "Nenhum cliente encontrado." quando a lista está
               vazia. Nos outros casos linhaVazia é null e não aparece nada. */}
              {linhaVazia}

              {clientes.map((cliente) => (
                <TableRow key={cliente.idCliente}>
                  {/* Nome em negrito */}
                  <TableCell sx={{ fontWeight: 600 }}>{cliente.nome}</TableCell>

                  <TableCell>{formatarTelefone(cliente.telefone)}</TableCell>

                  <TableCell>{formatarDocumento(cliente.cpf || cliente.cnpj || "") || "—"}</TableCell>

                  <TableCell>{cliente.email || "—"}</TableCell>

                  {/* Botões */}
                  <TableCell>
                    <Button
                      size="small"
                      startIcon={<EditOutlinedIcon />}
                      sx={{ color: VERDE }}
                      onClick={() => editarCliente(cliente)}
                    >
                      Editar
                    </Button>

                    <Button
                      size="small"
                      color="error" // vermelho padrão do MUI
                      startIcon={<DeleteOutlineIcon />}
                    onClick={() => pedirExclusao(cliente)}
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
          {clientes.length} clientes encontrados.
        </Typography>
      </Box>
      <DialogoExcluir
     aberto={clienteExcluindo !== null}
     nomeItem={clienteExcluindo ? clienteExcluindo.nome : ""}
     excluindo={excluindo}
     aoCancelar={() => setClienteExcluindo(null)}
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

export default Clientes;

import { useState, useEffect } from "react";
import axios from "axios";
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

const VERDE = "#2f5a45";


function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [ordenarPor, setOrdenarPor] = useState("nome");

  
    useEffect(() => {
      async function carregarClientes() {
        try {
          // params monta a URL sozinho: /clientes?busca=texto
          const resposta = await axios.get("/clientes", { params: { busca, ordenarPor  } });
          setClientes(resposta.data.clientes); //resposta.data é o conteúdo que a API respondeu o set aq guarda a lista e faz o react redesenhar a tabela
          setErro(""); // limpa um erro antigo, se a busca anterior tinha falhado
        } catch (error) {
          setErro("Não foi possível carregar os clientes. Tente Novamente.");
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
    }, [busca, ordenarPor]); // roda de novo toda vez que a busca mudar

   

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


async function excluirCliente(cliente) {
  // confirm abre uma caixinha com OK e Cancelar.
  // Devolve true se a pessoa clicou em OK, e false se cancelou.
  const confirmou = window.confirm("Deseja excluir " + cliente.nome + "?");

  // Se cancelou, para por aqui e não faz nada.
  if (confirmou === false) {
    return;
  }

  try {
    
    await axios.delete("/clientes/" + cliente.idCliente);

    // Se deu certo monta uma lista nova SEM esse cliente
    setClientes(clientes.filter((c) => c.idCliente !== cliente.idCliente)); // filter mantém só quem tem id diferente do que foi excluído.
  } catch (error) {
    
    let mensagem = "Não foi possível excluir o cliente. Tente novamente.";

    // Se o back mandou uma mensagem (ex.: cliente com pedidos), usa ela.
    if (error.response && error.response.data.erro) {
      mensagem = error.response.data.erro;
    }
   
    setErro(mensagem);
  }
}








  return (
    <Box>
      <Box
        sx={{
          display: "flex", // coloca os filhos lado a lado
          justifyContent: "space-between", // um encostado em cada ponta
          alignItems: "flex-start", // alinha os dois pelo topo
          mb: 3, // margem embaixo (3 x 8px = 24px)
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
        >
          Novo cliente
        </Button>
      </Box>

      <Box
        sx={{
          bgcolor: "white",
          border: "1px solid #ddd",
          borderRadius: 2, // cantos arredondados
          p: 3, // espaço interno (24px)
        }}
      >
                
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
                size="small"
                placeholder="Buscar por nome, telefone ou CPF/CNPJ"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                sx={{ width: 380 }}
            />

            {/* select faz o TextField virar uma lista de opções (dropdown) */}
            <TextField
                select
                size="small"
                label="Ordenar por"
                value={ordenarPor}
                onChange={(e) => setOrdenarPor(e.target.value)}
                sx={{ width: 180 }}
            >
                <MenuItem value="nome">Nome</MenuItem>
                <MenuItem value="telefone">Telefone</MenuItem>
                <MenuItem value="email">E-mail</MenuItem>
            </TextField>
            </Box>



        {/* Mostra a faixa de erro ou o "Carregando...". Se não tem nada
                    pra avisar, "aviso" está vazio (null) e nada aparece. */}
        {aviso}

        {/* -------- TABELA -------- */}
        <TableContainer>
          <Table>
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

                  <TableCell>{cliente.telefone}</TableCell>

                  {/* Mostra o CPF; se não tiver, o CNPJ; se não tiver nenhum, "—".
                                    O || escolhe o primeiro valor que não for vazio. */}
                  <TableCell>{cliente.cpf || cliente.cnpj || "—"}</TableCell>

                  <TableCell>{cliente.email || "—"}</TableCell>

                  {/* Botões de ação (ainda não fazem nada) */}
                  <TableCell>
                    <Button
                      size="small"
                      startIcon={<EditOutlinedIcon />}
                      sx={{ color: VERDE }}
                    >
                      Editar
                    </Button>

                    <Button
                      size="small"
                      color="error" // vermelho padrão do MUI
                      startIcon={<DeleteOutlineIcon />}
                    onClick={() => excluirCliente(cliente)}
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
    </Box>
  );
}

export default Clientes;

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

const VERDE = "#2f5a45";

function Clientes () {
    

const [clientes, setClientes] = useState([]);

const [carregando, setCarregando] = useState(true);

const [erro, setErro] = useState("");

useEffect(() => {

    async function carregarClientes() {

        try{
            const resposta = await axios.get("/clientes");
        
            setClientes(resposta.data.clientes); //resposta.data é o conteúdoi que a API respondeu o set aq guarda a lista e faz o react redesenhar a tabela
        }catch (error){
            setErro("Não foi possível carregar os clientes. Tente Novamente.");
        } finally {
            setCarregando(false); //roda sempre mesmo que deu certo ou errado
        }
        
    }

     // Chama a função que acabamos de criar.
                carregarClientes();
            }, []);


                let aviso = null;

                    if(erro){
                        aviso = (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {erro}
                            </Alert>
                        );
            }

                    if(carregando) {
                        aviso = <Typography sx={{ mb: 2 }}>Carregando clientes...</Typography>;
                    }




                       let linhaVazia = null;

                        if(carregando === false && erro === "" && clientes.length === 0){
                            linhaVazia = (
                                <TableRow>
                                        <TableCell colSpan={5}>Nenhum cliente encontrado.</TableCell> {/*colSpan é pra ocupar as 5 colunas*/}

                                 </TableRow>
    );
  }

  return (
        <Box>

            <Box
        sx={{
          display: "flex",                 // coloca os filhos lado a lado
          justifyContent: "space-between", // um encostado em cada ponta
          alignItems: "flex-start",        // alinha os dois pelo topo
          mb: 3,                           // margem embaixo (3 x 8px = 24px)
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
          variant="contained"            // botão preenchido
          startIcon={<AddIcon />}        // ícone de + 
          sx={{ bgcolor: VERDE }}        // cor de fundo verde
        >
          Novo cliente
        </Button>
        </Box>


         <Box
        sx={{
          bgcolor: "white",
          border: "1px solid #ddd",
          borderRadius: 2, // cantos arredondados
          p: 3,            // espaço interno (24px)
        }}
 >       

         <TextField
          size="small" // versão mais baixinha do campo
          placeholder="Buscar por nome, telefone ou CPF/CNPJ"
          sx={{ mb: 2, width: 380 }}
        />

                
                {/* Mostra a faixa de erro ou o "Carregando...". Se não tem nada
                    pra avisar, "aviso" está vazio (null) e nada aparece. */}
                {aviso}

               {/* -------- TABELA -------- */}
                <TableContainer>
                    <Table>
                        {/* Cabeçalho: uma linha verde com os nomes das colunas */}
                        <TableHead>
                        <TableRow sx={{ bgcolor: VERDE }}>
                            <TableCell sx={{ color: "white", fontWeight: 700 }}>Nome</TableCell>
                            <TableCell sx={{ color: "white", fontWeight: 700 }}>Telefone / WhatsApp</TableCell>
                            <TableCell sx={{ color: "white", fontWeight: 700 }}>CPF / CNPJ</TableCell>
                            <TableCell sx={{ color: "white", fontWeight: 700 }}>E-mail</TableCell>
                            <TableCell sx={{ color: "white", fontWeight: 700 }}>Ações</TableCell>
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





  








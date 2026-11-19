import { useState } from "react";
import axios from "axios";
import Alert from "@mui/material/Alert";
import { pegarMensagemErro } from "../utils/mensagemErro";
import { formatarCpf, formatarTelefone , somenteNumeros } from "../utils/formatacao";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";


const VERDE = "#2f5a45";

const DADOS_VAZIOS = {
  nome: "",
  cpf: "",
  telefone: "",
  email: "",
  dataContratacao: "",
  status: "ativo",
  senha: "",
  confirmarSenha: "",
};



function FormularioVendedor({ vendedor, aoCancelar, aoSalvar }) {  // vendedor: se for null é cadastro novo; se tiver um vendedor é edição


    let dadosIniciais = DADOS_VAZIOS;

     if (vendedor) {
    dadosIniciais = {
      nome: vendedor.nome || "",
      cpf: formatarCpf(vendedor.cpf),
      telefone: formatarTelefone(vendedor.telefone),
      email: vendedor.email || "",
      dataContratacao: vendedor.dataContratacao || "",
      status: vendedor.status ? "ativo" : "inativo",
      senha: "",
      confirmarSenha: "",
    };
  }



  const [dados, setDados] = useState(dadosIniciais);

  const [erro, setErro] = useState("");
  
  const [salvando, setSalvando] = useState(false); // true enquanto o envio está acontecendo (evita clicar duas vezes)

  // Chamada a cada tecla digitada em qualquer campo.
  function mudarCampo(evento) {
    setDados({ ...dados, [evento.target.name]: evento.target.value }); // evento.target.name é o campo que mudou e evento.target.value é o texto dele
    // O ...dados copia o que já estava
  }


    
  function validar() {
    if (dados.senha !== dados.confirmarSenha) {
      return "As senhas não conferem.";
    }

    return "";
  }


  // Chamada ao clicar em Salvar
  async function salvar() {
    
    const problema = validar();
    if (problema !== "") {
      setErro(problema);
      return;
    }

    setSalvando(true);
    setErro("");

     // Monta o que vai para o back.
    const corpo = {
      nome: dados.nome,
      cpf: dados.cpf,
      telefone: dados.telefone,
      email: dados.email,
      dataContratacao: dados.dataContratacao,
      status: dados.status === "ativo",
      senha: dados.senha,
    };

    try {
      if (vendedor) {
        await axios.put("/funcionarios/" + vendedor.id, corpo);
      } else {
        await axios.post("/funcionarios", corpo);
      }

      aoSalvar(); // Caso tenha dado certo a lista é avisada para recarregar e voltar
    } catch (error) {
      setErro(pegarMensagemErro(error));
      setSalvando(false);
    }
  }



















  // Textos da tela mudam conforme o modo, tem o cadastro novo e a edição
  let titulo = "Novo vendedor";
  let textoBotao = "Salvar";
  let dicaSenha = "Mínimo de 8 caracteres.";

  if (vendedor) {
    titulo = "Editar vendedor";
    textoBotao = "Salvar alterações";
    dicaSenha = "Deixe em branco para manter a senha atual.";
  }

  return (
    <Box>
      {/* Cabeçalho */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="overline" color="text.secondary">
          Floricultura Ugolini
        </Typography>

        <Typography variant="h4" component="h1" sx={{ color: VERDE }}>
          {titulo}
        </Typography>

        <Typography color="text.secondary">
          Preencha os dados do vendedor. Ele usará o e-mail e a senha para
          entrar no sistema.
        </Typography>
      </Box>

      <Box
        sx={{
          bgcolor: "white",
          border: "1px solid #ddd",
          borderRadius: 2,
          p: { xs: 2, sm: 3 },
        }}
      >

        {/* Se tiver erro: */}
        {erro && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {erro}
          </Alert>
        )}


         {/* Campos do formulário */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2,
          }}
        >
          <TextField
            name="nome"
            label="Nome completo"
            value={dados.nome}
            onChange={mudarCampo}
            required
            fullWidth
          />

          <TextField
            name="cpf"
            label="CPF"
            placeholder="000.000.000-00"  //Texto cinza de exemplo, some quando começa a digitar
            value={dados.cpf}
            onChange={mudarCampo}
            required // O asterisco de obrigatório
            fullWidth
          />

          <TextField
            name="telefone"
            label="Telefone/WhatsApp"
            placeholder="(49) 99999-0000" 
            value={dados.telefone}
            onChange={mudarCampo}
            required
            fullWidth
          />

          <TextField
            name="email"
            label="E-mail" 
            type="email"  // Para conferir se tem @ e abrir o teclado no celular
            value={dados.email}
            onChange={mudarCampo}
            required
            fullWidth
          />

          <TextField
            name="dataContratacao"
            label="Data de contratação"
            type="date" // Abre o calendário do navegador
            value={dados.dataContratacao}
            onChange={mudarCampo}
            required
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }} // mantém o texto "Data de contratação" sempre em cima do campo, sem isso ele ficaria em cima do "dd/mm/aaaa" quando a data está vazia

          />

          {/* select vira uma caixinha de escolha */}
          <TextField
            select
            name="status"
            label="Status"
            value={dados.status}
            onChange={mudarCampo}
            fullWidth
          >
            <MenuItem value="ativo">Ativo</MenuItem>
            <MenuItem value="inativo">Inativo</MenuItem>
          </TextField>

        
          <TextField
            name="senha"
            label="Senha"
            type="password"  // Esconde o que é digitado com bolinhas
            value={dados.senha}
            onChange={mudarCampo}
            required={!vendedor}
            helperText={dicaSenha} // Texto pequeno de dica
            autoComplete="new-password" // Impede o navegador de preencher sozinho sua senha salva
            fullWidth
          />

          <TextField
            name="confirmarSenha"
            label="Confirmar senha"
            type="password" 
            value={dados.confirmarSenha}
            onChange={mudarCampo}
            required={!vendedor}
            helperText={dicaSenha} //Texto pequeno embaixo do campo
            autoComplete="new-password"
            fullWidth
          />
        </Box>


        {/* Botões */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 3 }}>
          <Button onClick={aoCancelar} sx={{ color: VERDE }}>
            Cancelar
          </Button>

         <Button
            variant="contained"
            onClick={salvar}
            disabled={salvando}
            sx={{ bgcolor: VERDE }}
          >
            {textoBotao}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default FormularioVendedor;
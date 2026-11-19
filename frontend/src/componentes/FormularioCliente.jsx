import { useState } from "react";
import axios from "axios";
import { formatarTelefone, formatarDocumento } from "../utils/formatacao";
import { pegarMensagemErro } from "../utils/mensagemErro";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";


const VERDE = "#2f5a45";

const CAMPOS = [
  { name: "nome", label: "Nome completo", obrigatorio: true },
  { name: "documento", label: "CPF/CNPJ" },
  { name: "telefone", label: "Telefone/WhatsApp", obrigatorio: true },
  { name: "email", label: "E-mail" },
  { name: "cep", label: "CEP" },
  { name: "rua", label: "Rua" },
  { name: "numero", label: "Número" },
  { name: "bairro", label: "Bairro" },
  { name: "referencia", label: "Referência" },
];


const DADOS_VAZIOS = {
  nome: "",
  telefone: "",
  documento: "",
  email: "",
  cep: "",
  rua: "",
  numero: "",
  bairro: "",
  referencia: "",
};


function FormularioCliente({cliente, aoCancelar, aoSalvar}){



     // Se veio um cliente para edição, os campos começam com os dados dele.
     // Se não veio, no caso de cadastro novo, começam vazios.
      let dadosIniciais = DADOS_VAZIOS;

      if (cliente) {
        dadosIniciais = {
          nome: cliente.nome || "",
          telefone: formatarTelefone(cliente.telefone),
          documento: formatarDocumento(cliente.cpf || cliente.cnpj || ""),
          email: cliente.email || "",
          cep: cliente.cep || "",
           rua: cliente.rua || "",
          numero: cliente.numero || "",
          bairro: cliente.bairro || "",
          referencia: cliente.referencia || "",
        };
      }





    //Começa selecionando 0 que é o cadastro rápido 
    let abaInicial = 0;

    //se veio cliente, é edição então abre no cadastro completo já
    if(cliente){
      abaInicial = 1;
    }
    const [aba, setAba] = useState(abaInicial); //0 é o cadastro rápido e 1 é o completo

    const [dados, setDados] = useState(dadosIniciais);

    const [erro, setErro] = useState("");

    const [salvando, setSalvando] = useState(false); // true enquanto o POST está acontecendo



    // Chamada a cada tecla digitada em qualquer campo
    // evento.target.name  = qual campo mudou 
    // evento.target.value = o texto que está nele agora
    function mudarCampo(evento){
        // ...dados copia tudo que já estava preenchido antes e o [evento.target.name] troca só o campo que mudou
         setDados({ ...dados, [evento.target.name]: evento.target.value });
    }




    async function salvar(){
        if(dados.nome.trim() === "" || dados.telefone.trim() === ""  ){
            setErro("Preencha o nome e o telefone.");
            return;
        }
    

    let corpo = dados; //Começa no cadastro total
    if(aba === 0){ //No cadastro rápido manda só o nome e o telefone
        corpo = {nome: dados.nome, telefone: dados.telefone};
    }

    setSalvando(true);
    setErro("");

    try{
          if (cliente) {
            // Edição: PUT atualiza o cliente que já existe, o id vai na URL
            await axios.put("/clientes/" + cliente.idCliente, corpo);
        } else {
            // Cadastro novo: POST cria um cliente
            await axios.post("/clientes", corpo);
        }

        aoSalvar();
    } catch (error){
        
        setErro(pegarMensagemErro(error)); //Mostra a mensagem que o back mandou e caso não exista responde uma mensagem pronta
        setSalvando(false);
    }
}


     //é a lista do que vai aparecer agora
    let camposVisiveis = CAMPOS; //começa mostrando todos os campos

    if(aba === 0){
        camposVisiveis = CAMPOS.filter((campo) => campo.obrigatorio);
    }



    //faixa verde de dica em cima do cadastro rápido
    let dica = null;
    if(aba === 0){
         dica = (
      <Alert severity="success" sx={{ mb: 2 }}>
        Você poderá completar os dados depois.
      </Alert>);
    }

    let aviso = null;

    if(erro){
         aviso = (
      <Alert severity="error" sx={{ mb: 2 }}>
        {erro}
      </Alert>
    );
    }


      let abas = null;

    // Se não tem cliente (!cliente), é cadastro novo e as abas "Cadastro rápido" e "Cadastro completo" são montadas porque elas servem pra cadastrar um cliente novo,
    // Se tem cliente, "abas" continua null porque é edição então elas não devem aparecer e o {abas} do return não mostra nada.
      if (!cliente) {
      abas = (
        <Tabs
          value={aba}
          onChange={(evento, novaAba) => setAba(novaAba)}
           variant="fullWidth" 
          sx={{
            mb: 3,
            "& .MuiTabs-indicator": { backgroundColor: VERDE },
            "& .MuiTab-root.Mui-selected": { color: VERDE },
          }}
        >
          <Tab label="Cadastro rápido" />
          <Tab label="Cadastro completo" />
        </Tabs>
      );
    }

    // Texto da tela conforme o modo: cadastro novo ou edição.
    let titulo = "Novo cliente";
    let textoBotao = "Salvar";

    if (cliente) {
      titulo = "Editar cliente";
      textoBotao = "Salvar alterações";
    }














    return (

        <Box>
      {/* Cabeçalho */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="overline" color="text.secondary">
          Floricultura Ugolini
        </Typography>
        <Typography variant="h4" component="h1" sx={{ color: VERDE }}>
           {titulo}  {/* Se clicou em novo cliente  mostra NOVO CLIENTE se clicou em editar mostra EDITAR CLIENTE*/}
        </Typography>
        <Typography color="text.secondary">
          Cadastre os dados do cliente para agilizar os próximos pedidos.
        </Typography>
      </Box>


        {/* Cartão branco */}
      <Box
        sx={{
          bgcolor: "white",
          border: "1px solid #ddd",
          borderRadius: 2,
          p: { xs: 2, sm: 3 },
        }}
      >
 

        {/* mostra oq tiver guardado nessas variaveis */}
        {abas} 
        {dica}
        {aviso}


        {/* Grade de 2 colunas que em tela pequena vira 1 coluna: xs = celular, md = tela média) */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2,
          }}
        >

           {/* map percorre camposVisiveis e desenha um TextField para cada campo. */}
          {camposVisiveis.map((campo) => (
            <TextField
              key={campo.name}    //identificador único
              name={campo.name}    //nome do campo
              label={campo.label}     // texto em cima do campo
              value={dados[campo.name]}   // o que está escrito nele agora
              onChange={mudarCampo}      // a cada tecla, atualiza o dados
              required={campo.obrigatorio}   //mostrar * nos obrigatórios
              fullWidth
            />
          ))}
        </Box>

        {/* Botões */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 3 }}>
          <Button onClick={aoCancelar} sx={{ color: VERDE }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={salvar}
            disabled={salvando}  // Desativa o botão enquanto está salvando a fim de evitar vários cliques
            sx={{ bgcolor: VERDE }}
          >
           {textoBotao}   {/* se for pra novo cliente aparece SALVAR e para editar SALVAR ALTERAÇÕES */}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default FormularioCliente;
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { useState } from "react";
import axios from "axios";

// onLogin: função do App, chamada quando o login dá certo
export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [textoMensagem, setTextoMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("success");

  // Roda quando a pessoa clica em "Entrar"
  async function enviaLogin(event) {
    event.preventDefault();
    try {
      const response = await axios.post("/auth/login", { email, senha });

      localStorage.setItem("token", response.data.token); // Guarda o token no navegador para a pessoa continuar logada ao recarregar a página

      onLogin();
    } catch (error) {
      if (error.response) {
        // Se o back respondeu com erro mostra a mensagem dele ou uma fixa
        setTextoMensagem(
          error.response.data?.erro ||
            "Não foi possível fazer login. Tente novamente.",
        );
      } else {
        setTextoMensagem(
          "Não foi possível conectar ao servidor. Tente novamente.",
        ); // Se o back não respondeu, mensagem fixa
      }
      setTipoMensagem("error");
    }
  }



  // Roda quando a pessoa clica em "Cancelar"
  function cancelaLogin() {
    setEmail("");
    setSenha("");
    setTextoMensagem("Login cancelado!"); // Mensagem que aparece no aviso
    setTipoMensagem("warning"); // Aviso amarelo (error = vermelho, success = verde)
  }


  
  return (
    <div className="login-pagina">
      <form className="login-form" onSubmit={enviaLogin}>
        <h1>Login</h1>
        <div>
          <input
            required
            type="email"
            placeholder="E-mail"
            value={email}
            // A cada letra digitada, atualiza o estado
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div>
          <input
            required
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
          />
        </div>
        <div>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: "#2f5a45",
              "&:hover": { backgroundColor: "#264a39" },
            }}
          >
            Entrar
          </Button>
          <Button
            type="button"
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: "#5b9074",
              "&:hover": { backgroundColor: "#3f7056" },
            }}
            onClick={cancelaLogin}
          >
            Cancelar
          </Button>
        </div>
        {textoMensagem && (
          <Alert severity={tipoMensagem} sx={{ mt: 2 }}>
            {textoMensagem}
          </Alert>
        )}
      </form>
    </div>
  );
}

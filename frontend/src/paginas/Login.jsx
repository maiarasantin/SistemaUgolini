import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import { useState } from "react";
import axios from "axios";

// onLogin  É a função que avisa "login deu certo".
export default function Login({ onLogin }) {
    
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [textoMensagem, setTextoMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("success");

    // Roda quando a pessoa clica em "Entrar".
    async function enviaLogin(event) {
       
        event.preventDefault();
        try {
            
            const response = await axios.post("/auth/login", { email, senha });
            
            localStorage.setItem("token", response.data.token); //Lê-se: “guarde, com o nome token, o token que o back me devolveu”.
           
            onLogin();
        } catch (error) {
    
            if (error.response) {
                setTextoMensagem(error.response.data?.erro || "Não foi possível fazer login. Tente novamente.");
        // o back respondeu com erro: mostra a mensagem dele
        setTextoMensagem(error.response.data.erro);
    } else {
        // o back não respondeu: mensagem fixa
        setTextoMensagem("Não foi possível conectar ao servidor. Tente novamente.");
    }
    setTipoMensagem("error");
}
    }

    // Roda quando a pessoa clica em "Cancelar".
    function cancelaLogin() {
       
        setEmail("");
        setSenha("");
        setTextoMensagem("Login cancelado!"); //GUARDA O TEXTO QUE A PESSOA VAI LER
        setTipoMensagem("warning");   //GUARDA A ETIQUETA USADA PRA ESCOLHER A COR
    }

    //o que aparece na tela
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
                    // A cada letra digitada, atualiza o estado.
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
            <Button type="submit" variant="contained" fullWidth 
            sx={{
                 mt: 2,
                backgroundColor: "#2f5a45",
        "       &:hover": { backgroundColor: "#264a39" },
                }} >Entrar</Button>
                <Button
            type="button" variant="contained" fullWidth 
    sx={{
        mt: 2,
         backgroundColor: "#5b9074",
        "&:hover": { backgroundColor: "#3f7056" },
    }}
    onClick={cancelaLogin}
>Cancelar</Button>
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
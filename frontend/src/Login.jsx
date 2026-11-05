// useState: guarda o que a pessoa digita e as mensagens da tela.
import { useState } from "react";
// axios: faz a chamada ao back (a URL base já foi configurada no App.jsx).
import axios from "axios";

// onLogin vem do App (por props). É a função que avisa "login deu certo".
export default function Login({ onLogin }) {
    // O que a pessoa digitou nos dois campos.
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    // Texto da mensagem na tela e o tipo dela (success, error, warning).
    const [messageText, setMessageText] = useState("");
    const [messageSeverity, setMessageSeverity] = useState("success");

    // Roda quando a pessoa clica em "Entrar".
    async function enviaLogin(event) {
        // Impede o navegador de recarregar a página ao enviar o formulário.
        event.preventDefault();
        try {
            // Manda e-mail e senha pro back e ESPERA a resposta (await).
            const response = await axios.post("/auth/login", { email, senha });
            // Deu certo: guarda o token no navegador...
            localStorage.setItem("token", response.data.token);
            // ...e avisa o App que o login foi feito.
            onLogin();
        } catch (error) {
            // Deu errado. Se o back respondeu com {erro: "..."}, mostra essa mensagem
            // (ex.: "Credenciais inválidas"). O "?." evita quebrar se não houver resposta.
            const mensagemDoBack = error.response?.data?.erro;
            // Se o back nem respondeu (fora do ar), mostra uma mensagem amigável.
            setMessageText(
                mensagemDoBack || "Não foi possível conectar ao servidor. Tente novamente.",
            );
            setMessageSeverity("error");
        }
    }

    // Roda quando a pessoa clica em "Cancelar".
    function cancelaLogin() {
        // Limpa os campos.
        setEmail("");
        setSenha("");
        // Mostra um aviso.
        setMessageText("Login cancelado!");
        setMessageSeverity("warning");
    }

    return (
        // onSubmit: ao enviar o formulário (Enter ou botão), chama enviaLogin.
        <form onSubmit={enviaLogin}>
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
                <button type="submit">Entrar</button>
                <button type="button" onClick={cancelaLogin}>
                    Cancelar
                </button>
            </div>
            {/* Só mostra o parágrafo se existir mensagem. A classe define a cor. */}
            {messageText && <p className={messageSeverity}>{messageText}</p>}
        </form>
    );
}
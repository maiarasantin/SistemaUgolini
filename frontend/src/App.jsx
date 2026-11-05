// useState: "memória" do componente (guarda se está logado ou não).
import { useState } from "react";
// axios: biblioteca que faz as chamadas HTTP para o back-end.
import axios from "axios";
// Traz a tela de login, que vamos criar no outro arquivo.
import Login from "./Login";

// Endereço do back, lido do arquivo .env (VITE_API_URL=http://localhost:3010).
// Configurado UMA vez aqui; nas telas basta escrever "/auth/login".
axios.defaults.baseURL = import.meta.env.VITE_API_URL;

// Todas as chamadas enviam e recebem JSON.
axios.defaults.headers.common["Content-Type"] = "application/json;charset=utf-8";

// Coloca (ou tira) o token no cabeçalho de TODAS as chamadas seguintes.
function aplicarToken(token) {
    if (token) {
        // Com token: manda "Authorization: Bearer <token>" (a "pulseira").
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        // Sem token (logout): remove o cabeçalho.
        delete axios.defaults.headers.common["Authorization"];
    }
}

export default function App() {
    // isLoggedIn = está logada? (true/false). setIsLoggedIn muda esse valor.
    // A função dentro do useState roda SÓ na primeira vez que a tela abre.
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        // Procura um token guardado no navegador (de um login anterior).
        const token = localStorage.getItem("token");
        // Se achou, já coloca no cabeçalho do axios.
        aplicarToken(token);
        // Boolean(token): tem token = true, não tem = false.
        return Boolean(token);
    });

    // Chamada pelo Login quando o login dá certo.
    function handleLogin() {
        // Pega o token que o Login guardou e coloca no cabeçalho.
        aplicarToken(localStorage.getItem("token"));
        // Muda o estado: a tela passa a mostrar o sistema.
        setIsLoggedIn(true);
    }

    // Chamada ao clicar em "Sair".
    function handleLogout() {
        // Apaga o token guardado no navegador.
        localStorage.removeItem("token");
        // Tira o token do cabeçalho.
        aplicarToken(null);
        // Volta pra tela de login.
        setIsLoggedIn(false);
    }

    // Não está logada? Mostra só o login, e passa handleLogin pra ele avisar quando der certo.
    if (!isLoggedIn) {
        return <Login onLogin={handleLogin} />;
    }

    // Está logada: por enquanto uma tela provisória (depois vira o sistema de verdade).
    return (
        <>
            <h1>Sistema Ugolini</h1>
            <p>Você está logada!</p>
            <button type="button" onClick={handleLogout}>
                Sair
            </button>
        </>
    );
}
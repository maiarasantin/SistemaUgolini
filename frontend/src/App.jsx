import { useState } from "react";
import axios from "axios";
import Login from "./paginas/Login";
import Inicio from "./paginas/Inicio";
import Clientes from "./paginas/Clientes";




axios.defaults.baseURL = import.meta.env.VITE_API_URL;

axios.defaults.headers.common["Content-Type"] = "application/json;charset=utf-8";

// Coloca (ou tira) o token no cabeçalho de TODAS as chamadas seguintes.
function aplicarToken(token) {
    if (token) {
        
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;  // Com token: manda "Authorization: Bearer <token>" (a "pulseira").
    } else {
       
        delete axios.defaults.headers.common["Authorization"];    // Sem token (logout): remove o cabeçalho.
    }
}

export default function App() {
    
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
       
        const token = localStorage.getItem("token");
        
        aplicarToken(token);
       
        return Boolean(token);
    });

    const [paginaAtual, setPaginaAtual] = useState("inicio");
    
    function handleLogin() {
       
        aplicarToken(localStorage.getItem("token"));
        
        setIsLoggedIn(true);
    }

    // Chamada ao clicar em "Sair".
    function handleLogout() {
        
        localStorage.removeItem("token");  // Apaga o token guardado no navegador.
        
        aplicarToken(null);
        
        setIsLoggedIn(false);  // Volta pra tela de login.
    }

    
    if (!isLoggedIn) {
        return <Login onLogin={handleLogin} />;  // Não está logada? Mostra só o login, e passa handleLogin pra ele avisar quando der certo.
    }

    
    return (
     
    <>
        <button type="button" onClick={() => setPaginaAtual("inicio")}>Início</button>
        <button type="button" onClick={() => setPaginaAtual("clientes")}>Clientes</button>
        <button type="button" onClick={handleLogout}>Sair</button>

        {paginaAtual === "inicio" && <Inicio />}
        {paginaAtual === "clientes" && <Clientes />}
    </>
);
    
}
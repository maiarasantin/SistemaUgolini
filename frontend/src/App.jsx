import { useState } from "react";
import axios from "axios";
import Login from "./paginas/Login";
import Inicio from "./paginas/Inicio";
import Clientes from "./paginas/Clientes";
import Box from "@mui/material/Box";
import MenuLateral from "./componentes/MenuLateral";




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

    const [paginaAtual, setPaginaAtual] = useState("catalogo");
    
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
    <Box sx={{ display: "flex" }}>
        <MenuLateral paginaAtual={paginaAtual} aoSelecionar={setPaginaAtual} />

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            {/* Botão temporário: no passo 3 vai pra barra superior */}
            <button type="button" onClick={handleLogout}>Sair</button>

           {paginaAtual === "catalogo" && <Inicio />}
           {paginaAtual === "clientes" && <Clientes />}
        </Box>
    </Box>
    );
}
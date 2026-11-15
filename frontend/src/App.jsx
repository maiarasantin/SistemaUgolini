import { useState, useEffect } from "react";
import axios from "axios";
import Login from "./paginas/Login";
import Inicio from "./paginas/Inicio";
import Clientes from "./paginas/Clientes";
import Categorias from "./paginas/Categorias"; 
import Box from "@mui/material/Box";
import MenuLateral from "./componentes/MenuLateral";
import BarraSuperior from "./componentes/BarraSuperior";
import { ITENS } from "./componentes/itensMenu";




axios.defaults.baseURL = import.meta.env.VITE_API_URL;

axios.defaults.headers.common["Content-Type"] = "application/json;charset=utf-8";

// Coloca ou tira o token no cabeçalho de TODAS as chamadas seguintes
function aplicarToken(token) {
    if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;  // Com token: manda "Authorization: Bearer <token>" 
    } else {
        delete axios.defaults.headers.common["Authorization"];    // Sem token (logout): remove o cabeçalho
    }
}

export default function App() {
    
    const [usuario, setUsuario] = useState(null);
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
        setUsuario(null);   
        setIsLoggedIn(false);  // Volta pra tela de login.
    }




      // Quando a pessoa está logada, pergunta ao back quem ela é
    // Roda no login e também ao recarregar a página 
    useEffect(() => {
        // Sem login não tem o que buscar
        if (!isLoggedIn) {
            return;
        }

        async function buscarPerfil() {
            try {
                const resposta = await axios.get("/auth/perfil");
                setUsuario(resposta.data); // guarda nome, perfil e tal

                // Cada perfil começa em uma página que ele pode ver
                if (resposta.data.perfil === "admin") {
                    setPaginaAtual("entradaDeEstoque");
                } else {
                    setPaginaAtual("catalogo");
                }
            } catch (error) {
                localStorage.removeItem("token"); // Token inválido ou expirado: volta para o login
                aplicarToken(null);
                setIsLoggedIn(false);
            }
        }

        buscarPerfil();
    }, [isLoggedIn]); // roda quando isLoggedIn muda (login ou logout)
    

    
    if (!isLoggedIn) {
        return <Login onLogin={handleLogin} />;  // Não está logada? Mostra só o login, e passa handleLogin pra ele avisar quando der certo.
    }


      // Está logada, mas o back-end ainda não respondeu quem ela é: espera.
    if (usuario === null) {
        return <Box sx={{ p: 3 }}>Carregando...</Box>;
    }

    const itemAtual = ITENS.find((item) => item.id === paginaAtual);// .find percorre ITENS e devolve o PRIMEIRO item cujo id é igual à página aberta.

    let tituloPagina = "";

    if (itemAtual) {
        tituloPagina = itemAtual.texto;//isso aqui serve para a barra superior
    }  
    






    return (
    <Box sx={{ display: "flex" }}>
        <MenuLateral paginaAtual={paginaAtual} 
        aoSelecionar={setPaginaAtual} 
        perfil={usuario.perfil}/>

       {/* Lado direito: ocupa o resto da largura. Barra em cima, conteúdo embaixo. */}
        <Box sx={{ flexGrow: 1 }}>
            <BarraSuperior aoSair={handleLogout} tituloPagina={tituloPagina} />

            <Box component="main" sx={{ p: 3 }}>
                {paginaAtual === "catalogo" && <Inicio />}
                {paginaAtual === "clientes" && <Clientes />}
                {paginaAtual === "categorias" && <Categorias />}
            </Box>
        </Box>
    </Box>
    );
}
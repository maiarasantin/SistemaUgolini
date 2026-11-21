import { useState, useEffect } from "react";
import axios from "axios";
import Login from "./paginas/Login";
import Clientes from "./paginas/Clientes";
import Categorias from "./paginas/Categorias"; 
import Catalogo from "./paginas/Catalogo";
import Vendedores from "./paginas/Vendedores";
import Box from "@mui/material/Box";
import MenuLateral from "./componentes/MenuLateral";
import BarraSuperior from "./componentes/BarraSuperior";
import { ITENS } from "./componentes/itensMenu";



// ------------------------ CONFIGURAÇÃO DO AXIOS ------------------------

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









// ------------------------ COMPONENTE ------------------------

export default function App() {
    
    const [usuario, setUsuario] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
       
        const token = localStorage.getItem("token");
        
        aplicarToken(token);
       
        return Boolean(token); // Devolve se existe token ou não
    });

    const [paginaAtual, setPaginaAtual] = useState("catalogo");

        
    const [menuAberto, setMenuAberto] = useState(false); // Se o menu lateral está aberto no caso de celular (responsividade)
    

    








    // ------------------------ FUNÇÕES ------------------------

    function handleLogin() {
       
        aplicarToken(localStorage.getItem("token"));
        setIsLoggedIn(true);
    }


    
    function handleLogout() {
        localStorage.removeItem("token");  // Apaga o token guardado no navegador
        aplicarToken(null); // Tira o token do axios
        setUsuario(null);    // esquece quem estava logado
        setIsLoggedIn(false);  // Volta pra tela de login.
    }






    // ------------------------ DESCOBRIR QUEM LOGOU ------------------------

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
                    setPaginaAtual("vendedores");
                } else {
                    setPaginaAtual("catalogo");
                }
            } catch {
                localStorage.removeItem("token"); // Apaga o token
                aplicarToken(null); // Tira o token do axios
                setIsLoggedIn(false);  
            }
        }

        buscarPerfil();
    }, [isLoggedIn]); // roda quando isLoggedIn muda (login ou logout)
    

    










    // ------------------------ DECISÕES DE TELA ------------------------

    if (!isLoggedIn) {
        return <Login onLogin={handleLogin} />;  // Se não está logada mostra só o login e passa a prop para o Login
    }


      // Está logada, mas o back-end ainda não respondeu quem ela é então espera.
    if (usuario === null) {
        return <Box sx={{ p: 3 }}>Carregando...</Box>;
    }

    const itemAtual = ITENS.find((item) => item.id === paginaAtual);// .find percorre ITENS e devolve o PRIMEIRO item cujo id é igual à página aberta

    let tituloPagina = "";

    if (itemAtual) {
        tituloPagina = itemAtual.texto; // Isso aqui serve para a barra superior
    }  
    






    return (
    <Box sx={{ display: "flex" }}>
        <MenuLateral paginaAtual={paginaAtual} 
        aoSelecionar={setPaginaAtual} 
        perfil={usuario.perfil}
        aberto={menuAberto} // Responsividade do menu
        aoFechar={() => setMenuAberto(false)}/> {/*fechar a barra do menu*/}

       {/* Lado direito: Barra em cima e o conteúdo embaixo */}
        <Box sx={{ flexGrow: 1 , minWidth: 0 }}>
            <BarraSuperior 
             aoSair={handleLogout}
             tituloPagina={tituloPagina} 
             usuario={usuario} 
             aoAbrirMenu={() => setMenuAberto(true)}  /> {/*abrir a barra do menu em celulares*/}

            <Box component="main" sx={{ p: 3 }}>
                {paginaAtual === "catalogo" && <Catalogo />}
                {paginaAtual === "clientes" && <Clientes />}
                {paginaAtual === "categorias" && <Categorias />}
                {paginaAtual === "vendedores" && <Vendedores />}
            </Box>
        </Box>
    </Box>
    );
}
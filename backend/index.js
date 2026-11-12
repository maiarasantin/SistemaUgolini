// Lê o arquivo .env e deixa as variáveis disponíveis em process.env.
require("dotenv").config();
const clientesRouter = require("./Clientes/clientes.router");
const express = require("express");
const cors = require("cors");

// Traz o Passport (usado só pra iniciar a autenticação, logo abaixo).
const passport = require("passport");

// Traz a função que ensina o Passport a ler tokens JWT.
const { configureJwtStrategy ,requirePerfil} = require("./Auth/auth.config");
const authRouter = require("./Auth/auth.router");

const categoriasRoutes = require("./Categorias/categorias.router");
const subcategoriaRoutes = require("./Subcategorias/subcategorias.router");
const pedidoRoutes = require("./Pedidos/pedidos.router");



const app = express();
const PORT = process.env.PORT || 3010;

app.use(cors());
app.use(express.json());



// Registra a estratégia JWT no Passport (ensina a ler o token).
// Sem esta linha, o Passport não sabe validar nada.
configureJwtStrategy();

// Inicia o Passport no servidor.
app.use(passport.initialize());

// Protege categorias e subcategorias: sem token válido, retorna 401.
app.use("/categorias", requirePerfil("admin", "vendedor"));
app.use("/subcategorias", requirePerfil("admin", "vendedor"));
app.use("/pedidos", requirePerfil("admin", "vendedor"));

app.use(categoriasRoutes);
app.use(subcategoriaRoutes);
app.use(pedidoRoutes);

app.use("/auth", authRouter);
app.use("/clientes", clientesRouter);

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
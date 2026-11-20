// Lê o arquivo .env e deixa as variáveis disponíveis em process.env.
require("dotenv").config();
const clientesRouter = require("./Clientes/clientes.router");
const express = require("express");
const cors = require("cors");

// Traz o Passport (usado só pra iniciar a autenticação).
const passport = require("passport");

// Traz a função que ensina o Passport a ler tokens JWT
const { configureJwtStrategy } = require("./Auth/auth.config");
const authRouter = require("./Auth/auth.router");

const categoriasRouter = require("./Categorias/categorias.router");

const subcategoriasRouter = require("./Subcategorias/subcategorias.router");
const funcionariosRouter = require("./Funcionarios/funcionarios.router");
const produtosRouter = require("./Produtos/produtos.router");

const app = express();
const PORT = process.env.PORT || 3010;

app.use(cors());
app.use(express.json());

// Registra a estratégia JWT no Passport (ensina a ler o token).
// Sem isso o Passport não sabe validar nada
configureJwtStrategy();

// Inicia o Passport no servidor.
app.use(passport.initialize());

app.use("/auth", authRouter);
app.use("/clientes", clientesRouter);
app.use("/categorias", categoriasRouter);

app.use("/subcategorias", subcategoriasRouter);
app.use("/funcionarios", funcionariosRouter);
app.use("/produtos", produtosRouter);

// Para rota que não existe
app.use((req, res) => {
  res.status(404).json({ erro: "Rota não encontrada." });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

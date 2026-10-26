const database = require("./database");
const express = require('express');


const app = express();


app.use(express.json());

const PORTA = 3000;


const produtosRouter = require('./Produtos/produtos-router')


const clientesRouter = require('./Clientes/clientes-router')




app.listen(PORTA, () => {
  console.log(`Servidor rodando na porta ${PORTA}`);
});


app.use('/api/produtos', produtosRouter);


app.use('/api/clientes', clientesRouter);
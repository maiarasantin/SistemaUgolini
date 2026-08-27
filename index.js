// Importa o framework Express para criar a aplicação/servidors
const express = require('express');

// Inicializa a aplicação Express
const app = express();

// Configura o Express para entender e processar dados enviados no formato JSON
app.use(express.json());

const PORTA = 3000;

// Importa o arquivo de rotas que você criou dentro da pasta 'Produtos'
const produtosRouter = require('./Produtos/produtos-router')

// Importa o arquivo de rotas que você criou dentro da pasta 'Clintes'
const clientesRouter = require('./Clientes/clientes-router')



// Inicia o servidor e exibe uma mensagem no terminal informando a porta ativa
app.listen(PORTA, () => {
  console.log(`Servidor rodando na porta ${PORTA}`);
});

// Registra a rota: qualquer requisição para '/api/produtos' será enviada para o produtosRouter
app.use('/api/produtos', produtosRouter);

// 2. Registra o novo módulo no servidor
app.use('/api/clientes', clientesRouter);
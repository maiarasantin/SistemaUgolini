# Sistema Ugolini

Sistema para o gerenciamento de uma floricultura, permitindo o controle de produtos, clientes, funcionários, pedidos e estoque.
O projeto foi desenvolvido como Trabalho Integrador do componente curricular Desenvolvimento de Sistema Web, do curso de Ciência da Computação da Universidade Federal da Fronteira Sul (UFFS).

## Tecnologias utilizadas

### Frontend
React | JavaScript | Material UI | Axios | Vite

### Backend
Node.js | Express | Sequelize | PostgreSQL | JWT (JSON Web Token) | Bcrypt | Superbase

## Configuração do banco de dados
O projeto disponibiliza dois scripts SQL para preparar o banco de dados (em SistemaUgolini/database):
- criar_tabelas.sql: contém os comandos para a criação das tabelas, relacionamentos e restrições do banco de dados.
- dados_iniciais.sql: contém os comandos para inserir os dados iniciais necessários para utilização do sistema.
Execute os scripts na seguinte ordem:

1. Execute criar_tabelas.sql no banco de dados;
2. Execute dados_iniciais.sql para inserir os dados iniciais.
Os scripts podem ser executados pelo SQL Editor do Superbase ou por uma ferramenta de gerenciamento PostgreSQL.

## Instalação das dependências
Após clonar ou baixar o repositório, acesse a pasta principal do projeto e execute:
  ```bash
  npm install
  ```
Em seguida, instale as dependências do frontend:
  ```bash
  cd frontend
  npm install
  ```

## Executando o projeto
Para executar a aplicação, é necessário iniciar o backend e o frontend separadamente.
1. Backend
   Na pasta principal do projeto, execute:
   ```bash
   npm run dev
   ```
2. Frontend
   Abra outro terminal, acesse a pasta frontend e execute:
   ```bash
   yarn dev
   ```
   O Vite disponibilizará o endereço local para acessar a aplicação pelo navegador.

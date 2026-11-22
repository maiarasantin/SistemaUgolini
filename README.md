# Sistema Ugolini

Sistema para o gerenciamento de uma floricultura, permitindo o controle de produtos, clientes, funcionários, pedidos e estoque.

O projeto foi desenvolvido como Trabalho Integrador do componente curricular Desenvolvimento de Sistemas Web, do curso de Ciência da Computação da Universidade Federal da Fronteira Sul (UFFS).




## Tecnologias utilizadas

### Frontend
React | JavaScript | Material UI | Axios | Vite

### Backend
Node.js | Express | Sequelize | PostgreSQL | JWT (JSON Web Token) | Bcrypt | Supabase




## Bibliotecas necessárias

As bibliotecas são instaladas automaticamente pelo yarn install ou pelo npm install, descrito mais abaixo. A lista completa, com as versões, está nos arquivos package.json.

- **Backend, em `package.json` da pasta principal:** express, sequelize, pg, pg-hstore, bcrypt, jsonwebtoken, passport, passport-jwt, passport-local, cors, dotenv, multer e @supabase/supabase-js. Para desenvolvimento, nodemon.
- **Frontend, em `frontend/package.json`:** react, react-dom, @mui/material, @mui/icons-material, @emotion/react, @emotion/styled e axios. Para desenvolvimento, vite.

É necessário ter o Node.js instalado e um banco PostgreSQL, que pode ser o do Supabase ou um instalado no computador.




## Configuração do banco de dados
O projeto disponibiliza dois scripts SQL para preparar o banco de dados, em SistemaUgolini/scripts:
- criar_tabelas.sql: contém os comandos para a criação das tabelas, relacionamentos e restrições do banco de dados.
- dados_iniciais.sql: contém os comandos para inserir os dados iniciais necessários para utilização do sistema.

Em um banco PostgreSQL vazio, execute os scripts na seguinte ordem:

1. Execute criar_tabelas.sql no banco de dados;
2. Execute dados_iniciais.sql para inserir os dados iniciais.

Os scripts podem ser executados pelo SQL Editor do Supabase ou por uma ferramenta de gerenciamento PostgreSQL.




## Configuração das variáveis de ambiente
O sistema usa dois arquivos `.env`, que não são enviados ao repositório. Para cada um existe um modelo chamado `.env.example`.

1. Backend: na pasta principal, copie o modelo e preencha com os dados do seu banco.
   ```bash
   cp .env.example .env
   ```
   - `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST` e `DB_PORT`: dados de conexão do banco.
   - `DB_SSL`: `true` para o Supabase e `false` para um banco instalado no computador.
   - `JWT_SECRET`: um texto longo e aleatório, conhecido só pelo servidor.
   - `JWT_EXPIRES_IN`: validade do token, por exemplo `1h`.
   - `PORT`: porta do servidor, por exemplo `3010`.
   - `SUPABASE_URL`, `SUPABASE_SECRET_KEY` e `SUPABASE_BUCKET_PRODUTOS`: usadas apenas no envio das fotos dos produtos. Sem elas o sistema funciona, mas sem o envio de fotos. O bucket precisa ser público.
2. Frontend: na pasta frontend, copie o modelo. Ele tem uma variável, `VITE_API_URL`, com o endereço do backend, que deve usar a mesma porta do `PORT`.
   ```bash
   cd frontend
   cp .env.example .env
   ```




## Instalação das dependências
Após clonar ou baixar o repositório, acesse a pasta principal do projeto e execute:
  ```bash
  yarn install
  ```
Em seguida, instale as dependências do frontend:
  ```bash
  cd frontend
  yarn install
  ```
Se você não tiver o Yarn, pode usar `npm install` nos dois lugares, no lugar de `yarn install`.




## Executando o projeto
Para executar a aplicação, é necessário iniciar o backend e o frontend separadamente.
1. Backend
   Na pasta principal do projeto, execute:
   ```bash
   yarn dev
   ```
2. Frontend
   Abra outro terminal, acesse a pasta frontend e execute:
   ```bash
   yarn dev
   ```
   O Vite disponibilizará o endereço local para acessar a aplicação pelo navegador.

Com `npm`, os comandos equivalentes são `npm run dev`.




## Acessando o sistema
Os dados iniciais criam dois usuários para teste. Em uso real, troque as senhas.

| Perfil | E-mail | Senha |
|---|---|---|
| Administrador | admin@ugolini.com | Admin@2026 |
| Vendedor | vendedor@ugolini.com | Vendedor@2026 |
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authRepository = require("./auth.repository");

const { criarErro } = require("../utils/erros");
const { limparTexto } = require("../utils/validacoes");

const SALT_ROUNDS = 12;

// Hash de mentira, pra demorar o mesmo tempo quando o email não existe
const HASH_FICTICIO = bcrypt.hashSync("senha-ficticia", SALT_ROUNDS);


async function autenticarFuncionario(emailRecebido, senha) {
  // Só aceita texto. Se vier número, objeto ou lista, recusa antes de usar
  if (typeof emailRecebido !== "string" || typeof senha !== "string") {
    throw criarErro(400, "E-mail e senha são obrigatórios.");
  }

  // Tira espaços do começo e do fim do e-mail
  const email = limparTexto(emailRecebido);

  if (email === "" || senha === "") {
    throw criarErro(400, "E-mail e senha são obrigatórios.");
  }

  const funcionario = await authRepository.buscarPorEmail(email);

  // Compara sempre, mesmo sem funcionário pra não revelar se o e-mail existe
  const senhaValida = await bcrypt.compare(
    senha,
    funcionario ? funcionario.senha : HASH_FICTICIO,
  );

  //Se não achou o email, a senha não bate ou está inativo é enviado a mesma mensagem para não dar dicas a quem tentar adivinhar
  if (!funcionario || !senhaValida || !funcionario.status) {
    throw criarErro(401, "Credenciais inválidas.");
  }

  return funcionario;
}




// Cria o token JWT do funcionário e vence depois do prazo definido (1 hora se o .env não disser)
function gerarToken(funcionario) {
  return jwt.sign(
    { id: funcionario.id, role: funcionario.eAdmin ? "admin" : "vendedor" },
    process.env.JWT_SECRET,
    { algorithm: "HS256", expiresIn: process.env.JWT_EXPIRES_IN || "1h" },
  );
}

module.exports = { autenticarFuncionario, gerarToken };

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authRepository = require("./auth.repository");

const SALT_ROUNDS = 12;

// Hash de mentira, usado quando o e-mail não existe, pra demorar o mesmo tempo
const HASH_FICTICIO = bcrypt.hashSync("senha-ficticia", SALT_ROUNDS);

function criarErro(status, mensagem) {
    const erro = new Error(mensagem);
    erro.status = status;
    return erro;
}

async function autenticarFuncionario(email, senha) {
    if (!email || !senha) {
        throw criarErro(400, "E-mail e senha são obrigatórios.");
    }

    const funcionario = await authRepository.buscarPorEmail(email);

    // compara SEMPRE, mesmo sem funcionário, pra não revelar se o e-mail existe
    const senhaValida = await bcrypt.compare(
        senha,
        funcionario ? funcionario.senha : HASH_FICTICIO,
    );

    if (!funcionario || !senhaValida || !funcionario.status) {
        throw criarErro(401, "Credenciais inválidas");
    }

    return funcionario;
}

async function registrarFuncionario(dados) {
    const { cpf, nome, telefone, email, dataContratacao, senha } = dados;

    if (!cpf || !nome || !telefone || !email || !dataContratacao || !senha) {
        throw criarErro(400, "Preencha todos os campos obrigatórios.");
    }
    if (senha.length < 8) {
        throw criarErro(400, "A senha deve ter pelo menos 8 caracteres.");
    }
    if (await authRepository.buscarPorEmail(email)) {
        throw criarErro(409, "E-mail já cadastrado.");
    }

    const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);

    // eAdmin NÃO vem do body: quem se cadastra nunca nasce admin
    const funcionario = await authRepository.criar({
        cpf, nome, telefone, email, dataContratacao, senha: senhaHash,
    });

    return { id: funcionario.id, nome: funcionario.nome, email: funcionario.email };
}

function gerarToken(funcionario) {
    return jwt.sign(
        { id: funcionario.id, role: funcionario.eAdmin ? "admin" : "vendedor" },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "1h" },
    );
}

module.exports = { autenticarFuncionario, registrarFuncionario, gerarToken };
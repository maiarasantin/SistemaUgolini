const authService = require("./auth.service");


function responderErro( res, erro){
    if(erro.status){
        return res.status(erro.status).json({erro: erro.message});
    }

    
    console.error(erro); //mensagem no terminal para saber qual foi o erro
    return res.status(500).json({erro: "Erro interno do servidor."});
}

async function login (req, res) {
    try{
         const { email, senha } = req.body;

         const funcionario = await authService.autenticarFuncionario(email, senha);

         const token = authService.gerarToken(funcionario);
         return res.status(200).json({token : token});
        
        
        } catch (erro){
            return responderErro(res, erro);
        }
}

async function registrar(req, res) {
    try {
        const funcionario = await authService.registrarFuncionario(req.body);
        return res.status(201).json({
            mensagem: "Funcionário cadastrado com sucesso.",
            funcionario: funcionario,
        });
    } catch (erro) {
        return responderErro(res, erro);
    }
}



// =====================================================================
// perfil
// Responde "quem sou eu?" para quem está logado (GET /auth/perfil).
// Só roda depois que o requireJWTAuth aprovou o token.
// =====================================================================
async function perfil(req, res) {
    // Tira da ficha do funcionário (req.user) só os campos que vamos mostrar.
    // O req.user foi preenchido pelo requireJWTAuth.
    // Repara que a senha NÃO é pega, então nunca sai na resposta.
    const { id, nome, email, eAdmin } = req.user;
    return res.status(200).json({
        id,
        nome,
        email,
        perfil: eAdmin ? "admin" : "vendedor",
    });
}

module.exports = {login, registrar, perfil };
const authService = require("./auth.service");
const { responderErro } = require("../utils/erros");



// Confere e-mail e senha e devolve o token
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





// Devolve os dados de quem está logado para o front saber quem entrou e o que mostrar
async function perfil(req, res) {
    
    // O req.user foi preenchido pelo requireJWTAuth
    // A senha não é pega, por isso nunca sai na resposta
    const { id, nome, email, eAdmin } = req.user;
    return res.status(200).json({
        id,
        nome,
        email,
        perfil: eAdmin ? "admin" : "vendedor",
    });
}

module.exports = {login, perfil };
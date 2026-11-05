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
        return res.status(201).json({funcionario: funcionario});
    } catch (erro) {
        return responderErro(res, erro);
    }
}

module.exports = {login, registrar};
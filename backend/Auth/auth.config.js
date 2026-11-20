const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const authRepository = require("./auth.repository");



// Configura o Passport para ler o token JWT do cabeçalho Authorization,
// conferir a assinatura e a validade, e buscar no banco o funcionário dono do token.
// Deve ser chamada uma única vez no index.js, quando o servidor liga.
const configureJwtStrategy = () => {
      // Registra no Passport a regra "como autenticar com JWT"
    passport.use(
        new JwtStrategy(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKey: process.env.JWT_SECRET,
                algorithms: ["HS256"],
            },
            async (payload, done) => {
                try {
                    // Busca no banco o funcionário dono desse id
                    const funcionario = await authRepository.buscarPorId(payload.id);  

                    if (funcionario && funcionario.status) {
                        done(null, funcionario);
                    } else {
                        // Não existe ou está inativo: recusa 
                        done(null, false);
                    }
                } catch (error) {
                     // Deu problema no banco: avisa que foi erro
                    done(error, false);
                }
            },
        ),
    );
};

// Middleware para autenticação JWT
const requireJWTAuth = (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (erro, funcionario, info) => {
        //Se deu erro técnico manda para o tratador de erros
        if (erro) {
            return next(erro);
        }
        if (!funcionario) {
            const expirado = info?.name === "TokenExpiredError";
            return res.status(401).json({
                erro: expirado
                    ? "Sessão expirada. Faça login novamente."
                    : "Autenticação necessária.",
            });
        }
        //Se deu certo guarda o funcionário em req.user para as próximas etapas usarem
        req.user = funcionario;
        next(); //Libera a passagem para a próxima etapa
    })(req, res, next);
};

// Middleware reutilizável para verificar o perfil do funcionário
// Deve ser usado APÓS o requireJWTAuth
const verificarPerfilMiddleware = (...perfisPermitidos) => {
    return (req, res, next) => {
        //Se não tem req.user é porque o requireJWTAuth não rodou antes, então da erro
        if (!req.user) {
            return res.status(401).json({ erro: "Usuário não autenticado." });
        }

        //Descobre o perfil de quem está pedindo olhando no banco o campo eAdmin
        const perfilAtual = req.user.eAdmin ? "admin" : "vendedor";

        //Caso o perfil dele não esteja na lista de permitidos, da erro também
        if (!perfisPermitidos.includes(perfilAtual)) {
            return res.status(403).json({
                erro: "Acesso negado. Você não tem permissão para realizar esta ação.",
            });
        }

        next(); //Perfil permitido segue
    };
};


// Middleware para verificar token e depois o perfil
const requirePerfil = (...perfisPermitidos) => {
    return [requireJWTAuth, verificarPerfilMiddleware(...perfisPermitidos)];
};

module.exports = {
    configureJwtStrategy,
    requireJWTAuth,
    verificarPerfilMiddleware,
    requirePerfil,
};
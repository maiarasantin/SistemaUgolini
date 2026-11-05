const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const authRepository = require("./auth.repository");




// =====================================================================
// configureJwtStrategy
// Ensina o Passport a ler a "pulseira" (token) e descobrir de quem é.
// Precisa ser CHAMADA uma vez, no index.js, quando o servidor liga.
// =====================================================================
const configureJwtStrategy = () => {
     // Registra a estratégia no Passport
    passport.use(
        // Cria a estratégia JWT, que recebe 2 coisas: as opções e a função de verificação.
        new JwtStrategy(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKey: process.env.JWT_SECRET,
                algorithms: ["HS256"],
            },
            async (payload, done) => {
                try {
                    const funcionario = await authRepository.buscarPorId(payload.id);

                    if (funcionario && funcionario.status) {
                        done(null, funcionario);
                    } else {
                        done(null, false);
                    }
                } catch (error) {
                    done(error, false);
                }
            },
        ),
    );
};

// Middleware para autenticação JWT
const requireJWTAuth = (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (erro, funcionario, info) => {
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
        req.user = funcionario;
        next();
    })(req, res, next);
};

// Middleware reutilizável para verificar o perfil do funcionário
// Deve ser usado APÓS o requireJWTAuth
const verificarPerfilMiddleware = (...perfisPermitidos) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ erro: "Usuário não autenticado." });
        }

        const perfilAtual = req.user.eAdmin ? "admin" : "vendedor";

        if (!perfisPermitidos.includes(perfilAtual)) {
            return res.status(403).json({
                erro: "Acesso negado. Você não tem permissão para realizar esta ação.",
            });
        }

        next();
    };
};

// Middleware para verificar JWT e perfil
const requirePerfil = (...perfisPermitidos) => {
    return [requireJWTAuth, verificarPerfilMiddleware(...perfisPermitidos)];
};

module.exports = {
    configureJwtStrategy,
    requireJWTAuth,
    verificarPerfilMiddleware,
    requirePerfil,
};
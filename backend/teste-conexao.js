
const db = require("./database");

async function testarConexao() {
    try {
        const resultado = await db.one("SELECT NOW() AS horario");

        console.log("Conexão com o banco funcionando!");
        console.log("Horário do banco:", resultado.horario);

    } catch (erro) {
        console.error("Erro na conexão com o banco:");
        console.error(erro.message);
    } finally {
        await db.$pool.end();
    }
}

testarConexao();

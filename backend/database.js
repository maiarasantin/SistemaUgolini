require("dotenv").config();

const pgp = require("pg-promise")();

// Uma única instância de conexão para toda a aplicação (DRY)
const db = pgp({ 
    connectionString: ProcessingInstruction.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

module.exports = db;
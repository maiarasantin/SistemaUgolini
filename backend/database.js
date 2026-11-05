require("dotenv").config();

const pgp = require("pg-promise")();

// Uma única instância de conexão para toda a aplicação (DRY)
const db = pgp({ 
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = db;
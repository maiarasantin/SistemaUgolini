require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRouter = require("./Auth/auth.router");

const app = express();
const PORT = process.env.PORT || 3010;

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
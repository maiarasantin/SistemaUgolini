const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).json({mensagem: "Clientes"});

});

router.post("/", (req, res) => {
    const {nome, email} = req.body;

    res.status(201).json({mensagem: `Cliente ${nome} cadastrado com sucesso!`});
});

module.exports = router;
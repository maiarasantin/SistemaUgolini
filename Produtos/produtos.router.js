const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).json({mensagem: "Produtos"});

});

router.post("/", (req, res) => {
    const {nome, preco} = req.body;

    res.status(201).json({mensagem: `Produto ${nome} cadastrado com sucesso!`});
});

module.exports = router;
const FuncionarioControllers = require("../controllers/funcionarioControllers");
//const middlewares = require("../middlewares/verificarCampos")
const express = require('express')
const router = express.Router();
//const DadosToken = require("../middlewares/receberDadosToken");

router.post("/funcionario",  FuncionarioControllers.createFuncionario);
router.get("/funcionario", FuncionarioControllers.getAllFuncionario);
router.get("/funcionario/:id",  FuncionarioControllers.getIdFuncionario);
router.delete("/funcionario/:id", FuncionarioControllers.deleteFuncionario);
router.put("/funcionario/:id",  FuncionarioControllers.setFuncionario);
router.put("/funcionario/senha/:id", FuncionarioControllers.setSenha);

module.exports = router
const modelsFuncionario = require("../models/funcionarioModels");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

const createFuncionario = async (req, res) => {
    const usuario = await modelsFuncionario.createFuncionario(req.body);

    return res.status(200).json({mensagem: usuario});
}

const getAllFuncionario = async (req, res) => {
    const usuario = await modelsFuncionario.getAllFuncionario();

    return res.status(200).json(usuario);
}

const getIdFuncionario = async (req, res) => {
    const usuario = await modelsFuncionario.getIdFuncionario(req.params.id);

    return res.status(200).json(usuario);
}

const deleteFuncionario = async (req, res) => {
    const usuario = await modelsFuncionario.deleteFuncionario(req.params.id);

    return res.status(200).json({
        mensagem: true
    });

}

const setFuncionario = async (req, res) => {
    const usuario = await modelsFuncionario.setFuncionario(req.params.id, req.body);

    return res.status(200).json({
        mensagem: true
    });
}

const setSenha = async (req, res)=>{
    const saltRounds = 10;
    const senha = req.body.senha
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(senha, salt)
    req.body.senha = hash

    const usuario = await modelsFuncionario.setSenha(req.params.id, req.body)

    return res.status(201).json({mensagem:true})
}

module.exports = {
    createFuncionario,
    getAllFuncionario,
    getIdFuncionario,
    deleteFuncionario,
    setFuncionario,
    setSenha,
}
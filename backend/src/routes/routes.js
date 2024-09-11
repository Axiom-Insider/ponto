const express  = require("express")
const rotas = express.Router()
const funcionarios = require("./funcionario")
const hora = require("./horarios")
const ausencia = require('./ausencia')
const ferias = require("./feriados")


rotas.use("/", funcionarios)
rotas.use("/", hora)
rotas.use("/", ausencia)
rotas.use("/", ferias)

module.exports = rotas
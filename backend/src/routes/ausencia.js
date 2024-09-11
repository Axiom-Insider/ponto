const ausenciaControllers = require('../controllers/ausenciaControllers')
//const middlewares = require("../middlewares/verificarCampos")
const express = require('express');
const routes = express.Router();


routes.get('/ausencia', ausenciaControllers.getAusencia)
routes.get('/ausencia/:id', ausenciaControllers.getAusenciaId)
routes.post('/ausencia/delete/:id', ausenciaControllers.deleteAusencia)
routes.post('/ausencia', ausenciaControllers.createAtestado)
routes.delete('/ausencia/:id', ausenciaControllers.delet)




module.exports = routes
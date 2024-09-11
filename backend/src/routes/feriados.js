const feriadosControllers = require('../controllers/feriadosControllers')
const express = require('express');
const routes = express.Router();

routes.get('/ferias', feriadosControllers.getAll)
routes.post('/ferias', feriadosControllers.create)
routes.delete('/ferias/:id', feriadosControllers.delet)


module.exports = routes
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const FuncionarioBd = require('../models/FuncionarioBd')

module.exports = async (req, res, next)=>{
    const matricula = req.body.matricula
    const senha = req.body.senha

    FuncionarioBd.getFuncionarioId(matricula).then(dados=>{
        const funcionario = dados.data
        if(funcionario.length <= 0){
            req.flash('erro', 'Matrícula '+matricula+' não foi encontrar')
            return res.redirect('/PoloUAB/login')
        }

    bcrypt.compare(senha, funcionario[0].senha, function (err, result) {
        if(err){
            req.flash('erro', 'Sem registro de matrícula')
            return res.redirect('/PoloUAB/login')
        }
        if (result) {
            const info = {
                id: funcionario[0].matricula,
                adm:funcionario[0].adm
            }
            const segredo = '349ur309r039ir93i'
            const token = jwt.sign(info, segredo, {
                expiresIn: '12h'
            });
            req.session.token = token 
            req.flash('sucesso', 'Logado com sucesso '+funcionario[0].nome_completo)
            if(funcionario[0].adm > 0){
                return res.redirect('/PoloUAB/adm/home')
            }
            return res.redirect('/PoloUAB/Registrar-Horario')

        }
        req.flash('erro', 'Senha incorreta, tente novamente')
        return res.redirect('/PoloUAB/login')
    })

})
    next()
}

    
    

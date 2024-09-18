const {
    default: axios
} = require("axios");
const routes = require("express").Router();
const jwt = require('jsonwebtoken');
const online = require("../middlewares/rotaOnline")
const offline = require("../middlewares/rotaOffline")
const estruturaAno = require('../config/estruturaAno')
const estruturaDia = require("../config/estruturaDia")
const estruturaMes = require("../config/estruturaMes")
const verificarRegistro = require("../config/verificarRegistro")
const FuncionarioBd = require("../models/FuncionarioBd");
const HorarioBd = require("../models/HorarioBd")
const FeriadosBd = require('../models/FeriadosBd')
const auth = require("../middlewares/auth")
const bcrypt = require('bcrypt')


routes.use((req, res, next) => {

    //descodificar o token
    if (req.session.token) {
        const token = req.session.token;
        const tokenDecode = jwt.decode(token, {
            complete: true
        })
        const exp = new Date(tokenDecode.payload.exp * 1000)

        if (Date.now() > exp) {
            delete req.session.user
            delete req.session.token
        }

        if (req.session.user) return next();
        const decoded = jwt.decode(token, {
            complete: true
        });
        const payload = decoded.payload;
        req.session.user = payload.id
        req.session.adm = payload.adm
        if (req.session.adm > 0) {
            req.session.adm = true
        }
    }
    //criar sessão se o usuario ja se registrou hoje 
    if (req.session.user) {
        if (req.session.entrada) {
            HorarioBd.verificar(req.session.user).then(dados => {
                const horarios = dados.data
                const {
                    entrada,
                    saida
                } = verificarRegistro(horarios)
                req.session.entrada = entrada
                req.session.saida = saida
            })
        }
    }


    const admNot = ['/registrar-horario']

    if (req.session.adm > 0) {
        if (req.url == admNot[0]) {
            return res.redirect("/adm/home")
        }
    }
    next();
})


routes.get("/home", online, (req, res) => {
    HorarioBd.verificar(req.session.user).then(dados => {
        const horarios = dados.data

        const {
            registro,
            entrada,
            saida
        } = verificarRegistro(horarios)
        res.render('./funcionario/home.hbs', {
            nome: horarios[0].nome_completo,
            matricula: horarios[0].matricula,
            user: req.session.user,
            adm: req.session.adm,
            registro,
            menu: true,
            sucesso: req.flash('sucesso'),
            erro: req.flash('erro'),
            entrada,
            saida
        })
    })
})

routes.get("/historico", online, (req, res) => {
    HorarioBd.historicoAdm(req.session.user).then(dados => {
        const historico = dados.data
        if (historico.length < 1) {
            return res.render("./funcionario/historico.hbs", {
                registro: false,
                user: req.session.user || null,
                adm: req.session.adm || null,
                historico: true
            })
        }
        const date = new Date()
        const anoAtual = req.query.ano || date.getFullYear()
        const mesAtual = req.query.mes || date.getMonth() + 1
        const ano = estruturaAno(historico, anoAtual)
        const mes = estruturaMes(mesAtual)
        HorarioBd.historico(req.session.user, mesAtual, anoAtual).then(dados => {
            FeriadosBd.getAll().then(feriadosAll => {
                const horarios = dados.data
                const feriados = feriadosAll.data
                const estruturaMesVar = estruturaDia(horarios, anoAtual, mesAtual, feriados)
                res.render("./funcionario/historico.hbs", {
                    ano,
                    mes,
                    dados: estruturaMesVar,
                    registro: horarios.length == 0 ? false : true,
                    user: req.session.user || null,
                    adm: req.session.adm || null,
                    historico: true
                })
            })

        })
    })
})

routes.get("/registrar-horario", online, (req, res) => {
    HorarioBd.verificar(req.session.user).then(dados => {
        const horarios = dados.data
        const {
            registro,
            entrada,
            saida
        } = verificarRegistro(horarios)
        res.render("./funcionario/registrarHorario.hbs", {
            user: req.session.user || null,
            adm: req.session.adm || null,
            registro,
            sucesso: req.flash('sucesso'),
            erro: req.flash('erro'),
            entrada,
            saida,
            hora: true
        })
    })
})


routes.post("/registrar-horario", (req, res) => {
    const botao = req.body.botao

    if (botao == 'entrada' && req.session.entrada == true) {
        req.session.entrada = false
    }
    if (req.session.entrada && botao == 'entrada') {
        return res.redirect("/registrar-horario")
    }
    if (botao == 'entrada' && req.session.entrada != true) {
        const entrada = req.body.botao == 'entrada' ? 1 : 0
        const saida = req.body.botao == 'saida' ? 1 : 0
        HorarioBd.horarios_entrada(req.session.user, entrada, saida).then(dados => {
            const horarios = dados.data
            if (horarios.mensagem) {
                req.session.entrada = true
                req.flash('sucesso', `Entrada registrada!`)
                return res.redirect('/registrar-horario')
            }
            req.flash('erro', `Erro ao registrar entrada`)
            return res.redirect('/registrar-horario')
        })

    }
    if (botao == 'saida' && req.session.saida == true) {
        req.session.saida = false
    }
    if (botao == 'saida' && req.session.saida != true) {
        HorarioBd.horarios_saida(req.session.user).then(dados => {
            const horarios = dados.data

            if (horarios.mensagem) {
                req.session.saida = true
                req.flash('sucesso', `Saída registrada!`)
                return res.redirect('/registrar-horario')
            }

            req.flash('erro', `Erro ao registrar saída`)
            return res.redirect('/registrar-horario')
        })
    }
})

routes.get('/senha/:matricula', (req, res)=>{
    const matricula = req.params.matricula
    res.render('./funcionario/senha', {
        matricula,
        login: true,
        erro: req.flash('erro') || null,
        sucesso: req.flash('sucesso') || null
    })
})

routes.post('/senha', (req, res)=>{
    const id = req.body.matricula
    const senha = req.body.senha
    FuncionarioBd.upFuncionario(id, senha).then(dados => {
        const funcionario = dados.data
        if (funcionario.mensagem) {
            req.flash('sucesso', 'Nova senha criada com sucesso, faça o login novamente')
            return res.redirect("/login")
        }
        req.flash('erro', 'Erro ao modificar senha')
        return res.redirect("/login")
    })
})

routes.get("/login", offline, (req, res) => {
    return res.render("./funcionario/login.hbs", {
        login: true,
        erro: req.flash('erro') || null,
        sucesso: req.flash('sucesso') || null
    })

})
routes.post("/login", (req, res) => {
    const matricula = req.body.matricula
    const senha = req.body.senha
    FuncionarioBd.getFuncionarioId(matricula).then(dados => {
        const funcionario = dados.data
        console.log(funcionario.nome_completo, funcionario.matricula)
        if (funcionario.length <= 0) {
            req.flash('erro', 'Matrícula ' + matricula + ' não foi encontrar')
            return res.redirect('/login')
        }
        console.log(funcionario.senha)
        bcrypt.compare(senha, funcionario.senha, (err, result) => {
            if (err) {
                req.flash('erro', 'Sem registro de matrícula')
                return res.redirect('/login')
            }
            
            if (result) {
                const info = {
                    id: funcionario.matricula,
                    adm: funcionario.adm
                }
                const segredo = '349ur309r039ir93i'
                const token = jwt.sign(info, segredo, {
                    expiresIn: '8d'
                });
                if(funcionario.log == 0 && funcionario.adm == 0){
                    return res.redirect('/senha/'+matricula)
                    }
                req.session.token = token
                req.flash('sucesso', 'Logado com sucesso ' + funcionario.nome_completo)

                if (funcionario.adm > 0) {
                    return res.redirect('/adm/home')
                }
                
                return res.redirect('/Registrar-Horario')

            }
            req.flash('erro', 'Senha incorreta, tente novamente')
            return res.redirect('/login')
        })

    })
})



routes.get("/sair", online, (req, res) => {
    delete req.session.token
    delete req.session.user
    delete req.session.adm
    delete req.flash()
    req.flash('sucesso', 'Deslogado com sucesso!')
    return res.redirect("/login")
})


module.exports = routes

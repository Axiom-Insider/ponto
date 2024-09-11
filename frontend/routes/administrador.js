const {
    default: axios
} = require("axios");
const routes = require("express").Router();
const online = require("../middlewares/rotaOnline")
const estruturaAno = require('../config/estruturaAno')
const estruturaDiaAdm = require("../config/estruturaDiaAdm")
const estruturaMes = require("../config/estruturaMes")
const estruturaAusencia = require("../config/estruturaAusencia")
const FuncionarioBd = require("../models/FuncionarioBd")
const AusenciaBd = require("../models/AusenciaBd")
const HorarioBd = require("../models/HorarioBd")
const FeriadosBd = require("../models/FeriadosBd")
const FormatarData = require("../config/FormatandoDataPtBR");
const bcrypt = require('bcrypt')
const estruturaPdf = require("../config/estruturaPdf");


routes.use((req, res, next) => {
    if (req.session.adm > 0) {
        return next()
    }
    req.flash('erro', ' Sem permissão para acessar essa página')
    return res.redirect('/PoloUAB/home')
})
//rota para apagar 
routes.post("/entrada-saida", online, (req, res) => {
    const { opcao, idUser, idHorario, mes, ano } = req.body
    if (opcao == 'entrda') {
        req.session.entrada = false
    }
    if (opcao == 'saida') {
        req.session.saida = false
    }
    HorarioBd.deleteHorarios(opcao, idHorario).then(dados => {
        return res.redirect(`/polouab/adm/historico/${idUser}?mes=${mes}&ano=${ano}`)
    }).catch(erro => {
        console.log(erro)
    })

})

// exluir usuarios e trocar senha dos usuarios
routes.get("/usuarios", online, (req, res) => {
    FuncionarioBd.getFuncionarios().then(dados => {
        const funcionario = dados.data
        res.render("./admin/usuarios.hbs", {
            dados: funcionario,
            user: req.session.user,
            adm: req.session.adm,
            sucesso: req.flash('sucesso') || null,
            erro: req.flash('erro') || null,
            usuarios: true
        })
    })
})

routes.get("/pdf/:id", online, (req, res) => {
    HorarioBd.historicoAdm(req.params.id).then(dados => {
        const historico = dados.data
        if (historico.length < 1) {
            return res.render("./admin/pdfDeFrequencia.hbs", {
                registro: false,
                user: req.session.user || null,
                adm: req.session.adm || null,
                historico: true
            })
        }
        const nome = ['Janeiro', 'Fervereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
        var num = 1
        var mesAtual2
        nome.forEach(element => {
            if (num == req.query.mes) {
                mesAtual2 = element
            }
            num++
        });
        const anoAtual = req.query.ano
        const mesAtual = req.query.mes
        HorarioBd.historico(req.params.id, mesAtual, anoAtual).then(dados => {
            FeriadosBd.getAll().then(feriadosAll => {
                AusenciaBd.getUserId(req.params.id).then(ausenciaDados => {
                    FuncionarioBd.getFuncionarioId(req.params.id).then(funcionario => {
                        const nome = funcionario.data[0].nome_completo
                        const matricula = funcionario.data[0].matricula
                        const cargo = funcionario.data[0].cargo
                        const ausencia = ausenciaDados.data
                        const horarios = dados.data
                        const feriados = feriadosAll.data
                        const pdf = estruturaPdf(horarios, anoAtual, mesAtual, feriados, ausencia)
                        res.render("./admin/pdfDeFrequencia", {
                            nome, matricula, cargo,
                            mesAtual2,
                            mesAtual,
                            anoAtual,
                            dados: pdf,
                            registro: horarios.length == 0 ? false : true,
                            user: req.session.user || null,
                            adm: req.session.adm || null,
                            historico: true
                        })
                    })

                })

            })

        })
    })
})

routes.get('/ausencias/:id', online, (req, res) => {
    const id = req.params.id
    AusenciaBd.getUserId(id).then(dados => {
        const {
            data
        } = dados
        const date = new Date().getFullYear()
        const anoQ = req.query.ano || date
        var filtro = []
        var ano = []
        var dataBd
        var anosTrue = []
        var dadosAno = []
        var dataAnoComp
        for (key in data) {
            dataAnoComp = data[key].data_saida.split('/')[2] || data[key].data_entrada.split('/')[2]
            if (anoQ == dataAnoComp) {
                dadosAno.push({
                    id_ausencia: data[key].id_ausencia,
                    atestado: data[key].atestado == 1 ? true : false,
                    ferias: data[key].ferias == 1 ? true : false,
                    data_entrada: data[key].data_entrada,
                    data_saida: data[key].data_saida,
                    id_usuario: data[key].id_usuario
                })
            }
            dataBd = data[key].data_saida.split('/')[2] || data[key].data_entrada.split('/')[2]
            filtro = ano.filter(ano => ano == dataBd)
            if (filtro.length <= 0) {
                ano.push(dataBd)
                anosTrue.push({
                    select: dataBd == anoQ ? true : false,
                    ano: dataBd
                })
            }
        }
        res.render('./admin/ausencias', {
            dados: dadosAno,
            anos: anosTrue,
            user: req.session.user,
            adm: req.session.adm,
            sucesso: req.flash('sucesso') || null,
            erro: req.flash('erro') || null,
            ausencias: true
        })
    })
})

routes.get('/ausencia-excluir/:id', online, (req, res) => {
    const id = req.params.id

    AusenciaBd.delet(id).then(dados => {
        const msg = dados.data.msg
        req.flash('sucesso', 'Deletado com sucesso!')
        return res.redirect('/PoloUAB/adm/usuarios')
    }).catch(erro => {
        console.log(erro)
        req.flash('erro', 'Erro')
        return res.redirect('/PoloUAB/adm/usuarios')
    })
})


routes.get("/cadastro", online, (req, res) => {
    res.render("./funcionario/registro.hbs", {
        user: req.session.user,
        adm: req.session.adm,
        sucesso: req.flash('sucesso') || null,
        erro: req.flash('erro') || null,
        registro: true
    })
})

routes.post("/cadastro", online, (req, res) => {
    const saltRounds = 10;
    const senha = "123"
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(senha, salt)
    req.body.senha = hash
    FuncionarioBd.creatFuncionario(req.body.matricula, req.body.senha, req.body.nome, req.body.cargo).then(dados => {
        const {
            data
        } = dados
        console.log(data.mensagem)
        if (data.mensagem) {
            req.flash('sucesso', 'Cadastrado com sucesso')
            return res.redirect("/PoloUAB/adm/cadastro")
        }

        if (!data.mensagem) {
            req.flash('erro', 'Essa matricula já esta registrada')
            return res.redirect("/PoloUAB/adm/cadastro")
        }
        req.flash('erro', 'Cadastro falhou')
        res.redirect("/PoloUAB/adm/cadastro")
    })
})

routes.get('/feriados', online, (req, res) => {
    const data = new Date().getFullYear()
    const anoQ = req.query.ano || data
    var nacional = []
    var estaduais = []
    var ano = []
    var anosTrue = []
    var filtro = []

    FeriadosBd.getAll().then(dados => {
        const feriados = dados.data
        if (anoQ) {
            for (key in feriados) {
                if (feriados[key].nacional == 1) {
                    nacional.push({
                        id: feriados[key].id_feriados,
                        nome: feriados[key].nome,
                        data: feriados[key].data,
                        dataSec: feriados[key].dataSec
                    })
                }
                if (feriados[key].nacional != 1) {
                    if (feriados[key].data.split('/')[2] == anoQ || feriados[key].dataSec.split('/')[2] == anoQ) {
                        estaduais.push({
                            id: feriados[key].id_feriados,
                            nome: feriados[key].nome,
                            data: feriados[key].data,
                            dataSec: feriados[key].dataSec
                        })
                    }
                }

                filtro = ano.filter(ano => ano == feriados[key].data.split('/')[2])
                if (filtro.length <= 0) {
                    ano.push(feriados[key].data.split('/')[2])
                    anosTrue.push({
                        select: feriados[key].data.split('/')[2] == req.query.ano ? true : false,
                        ano: feriados[key].data.split('/')[2]
                    })
                }
            }

            return res.render('./admin/feriados.hbs', {
                sucesso: req.flash('sucesso') || null,
                erro: req.flash('erro') || null,
                anos: anosTrue,
                estaduais: estaduais,
                nacionais: nacional,
                feriados: true,
                user: req.session.user,
                adm: req.session.adm
            })
        }

    })
})

routes.post('/feriados', online, (req, res) => {
    const {
        nome,
        data1,
        nacional
    } = req.body
    var data2 = req.body.data2 || false
    FeriadosBd.create(nome, FormatarData(data1), FormatarData(data2), nacional).then(dados => {
        const {
            data
        } = dados
        req.flash('sucesso', data.msg)
        return res.redirect('/poloUAB/adm/horarios')
    }).catch(erro => {
        console.log(erro)
    })
})

routes.get('/feriados-excluir/:id', online, (req, res) => {
    const id = req.params.id

    FeriadosBd.delet(id).then(dados => {
        const msg = dados.data
        req.flash("sucesso", msg.msg)
        return res.redirect("/poloUAB/adm/feriados")
    })

})

routes.get("/horarios", online, (req, res) => {
    AusenciaBd.verificar().then(dados => {
        const ausencia = dados.data
        FuncionarioBd.getFuncionarios().then(dados => {
            const funcionario = dados.data
            const funcionarioAusentes = estruturaAusencia(ausencia)

            res.render("./admin/horarios.hbs", {
                usersAusencia: funcionario,
                dadosAusencia: funcionarioAusentes,
                user: req.session.user,
                adm: req.session.adm,
                sucesso: req.flash('sucesso') || null,
                erro: req.flash('erro') || null,
                hora: true
            })
        })
    })

})

routes.post("/editar-horario", (req, res) => {
    const data = new Date(req.body.data)
    const dia = data.getDate() + 1
    const mes = data.getMonth() + 1
    const ano = data.getFullYear()
    const newData = dia + "/" + mes + "/" + ano
    const id_usuario = req.body.id
    var opcao = req.body.opcao
    const hora = req.body.hora

    switch (opcao) {
        case 'entrada':
            opcao = true
            break;
        case 'saida':
            opcao = false
            break;
        default:
            req.flash('erro', 'Métodos de ausencia não foram selecionados Entrada/Saída')
            return res.redirect('/PoloUAB/adm/horarios')
    }

    if (opcao) {
        HorarioBd.editar_horarios(dia, mes, ano, hora, newData, id_usuario).then(dados => {
            const {
                data
            } = dados
            if (data.mensagem) {
                req.flash('sucesso', 'Horario editado!')
                return res.redirect('/PoloUAB/adm/horarios')
            }
        })
    }

    if (!opcao) {
        console.log(true)
        HorarioBd.editar_horarios_saida(dia, mes, ano, hora, id_usuario).then(dados => {
            const {
                data
            } = dados
            if (data.mensagem) {
                req.flash('sucesso', 'Horario editado!')
                return res.redirect('/PoloUAB/adm/horarios')
            }

            req.flash('erro', 'Registro não encontrado')
            return res.redirect('/PoloUAB/adm/horarios')
        })
    }


})

routes.post("/ausencia", (req, res) => {
    var data_entrada = req.body.entrada.split('-')
    data_entrada = data_entrada[2] + '/' + data_entrada[1] + '/' + data_entrada[0]
    data_saida = req.body.saida.split('-') || ''

    if (data_saida[0]) data_saida = data_saida[2] + '/' + data_saida[1] + '/' + data_saida[0]

    const id_usuario = req.body.id
    const {
        opcao
    } = req.body

    var ferias
    var atestado
    switch (opcao) {
        case 'ferias':
            ferias = 1
            atestado = 0
            break;
        case 'atestado':
            ferias = 0
            atestado = 1
            break;
        default:
            req.flash('erro', 'Métodos de ausencia não foram selecionados Férias/Atestado')
            return res.redirect('/PoloUAB/adm/horarios')
    }

    AusenciaBd.createAusencia(
        data_entrada,
        data_saida,
        id_usuario,
        ferias,
        atestado
    ).then(dados => {
        const {
            data
        } = dados

        if (data.mensagem) {
            req.flash('sucesso', 'Férias de ' + data.ausencia[0].nome_completo + ' registrada com sucesso!')
            return res.redirect('/PoloUAB/adm/horarios')
        }

        req.flash('erro', 'erro ao registrar férias')
        return res.redirect('/PoloUAB/adm/horarios')
    })
})

routes.get("/historico/:id", online, (req, res) => {
    HorarioBd.historicoAdm(req.params.id).then(dados => {
        const historico = dados.data
        if (historico.length < 1) {
            return res.render("./admin/historicoFuncionario.hbs", {
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
        HorarioBd.historico(req.params.id, mesAtual, anoAtual).then(dados => {
            FeriadosBd.getAll().then(feriadosAll => {
                AusenciaBd.getUserId(req.params.id).then(ausenciaAll => {
                    const ausencia = ausenciaAll.data
                    const horarios = dados.data
                    const feriados = feriadosAll.data
                    const estruturaMesVar = estruturaDiaAdm(horarios, anoAtual, mesAtual, feriados, req.params.id, ausencia)
                    res.render("./admin/historicoFuncionario.hbs", {
                        id: req.params.id,
                        anoAtual: anoAtual,
                        mesAtual: mesAtual,
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
})

routes.get('/senha/:id', online, (req, res) => {
    res.render("./admin/senha", {
        user: req.session.user,
        adm: req.session.adm,
        usuarios: true
    })
})

routes.post('/senha/:id', online, (req, res) => {

    FuncionarioBd.upFuncionario(req.params.id, req.body.senha).then(dados => {
        const funcionario = dados.data
        if (funcionario.mensagem) {
            req.flash('sucesso', 'Senha Modificada!')
            return res.redirect("/PoloUAB/adm/usuarios")
        }
        req.flash('erro', 'Erro ao modificar senha')
        return res.redirect("/PoloUAB/adm/usuarios")
    })
})

/*
routes.get('/excluir/:id', online, (req, res) => {
    axios.delete('http://192.168.88.15:2000/api/funcionario/' + req.params.id, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(dados => {
        const {
            data
        } = dados
        if (data.mensagem) {
            req.flash('sucesso', 'Usuário excluído!')
            return res.redirect('/PoloUAB/adm/usuarios')
        }
    })
})
*/

routes.get("/home", online, (req, res) => {
    HorarioBd.verificarAll().then(dados => {
        FuncionarioBd.getFuncionarios().then(funcionario => {
            const horarios = dados.data
            const func = funcionario.data
            var funcionarioAprovados = []
            var funcionarioReprovados = []
            var filtro
            for (key in horarios) {
                funcionarioAprovados.push({
                    nome: horarios[key].nome_completo,
                    matricula: horarios[key].matricula,
                    entrada: horarios[key].entrada == 1 ? true : false,
                    saida: horarios[key].saida == 1 ? true : false,
                    hora_entrada: horarios[key].hora_entrada,
                    hora_saida: horarios[key].hora_saida
                })
            }
            for (key in func) {
                filtro = 0
                for (key1 in horarios) {
                    if (func[key].matricula == horarios[key1].matricula) {
                        filtro = 1
                    }
                }
                if (filtro <= 0) {
                    funcionarioReprovados.push({
                        matricula: func[key].matricula,
                        nome: func[key].nome_completo,
                    })
                }
            }

            res.render("./admin/home.hbs", {
                funcAprovados: funcionarioAprovados,
                funcReprovados: funcionarioReprovados,
                user: req.session.user,
                adm: req.session.adm,
                sucesso: req.flash('sucesso') || null,
                erro: req.flash('erro') || null,
                menu: true
            })
        })

    })

})





module.exports = routes
module.exports = (data, anoAtual, mesAtual, feriados, id, ausencia) => {
    var diaMes = new Date(anoAtual, mesAtual, 0).getDate();
    var estruturaMes = []
    var num = 1
    if (data.length < 1) {
        data.push({
            id_horario: 1,
            entrada: '0',
            saida: '0',
            hora_entrada: '',
            hora_saida: '',
            data: `${01}/${mesAtual}/${anoAtual}`,
            dia: 01,
            mes: mesAtual,
            ano: anoAtual,
            id_usuarios: id
        })
    }

    for (var i = 0; i < diaMes; i++) {
        var nomeDia = new Date(anoAtual, mesAtual - 1, num).toLocaleString('pt-BR', {
            weekday: 'long'
        })
        if (nomeDia != 'sábado' && nomeDia != 'domingo' && i != diaMes + 1) {
            estruturaMes.push({
                id: id,
                idHorario: null,
                dia: num,
                entrada: 'X',
                saida: 'X',
                diaDasemana: nomeDia,
                fds: null,
                feriado: null,
                ausencia: null,
                horasT:null,
                totalH:null
            })
        }
        if (nomeDia == 'sábado' || nomeDia == 'domingo' && i != diaMes + 1) {
            estruturaMes.push({
                id: id,
                idHorario: null,
                dia: num,
                entrada: null,
                saida: null,
                diaDasemana: nomeDia,
                fds: true,
                feriado: null,
                ausencia: null,
                horasT:null,
                totalH:null
            })
        }
        num++
    }
    if (data.length > 0) {
        var dataAusencias
        var dataFerias
        var dataUser
        var index
        var dias
        var entrada
        //configurar feriados
        for (key in data) {
            estruturaMes[data[key].dia - 1].entrada = data[key].hora_entrada || 'X'
            estruturaMes[data[key].dia - 1].saida = data[key].hora_saida || 'X'
        }

        for (key in estruturaMes) {
            for (keyF in feriados) {
                if (feriados[keyF].dataSec) {
                    dias = Math.abs(parseInt(feriados[keyF].data.split('/')[0]) - parseInt(feriados[keyF].dataSec.split('/')[0]))
                    entrada = parseInt(feriados[keyF].data.split('/')[0]) + 1
                    for (var e = 0; e < dias; e++) {
                        feriados.push({
                            nome: feriados[keyF].nome,
                            nacional: feriados[keyF].nacional,
                            data: `${entrada++}/${feriados[keyF].data.split('/')[1]}/${feriados[keyF].data.split('/')[2]}`
                        })
                    }
                }

                if (feriados[keyF].nacional == "1") {
                    dataFerias = parseInt(feriados[keyF].data.split('/')[1])
                    dataUser = mesAtual
                    if (dataFerias == dataUser) {
                        dataFerias = parseInt(feriados[keyF].data.split('/')[0])
                        dataUser = estruturaMes[key].dia
                        if (dataFerias == dataUser) {
                            index = parseInt(dataFerias)
                            estruturaMes[index - 1].feriado = feriados[keyF].nome
                        }
                    }

                }
                if (feriados[keyF].nacional != 1) {
                    dataFerias = feriados[keyF].data.split('/')[2]
                    dataUser = anoAtual
                    if (dataFerias == dataUser) {
                        dataFerias = parseInt(feriados[keyF].data.split('/')[1])
                        dataUser = mesAtual
                        if (dataFerias == dataUser) {
                            dataFerias = parseInt(feriados[keyF].data.split('/')[0])
                            dataUser = estruturaMes[key].dia
                            if (dataFerias == dataUser) {
                                index = parseInt(dataFerias)
                                estruturaMes[index - 1].feriado = feriados[keyF].nome
                            }
                        }
                    }
                }
            }
        }
        for (key in estruturaMes) {
            //configurando ausencias
            for (keyA2 in ausencia) {
                if (ausencia[keyA2].data_saida) {
                    dias = Math.abs(parseInt(ausencia[keyA2].data_entrada.split('/')[0]) - parseInt(ausencia[keyA2].data_saida.split('/')[0]))
                    entrada = parseInt(ausencia[keyA2].data_entrada.split('/')[0]) + 1
                    for (var e = 0; e < dias; e++) {
                        ausencia.push({
                            atestado: ausencia[keyA2].atestado,
                            ferias: ausencia[keyA2].ferias,
                            data_entrada: `${entrada++}/${ausencia[keyA2].data_entrada.split('/')[1]}/${ausencia[keyA2].data_entrada.split('/')[2]}`
                        })
                    }
                }
            }
            for (keyA in ausencia) {
                dataAusencias = dataAusencias = ausencia[keyA].data_entrada.split('/')[2]
                dataUser = anoAtual
                if (dataAusencias == dataUser) {
                    dataAusencias = parseInt(dataAusencias = ausencia[keyA].data_entrada.split('/')[1])
                    dataUser = mesAtual
                    if (dataAusencias == dataUser) {
                        dataAusencias = parseInt(ausencia[keyA].data_entrada.split('/')[0])
                        dataUser = estruturaMes[key].dia
                        if (dataAusencias == dataUser) {
                            index = parseInt(dataAusencias)
                            estruturaMes[index - 1].ausencia = ausencia[keyA].atestado == 1 ? "Atestado" : "Ferias"
                        }
                    }
                }

            }
        }

        for (keys in data) {
            estruturaMes[data[keys].dia - 1].idHorario = estruturaMes[data[keys].dia - 1].hora_entrada == 'X' ? '' : data[keys].id_horario
        }
    }
    var horaEmMinutos
    var hora1 
    var hora2 
    var minuto1 
    var minuto2  
    var hora 
    var minuto
    var horaTotal = 0
    for(keys in data){
        if(estruturaMes[data[keys].dia - 1].saida != 'X'){
            hora1 = estruturaMes[data[keys].dia - 1].entrada.split(':')[0] 
            hora2 = estruturaMes[data[keys].dia - 1].saida.split(':')[0] 
            minuto1 = estruturaMes[data[keys].dia - 1].entrada.split(':')[1]
            minuto2 = estruturaMes[data[keys].dia - 1].saida.split(':')[1] 
            horaEmMinutos = ((hora2 - hora1) * 60) + (minuto2 - minuto1)
            horaTotal += horaEmMinutos 
            hora = Math.floor(horaEmMinutos / 60).toString()
            minuto = horaEmMinutos % 60
            if(minuto < 10){
                minuto = `0${minuto}`
            }
            if(hora < 10){
                hora = `0${hora}`
            }
            estruturaMes[data[keys].dia - 1].horasT = `${hora}:${minuto}`
        }
    }
    var horaTotal2 = Math.floor(horaTotal / 60)
    var minutoTotal2 = horaTotal % 60
    if(minutoTotal2 < 10){
        minutoTotal2 = `0${minutoTotal2}`
    }
    if(horaTotal2 < 10){
        horaTotal2 = `0${horaTotal2}`
    }
    estruturaMes.push({
        totalH:`${horaTotal2}:${minutoTotal2}`
    })
    return estruturaMes
}
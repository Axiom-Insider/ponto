module.exports = (data, anoAtual, mes, feriados, id) => {
    const diaMes = new Date(anoAtual, mes, 0).getDate();
    var estruturaMes = []
    var num = 1
    for (var i = 0; i < diaMes; i++) {
        var nomeDia = new Date(anoAtual, mes - 1, num).toLocaleString('pt-BR', {
            weekday: 'long'
        })
        if (nomeDia != 'sábado' && nomeDia != 'domingo') {
            estruturaMes.push({
                id: id,
                idHorario: null,
                dia: num,
                entrada: 'X',
                saida: 'X',
                diaDasemana: nomeDia,
                fds: null,
                feriado: null,
            })
        }
        if (nomeDia == 'sábado' || nomeDia == 'domingo') {
            estruturaMes.push({
                id: id,
                idHorario: null,
                dia: num,
                entrada: null,
                saida: null,
                diaDasemana: nomeDia,
                fds: true,
                feriado: null,
            })
        }
        num++
    }

    var dataFerias
    var dataUser
    var index
    for (key in data) {
        estruturaMes[data[key].dia - 1].entrada = data[key].hora_entrada || 'X'
        estruturaMes[data[key].dia - 1].saida = data[key].hora_saida || 'X'
    }
    for(keys in data){
        estruturaMes[data[keys].dia -1].idHorario = estruturaMes[data[keys].dia - 1].hora_entrada == 'X' ? ''  : data[keys].id_horario
    }
    return estruturaMes
}
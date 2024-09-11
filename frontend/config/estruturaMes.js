module.exports = (mesAtual)=>{
    const nome = ['Janeiro','Fervereiro', 'Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
    var mes = []
    var num = 1
    nome.forEach(element => {
        mes.push({mes:element, num:num, selecionado:mesAtual == num ? true : null })
        num++
    })

    return mes
}
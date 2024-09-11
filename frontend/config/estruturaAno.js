module.exports = (data, anoAtual)=>{
    var anoAtual = anoAtual
    var ano = []
    var year = []
    var filtro
    for (key in data) {
            filtro = year.filter(year => year == data[key].ano)
            if(filtro.length == 0){
                year.push(data[key].ano)
                ano.push({ano:data[key].ano, selecionado:anoAtual == data[key].ano ? true : null})
            }
           
    }
    return ano
}
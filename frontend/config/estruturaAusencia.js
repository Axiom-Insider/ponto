module.exports = (dados) => {
    const data = new Date()
    var dataBd
    var dataSeparadas
    var ausencia = []

    for (const key in dados) {
        dataSeparadas = dados[key].data_saida.split("/") != '' ? dados[key].data_saida.split("/") : dados[key].data_entrada.split("/")
        dataSeparadas[1] = dataSeparadas[1] - 1;
        dataBd = new Date(dataSeparadas[2], dataSeparadas[1], dataSeparadas[0])
        if (dataBd > data) {
            ausencia.push(dados[key])
        }
    }

    return ausencia
}
const {
    default: axios
} = require("axios")
require('dotenv').config()

const historicoAdm = async (id_usuario) => {
    try {
        const dados = await axios.get(`http://${process.env.IP}/api/horarios/${id_usuario}`)
        return dados
    } catch (error) {
        return console.log(error)
    }

}

const deleteHorarios = async (opcao, id)=>{
    try {
        return await axios.put(`http://${process.env.IP}/api/deleteHorario/${id}`, {
            opcao
        })
    } catch (erro) {
        console.log(erro)
    }
}

const historico = (id_usuario, mes, ano) => {
    try {
        return axios.post(`http://${process.env.IP}/api/historico`, {
            id_usuario,
            mes,
            ano
        })
    } catch (error) {
        console.log(error)
    }
}

const editar_horarios = (dia, mes, ano, hora, data, id_usuario) => {
    try {

        return axios.post(`http://${process.env.IP}/api/horarios/edit`, {
            dia,
            mes,
            ano,
            hora,
            data,
            id_usuario,
        })
    } catch (error) {
        console.log(error)
    }
}

const verificar = (id) => {
    try {
        
        const date = new Date();
        const dia = date.getDate();
        const mes = date.getMonth() + 1;
        const ano = date.getFullYear();
        console.log(id)
        return axios.post(`http://${process.env.IP}/api/verificar`, {
            id,
            dia,
            mes,
            ano
        })
    } catch (error) {
        console.log(error)
    }
}

const verificarAll = () => {
    try {
        
        const date = new Date();
        const dia = date.getDate();
        const mes = date.getMonth() + 1;
        const ano = date.getFullYear();
    
        return axios.post(`http://${process.env.IP}/api/verificar/all`, {
            dia,
            mes,
            ano
        })
    } catch (error) {
        console.log(error)
    }
}

const horarios_entrada = (id_usuario, entrada, saida) => {
    try {
        
        var data = new Date();
        var hora = data.getHours();
        var minutos = data.getMinutes();
        const dia = data.getDate();
        const mes = data.getMonth() + 1;
        const ano = data.getFullYear();
        if (hora < 10) hora = "0" + hora;
        if (minutos < 10) minutos = "0" + minutos;
        hora = hora + ":" + minutos
        data = data.toLocaleDateString()
        return axios.post(`http://${process.env.IP}/api/horarios`, {
            entrada,
            saida,
            hora,
            dia,
            mes,
            ano,
            data,
            id_usuario
        })
    } catch (error) {
        console.log(error)
    }
}

const editar_horarios_saida = (dia, mes, ano, hora_saida, id_usuario) => {
    try {
        
        return axios.post(`http://${process.env.IP}/api/horario-saida`, {
            hora_saida,
            dia,
            mes,
            ano,
            id_usuario
        })
    } catch (error) {
        console.log(error)
    }
}

const horarios_saida = (id_usuario) => {
    try {
        
        var data = new Date();
        var hora = data.getHours();
        var minutos = data.getMinutes();
        const dia = data.getDate();
        const mes = data.getMonth() + 1;
        const ano = data.getFullYear();
        if (hora < 10) hora = "0" + hora;
        if (minutos < 10) minutos = "0" + minutos;
        var hora_saida = hora + ":" + minutos
        return axios.post(`http://${process.env.IP}/api/horario-saida`, {
            hora_saida,
            dia,
            mes,
            ano,
            id_usuario
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    deleteHorarios,
    verificar,
    historico,
    horarios_entrada,
    horarios_saida,
    editar_horarios,
    editar_horarios_saida,
    historicoAdm,
    verificarAll
}
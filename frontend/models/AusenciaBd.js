const {
    default: axios
} = require("axios");

require('dotenv').config()

const verificar = async () => {
    try {
        return await axios.get(`http://${process.env.IP}/api/ausencia`)

    } catch (error) {
        console.log(error)
    }
}

const createAusencia = async (data_entrada, data_saida, id_usuario, ferias, atestado) => {
    try {
        return await axios.post(`http://${process.env.IP}/api/ausencia`, {
            data_entrada,
            data_saida,
            id_usuario,
            ferias,
            atestado
        })
    } catch (error) {
        console.log(error)
    }
}

const getUserId = async (id) => {
    try {
        return await axios.get(`http://${process.env.IP}/api/ausencia/` + id)
    } catch (error) {
        console.log(error)
    }
}

const delet = async (id) => {
    try {
	return await axios.delete(`http://${process.env.IP}/api/ausencia/` + id)
} catch (error) {
	console.log(error)
}
}

module.exports = {
    verificar,
    createAusencia,
    getUserId,
    delet
}
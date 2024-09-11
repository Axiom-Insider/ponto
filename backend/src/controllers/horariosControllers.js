
const horarios = require("../models/horariosModels.js")



const createHorarios = async (req, res) => {
    const result = await horarios.createHorario(req.body)

    return res.status(201).json({
        mensagem: true
    })

}

const upHorarioSaida = async (req, res) => {
    const result = await horarios.upHorarioSaida(req.body)

    if (result) {
        return res.status(201).json({
            mensagem: true
        })
    }
    
    return res.status(201).json({mensagem:false})
}

const editHorarios = async (req, res) => {
    const result = await horarios.editHorarios(req.body)

    return res.status(201).json({
        mensagem: true
    })
}

const getHorariosHistorico = async (req, res) => {
    const result = await horarios.getHorariosHistorico(req.body)

    return res.status(201).json(result)
}

const getHorariosAno = async (req, res) => {
    const result = await horarios.getHorariosAno(req.body)

    return res.status(201).json(result)
}

const getHorariosIdUser = async (req, res) => {
    const result = await horarios.getHorariosIdUser(req.params.id)

    return res.status(201).json(result)
}

const verificarRegistro = async (req, res) => {
    const result = await horarios.verificarRegistro(req.body)
    
    return res.status(201).json(result)
}

const verificarAll = async (req, res)=>{
    const result = await horarios.verificarAll(req.body)

    return res.status(201).json(result)
}

const deleteHorario = async (req, res)=>{

    try {
        const result = await horarios.deleteHorario(req.body.opcao, req.params.id)
        
        return res.status(201).json(result)
    } catch (erro) {
        console.log(erro)
        return res.status(500).json({mesagem:'erro no server'})
    }
}

module.exports = {
    deleteHorario,
    createHorarios,
    getHorariosIdUser,
    verificarRegistro,
    editHorarios,
    upHorarioSaida,
    getHorariosHistorico,
    getHorariosAno,
    verificarAll
}
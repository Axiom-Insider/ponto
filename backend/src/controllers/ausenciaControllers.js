const { json } = require("sequelize")
const modelsAusencia = require("../models/ausenciaModels")


const createAtestado = async (req, res)=>{
    const ausencia = await modelsAusencia.create(req.body)

    return res.status(201).json({mensagem:true, ausencia},)
}

const getAusenciaUser = async (req, res)=>{
    const ausencia = await modelsAusencia.getUser(req.body)

    return res.status(201).json(ausencia)
}

const getAusencia = async(req, res)=>{
    const ausencia = await modelsAusencia.get()

    return res.status(201).json(ausencia)
}

const getAusenciaId = async(req, res)=>{
    const ausencia = await modelsAusencia.getId(req.params.id)

    return res.status(201).json(ausencia)
}

const deleteAusencia = async (req, res)=>{
    const ausencia = await modelsAusencia.deleteUser(req.params.id, req.body)

    return res.status(201).json({mensagem:true})
}

const delet = async (req, res)=>{
    const ausencia = await modelsAusencia.delet(req.params.id)

    return res.status(201).json({mensagem:true})
}

module.exports = {
    createAtestado,
    getAusencia,
    getAusenciaUser,
    getAusenciaId,
    deleteAusencia,
    delet
}
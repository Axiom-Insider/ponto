const feriasModels = require('../models/feriadosModels')


const getAll = async (req, res)=>{
    const feriados = await feriasModels.getAll()

    if(!feriados) return res.status(404).json({msg:'ERRO!'})

    res.status(201).json(feriados)
}

const create = async (req, res)=>{
    const feriados = await feriasModels.create(req.body)
    if(!feriados) return res.status(404).json({msg:'Erro no registro'})
    
    return res.status(201).json({msg:'Registrado com sucesso!'})
    
}

const delet = async (req, res)=>{
    const feriados = await feriasModels.delet(req.params)
    if(!feriados)return res.status(404).json({msg:'ERRO!'})
    
    return res.status(200).json({msg:'Feriado deletado!'})
}


module.exports = {
    create,
    delet,
    getAll
}
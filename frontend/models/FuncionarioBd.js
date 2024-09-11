const {
    default: axios
} = require("axios")
require('dotenv').config()

const getFuncionarios = async () => {
    try {
      return await axios.get(`http://${process.env.IP}/api/funcionario`)  
    } catch (error) {
        console.log(error)
    }
    
}

const getFuncionarioId = async (id) =>{
    try {
         return await axios.get(`http://${process.env.IP}/api/funcionario/${id}`)
    } catch (error) {
        console.log(error)
    }
   
}

const creatFuncionario = async (matricula, senha, nome_completo, cargo) =>{
    try {
       return await axios.post(`http://${process.env.IP}/api/funcionario`,{matricula, senha, nome_completo, cargo}) 
    } catch (error) {
        console.log(error)
    }
    
}

const upFuncionario = async (id_usuasrio, senha)=>{
    try {
        return await axios.put(`http://${process.env.IP}/api/funcionario/senha/` + id_usuasrio, {senha})
    } catch (error) {
        console.log(error)
    }
    
}

module.exports = {
    getFuncionarios,
    getFuncionarioId,
    creatFuncionario,
    upFuncionario
}
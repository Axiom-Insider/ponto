const { default: axios } = require("axios");
require('dotenv').config()

const getAll = async ()=>{ 
    try {
      return await axios.get(`http://${process.env.IP}/api/ferias`)  
    } catch (error) {
        console.log(error)
    }
    
}

const create = async (nome, data, dataSec, nacional)=>{
    try {
	return await axios.post(`http://${process.env.IP}/api/ferias`, {nome, data, dataSec, nacional})
} catch (error) {
	console.log(error)
}
}


const delet = async (id) =>{
    try {
	return await axios.delete(`http://${process.env.IP}/api/ferias/${id}`)
} catch (error) {
	console.log(error)
}
}



module.exports = {
    create, 
    delet,
    getAll
}
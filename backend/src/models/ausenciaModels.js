const { QueryTypes } = require("sequelize")
const bd = require("./bd")



const create = async ({data_entrada, data_saida, atestado, ferias, id_usuario})=>{

    try { 
        const sql = `INSERT INTO ausencia(atestado, ferias, data_entrada, data_saida, id_usuarios) VALUES(?, ?, ?, ?, ?)`
        const [ausencia] = await bd.query(sql,  {replacements:[atestado, ferias, data_entrada, data_saida || '', id_usuario], type: bd.QueryTypes.INSERT})
        const sql2 = `SELECT * FROM usuarios WHERE matricula = '${id_usuario}'`
        const [usuario] = await bd.query(sql2, {replacements:[id_usuario], type:bd.QueryTypes.SELECT})
        return usuario
    } catch (error) {
        console.error('erro ao criar ausencia', error)
        throw error
    }

}

const getUser = async ()=>{
    try {
        const sql = `SELECT * FROM ausencia JOIN usuarios ON ausencia.id_usuarios = usuarios.matricula`
        const [result] = await bd.query(sql)
        return result
    } catch (error) {
        console.error('erro ae puxar dados de usuarios na tabela de ausencia' , error)
        throw error
    }
}

const get = async ()=>{
    try {
        const sql = `SELECT * FROM ausencia JOIN usuarios ON ausencia.id_usuarios = usuarios.matricula`
        const [result] = await bd.query(sql)
        return result
    } catch (error) {
        console.error('pegar ');
        
    }
   
}

const getId = async (id)=>{
    const sql = `SELECT * FROM ausencia WHERE id_usuarios = '${id}'`
    const [ausencia] = await bd.query(sql)

    return ausencia
}

const deleteUser = async (id, {entrada, saida})=>{
    console.log(id, entrada, saida)
    const sql = `DELETE FROM ausencia WHERE id_usuarios = '${id}' AND data_entrada = '${entrada}' AND data_saida = '${saida}'`
    const atestado = await bd.query(sql)

    return atestado
}

const delet = async (id) =>{
    const sql = `DELETE FROM ausencia WHERE id_ausencia = ${id}`
    const atestado = await bd.query(sql)

    return atestado
}



module.exports = {
    create,
    getUser,
    getId,
    get,
    delet,
    deleteUser
}
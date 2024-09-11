const bd = require("./bd")



const create = async ({data_entrada, data_saida, atestado, ferias, id_usuario})=>{
    const sql = `INSERT INTO ausencia(atestado, ferias, data_entrada, data_saida, id_usuarios) VALUES('${atestado}', '${ferias}', '${data_entrada}','${data_saida || ''}', '${id_usuario}')`

    const [ausencia] = await bd.query(sql)

    const sql2 = `SELECT nome_completo FROM usuarios WHERE matricula = '${id_usuario}'`
    const [usuario] = await bd.query(sql2)

    return usuario
}

const getUser = async ()=>{
    const data = new Date()
    const dataHoje = data.toLocaleDateString()
    var dataBd 
    var dataSeparadas
    var ausencia = [] 
    const sql = `SELECT * FROM ausencia JOIN usuarios ON ausencia.id_usuarios = usuarios.matricula`

    const [result] = await bd.query(sql)

    return result
}

const get = async ()=>{
    const sql = `SELECT * FROM ausencia JOIN usuarios ON ausencia.id_usuarios = usuarios.matricula`
    const [result] = await bd.query(sql)
    return result
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
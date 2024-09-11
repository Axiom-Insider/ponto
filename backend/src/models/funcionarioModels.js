const bd = require("./bd")



const createFuncionario = async ({
    nome_completo,
    senha,
    matricula,
    cargo
}) => {
    const sql2 = `SELECT * FROM usuarios WHERE matricula = ${matricula}`
    const [resul] = await bd.query(sql2)
    console.log(resul.length > 0)
    if(resul.length > 0){
        return false;
    }

    const usuario = {
        nome_completo,
        senha,
        matricula,
        cargo,
    }
    const sql = `INSERT INTO usuarios(nome_completo, senha, matricula, cargo, log) VALUES('${usuario.nome_completo}', '${usuario.senha}', '${usuario.matricula}', '${usuario.cargo}', 0)`
    const [resultado] = await bd.query(sql);

    return true;
}

const getAllFuncionario = async () => {
    const sql = "SELECT * FROM usuarios WHERE adm = 0"
    const [usuario] = await bd.query(sql);

    return usuario
}

const getIdFuncionario = async (matricula) => {
    const sql = `SELECT * FROM usuarios WHERE matricula = '${matricula}'`
    const [usuario] = await bd.query(sql)
    return usuario
}

const deleteFuncionario = async (matricula) => {
    const sqlHorarios = `DELETE FROM horarios WHERE id_usuarios = '${matricula}'`
    const horarios = bd.query(sqlHorarios)

    const sql = `DELETE FROM usuarios WHERE matricula = '${matricula}' `
    const usuario = bd.query(sql)

    return usuario
}
const setSenha = (matricula, {senha})=>{
    const sql = `UPDATE usuarios SET senha = '${senha}', log = '${1}' WHERE matricula = '${matricula}'`
    const usuario = bd.query(sql)

    return usuario
}

const setFuncionario = async (matricula, {
    nome_completo,
    senha,
}) => {

    const sql = `UPDATE usuarios SET  nome_completo = '${nome_completo}', senha = '${senha}', matricula = '${matricula}' WHERE matricula = '${matricula}' `
    const usuario = await bd.query(sql);

    return usuario;
}


module.exports = {
    createFuncionario,
    getAllFuncionario,
    getIdFuncionario,
    deleteFuncionario,
    setFuncionario,
    setSenha,
  
}
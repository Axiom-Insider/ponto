const bd = require('./bd')



const create = async ({
    nome,
    data,
    dataSec,
    nacional
}) => {

    try {
        const sql = `INSERT INTO feriados(nome, data, dataSec, nacional) VALUES ('${nome}', '${data}', '${dataSec || ''}', '${nacional || 0}' )`
        const res = await bd.query(sql)
        console.log('Feriado criado com sucesso')
        return res
    } catch (error) {
        console.log(error)
        return false
    }


}

const getAll = async () => {
    try {
        const sql = 'SELECT * FROM feriados'
        const [res] = await bd.query(sql)
        return res
    } catch (error) {
        console.log(error)
        return false
    }
}


const delet = async ({
    id
}) => {
    try {
        const sql = `DELETE FROM feriados WHERE id_feriados = ${id}`
        const res = await bd.query(sql)
        console.log('deletado')
        return res
    } catch (error) {
        console.log(error)
        return false
    }

}


module.exports = {
    getAll,
    create,
    delet
}
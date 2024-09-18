const { log } = require("handlebars");
const bd = require("./bd")

const verificarSeMatriculaExiste = async (matricula) => {
    try {
        // Faz um SELECT EXISTS para verificar se o registro com a matrícula existe
        const sql = `SELECT EXISTS(SELECT 1 FROM usuarios WHERE matricula = ?) AS existe`;
        const [resultado] = await bd.query(sql, {
            replacements: [matricula],
            type: bd.QueryTypes.SELECT
        });

        // Dependendo do banco de dados, o retorno pode ser um objeto com uma chave numérica ou string
        const existe = Object.values(resultado)[0];  // Pega o primeiro valor do resultado
        console.log(existe)
        return existe === 1;  // Retorna true se existe, false se não
    } catch (error) {
        console.error('Erro ao verificar existência do registro:', error);
        throw error;
    }
};



const createFuncionario = async ({nome_completo, senha, matricula, cargo}) => {
    try {
        const resul = await verificarSeMatriculaExiste(matricula)
        if(resul){
            return {mensagem:'Essa matrícula já existe', alert:false}
        }
        const usuario = {nome_completo, senha, matricula, cargo}
        const sql = `INSERT INTO usuarios(nome_completo, senha, matricula, cargo, log) VALUES(?, ?, ?, ?, ?)`
        const [resultado] = await bd.query(sql, {replacements:[usuario.nome_completo, usuario.senha, usuario.matricula, usuario.cargo, 0], type: bd.QueryTypes.INSERT});
        return {mensagem:'Funcionário cadastrado com sucesso', alert:true}
    } catch (error) {
        console.error('erro ao criar novo usuario', error)
        return {mensagem:'Erro ao cadastrar Funcionário', alert:false}
    }
}

const getAllFuncionario = async () => {
    try {
        const sql = "SELECT * FROM usuarios WHERE adm = 0"
        const [usuario] = await bd.query(sql);
        if(usuario.length > 0){
           return usuario 
        }else{
            return false
        }
        
    } catch (error) {
        console.error('Erro ao buscar administradores', error)
        throw error
    }
    
}

const getIdFuncionario = async (matricula) => {
    try {
        // Use o ? para definir o local onde a variável será passada
        const sql = `SELECT * FROM usuarios WHERE matricula = ?`
        
        // Passe o valor de matricula como um array no segundo argumento
        const [usuario] = await bd.query(sql, { replacements: [matricula], type: bd.QueryTypes.SELECT });
        
        return usuario;
    } catch (error) {
        console.error('Erro ao buscar usuário:', error)
        throw error // Relance o erro se precisar lidar com ele em outro lugar
    }
}

const deleteFuncionario = async (matricula) => {
    try {
        const sqlHorarios = `DELETE FROM horarios WHERE id_usuarios = ?`
        const [horarios] = bd.query(sqlHorarios, [matricula])

        if(horarios.length > 0){
            const sql = `DELETE FROM usuarios WHERE matricula = ?`
            const usuario = await bd.query(sql, [matricula])
            return usuario
        }else{
            return false
        }

    } catch (error) {
        console.error('erro ao excluir usuario', error);
        throw error;
        
    }
 
}

const setSenha = async (matricula, {senha})=>{
    try {
        const sql = `UPDATE usuarios SET senha = ?, log = ? WHERE matricula = ?`
        const usuario = await bd.query(sql, {replacements:[senha, 1, matricula], type: bd.QueryTypes.UPDATE })
        return usuario
    } catch (error) {
        console.error('ERRo ao setar senha', error)
        throw error
    }
}

const setFuncionario = async (matricula, {
    nome_completo,
    senha,
}) => {
    try {
        const sql = `UPDATE usuarios SET  nome_completo = ?, senha = ?, matricula = ? WHERE matricula = ?`
        const usuario = await bd.query(sql, { replacements:[nome_completo, senha, matricula, matricula], type: bd.QueryTypes.UPDATE })
        return usuario
    } catch (error) {
        console.error('erro ao editar funcionario', error)
        throw error        
    }
 
}


module.exports = {
    createFuncionario,
    getAllFuncionario,
    getIdFuncionario,
    deleteFuncionario,
    setFuncionario,
    setSenha,
  
}
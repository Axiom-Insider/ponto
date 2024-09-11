module.exports = (horarios)=>{
    var entrada
    var saida
    var registro
    if (horarios.length > 0) {
        if (horarios[0].entrada == 1 && horarios[0].saida == 1) {
            return {registro:true, entrada:true, saida:true}
        }
        if (horarios[0].entrada == 1) {
            return {registro:true, entrada:true, saida:false}
        }
        if(horarios[0].entrada == 0 && horarios[0].saida == 0){
            return {registro:false, entrada:false, saida:false}
        }
    }
    if(horarios.length <= 0){
        return {registro:false, entrada:false, saida:false}
    }

    
}
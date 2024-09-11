module.exports = (data)=>{
    if(data == false){
        return ''
    }
    const dataFormatada = new Date(data)
    const dia = (dataFormatada.getDate()+ 1).toString().padStart(2, '0');
    const mes = (dataFormatada.getMonth() + 1).toString().padStart(2, '0'); // Mês começa do 0
    const ano = dataFormatada.getFullYear();
    return `${dia}/${mes}/${ano}`;
}
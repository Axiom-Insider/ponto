

const selectMes = document.getElementById('mes');
const selectAno = document.getElementById('ano')
const formulario = document.getElementById('form');

selectMes.addEventListener('change', () => {
  formulario.submit();
})

selectAno.addEventListener('change', ()=>{
    formulario.submit();
})    



const enviarFormulario = (id, valor)=>{
    const ano = selectAno.value
    const mes = selectMes.value
  
    var formulario = document.getElementById('form'+id)
    formulario.elements["ano"].value = ano
    formulario.elements["mes"].value = mes
    formulario.elements["opcao"].value = valor
    formulario.submit()
}
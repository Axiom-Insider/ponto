
const selectMes = document.getElementById('mes');
const selectAno = document.getElementById('ano')
const formulario = document.getElementById('form');

selectMes.addEventListener('change', () => {
  formulario.submit();
})

selectAno.addEventListener('change', ()=>{
    formulario.submit();
})    



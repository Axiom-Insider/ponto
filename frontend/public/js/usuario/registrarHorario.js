

    const horaRegistrar = document.getElementById("hora")
    const load = document.getElementById('carregar')
    const form = document.getElementById('form')
    const publicKey = "BFIh0Kb4ibNx0HMqyZSfoYjPk84RHwWYhfP1Kv8wRlInctewiXjzpoW_B-9KGuGJx8V_VdpoLi0kCPw9ix5nXOg"

    load.innerHTML += `<div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`

    const exibirHoraAtual = async ()=>{
    var data = new Date();
    var hora = data.getHours();
    var minutos = data.getMinutes();
    var segundos = data.getSeconds();
  
    if (hora < 10) hora = "0" + hora;
    if (minutos < 10) minutos = "0" + minutos;
    if (segundos < 10) segundos = "0" + segundos;
  
    var horaAtual = hora + ":" + minutos + ":" + segundos;

   horaRegistrar.innerHTML = await `${horaAtual}`
      load.innerHTML = ''
  }
  setInterval(exibirHoraAtual, 1000)

  const enviar = ()=>{
    const e = window.confirm('Deseja confirmar?')
  } 

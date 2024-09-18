const Sequelize = require("sequelize");
require('dotenv').config();

const sequelize = new Sequelize('ponto','polo', 'PoloUABlab',{
    host:process.env.HOST,
    port:process.env.PORT,
    dialect:'mysql',
    dialectOptions:{
	connectTimeout: 60000 	
},
    define:{
        charset:'utf8',
        callate: 'utf8_general_ci',
        timestamps: true
    }, 
    logging:false
})

sequelize.authenticate().then(()=>{
    console.log("conectado com sucesso")
}).catch((erro)=>{
    console.log("erro ao conectar "+ erro)
})


module.exports =  sequelize;

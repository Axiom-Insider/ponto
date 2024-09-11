const express = require("express");
const app = express();
const cors = require('cors');
require('dotenv').config()

app.use(cors());

app.use(express.json())

//router
const routes = require("./routes/routes");

app.use("/api", routes)


app.listen(2000, ()=>{
    console.log("API do banco de dados on")
})



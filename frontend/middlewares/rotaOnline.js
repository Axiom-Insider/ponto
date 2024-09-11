module.exports = (req, res, next)=>{
    
    if(!req.session.user){
        req.flash("erro", " Faça autenticação das suas credenciais")
        return res.redirect("/PoloUAB/login")
    }

    next()
}
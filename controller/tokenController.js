const BadRequest = require('./utils/badRequestErrors');
const Usuario = require('../model/usuario');
const bcrypt = require('bcrypt')
const Jwt = require('jsonwebtoken')

exports.gerarToken = (req,res) => {
    try{
        if(req.body && req.body.usuario && req.body.senha){
            const usuario = req.body.usuario
            const senha = req.body.senha

            Usuario.findOne({nome:usuario}, (err, user ) => {
                if(err){
                    res.status(500).json({error: "Erro interno no servidor!", message: err})
                }
                if(user && bcrypt.compareSync(senha, user.senha)){
                    const token = Jwt.sign({id: user.id, role: user.role},"encryptor",{expiresIn:"1h"} )
                    res.json({token:token, expires_in: "1h"})
                }else{
                    res.status(401).json({erro:"Usuario Invalido!"})
                }
            })
        }else{
            res.status(400).json({erro:"Necessario enviar campos usuario e senha!"})
        }
    }catch{
        res.status(500).send("Erro interno no servidor.")
    }
}
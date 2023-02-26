const jwt = require('jsonwebtoken');
const constants = require('../constants/constants');

exports.validarToken = (req,res,next) => {
    try{
        const token = req.header('x-auth-token');
        
        if(token){
            jwt.verify(token, constants.JWT_VERIFICATOR, (err,decoded) => {
                if(err){
                    res.status(400).json({erro: "Houve um problema ao validar Token!", message:err})
                }else{
                    next();
                }
            })
        }else{
            res.status(400).json({erro:"Necessario informar o token de autenticacao!"})
        }
    }catch{
        res.status(500).json({erro: "Erro interno no servidor!"})
    }
}


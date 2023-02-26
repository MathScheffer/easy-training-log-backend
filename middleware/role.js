const constants = require('../constants/constants');
const jwt = require('jsonwebtoken');

const validarPermissao = (token, permissao, callback) => {

    if(!constants.PERMISSIONS.includes(permissao.toUpperCase())){
        const error = {
            status: 400,
            erro: "Necessario informar a Role"
        }
        callback(error,null);
    }

    jwt.verify(token,constants.JWT_VERIFICATOR,(err,payload) => {
        if(err){
            const error = {
                status:403,
                erro:"Token invalido!"
            }
            callback(error,null)
        }else{
            const permissions = payload.role;
            if(permissions == permissao && permissao != "DISABLED"){
                callback(null,{
                    status:200,
                    erro:"Permissao concedida!"
                 })
            }else{
                const error = {
                    status:401,
                    erro:"Permissao nao concedida!"
                 }
                callback(error,null)  
            }
        }
    })
}


exports.validarTokenAdm = (req,res,next) => {
    try{
        const token = req.get('x-auth-token');

        validarPermissao(token, 'ADM',(err,sucess) => {
            if(err){
                res.status(err.status).json(err);
            }else{
                next();
            }
        })
    }catch(error){
        res.status(500).json({erro: "Erro interno no servidor!"})
    }
}


exports.validarTokenUsuarioDesabilitado = (req,res,next) => {
    try{
        const token = req.get('x-auth-token');

        validarPermissao(token, 'DISABLED',(err,sucess) => {
            if(err){
                res.status(err.status).json(err);
            }else{
                next();
            }
        })
    }catch(error){
        res.status(500).json({erro: "Erro interno no servidor!"})
    }
}
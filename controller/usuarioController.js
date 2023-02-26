const bcrypt = require('bcrypt')
const Usuario = require('../model/usuario');
const Rotina = require('../model/rotina');
const BadRequestErrors = require('./utils/badRequestErrors');
const UnprocessableEntityErrors = require('./utils/unprocessableEntityErrors');
const Utils = require('./utils/utils');


exports.adicionar =(req,res) => {
    try{
        console.log(req.body)
        req.body.senha = req.body.senha ? bcrypt.hashSync(req.body.senha,10) : null;
        req.body.role = req.body.role ? req.body.role.toUpperCase() : req.body.role;
        const user = new Usuario(req.body);
        
        user.save((err,User) => {
            if(err){
                const badRequest = new BadRequestErrors(JSON.parse(JSON.stringify(err.errors || err)))
                const unprocessableError = new UnprocessableEntityErrors(JSON.parse(JSON.stringify(err)))

                //TODO: Adicionar um validador caso a mensagme saia com chave:Array vazio
                
                if(Utils.validaJsonVazio(badRequest.getMessages())){
                    res.status(400).json(badRequest.getMessages())}
                else if(Utils.validaJsonVazio(unprocessableError.getMessages()))
                    res.status(422).json(unprocessableError.getMessages())
                else
                    res.status(500).json({"Message":"Erro interno no servidor!"})
            }else{
                res.status(201).json(User)
            }
        })
    }catch(erro){
        res.status(500).json({message:"Erro interno no servidor!"})
    }
}

exports.listar = (req,res) => {
   try{
        Usuario.find({}, (err,User) => {
            if(err){
                res.status(500).json({message:"Erro interno no servidor!"})
            }else{
                res.json(User)
            }
        })
   }catch{
        res.status(500).json({message:"Erro interno no servidor!"})
    }
}

exports.encontrarUsuario = (req,res) => {
    //try{
        if(req.params.id){
            const id = req.params.id
            if(id.length != 24){
                res.status(400).send("Id deve conter exatamente 24 caracteres!")

            }else{
                Usuario.findOne({_id: req.params.id}).populate('rotina').exec( function(err, User){
                    if(err){
                        console.log(err)
                        res.status(500).send("Erro interno no servidor!")
                    }else{
                        if(User){
                            res.json(User)
                        }else{
                            res.status(404).send("Usuario nao encontrado!")
                        }
                    } 
                })
            }
        }else{
            res.status(400).send("Necessario informar um id!")
        }
    /*}catch{
        res.status(500).send("Erro interno no Servidor!")
    }*/
}

exports.encontrarUsuarioPorNome = (req,res) => {
    //if(req.query.nome){
        //const nome = req.query.nome
        Usuario.find({"nome": {$regex: `.*${req.query.nome}.*`}}).populate('rotina').exec( function(err, User){
            if(err){
                console.log(err)
                res.status(500).send({"message":"Erro interno no servidor!"})
            }else{
                if(User && User != 0){
                    res.json(User)
                }else{
                    res.status(404).send({"message":"Usuario nao encontrado!"})
                }
            } 
        })
    //}
}

exports.atualizarUsuario = (req,res) => {
    try{
        const id = req.params.id;
        const body = req.body;
        console.log(body)
        Usuario.findOneAndUpdate({_id: id},body,{new:true},(err,usuario) => {
            if(err){
                const badRequest = new BadRequestErrors(JSON.parse(JSON.stringify(err.errors || err)))
                const unprocessableError = new UnprocessableEntityErrors(JSON.parse(JSON.stringify(err)))

                if(Utils.validaJsonVazio(badRequest.getMessages()))
                    res.status(400).json(badRequest.getMessages())
                else if(Utils.validaJsonVazio(unprocessableError.getMessages()))
                    res.status(422).json(unprocessableError.getMessages())
                else
                    res.status(500).json({message: "Houve um problema ao atualizar usuario!", erro: err})

            }else if(usuario){
                res.status(200).json({message: "Usuario atualizado com sucesso!", usuario: usuario})
            }else{
                res.status(404).json({message: "Usuario nao encontrado!"})
            }
        })
    }catch{
        res.status(500).json({message: "Erro interno no servidor!", erro:err})
    }
}


exports.excluirUsuario = (req,res) => {
    try{
        const id = req.params.id;

        Usuario.findOneAndDelete({_id: id}, (err, usuarioDeletado) => {
            if(err){
                res.status(500).json({message: "Erro interno no servidor!", erro: err})
            }else{
                res.status(200).json({message: "Usuario excluido com sucesso!"})
            }
        })
    }catch{
        res.status(500).json({message: "Erro interno no servidor!", erro:err})
    }
}

exports.incrementarRotina = async(req,res) => {
    try{
        const id = req.params.id;
        const rotinaBody = req.body.rotina;

        if(rotinaBody){
            const user = await Usuario.findOne({_id: id}).populate('rotina').exec();
            const rotina = await Rotina.findOne({_id:rotinaBody});

            if(!user || !Utils.validaJsonVazio(user)){
                res.status(404).json({message: "usuario nao encontrado!"})
                return ;
            }else if(!rotina || !Utils.validaJsonVazio(rotina)){
                res.status(404).json({message: "rotina nao encontrada!"})
                return ;
            }else if(!user.rotina.includes(rotina)){

                const diaRotina = rotina.dia;

                if(user.rotina.filter(r => r.dia == diaRotina).length == 0){
                    user.rotina.push(rotina);
                }else{
                    res.status(422).json({message: "Usuario ja possui uma rotina neste dia!"})
                    res.end();
                    return ;
                }
            }else{
                res.status(422).json({message: "Rotina ja adicionada!"})
                return ;
            }
 
            
            Usuario.findOneAndUpdate({_id: id},{rotina:user.rotina},{new:true},(err,usuario) => {
                if(err){
                    const badRequest = new BadRequestErrors(JSON.parse(JSON.stringify(err.errors || err)))
                    const unprocessableError = new UnprocessableEntityErrors(JSON.parse(JSON.stringify(err)))
    
                    if(Utils.validaJsonVazio(badRequest.getMessages()))
                        res.status(400).json(badRequest.getMessages())
                    else if(Utils.validaJsonVazio(unprocessableError.getMessages()))
                        res.status(422).json(unprocessableError.getMessages())
                    else
                        res.status(500).json({message: "Houve um problema ao atualizar usuario!",erro:err})
    
                }else if(usuario){
                    res.status(200).json({message: "Usuario atualizado com sucesso!", usuario: usuario})
                }else{
                    res.status(404).json({message: "Usuario nao encontrado!"})
                }
            })
        
        }else{
            res.status(400).json({message: "Necessario informar a rotina!"})
        }
        
    }catch(err){
        res.status(500).json({message: "Erro interno no servidor!", erro:err})
    }
}

exports.decrementarRotina = async(req,res) => {
    try{
        const id = req.params.id;
        const rotinaBody = req.body.rotina;

        if(rotinaBody){
            const user = await Usuario.findOne({_id: id}).exec();
            const rotina = await Rotina.findOne({_id:rotinaBody});

            if(!user || !Utils.validaJsonVazio(user)){
                res.status(404).json({message: "usuario nao encontrado!"})
                return ;
            }else if(!rotina || !Utils.validaJsonVazio(rotina)){
                res.status(404).json({message: "rotina nao encontrada!"})
                return ;
            }else if(user.rotina.includes(rotinaBody)){
                //let arr = user.rotina
                const i = user.rotina.indexOf(rotinaBody)
                user.rotina.splice(i,1)
            }else{
                res.status(422).json({message: "Rotina ja retirada!"})
                return ;
            }
 
            
            Usuario.findOneAndUpdate({_id: id},{rotina:user.rotina},{new:true},(err,usuario) => {
                if(err){
                    const badRequest = new BadRequestErrors(JSON.parse(JSON.stringify(err.errors || err)))
                    const unprocessableError = new UnprocessableEntityErrors(JSON.parse(JSON.stringify(err)))
    
                    if(Utils.validaJsonVazio(badRequest.getMessages()))
                        res.status(400).json(badRequest.getMessages())
                    else if(Utils.validaJsonVazio(unprocessableError.getMessages()))
                        res.status(422).json(unprocessableError.getMessages())
                    else
                        res.status(500).json({message: "Houve um problema ao atualizar usuario!",erro:err})
    
                }else if(usuario){
                    res.status(200).json({message: "Rotina removida com sucesso!", usuario: usuario})
                }else{
                    res.status(404).json({message: "Usuario nao encontrado!"})
                }
            })
        
        }else{
            res.status(400).json({message: "Necessario informar a rotina!"})
        }
        
    }catch(err){
        res.status(500).json({message: "Erro interno no servidor!", erro:err})
    }
}
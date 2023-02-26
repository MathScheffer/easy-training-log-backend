const Rotina = require('../model/rotina');
const BadRequestErrors = require('./utils/badRequestErrors')
const Utils = require('./utils/utils')
const Constants = require('../constants/constants');
const { validaCamposObrigatorios } = require('./utils/utils');

exports.adicionar = async(req,res) => {
    try{
        const rotina = new Rotina(req.body);
        const rotinas = await Rotina.find({usuario: rotina.usuario}).exec();

        if(verificarCadastroRotina(rotina, rotinas)){
            rotina.save((err,Rotina) => {
                if(err) {
                    const badRequest = new BadRequestErrors(JSON.parse(JSON.stringify(err.errors || err)))
                    
                    if(badRequest.getMessages())
                        res.status(400).json(badRequest.getMessages())
                    else
                        res.status(500).json({"Message":"Erro interno no servidor!"})
                }else{
                    res.status(201).json(Rotina);
                }
            })
        }else{
            res.status(422).json({message: `O usuario ja possui uma rotina no dia de ${rotina.dia}`})
        }
    }catch{
        res.status(500).json({message: "Erro interno no servidor!"})
    }

}

const verificarCadastroRotina = (novaRotina, rotinasAntigas) => {
    const dia = novaRotina.dia.toLowerCase();
    for(rotina of rotinasAntigas){
        if(rotina.dia.toLowerCase() == dia){
            return false
        }
    }

    return true
}

exports.listar = (req,res) => {
    try{
        Rotina.find({}, (err, listaRotinas) => {
            if(err){
                res.status(500).json({erro: "Erro interno no servidor!"})
            }

            if(listaRotinas){
                res.json(listaRotinas)
            }else{
                res.status(404).json({erro: "Nao ha rotinas registradas!"})
            }
        })
    }catch{
        
    }
}

exports.encontrarRotina = (req,res) => {
    Rotina.findById(req.params.id, (err,rotina) => {
        if(err){
            res.send(err)
        }else if(rotina){
            res.json(rotina)
        }else{
            res.status(404).json({message: "Rotina nao encontrada!"})
        }
    })
}

exports.atualizar = (req,res) => {
    try{
        const id = req.params.id;
        const body = req.body;

        Rotina.findByIdAndUpdate(id, body,{new:true},(err,rotina) => {
            if(err){
                res.status(500).json({erro: "Houve um problema ao atualizar rotina!"})
            }

            if(rotina){
                res.status(200).json({message: "Rotina atualizada com sucesso!", rotina: rotina})
            }else{
                res.status(404).json({message: "Rotina nao encontrada!"})
            }
        })
    }catch{
        res.status(500).json({erro: "Erro interno no servidor!"})
    }
}

exports.encontrarExercicio = async(req,res) => {
    try{    
        const id = req.params.id;
        const rotina = await Rotina.findOne({"exercicios._id":id}).exec();

        if(rotina){
            res.send(rotina.exercicios.filter(e => e._id == id))
        }else{
            res.status(404).json({message: "Exercicio nao encontrado!"})
            console.log(rotina)
        }
    }catch(err){
        res.status(500).json({message: "Erro interno no servidor.", error: err.message})
    }
}

exports.atualizarExercicio = (req,res) => {
    try{
        const id = req.params.id_exercicio;
        const body = req.body

        if(!Utils.validaParametrosValidos(body, Constants.EXERCICIOS_PARAMS)){
            res.status(400).json(
                {
                    erro:"Ha parametros que nao sao validos no corpo da requisicao!",
                    parametros_validos: Constants.EXERCICIOS_PARAMS
                })

        }else if (!Utils.validaJsonVazio(body)){
            res.status(400).json({Message:"Corpo da requisicao Vazio: Nenhum dado foi modificado!"})    

        }else{
            const bodyFormatado = Utils.formatarObjetoInterno("exercicios",body);

            Rotina.findOneAndUpdate({'exercicios._id':id},
            {$set:bodyFormatado},
            {new:true},(err, rotina) => {
                if(err){
                    const badRequest = new BadRequestErrors(JSON.parse(JSON.stringify(err.errors || err)))
                    
                    if(Utils.validaJsonVazio(badRequest.getMessages()))
                        res.status(400).json(badRequest.getMessages())
                    else
                        res.status(500).json({erro: "Houve um problema ao atualizar exercicio!"})
                }
                else if(rotina && rotina.exercicios){
                    res.status(200).json({message: "Exercicio da rotina atualizado com sucesso!", exercicio: rotina.exercicios.filter(e => e._id == id)[0]})
                }else{
                    res.status(404).json({message: "Exericicio nao encontrado!"})
                }
            })
        }

    }catch(error){
        res.status(500).json({erro: "Erro interno no servidor!"})
    }
}

exports.registrarExercicio = (req,res) => {
    try{
        const id = req.params.id_exercicio;
        const body = req.body

        if(!Utils.validaParametrosValidos(body, Constants.EXERCICIOS_REGISTRO)){
            res.status(400).json(
                {
                    erro:"Ha parametros que nao sao validos no corpo da requisicao!",
                    parametros_validos: Constants.EXERCICIOS_REGISTRO
                })

        }else if (!Utils.validaJsonVazio(body)){
            res.status(400).json({Message:"Corpo da requisicao Vazio: Nenhum dado foi modificado!"})    

        }else{
            const bodyFormatado = Utils.formatarObjetoInterno("exercicios",body);
            Rotina.findOneAndUpdate({'exercicios._id':id},
            {$set:bodyFormatado},
            {new:true},(err,exercicio) => {
                if(err){
                    const badRequest = new BadRequestErrors(JSON.parse(JSON.stringify(err.errors || err)))
                    
                    if(Utils.validaJsonVazio(badRequest.getMessages()))
                        res.status(400).json(badRequest.getMessages())
                    else
                        res.status(500).json({erro: "Houve um problema ao atualizar exercicio!"})
                }
                else if(exercicio){
                    res.status(200).json({message: "Exercicio da rotina atualizado com sucesso!", exercicio: exercicio})
                }else{
                    res.status(404).json({message: "Exericicio nao encontrado!"})
                }
            })
        }

    }catch(error){
        res.status(500).json({erro: "Erro interno no servidor!"})
    }
}

exports.adicionarExercicio = async(req,res) => {
    try{
        const id = req.params.id;
        const exercicio = req.body;

        if(!Utils.validaParametrosValidos(exercicio, Constants.EXERCICIOS_PARAMS)){
            res.status(400).json(
                {
                    erro:"Ha parametros que nao sao validos no corpo da requisicao!",
                    parametros_validos: Constants.EXERCICIOS_PARAMS
                })

        }else if (!Utils.validaJsonVazio(exercicio)){
            res.status(400).json({Message:"Corpo da requisicao Vazio: Nenhum dado foi modificado!"})    
        }else{
            const rotina = await Rotina.findOne({_id: id}).exec();  
            
            if(rotina){
                let haCamposFaltando = Utils.haCamposObrigatoriosFaltando(exercicio,["nome","series","repeticoes"]);
                if(haCamposFaltando){
                    res.status(400).json({message: "Ha parametros faltando: " + haCamposFaltando})
                }
                
                else if(verificarCadastroExercicio(exercicio, rotina.exercicios)){
                    rotina.exercicios.push(exercicio)

                    Rotina.findByIdAndUpdate(id, rotina,{new:true},(err,rotina) => {
                        if(err){
                            res.status(500).json({erro: "Houve um problema ao atualizar rotina!"})
                        }
            
                        if(rotina){
                            res.status(200).json({message: "Rotina atualizada com sucesso!", rotina: rotina, novo_exercicio: exercicio})
                        }else{
                            res.status(404).json({message: "Rotina nao encontrada!"})
                        }
                    })
                }else{
                    res.status(422).json({message: `Ja existe o exercicio "${exercicio.nome}"!`})
                }
            }else{
                res.status(404).json({message: "Rotina nao encontrada."})
            }
        }

    }catch(err){
        res.status(500).json({message: "Erro interno no servidor!", erro: err.message})
    }
}

/* exports.adicionarExercicios = async(req,res) => {
    try{
        const id = req.params.id;
        const exercicio = req.body;

        if(!Utils.validaParametrosValidos(exercicio, Constants.EXERCICIOS_PARAMS)){
            res.status(400).json(
                {
                    erro:"Ha parametros que nao sao validos no corpo da requisicao!",
                    parametros_validos: Constants.EXERCICIOS_PARAMS
                })

        }else if (!Utils.validaJsonVazio(exercicio)){
            res.status(400).json({Message:"Corpo da requisicao Vazio: Nenhum dado foi modificado!"})    
        }else{
            const rotina = await Rotina.findOne({_id: id}).exec();  
            
            if(rotina){
                if(verificarCadastroExercicio(exercicio, rotina.exercicios)){
                    rotina.exercicios.push(exercicio)

                    Rotina.findByIdAndUpdate(id, rotina,{new:true},(err,rotina) => {
                        if(err){
                            res.status(500).json({erro: "Houve um problema ao atualizar rotina!"})
                        }
            
                        if(rotina){
                            res.status(200).json({message: "Rotina atualizada com sucesso!", rotina: rotina, novo_exercicio: exercicio})
                        }else{
                            res.status(404).json({message: "Rotina nao encontrada!"})
                        }
                    })
                }else{
                    res.status(422).json({message: `Ja existe o exercicio ${exercicio.nome}!`})
                }
            }else{
                res.status(404).json({message: "Rotina nao encontrada."})
            }
        }

    }catch(err){
        res.status(500).json({message: "Erro interno no servidor!", erro: err.message})
    }
} */

verificarCadastroExercicio = (exercicio, exercicios) => {
    const nome = exercicio.nome;
    
    for(e of exercicios){
        if(e.nome == nome){
            return false
        }
    }

    return true
}

exports.excluir = (req,res) => {
    try{
        const id = req.params.id;
        
        Rotina.findOneAndDelete({_id:id}, (err, rotinaDeletada) => {
            if(err){
                res.status(500).json({erro: "Erro interno no servidor!"})

            }else if(rotinaDeletada){
                res.json({message: "Rotina excluida com sucesso!"})

            }else{
                res.status(404).send("Rotina nao encontrada!")
            }
        })
    }catch{
        res.status(500).json({erro: "Erro interno no servidor!"})
    }
}

exports.excluirExercicio = (req,res) => {
    try{
        const id = req.params.id;

        Rotina.updateOne({'exercicios._id':id}, {
            $pull:{ exercicios:{_id:id}}}, 
            (err, rotina) => {
                if(err){
                    res.status(500).send({message: "Erro interno no servidor!", error: err.message})
                }else if(rotina){
                    if(rotina.n && rotina.nModified && rotina.ok){
                        res.json({message: 'Exercicio excluido com sucesso!'})
                    }else{
                        res.json({message: 'Exercicio ja foi excluido ou nao esta mais na base de dados.'})
                    }
                    
                }else{
                    res.status(404).json({message: "Rotina nao encontrada!"})
                }
            })
    }catch(err){
        res.status(500).json({message: "Erro interno no servidor!", error: err.message})
    }
}
const Exercicio = require('../model/exercicio');
const BadRequestErrors = require('./utils/badRequestErrors')

exports.adicionar = (req,res) => {
    try{
        const exercicio = new Exercicio(req.body);
        exercicio.save((err,Exercicio) => {
            if(err) {
                const badRequest = new BadRequestErrors(JSON.parse(JSON.stringify(err.errors)))
                if(badRequest.getMessages())
                    res.status(400).json(badRequest.getMessages())
                else
                    res.status(500).json({"Message":"Erro interno no servidor!"})
            }else{
                res.status(201).json(Exercicio);
            }
        })
    }catch{
        res.status(500).json({"erro":"Erro interno no servidor!"});
    }
}
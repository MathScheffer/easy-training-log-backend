var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const UsuarioSchema = new Schema({
    nome: {type: String, required:[true,"Necessario informar o nome do usuario!"],unique:[true, "nome de usuario precisa ser unico"]},
    senha: {type: String, required:[true, "Necessario informar a senha do usuario!"]},
    whatsapp:{type: String, required:[true, "Necessario informar o telefone / whatsapp do usuario!"]},
    idade: Number,
    peso:Number,
    sexo: String,
    objetivo: String,
    rotina: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rotina"
      }],
      
    role:{type: String, required:[true, "Necessario informar a role do usuario!"]}
},{versionKey:false})

module.exports = mongoose.model("Usuario",UsuarioSchema)
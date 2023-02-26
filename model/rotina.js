var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const RotinaSchema = new Schema({
    dia:{type:String, 
        required: [true,"necessario informar o nome da rotina!"]},
    exercicios: [{
        nome: {type:String, required: [true,"necessario informar o nome do exercicio!"]},
        carga: {type:Number, default:0},
        repeticoes: {type:String, required: [true,"necessario informar a quantidade de repeticoes!"]},
        series: {type:String, required: [true,"necessario informar a quantidade de series!"]},
        cargaAlcancada:{
            type: Number,
            default:0
         },
        repeticoesFeitas: {
            type: String,
            default: 0
        }
    }],
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required:[true,"necessario informar o id do usuario!"]
      },
    //exercicios:[{ type: Schema.Types.ObjectId, ref: 'Exercicio' }]
},{
    versionKey:false
})

module.exports = mongoose.model("Rotina",RotinaSchema)
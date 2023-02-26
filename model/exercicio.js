var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const ExercicioSchema = new Schema({
    nome: {type: String, required:[true, "Necessario informar o nome do exercicio!"]},
    carga: {type: Number, required:[true, "Necessario informar a carga para o exercicio!"]},
    repeticoes: {type:Number, required:[true, "Necessario informar o numero de repeticoes da serie!"]},
    series: {type: Number, required:[true, "Necessario informar a quantidade de series!"]},
    cargaAlcancada: Number,
    repeticoesAlcançadas: Number
},{
    versionKey:false
})

module.exports = mongoose.model("Exercicio",ExercicioSchema);
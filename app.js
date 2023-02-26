const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose')
const port = 3000
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs') 

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

const rotasToken = require('./rotas/token');
const rotasRotinas = require('./rotas/rotina_rotas');
const usuarioRotas = require('./rotas/usuario_rotas');

const middleware = require('./middleware/auth');

//Configuração do Mongoose
mongoose.connect('mongodb://localhost/easy_training_log', {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useFindAndModify: false
  }).then(()=> {
    console.log('BD conectado');
  })
  .catch((error)=> {
    console.log('Error ao conectar ao BD', error);
  });
mongoose.Promise = global.Promise;

app.use(cors())

const swaggerDocument = YAML.load('./swagger.yaml')
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use('/api/token', rotasToken)
app.use(middleware.validarToken)
app.use('/api/rotinas',rotasRotinas);
app.use('/api/usuarios',usuarioRotas)




app.listen(port, () => {
    console.log(`Iniciando o servidor: http://localhost:${port}`)
  })
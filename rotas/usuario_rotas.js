const express = require('express')
const router = express.Router();

const controller = require('../controller/usuarioController');
const middleware_role = require('../middleware/role')

//router.use(middleware_role.validarTokenAdm)
router.post('/',controller.adicionar)


router.get('/',controller.listar)
router.get('/query',controller.encontrarUsuarioPorNome)

router.get('/:id',controller.encontrarUsuario)

router.put('/incrementar-rotina/:id',controller.incrementarRotina)
router.put('/decrementar-rotina/:id',controller.decrementarRotina)
router.put('/:id',controller.atualizarUsuario)

router.delete('/:id',controller.excluirUsuario)


module.exports = router;
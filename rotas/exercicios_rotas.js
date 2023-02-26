const express = require('express');
const router = express.Router();

const controller = require('../controller/exercicioController');

router.post('/',controller.adicionar);

module.exports = router;
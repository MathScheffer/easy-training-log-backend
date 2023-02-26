const express = require('express');
const  router = express.Router();

const controller = require('../controller/tokenController');

router.post('/',controller.gerarToken);

module.exports = router;
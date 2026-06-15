const express = require('express');

const router = express.Router();
const verificarToken = require('../middlewares/auth.middleware');

const {
    listarRespostas,
    buscarRespostaPorId,
    criarResposta,
    atualizarResposta,
    deletarResposta
} = require('../controllers/respostas.controller');

router.get('/', listarRespostas);

router.get('/:id', buscarRespostaPorId);

router.post('/', verificarToken, criarResposta);

router.put('/:id', verificarToken, atualizarResposta);

router.delete('/:id', verificarToken, deletarResposta);

module.exports = router;
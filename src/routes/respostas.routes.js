const express = require('express');

const router = express.Router();

const {
    listarRespostas,
    buscarRespostaPorId,
    criarResposta,
    atualizarResposta,
    deletarResposta
} = require('../controllers/respostas.controller');

router.get('/', listarRespostas);

router.get('/:id', buscarRespostaPorId);

router.post('/', criarResposta);

router.put('/:id', atualizarResposta);

router.delete('/:id', deletarResposta);

module.exports = router;
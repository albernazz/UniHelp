const express = require('express');

const router = express.Router();

const {
    listarPerguntas,
    buscarPerguntaPorId,
    criarPergunta,
    atualizarPergunta,
    deletarPergunta,
    buscarDetalhesPergunta
} = require('../controllers/perguntas.controller');

router.get('/', listarPerguntas);

router.get('/:id', buscarPerguntaPorId);

router.post('/', criarPergunta);

router.put('/:id', atualizarPergunta);

router.delete('/:id', deletarPergunta);

router.get('/:id/detalhes', buscarDetalhesPergunta);

module.exports = router;
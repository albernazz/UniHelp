const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth.middleware');

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
router.get('/:id/detalhes', buscarDetalhesPergunta);

router.post('/', verificarToken, criarPergunta);
router.put('/:id', verificarToken, atualizarPergunta);
router.delete('/:id', verificarToken, deletarPergunta);

module.exports = router;
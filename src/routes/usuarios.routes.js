const express = require('express');

const router = express.Router();

const {
    listarUsuarios,
    buscarUsuarioPorId,
    buscarUsuarioPorEmail,
    criarUsuario,
    atualizarUsuario,
    deletarUsuario
} = require('../controllers/usuarios.controller');

router.get('/', listarUsuarios);

router.get('/:id', buscarUsuarioPorId);

router.post('/', criarUsuario);

router.put('/:id', atualizarUsuario);

router.delete('/:id', deletarUsuario);

router.get('/email/:email', buscarUsuarioPorEmail);

module.exports = router;
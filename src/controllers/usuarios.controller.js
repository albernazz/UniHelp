const pool = require('../config/db');

// GET /usuarios
const listarUsuarios = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM usuarios'
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: error.message
        });
    }
};

// GET /usuarios/:id
const buscarUsuarioPorId = async (req, res) => {
    try {

        const { id } = req.params;

        const result = await pool.query(
            'SELECT * FROM usuarios WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                erro: 'Usuário não encontrado'
            });
        }

        res.json(result.rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            erro: error.message
        });
    }
};

// POST /usuarios
const criarUsuario = async (req, res) => {
    try {

        const { nome, email, senha, tipo } = req.body;

        const result = await pool.query(
            `
            INSERT INTO usuarios
            (nome, email, senha, tipo)
            VALUES ($1, $2, $3, $4)
            RETURNING *
            `,
            [nome, email, senha, tipo]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            erro: error.message
        });
    }
};

// PUT /usuarios/:id
const atualizarUsuario = async (req, res) => {
    try {

        const { id } = req.params;
        const { nome, email, senha, tipo } = req.body;

        const result = await pool.query(
            `
            UPDATE usuarios
            SET nome = $1,
                email = $2,
                senha = $3,
                tipo = $4
            WHERE id = $5
            RETURNING *
            `,
            [nome, email, senha, tipo, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                erro: 'Usuário não encontrado'
            });
        }

        res.json(result.rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            erro: error.message
        });
    }
};

// DELETE /usuarios/:id
const deletarUsuario = async (req, res) => {
    try {

        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM usuarios WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                erro: 'Usuário não encontrado'
            });
        }

        res.json({
            mensagem: 'Usuário removido com sucesso'
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            erro: error.message
        });
    }
};

//GET /usuarios/email/:email
const buscarUsuarioPorEmail = async (req, res) => {
    try {

        const { email } = req.params;

        const result = await pool.query(
            'SELECT * FROM usuarios WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                erro: 'Usuário não encontrado'
            });
        }

        res.json(result.rows[0]);

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });
    }
};

module.exports = {
    listarUsuarios,
    buscarUsuarioPorId,
    buscarUsuarioPorEmail,
    criarUsuario,
    atualizarUsuario,
    deletarUsuario
};
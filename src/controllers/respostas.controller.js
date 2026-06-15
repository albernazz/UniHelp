const pool = require('../config/db');

// GET /respostas
const listarRespostas = async (req, res) => {
    try {

        const result = await pool.query(
            'SELECT * FROM respostas ORDER BY criado_em DESC'
        );

        res.json(result.rows);

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });
    }
};

// GET /respostas/:id
const buscarRespostaPorId = async (req, res) => {
    try {

        const { id } = req.params;

        const result = await pool.query(
            'SELECT * FROM respostas WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                erro: 'Resposta não encontrada'
            });
        }

        res.json(result.rows[0]);

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });
    }
};

// POST /respostas
const criarResposta = async (req, res) => {
    try {

        const {
            conteudo,
            pergunta_id,
            usuario_id
        } = req.body;

        const result = await pool.query(
            `
            INSERT INTO respostas
            (conteudo, pergunta_id, usuario_id)
            VALUES ($1, $2, $3)
            RETURNING *
            `,
            [conteudo, pergunta_id, usuario_id]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });
    }
};

const atualizarResposta = async (req, res) => {
    try {
        const { id } = req.params;
        const { conteudo } = req.body;
        const usuarioId = req.usuario.id;

        const result = await pool.query(
            `
            UPDATE respostas
            SET conteudo = $1
            WHERE id = $2 AND usuario_id = $3
            RETURNING *
            `,
            [conteudo, id, usuarioId]
        );

        if (result.rows.length === 0) {
            return res.status(403).json({
                erro: 'Não tem permissão para editar esta resposta ou ela não existe'
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        res.status(500).json({
            erro: error.message
        });
    }
};

const deletarResposta = async (req, res) => {
    try {
        const { id } = req.params;
        const usuarioId = req.usuario.id;

        const result = await pool.query(
            'DELETE FROM respostas WHERE id = $1 AND usuario_id = $2 RETURNING *',
            [id, usuarioId]
        );

        if (result.rows.length === 0) {
            return res.status(403).json({
                erro: 'Não tem permissão para apagar esta resposta ou ela não existe'
            });
        }

        res.json({
            mensagem: 'Resposta removida com sucesso'
        });

    } catch (error) {
        res.status(500).json({
            erro: error.message
        });
    }
};

module.exports = {
    listarRespostas,
    buscarRespostaPorId,
    criarResposta,
    atualizarResposta,
    deletarResposta
};
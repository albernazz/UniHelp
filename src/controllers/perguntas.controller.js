const pool = require('../config/db');

// GET /perguntas
const listarPerguntas = async (req, res) => {
    try {

        const result = await pool.query(`
            SELECT
                p.id,
                p.titulo,
                p.descricao,
                p.criado_em,
                u.nome AS autor

            FROM perguntas p

            INNER JOIN usuarios u
                ON p.usuario_id = u.id

            ORDER BY p.criado_em DESC
        `);

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            erro: error.message
        });
    }
};

// GET /perguntas/:id
const buscarPerguntaPorId = async (req, res) => {
    try {

        const { id } = req.params;

        const result = await pool.query(
            `
            SELECT *
            FROM perguntas
            WHERE id = $1
            `,
            [id]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                erro: 'Pergunta não encontrada'
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

// POST /perguntas
const criarPergunta = async (req, res) => {
    try {

        const {
            titulo,
            descricao,
            usuario_id
        } = req.body;

        const result = await pool.query(
            `
            INSERT INTO perguntas
            (titulo, descricao, usuario_id)
            VALUES ($1, $2, $3)
            RETURNING *
            `,
            [titulo, descricao, usuario_id]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            erro: error.message
        });
    }
};

// PUT /perguntas/:id
const atualizarPergunta = async (req, res) => {
    try {

        const { id } = req.params;

        const {
            titulo,
            descricao
        } = req.body;

        const result = await pool.query(
            `
            UPDATE perguntas
            SET titulo = $1,
                descricao = $2
            WHERE id = $3
            RETURNING *
            `,
            [titulo, descricao, id]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                erro: 'Pergunta não encontrada'
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

// DELETE /perguntas/:id
const deletarPergunta = async (req, res) => {
    try {

        const { id } = req.params;

        const result = await pool.query(
            `
            DELETE FROM perguntas
            WHERE id = $1
            RETURNING *
            `,
            [id]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                erro: 'Pergunta não encontrada'
            });
        }

        res.json({
            mensagem: 'Pergunta removida com sucesso'
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            erro: error.message
        });
    }
};

// GET /perguntas/:id/detalhes
const buscarDetalhesPergunta = async (req, res) => {

    try {

        const { id } = req.params;

        const pergunta = await pool.query(
            `
            SELECT
                p.*,
                u.nome AS autor

            FROM perguntas p

            INNER JOIN usuarios u
                ON p.usuario_id = u.id

            WHERE p.id = $1
            `,
            [id]
        );

        if (pergunta.rows.length === 0) {

            return res.status(404).json({
                erro: 'Pergunta não encontrada'
            });
        }

        const respostas = await pool.query(
            `
            SELECT
                r.*,
                u.nome AS autor

            FROM respostas r

            INNER JOIN usuarios u
                ON r.usuario_id = u.id

            WHERE r.pergunta_id = $1

            ORDER BY r.criado_em ASC
            `,
            [id]
        );

        res.json({
            pergunta: pergunta.rows[0],
            respostas: respostas.rows
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            erro: error.message
        });
    }
};

module.exports = {
    listarPerguntas,
    buscarPerguntaPorId,
    criarPergunta,
    atualizarPergunta,
    deletarPergunta,
    buscarDetalhesPergunta
};
const pool = require('../config/db');

const listarPerguntas = async (req, res) => {
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = parseInt(req.query.limite) || 10;
    const offset = (pagina - 1) * limite;

    const result = await pool.query(
        `
        SELECT p.id, p.titulo, p.descricao, p.criado_em, u.nome AS autor
        FROM perguntas p
        INNER JOIN usuarios u ON p.usuario_id = u.id
        ORDER BY p.criado_em DESC
        LIMIT $1 OFFSET $2
        `,
        [limite, offset]
    );

    const countResult = await pool.query('SELECT COUNT(*) FROM perguntas');
    const totalItems = parseInt(countResult.rows[0].count);
    const totalPaginas = Math.ceil(totalItems / limite);

    res.json({
        dados: result.rows,
        paginaAtual: pagina,
        totalPaginas: totalPaginas
    });
};

const buscarPerguntaPorId = async (req, res) => {
    const { id } = req.params;
    const result = await pool.query(
        'SELECT * FROM perguntas WHERE id = $1',
        [id]
    );
    
    if (result.rows.length === 0) {
        return res.status(404).json({ erro: 'Pergunta não encontrada' });
    }
    
    res.json(result.rows[0]);
};

const criarPergunta = async (req, res) => {
    const { titulo, descricao } = req.body;
    const usuario_id = req.usuario.id;

    if (!titulo || !titulo.trim() || !descricao || !descricao.trim()) {
        return res.status(400).json({
            erro: 'O título e a descrição são obrigatórios e não podem estar vazios.'
        });
    }

    const result = await pool.query(
        `
        INSERT INTO perguntas (titulo, descricao, usuario_id)
        VALUES ($1, $2, $3)
        RETURNING *
        `,
        [titulo, descricao, usuario_id]
    );
    
    res.status(201).json(result.rows[0]);
};

const atualizarPergunta = async (req, res) => {
    const { id } = req.params;
    const { titulo, descricao } = req.body;
    const usuarioId = req.usuario.id;

    if (!titulo || !titulo.trim() || !descricao || !descricao.trim()) {
        return res.status(400).json({
            erro: 'O título e a descrição são obrigatórios e não podem estar vazios.'
        });
    }

    const result = await pool.query(
        `
        UPDATE perguntas
        SET titulo = $1, descricao = $2
        WHERE id = $3 AND usuario_id = $4
        RETURNING *
        `,
        [titulo, descricao, id, usuarioId]
    );

    if (result.rows.length === 0) {
        return res.status(403).json({
            erro: 'Não tem permissão para editar esta pergunta ou ela não existe'
        });
    }
    
    res.json(result.rows[0]);
};

const deletarPergunta = async (req, res) => {
    const { id } = req.params;
    const usuarioId = req.usuario.id;

    const result = await pool.query(
        `
        DELETE FROM perguntas
        WHERE id = $1 AND usuario_id = $2
        RETURNING *
        `,
        [id, usuarioId]
    );

    if (result.rows.length === 0) {
        return res.status(403).json({
            erro: 'Não tem permissão para apagar esta pergunta ou ela não existe'
        });
    }
    
    res.json({ mensagem: 'Pergunta removida com sucesso' });
};

const buscarDetalhesPergunta = async (req, res) => {
    const { id } = req.params;

    const pergunta = await pool.query(
        `
        SELECT p.*, u.nome AS autor
        FROM perguntas p
        INNER JOIN usuarios u ON p.usuario_id = u.id
        WHERE p.id = $1
        `,
        [id]
    );

    if (pergunta.rows.length === 0) {
        return res.status(404).json({ erro: 'Pergunta não encontrada' });
    }

    const respostas = await pool.query(
        `
        SELECT r.*, u.nome AS autor
        FROM respostas r
        INNER JOIN usuarios u ON r.usuario_id = u.id
        WHERE r.pergunta_id = $1
        ORDER BY r.criado_em ASC
        `,
        [id]
    );

    res.json({
        pergunta: pergunta.rows[0],
        respostas: respostas.rows
    });
};

module.exports = {
    listarPerguntas,
    buscarPerguntaPorId,
    criarPergunta,
    atualizarPergunta,
    deletarPergunta,
    buscarDetalhesPergunta
};